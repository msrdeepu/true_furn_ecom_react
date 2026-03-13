import { useEffect, useState } from 'react'
import { formatINR, useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthHook'
import { useToast } from '../context/ToastContext'
import { addressApi, paymentApi, RAZORPAY_KEY } from '../api'
import type { ApiAddress } from '../api'
import { Icon } from '../components/ui/Icon'
import { useProducts } from '../hooks/useProducts'

export function CartPage() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const { items, totalItems, increaseQty, decreaseQty, removeFromCart, clearCart } =
    useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [addresses, setAddresses] = useState<ApiAddress[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null)
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'phonepe' | 'razorpay' | 'cod'>('razorpay')

  const { variants } = useProducts()

  useEffect(() => {
    if (user) {
      fetchAddresses()
    }
  }, [user])

  const fetchAddresses = async () => {
    setIsLoadingAddresses(true)
    try {
      const data = await addressApi.list(user!.id)
      if (Array.isArray(data)) {
        setAddresses(data)
        if (data.length > 0) {
          setSelectedAddressId(data[0].id)
        }
      }
    } catch (err) {
      console.error('Failed to fetch addresses', err)
    } finally {
      setIsLoadingAddresses(false)
    }
  }

  let computedSubtotal = 0;
  let totalTaxBreakup = 0;
  let totalExclusiveTax = 0;
  let totalMrp = 0;

  const enrichedItems = items.map(item => {
    const vId = item.id.replace('variant-', '');
    const variant = variants.find(v => v.id.toString() === vId);
    
    const qty = item.qty;
    const price = item.price;
    const lineTotal = price * qty;
    computedSubtotal += lineTotal;

    let taxAmount = 0;
    let taxLabel = 'GST';
    let taxPercent = 0;
    let mrp = price;

    if (variant) {
      taxPercent = parseFloat((variant.tax as any)?.tax || variant.tax?.percent || '0');
      taxLabel = (variant.tax as any)?.label || 'GST';
      const taxMode = variant.tax?.mode?.toLowerCase() || 'inclusive';
      mrp = parseFloat(variant.pricing?.mrp || price.toString());

      if (taxPercent > 0) {
        if (taxMode === 'exclusive') {
          taxAmount = lineTotal * (taxPercent / 100);
          totalExclusiveTax += taxAmount;
        } else {
          // Inclusive: Tax is already inside lineTotal
          taxAmount = lineTotal - (lineTotal / (1 + taxPercent / 100));
        }
      }
    }
    
    totalTaxBreakup += taxAmount;
    totalMrp += (mrp * qty);

    return {
      ...item,
      taxAmount,
      taxPercent,
      taxLabel,
      mrp
    }
  });

  const totalDiscount = totalMrp - computedSubtotal;
  const grandTotal = computedSubtotal + totalExclusiveTax;

  const handleCheckout = async () => {
    if (!user) {
      window.location.href = '/login'
      return
    }

    if (items.length === 0) return

    if (!selectedAddressId) {
      showToast('Please select or add a shipping address', 'info')
      return
    }

    setIsProcessing(true)

    try {
      const orderPayload = {
        user_id: user!.id,
        amount: Math.round(grandTotal),
        email: user!.email,
        order_tax_amount: totalTaxBreakup,
        address_id: selectedAddressId,
        items: enrichedItems.map(item => {
          const vId = item.id.includes('variant-') ? item.id.replace('variant-', '') : item.id;
          return {
            variant_id: parseInt(vId, 10),
            product_id: item.id.includes('variant-') ? null : parseInt(item.id, 10),
            name: item.name,
            quantity: item.qty,
            price: item.price,
            image: item.image,
            item_tax_amount: item.taxAmount,
            slab: item.taxPercent
          }
        })
      };

      if (paymentMethod === 'cod') {
        // --- COD Flow ---
        const orderData = await paymentApi.createCODOrder(orderPayload);

        if (!orderData.status) {
          throw new Error(orderData.message || 'Failed to place COD order')
        }

        showToast('Order Placed Successfully!', 'success')
        clearCart()
        setTimeout(() => {
          window.location.href = '/dashboard?payment=success'
        }, 1500)
      } else if (paymentMethod === 'razorpay') {
        // --- Razorpay Flow ---
        const orderData = await paymentApi.createRazorpayOrder(orderPayload);

        if (!orderData.status) {
          throw new Error(orderData.message || 'Failed to create Razorpay order')
        }

        const options = {
          key: RAZORPAY_KEY,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'True Furn',
          description: 'Furniture Purchase',
          order_id: orderData.razorpay_order_id,
          handler: async function (response: any) {
            try {
              const verification = await paymentApi.verifyRazorpayPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              })

              if (verification.status) {
                showToast('Payment Successful!', 'success')
                clearCart()
                setTimeout(() => {
                  window.location.href = '/dashboard?payment=success'
                }, 1500)
              } else {
                showToast('Payment verification failed: ' + verification.message, 'error')
              }
            } catch (err: any) {
              showToast('Verification Error: ' + err.message, 'error')
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
          },
          theme: {
            color: '#1a1a1a',
          },
          modal: {
            ondismiss: function() {
              setIsProcessing(false)
            }
          }
        }

        const rzp = new (window as any).Razorpay(options)
        rzp.open()
      } else {
        // --- PhonePe Flow ---
        const orderData = await paymentApi.createPhonePeOrder(orderPayload);

        if (!orderData.status) {
          throw new Error(orderData.message || 'Failed to create PhonePe order')
        }

        if (orderData.redirect_url) {
          showToast('Redirecting to PhonePe...', 'info')
          setTimeout(() => {
            window.location.href = orderData.redirect_url;
          }, 800);
        } else {
          throw new Error('PhonePe redirect URL not found');
        }
      }

    } catch (err: any) {
      showToast('Checkout Error: ' + err.message, 'error')
    } finally {
      // For PhonePe, we don't set isProcessing to false immediately as we redirect
      if (paymentMethod === 'razorpay' || paymentMethod === 'cod') {
        setIsProcessing(false)
      }
    }
  }

  return (
    <section className="cart-page">
      <div className="container">
        <div className="shop-breadcrumbs">
          <a href="/">Home</a>
          <span>{'>'}</span>
          <strong>Shopping Cart</strong>
        </div>

        <div className="cart-layout">
          <div>
            <div className="cart-head">
              <h1>Your Shopping Cart</h1>
              <span>{totalItems} Items</span>
            </div>

            <div className="cart-items">
              {items.length === 0 && (
                <div className="cart-empty">
                  <h3>Your cart is empty</h3>
                  <p>Explore products and add your favorites to continue.</p>
                  <a className="btn-primary" href="/shop">
                    Continue Shopping
                  </a>
                </div>
              )}

              {enrichedItems.map((item) => (
                <article className="cart-item" key={item.id}>
                  <div className="cart-item-image">
                    <img alt={item.name} src={item.image} />
                  </div>
                  <div className="cart-item-main">
                    <h3>{item.name}</h3>
                    <p>{item.meta || 'Premium furniture selection'}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.25rem 0' }}>
                       <span className="line-price" style={{ margin: 0 }}>{formatINR(item.price)}</span>
                       {item.mrp > item.price && (
                         <span style={{ textDecoration: 'line-through', opacity: 0.5, fontSize: '0.8rem' }}>{formatINR(item.mrp)}</span>
                       )}
                    </div>
                    {item.taxPercent > 0 && (
                        <span style={{ display: 'inline-block', fontSize: '0.7rem', background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px', border: '1px solid #eee', color: '#666', marginTop: '4px' }}>
                           {item.taxLabel} {item.taxPercent}% 
                           {item.taxAmount > 0 ? ` (+${formatINR(item.taxAmount)})` : ' (Inclusive)'}
                        </span>
                    )}
                    <div className="cart-item-actions">
                      <div className="qty-box">
                        <button onClick={() => decreaseQty(item.id)} type="button">
                          -
                        </button>
                        <span>{item.qty}</span>
                        <button onClick={() => increaseQty(item.id)} type="button">
                          +
                        </button>
                      </div>
                      <button
                        className="remove-btn"
                        onClick={() => removeFromCart(item.id)}
                        type="button"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <strong className="cart-item-total">
                    {formatINR(item.price * item.qty)}
                  </strong>
                </article>
              ))}
            </div>

            <div className="cart-bottom-actions">
              <a href="/shop">Continue Shopping</a>
              <div className="promo-box">
                <input placeholder="Promo code" type="text" />
                <button type="button">Apply</button>
              </div>
            </div>
          </div>

          <aside className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Total MRP</span>
              <strong>{formatINR(totalMrp)}</strong>
            </div>
            {totalDiscount > 0 && (
            <div className="summary-row" style={{ color: 'var(--clr-accent, #2e7d32)' }}>
              <span>Discount</span>
              <strong>-{formatINR(totalDiscount)}</strong>
            </div>
            )}
            <div className="summary-row">
              <span>Subtotal</span>
              <strong>{formatINR(computedSubtotal)}</strong>
            </div>
            <div className="summary-row">
              <span>Shipping Charges</span>
              <span className="badge-pill-elite badge-primary-lite">Additional</span>
            </div>
            <div className="summary-row">
              <span>Tax ({totalExclusiveTax > 0 ? 'Exclusive' : 'Inclusive'})</span>
              <strong>{totalExclusiveTax > 0 ? `+${formatINR(totalExclusiveTax)}` : 'Included'}</strong>
            </div>
            <div className="summary-total">
              <span>Final Total</span>
              <strong>{formatINR(Math.round(grandTotal))}</strong>
            </div>
            {user ? (
              <>
                <div className="checkout-addresses">
                  <div className="flex-between mb-4">
                    <p className="summary-section-title">Shipping Address</p>
                    <a href="/account/addresses" className="text-primary text-xs font-bold">Manage</a>
                  </div>
                  
                  {isLoadingAddresses ? (
                    <p className="text-xs text-muted">Loading addresses...</p>
                  ) : addresses.length === 0 ? (
                    <div className="no-address-alert">
                      <p>No addresses found.</p>
                      <a href="/account/addresses" className="btn-ghost-sm">Add Address</a>
                    </div>
                  ) : (
                    <div className="address-select-list">
                      {addresses.map(addr => (
                        <label key={addr.id} className={`address-select-card ${selectedAddressId === addr.id ? 'active' : ''}`}>
                          <input 
                            type="radio" 
                            name="checkout-address" 
                            checked={selectedAddressId === addr.id}
                            onChange={() => setSelectedAddressId(addr.id)}
                          />
                          <div className="addr-info">
                            <div className="addr-type mb-1 flex items-center gap-2">
                              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
                                <Icon name={addr.a_type.toLowerCase() === 'home' ? 'home' : 'business'} className="icon-xs align-text-bottom mr-1" />
                                {addr.a_type}
                              </span>
                              {addr.contact_number && (
                                <span className="text-xs font-bold text-gray-500">
                                  <Icon name="phone" className="icon-xs align-text-bottom mr-1" />
                                  {addr.contact_number}
                                </span>
                              )}
                            </div>
                            <p className="addr-text text-sm font-medium text-gray-800 leading-tight">{addr.address}, {addr.city}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <div className="payment-methods" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginTop: '1.5rem' }}>
                  <p className="summary-section-title" style={{ gridColumn: '1 / -1', marginBottom: '0.2rem' }}>Payment Method</p>
                  <label className="payment-option">
                    <input
                      checked={paymentMethod === 'phonepe'}
                      name="payment-method"
                      onChange={() => setPaymentMethod('phonepe')}
                      type="radio"
                    />
                    <Icon name="phonepe" className="icon-md" />
                    <span>PhonePe</span>
                  </label>
                  <label className="payment-option">
                    <input
                      checked={paymentMethod === 'razorpay'}
                      name="payment-method"
                      onChange={() => setPaymentMethod('razorpay')}
                      type="radio"
                    />
                    <Icon name="razorpay" className="icon-md" />
                    <span>Razorpay</span>
                  </label>
                  <label className="payment-option" style={{ gridColumn: '1 / -1' }}>
                    <input
                      checked={paymentMethod === 'cod'}
                      name="payment-method"
                      onChange={() => setPaymentMethod('cod')}
                      type="radio"
                    />
                    <Icon name="cash" className="icon-md" />
                    <span>Cash on Delivery</span>
                  </label>
                </div>
                <button
                  className="btn-primary summary-checkout"
                  disabled={isProcessing || items.length === 0 || !selectedAddressId}
                  onClick={handleCheckout}
                  type="button"
                >
                  {isProcessing ? 'Processing...' : `Proceed with ${paymentMethod === 'phonepe' ? 'PhonePe' : paymentMethod === 'razorpay' ? 'Razorpay' : 'COD'}`}
                </button>
              </>
            ) : (
              <div className="login-to-checkout">
                <p className="summary-note">Please login to proceed with payment</p>
                <a className="btn-primary summary-checkout block text-center" href="/login?redirect=/cart" style={{ display: 'block', textAlign: 'center', lineHeight: '3rem' }}>
                  Login to Checkout
                </a>
              </div>
            )}
            <p className="summary-note">Secure checkout guaranteed</p>
            <div className="delivery-box">
              <small>Estimated Delivery</small>
              <p>4-7 business days</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
