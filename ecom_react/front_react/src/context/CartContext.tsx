import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import { cartApi, type ApiCartItem, getImageUrl } from '../api'
import { useAuth } from './AuthHook'

export type CartProduct = {
  id: string // prefixed with 'variant-' or numeric string
  name: string
  price: number
  image: string
  meta?: string
  variant_model?: string
  cartId?: number // Backend row ID
}

type CartLine = CartProduct & {
  qty: number
}

type CartContextValue = {
  items: CartLine[]
  totalItems: number
  subtotal: number
  addToCart: (product: CartProduct, qty?: number) => void
  increaseQty: (id: string) => void
  decreaseQty: (id: string) => void
  removeFromCart: (id: string) => void
  syncWithBackend: () => Promise<void>
  clearCart: () => void
}

const STORAGE_KEY = 'truefurn_cart'

const CartContext = createContext<CartContextValue | null>(null)

export function formatINR(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function CartProvider({ children }: PropsWithChildren) {
  const { user } = useAuth()
  const [items, setItems] = useState<CartLine[]>(() => {
    if (typeof window === 'undefined') return []
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    try {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })
  const [isSyncing, setIsSyncing] = useState(false)

  // Persist to local storage
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const syncWithBackend = async () => {
    if (!user || isSyncing) return
    setIsSyncing(true)

    try {
      const response = await cartApi.get(user.id) as any
      const backendItems = Array.isArray(response) ? response : (response?.data || [])

      if (!Array.isArray(backendItems)) {
        setIsSyncing(false)
        return
      }

      const mappedRemote: CartLine[] = backendItems.map((bi: ApiCartItem) => {
        const vId = bi.variant_id || (bi as any).product_id
        const mainImage = bi.images && bi.images.length > 0 ? bi.images[0] : (bi.image || '')
        return {
          id: `variant-${vId}`,
          cartId: typeof bi.id === 'string' ? parseInt(bi.id, 10) : bi.id,
          name: bi.variant_name || bi.product_name || bi.name || 'Unnamed Product',
          price: typeof bi.price === 'string' ? parseFloat(bi.price) : (bi.price || 0),
          image: getImageUrl(mainImage) || '',
          qty: typeof bi.quantity === 'string' ? parseInt(bi.quantity, 10) : (bi.quantity || 0),
          meta: bi.color_name && bi.size_label ? `${bi.color_name} / Size ${bi.size_label}` : undefined,
          variant_model: bi.variant_model
        }
      })

      // MERGE LOGIC: 
      // 1. Keep all items from backend.
      // 2. Add local guest items (no cartId) that aren't already in the backend.
      setItems((prev) => {
        const localGuestItems = prev.filter(li => !li.cartId);
        
        // Filter out guest items that might already be in mappedRemote (by ID) to avoid duplicates
        const uniqueGuestItems = localGuestItems.filter(
          gi => !mappedRemote.some(ri => ri.id === gi.id)
        );

        // If there are new guest items, we should ideally push them to backend
        // but for immediate UI consistency, we just combine them here.
        return [...mappedRemote, ...uniqueGuestItems];
      });

      // 3. Background push: If there were guest items, push them to backend
      const guestItemsToPush = items.filter(li => !li.cartId);
      if (guestItemsToPush.length > 0) {
        for (const gi of guestItemsToPush) {
          try {
            const vId = gi.id.replace('variant-', '');
            await cartApi.add(user.id, parseInt(vId, 10));
          } catch (e) {
            console.error('Failed to auto-merge guest item to backend:', gi.name);
          }
        }
        // No need for a recursive sync call here; the next natural sync or user action will pick it up.
      }

    } catch (err) {
      console.error('Failed to sync cart:', err)
    } finally {
      setIsSyncing(false)
    }
  }

  // Sync when user changes
  useEffect(() => {
    if (user) {
      syncWithBackend()
    }
  }, [user?.id])

  const addToCart = async (product: CartProduct, qty = 1) => {
    // Ensure qty is a number
    const quantity = typeof qty === 'string' ? parseInt(qty, 10) : qty

    // Optimistic local update
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + quantity } : item
        )
      }
      return [...prev, { ...product, qty: quantity }]
    })

    // Backend sync
    if (user) {
      try {
        const variantId = product.id.replace('variant-', '')
        await cartApi.add(user.id, parseInt(variantId, 10))
        await syncWithBackend() // Refresh to get the correct cartId
      } catch (err) {
        console.error('Add to cart failed:', err)
      }
    }
  }

  const increaseQty = async (id: string) => {
    const item = items.find((i) => i.id === id)
    if (!item) return

    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: Number(i.qty) + 1 } : i))
    )

    if (user && item.cartId) {
      try {
        await cartApi.update(item.cartId, Number(item.qty) + 1)
      } catch (err) {
        console.error('Update qty failed:', err)
        syncWithBackend() // Revert on failure
      }
    }
  }

  const decreaseQty = async (id: string) => {
    const item = items.find((i) => i.id === id)
    if (!item) return

    if (Number(item.qty) <= 1) {
      return removeFromCart(id)
    }

    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: Number(i.qty) - 1 } : i))
    )

    if (user && item.cartId) {
      try {
        await cartApi.update(item.cartId, Number(item.qty) - 1)
      } catch (err) {
        console.error('Update qty failed:', err)
        syncWithBackend()
      }
    }
  }

  const removeFromCart = async (id: string) => {
    const item = items.find((i) => i.id === id)
    setItems((prev) => prev.filter((i) => i.id !== id))

    if (user && item?.cartId) {
      try {
        await cartApi.remove(item.cartId)
      } catch (err) {
        console.error('Remove from cart failed:', err)
        syncWithBackend()
      }
    }
  }

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.qty), 0),
    [items]
  )
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.price) * Number(item.qty), 0),
    [items]
  )

  const clearCart = () => {
    setItems([])
    window.localStorage.removeItem(STORAGE_KEY)
  }

  const value: CartContextValue = {
    items,
    totalItems,
    subtotal,
    addToCart,
    increaseQty,
    decreaseQty,
    removeFromCart,
    syncWithBackend,
    clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used inside CartProvider')
  }
  return context
}
