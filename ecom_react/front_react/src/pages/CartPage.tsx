import { useState } from 'react'
import { formatINR, useCart } from '../context/CartContext'

export function CartPage() {
  const { items, subtotal, totalItems, increaseQty, decreaseQty, removeFromCart } =
    useCart()
  const [paymentMethod, setPaymentMethod] = useState<'phonepe' | 'razorpay'>(
    'phonepe'
  )
  const tax = subtotal * 0.08
  const total = subtotal + tax

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
            <div className="payment-methods">
              <p>Select Payment Method</p>
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
            <button className="btn-primary summary-checkout" type="button">
              Proceed with {paymentMethod === 'phonepe' ? 'PhonePe' : 'Razorpay'}
            </button>
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
