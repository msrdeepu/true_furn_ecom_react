import { useEffect, useState } from 'react'
import { UserDashboardLayout } from '../components/layout/UserDashboardLayout'
import { Icon } from '../components/ui/Icon'
import { useAuth } from '../context/AuthHook'
import { orderApi } from '../api'
import type { ApiOrder } from '../api'
import { formatINR } from '../context/CartContext'

export function UserOrderDetailPage() {
  const { user } = useAuth()
  const [order, setOrder] = useState<ApiOrder | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Get ID from URL since we're using a simple router
  const orderId = window.location.pathname.split('/').pop()

  useEffect(() => {
    if (user && orderId) {
      fetchOrderDetails()
    }
  }, [user, orderId])

  const fetchOrderDetails = async () => {
    setIsLoading(true)
    try {
      const data = await orderApi.get(parseInt(orderId!))
      setOrder(data)
    } catch (err) {
      console.error('Failed to fetch order details', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <UserDashboardLayout active="orders" title="Order Details" subtitle="Loading your order information...">
        <div style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div>
      </UserDashboardLayout>
    )
  }

  if (!order) {
    return (
      <UserDashboardLayout active="orders" title="Order Not Found" subtitle="We couldn't find the order you're looking for.">
        <div style={{ padding: '4rem', textAlign: 'center' }}>
          <p>The order might have been removed or the ID is incorrect.</p>
          <a href="/account/orders" className="btn-primary mt-4 inline-block">Back to Orders</a>
        </div>
      </UserDashboardLayout>
    )
  }

  return (
    <UserDashboardLayout
      active="orders"
      title={`Order Details`}
      subtitle={`Comprehensive summary of your transaction`}
    >
      <div className="order-detail-container pt-4">
        {/* Elite Unified Header SECTION */}
        <div className="order-header-elite">
          <div className="order-id-block-elite">
            <h2>
              Order <span>#{order.id}</span>
            </h2>
            <div className="order-meta-elite">
              <span className="order-date-elite">
                <Icon name="history" className="icon-xs" />
                Placed on {new Date(order.created_at).toLocaleDateString(undefined, { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
          <div>
            <span className={`order-status-badge-elite ${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
              {order.status}
            </span>
          </div>
        </div>

        <div className="order-detail-grid">
          <div className="order-main-content">
            {/* Items Summary Card */}
            <div className="elite-card">
              <div className="elite-card-header !bg-gray-50/30">
                <h3 className="text-xl font-black text-gray-800 flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex-center text-primary">
                    <Icon name="shopping_bag" className="icon-sm" />
                  </div>
                  Items Summary
                </h3>
                <span className="text-sm font-bold text-gray-400 bg-white px-4 py-1.5 rounded-full border border-gray-100">
                  {order.items?.length || 0} Products
                </span>
              </div>
              <div className="elite-card-body !pt-4">
                <div className="order-items-list-elite">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item) => (
                      <div key={item.id} className="order-item-elite">
                        <div className="order-item-thumb-wrap">
                          <img 
                            src={item.image || 'https://via.placeholder.com/100?text=No+Image'} 
                            alt={item.name} 
                            className="order-item-thumb"
                          />
                        </div>
                        <div className="order-item-info">
                          <h4 className="order-item-title">{item.name}</h4>
                          <div className="order-item-meta">
                            <span className="meta-pill primary">
                               Qty: {item.quantity}
                            </span>
                            <span className="meta-pill">
                               {formatINR(item.price)} per unit
                            </span>
                          </div>
                        </div>
                        <div className="order-item-price-total">
                          <p className="total-price-text">{formatINR(item.unit_total)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-20 text-center">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex-center mx-auto mb-4 border border-dashed border-gray-200">
                        <Icon name="error_outline" className="icon-lg text-gray-300" />
                      </div>
                      <p className="text-gray-400 font-bold">No purchase data available for this record.</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="elite-card-footer !bg-[#f8fafc]/50">
                <div className="elite-summary-wrap">
                  <div className="summary-row-elite">
                    <span className="summary-label-elite">Subtotal</span>
                    <span className="summary-value-elite">{formatINR(order.amount)}</span>
                  </div>
                  <div className="summary-row-elite">
                    <span className="summary-label-elite">
                      <Icon name="local_shipping" className="icon-xs" />
                      Shipping Fee
                    </span>
                    <span className="summary-value-elite free">FREE</span>
                  </div>
                  <div className="elite-total-cta">
                    <div className="final-amount-block">
                        <h5>Final Amount</h5>
                        <p>Inclusive of all taxes</p>
                    </div>
                    <div className="final-price-elite">
                        {formatINR(order.amount)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Journey Card */}
            <div className="elite-card">
              <div className="elite-card-header">
                <h3 className="text-xl font-black text-gray-800 flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex-center text-primary">
                    <Icon name="history" className="icon-sm" />
                  </div>
                  Order Journey
                </h3>
              </div>
              <div className="elite-card-body">
                <div className="order-timeline-elite">
                  <div className="timeline-item-elite active">
                    <div className="timeline-marker-elite"></div>
                    <div className="timeline-content-elite">
                      <h4>Order Placed</h4>
                      <p>Successfully received on {new Date(order.created_at).toLocaleString([], { dateStyle: 'long', timeStyle: 'short' })}</p>
                    </div>
                  </div>
                  <div className={`timeline-item-elite ${order.payment_status?.toLowerCase() === 'completed' || order.payment_status?.toLowerCase() === 'paid' ? 'active' : ''}`}>
                    <div className="timeline-marker-elite"></div>
                    <div className="timeline-content-elite">
                      <h4>Payment Status</h4>
                      <p className="font-black !text-gray-900 uppercase tracking-widest text-xs mt-1">Status: {order.payment_status || 'NOT INITIALIZED'}</p>
                    </div>
                  </div>
                  <div className={`timeline-item-elite ${['shipped', 'delivered'].includes(order.status.toLowerCase()) ? 'active' : ''}`}>
                    <div className="timeline-marker-elite"></div>
                    <div className="timeline-content-elite">
                      <h4>Shipment Details</h4>
                      <p>{order.status === 'Shipped' || order.status === 'Delivered' ? 'Your package is on its way to the delivery address.' : 'Your order is currently being prepared for dispatch.'}</p>
                    </div>
                  </div>
                  <div className={`timeline-item-elite ${order.status.toLowerCase() === 'delivered' ? 'active' : ''}`}>
                    <div className="timeline-marker-elite"></div>
                    <div className="timeline-content-elite">
                      <h4>Delivery</h4>
                      <p>{order.status === 'Delivered' ? 'Package has been delivered successfully. Thank you for shopping!' : 'We will notify you once the package is delivered.'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="order-sidebar">
            {/* Reference (Moved to Top) */}
            {order.paypal_orderid && (
              <div className="elite-card !bg-gray-900 border-none">
                <div className="elite-card-body !p-8">
                  <p className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] mb-4">Transaction Reference</p>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 select-all backdrop-blur-sm">
                    <code className="text-[11px] break-all font-mono text-gray-300 leading-relaxed font-bold tracking-tight">{order.paypal_orderid}</code>
                  </div>
                  <p className="text-[10px] text-gray-500 font-bold mt-4 flex items-center gap-2">
                    <Icon name="lock" className="icon-xs" />
                    Secure encrypted transaction
                  </p>
                </div>
              </div>
            )}

            {/* Customer Details */}
            <div className="elite-card">
              <div className="elite-card-header !py-6 !px-8">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Contact Information</h3>
              </div>
              <div className="elite-card-body !p-8">
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex-center text-primary border border-gray-100">
                    <Icon name="person" className="icon-md" />
                  </div>
                  <div>
                    <h4 className="font-black text-2xl text-gray-900 capitalize">{user?.name} {user?.lname}</h4>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Verified Customer</span>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 flex-shrink-0 bg-gray-50 rounded-xl flex-center text-gray-500 border border-gray-100">
                      <Icon name="mail" className="icon-xs" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-0.5">Primary Email</p>
                      <p className="text-sm font-bold text-gray-900 truncate">{order.email_address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 flex-shrink-0 bg-gray-50 rounded-xl flex-center text-gray-500 border border-gray-100">
                      <Icon name="phone" className="icon-xs" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-0.5">Phone Number</p>
                      <p className="text-sm font-bold text-gray-900">{user?.mobile || user?.phone || 'Not Provided'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Details */}
            <div className="elite-card">
              <div className="elite-card-header !py-6 !px-8">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Shipping Destination</h3>
              </div>
              <div className="elite-card-body !p-8">
                {order.address ? (
                  <div>
                    <div className="inline-flex items-center gap-2 bg-primary/5 px-4 py-1 rounded-full border border-primary/10 mb-6">
                      <Icon name="location" className="icon-xs text-primary" />
                      <span className="text-[10px] font-black uppercase text-primary tracking-widest">{order.address.a_type}</span>
                    </div>
                    <p className="text-xl font-extrabold text-gray-900 leading-tight mb-2">{order.address.address}</p>
                    {order.address.extra_address && (
                      <p className="text-gray-500 font-bold mb-6 text-sm leading-relaxed">{order.address.extra_address}</p>
                    )}
                    <div className="pt-6 border-t border-gray-100 mt-6 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1">City</p>
                        <p className="text-sm font-bold text-gray-900">{order.address.city}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1">Zip Code</p>
                        <p className="text-sm font-bold text-gray-900">{order.address.zipcode}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-10 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <Icon name="error_outline" className="icon-lg text-gray-300 mb-3" />
                    <p className="text-sm text-gray-400 font-bold max-w-[200px] mx-auto">No shipping details linked to this transaction record.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Reference section removed, moved to header */}
          </div>
        </div>
      </div>
    </UserDashboardLayout>
  )
}
