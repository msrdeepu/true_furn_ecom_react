import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'

export type CartProduct = {
  id: string
  name: string
  price: number
  image: string
  meta?: string
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
  const [items, setItems] = useState<CartLine[]>([])

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    try {
      const parsed = JSON.parse(raw) as CartLine[]
      if (Array.isArray(parsed)) {
        setItems(parsed)
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addToCart = (product: CartProduct, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + qty } : item
        )
      }
      return [...prev, { ...product, qty }]
    })
  }

  const increaseQty = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    )
  }

  const decreaseQty = (id: string) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, qty: Math.max(0, item.qty - 1) } : item
        )
        .filter((item) => item.qty > 0)
    )
  }

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.qty, 0),
    [items]
  )
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.qty, 0),
    [items]
  )

  const value: CartContextValue = {
    items,
    totalItems,
    subtotal,
    addToCart,
    increaseQty,
    decreaseQty,
    removeFromCart,
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
