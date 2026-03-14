import { useEffect, useState } from 'react'
import { formatINR, useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthHook'
import { useToast } from '../context/ToastContext'
import { addressApi, paymentApi, RAZORPAY_KEY, couponApi } from '../api'
import type { ApiAddress, ApiCoupon } from '../api'
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

  const [promoCode, setPromoCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<ApiCoupon | null>(null)
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false)

  const { variants } = useProducts()

  useEffect(() => {
    if (user) {
      fetchAddresses()
    }
  }, [user])

  useEffect(() => {
    if (items.length === 0 && appliedCoupon) {
      setAppliedCoupon(null)
      setPromoCode('')
    }
  }, [items.length, appliedCoupon])

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

  const handleApplyCoupon = async () => {
    if (!promoCode.trim()) return
    if (items.length === 0) {
      showToast('Add items to your cart before applying a coupon', 'info')
      return
    }
    setIsValidatingCoupon(true)
    try {
      const res = await couponApi.verify(promoCode)
      if (res.status && res.data) {
        setAppliedCoupon(res.data)
        showToast('Coupon applied successfully!', 'success')
      } else {
        showToast(res.message || 'Invalid coupon', 'error')
      }
    } catch (err: any) {
      showToast(err.message || 'Validation failed', 'error')
    } finally {
      setIsValidatingCoupon(false)
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setPromoCode('')
  }

  let baseSubtotal = 0;
  let totalTaxAmount = 0;
  let totalMrp = 0;

  const enrichedItems = items.map(item => {
    const vId = item.id.replace('variant-', '');
    const variant = variants.find(v => v.id.toString() === vId);
    
    const qty = item.qty;
    const itemPrice = item.price; // This is the API price (could be incl or excl)
    let lineTotal = itemPrice * qty;

    let taxAmount = 0;
    let taxLabel = 'GST';
    let taxPercent = 0;
    let mrp = itemPrice;
    let lineBaseAmount = lineTotal;

    if (variant) {
      taxPercent = parseFloat((variant.tax as any)?.tax || variant.tax?.percent || '0');
      taxLabel = (variant.tax as any)?.label || 'GST';
      const taxMode = variant.tax?.mode?.toLowerCase() || 'inclusive';
      mrp = parseFloat(variant.pricing?.mrp || itemPrice.toString());

      if (taxPercent > 0) {
        if (taxMode === 'exclusive') {
          taxAmount = lineTotal * (taxPercent / 100);
          lineBaseAmount = lineTotal;
        } else {
          taxAmount = lineTotal - (lineTotal / (1 + taxPercent / 100));
          lineBaseAmount = lineTotal - taxAmount;
        }
      }
    }
    
    baseSubtotal += lineBaseAmount;
    totalTaxAmount += taxAmount;
    totalMrp += (mrp * qty);

    return {
      ...item,
      taxAmount,
      taxPercent,
      taxLabel,
      mrp,
      lineBaseAmount,
      variantModel: variant?.variant?.variant_model
    }
  });

  let discountAmount = 0
  if (appliedCoupon) {
    if (appliedCoupon.type === 'PERCENT') {
      discountAmount = baseSubtotal * (appliedCoupon.discount / 100)
    } else {
      discountAmount = appliedCoupon.discount
    }
  }

  const productDiscount = totalMrp - (baseSubtotal + totalTaxAmount);
  const grandTotal = baseSubtotal + totalTaxAmount - discountAmount;

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
      console.log('Final Totals:', {
        subtotal: baseSubtotal,
        tax: totalTaxAmount,
        grand: grandTotal
      })
      const orderPayload = {
        user_id: user!.id,
        amount: Math.round(grandTotal),
        email: user!.email,
        order_tax_amount: totalTaxAmount,
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
        }),
        coupon_code: appliedCoupon?.code || null,
        discount_type: appliedCoupon?.type || null,
        discount_amount: discountAmount
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
                  
                  <div className="cart-item-info">
                    <h3 className="cart-item-name">{item.name}</h3>
                    <div className="cart-item-metadata">
                        {item.variantModel && <span style={{ color: 'var(--primary)', background: 'rgb(23 84 207 / 0.1)', padding: '3px 10px', borderRadius: '6px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{item.variantModel}</span>}
                        {item.variantModel && item.meta && <span style={{ opacity: 0.3 }}>•</span>}
                        {item.meta && <span style={{ color: '#475569' }}>{item.meta}</span>}
                    </div>
                    {item.taxPercent > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            {item.taxLabel} {item.taxPercent}% 
                          </span>
                          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#cbd5e1' }}>|</span>
                          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8' }}>
                            {item.taxAmount > 0 ? `+${formatINR(item.taxAmount)}` : 'Incl.'}
                          </span>
                        </div>
                    )}
                  </div>

                  <div className="cart-item-actions-cluster" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', justifyContent: 'center' }}>
                    <div className="qty-box" style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', height: '38px', borderRadius: '10px' }}>
                      <button onClick={() => decreaseQty(item.id)} style={{ width: '36px', fontSize: '1.1rem', color: '#64748b' }} type="button"> – </button>
                      <span style={{ minWidth: '32px', textAlign: 'center', fontWeight: 800, fontSize: '1rem', color: '#1e293b' }}>{item.qty}</span>
                      <button onClick={() => increaseQty(item.id)} style={{ width: '36px', fontSize: '1.1rem', color: '#64748b' }} type="button"> + </button>
                    </div>
                    
                    <button
                      className="remove-btn-elite"
                      onClick={() => removeFromCart(item.id)}
                      type="button"
                      title="Remove Item"
                      style={{ padding: '10px', borderRadius: '12px' }}
                    >
                      <Icon name="trash" style={{ width: '20px', height: '20px' }} />
                    </button>
                  </div>

                  <div className="cart-item-price-col">
                    <span className="line-price" style={{ marginBottom: '0.1rem' }}>
                      {formatINR(item.lineBaseAmount / item.qty)} <span style={{ opacity: 0.5, fontWeight: 500 }}>/ unit</span>
                    </span>
                    <strong style={{ fontSize: '1.6rem', fontWeight: 900, color: '#1e293b', letterSpacing: '-0.02em' }}>
                      {formatINR(item.lineBaseAmount)}
                    </strong>
                  </div>
                </article>
              ))}
            </div>

            {items.length > 0 && (
              <div className="cart-bottom-actions">
                <a href="/shop">Continue Shopping</a>
                <div className="promo-box">
                  {appliedCoupon ? (
                    <div className="applied-coupon-badge">
                      <Icon name="award" className="icon-xs" style={{ color: 'var(--primary)' }} />
                      <span className="flex-1">
                        Code <strong>{appliedCoupon.code}</strong> Applied
                      </span>
                      <button type="button" onClick={removeCoupon} className="coupon-close-btn" title="Remove Coupon">
                        <Icon name="close" className="icon-xs" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <input 
                        placeholder="Enter Promo Code..." 
                        type="text" 
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                      />
                      <button 
                        className="promo-btn-elite"
                        type="button" 
                        onClick={handleApplyCoupon}
                        disabled={isValidatingCoupon || !promoCode.trim()}
                      >
                        {isValidatingCoupon ? 'Validating...' : 'Apply Code'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          <aside className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Total MRP</span>
              <strong>{formatINR(totalMrp)}</strong>
            </div>
            {productDiscount > 0 && (
            <div className="summary-row" style={{ color: 'var(--clr-accent, #2e7d32)' }}>
              <span>Product Discount</span>
              <strong>-{formatINR(productDiscount)}</strong>
            </div>
            )}
            <div className="summary-row">
              <span>Subtotal</span>
              <strong>{formatINR(baseSubtotal)}</strong>
            </div>
            {appliedCoupon && (
              <div className="summary-row" style={{ color: 'var(--primary)', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span>Coupon Discount</span>
                  <span className="coupon-summary-badge">
                    {appliedCoupon.code}
                  </span>
                </div>
                <strong>-{formatINR(discountAmount)}</strong>
              </div>
            )}
            <div className="summary-row">
              <span>Tax (GST)</span>
              <strong>{totalTaxAmount > 0 ? `+${formatINR(totalTaxAmount)}` : 'Included'}</strong>
            </div>
            <div className="summary-total">
              <span>Final Total</span>
              <strong>{formatINR(Math.round(grandTotal))}</strong>
            </div>
            {user ? (
              <>
                <div className="checkout-addresses">
                  <div className="shipping-info-alert">
                    <div className="shipping-alert-content">
                      <Icon name="info" style={{ width: '18px', height: '18px', color: 'var(--primary)' }} />
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className="shipping-alert-title">Shipping Charges</span>
                        <span className="shipping-alert-note">Calculated based on your location</span>
                      </div>
                    </div>
                    <span className="badge-pill-elite badge-primary-lite">Additional</span>
                  </div>
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
              <p>1-7 business days</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
