import { useEffect, useState } from 'react'
import { formatINR, useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthHook'
import { useToast } from '../context/ToastContext'
import { addressApi, paymentApi, RAZORPAY_KEY } from '../api'
import type { ApiAddress } from '../api'
import { Icon } from '../components/ui/Icon'

export function CartPage() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const { items, subtotal, totalItems, increaseQty, decreaseQty, removeFromCart, clearCart } =
    useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [addresses, setAddresses] = useState<ApiAddress[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null)
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'phonepe' | 'razorpay'>(
    'razorpay'
  )

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
  const tax = subtotal * 0.08
  const total = subtotal + tax

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
        amount: Math.round(total),
        email: user!.email,
        address_id: selectedAddressId,
        items: items.map(item => {
          const vId = item.id.includes('variant-') ? item.id.replace('variant-', '') : item.id;
          return {
            variant_id: parseInt(vId, 10),
            product_id: item.id.includes('variant-') ? null : parseInt(item.id, 10),
            name: item.name,
            quantity: item.qty,
            price: item.price,
            image: item.image
          }
        })
      };

      if (paymentMethod === 'razorpay') {
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
                  window.location.href = '/dashboard'
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
      if (paymentMethod === 'razorpay') {
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

              {items.map((item) => (
                <article className="cart-item" key={item.id}>
                  <div className="cart-item-image">
                    <img alt={item.name} src={item.image} />
                  </div>
                  <div className="cart-item-main">
                    <h3>{item.name}</h3>
                    <p>{item.meta || 'Premium furniture selection'}</p>
                    <span className="line-price">{formatINR(item.price)}</span>
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
              <span>Subtotal</span>
              <strong>{formatINR(subtotal)}</strong>
            </div>
            <div className="summary-row">
              <span>Shipping Estimate</span>
              <strong className="ok-green">Free</strong>
            </div>
            <div className="summary-row">
              <span>Tax Estimate</span>
              <strong>{formatINR(Math.round(tax))}</strong>
            </div>
            <div className="summary-total">
              <span>Total Order</span>
              <strong>{formatINR(Math.round(total))}</strong>
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

                <div className="payment-methods">
                  <p className="summary-section-title">Payment Method</p>
                  <label className="payment-option">
                    <input
                      checked={paymentMethod === 'phonepe'}
                      name="payment-method"
                      onChange={() => setPaymentMethod('phonepe')}
                      type="radio"
                    />
                    <span>PhonePe</span>
                  </label>
                  <label className="payment-option">
                    <input
                      checked={paymentMethod === 'razorpay'}
                      name="payment-method"
                      onChange={() => setPaymentMethod('razorpay')}
                      type="radio"
                    />
                    <span>Razorpay</span>
                  </label>
                </div>
                <button
                  className="btn-primary summary-checkout"
                  disabled={isProcessing || items.length === 0 || !selectedAddressId}
                  onClick={handleCheckout}
                  type="button"
                >
                  {isProcessing ? 'Processing...' : `Proceed with ${paymentMethod === 'phonepe' ? 'PhonePe' : 'Razorpay'}`}
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
