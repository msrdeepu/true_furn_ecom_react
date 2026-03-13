import { useEffect, useState } from 'react'
import { UserDashboardLayout } from '../components/layout/UserDashboardLayout'
import { Icon } from '../components/ui/Icon'
import { useAuth } from '../context/AuthHook'
import { orderApi } from '../api'
import type { ApiOrderDetails } from '../api'
import { formatINR } from '../context/CartContext'

export function UserOrderDetailPage() {
  const { user } = useAuth()
  const [orderData, setOrderData] = useState<ApiOrderDetails | null>(null)
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
      setOrderData(data)
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

  if (!orderData) {
    return (
      <UserDashboardLayout active="orders" title="Order Not Found" subtitle="We couldn't find the order you're looking for.">
        <div style={{ padding: '4rem', textAlign: 'center' }}>
          <p>The order might have been removed or the ID is incorrect.</p>
          <a href="/account/orders" className="btn-primary mt-4 inline-block">Back to Orders</a>
        </div>
      </UserDashboardLayout>
    )
  }

  const { order, items, summary, tax_context, customer_address } = orderData;
  
  // Revised Tax Deduction Logic: 
  // Prioritize the raw tax_amount column from the orders table if available.
  const totalTaxAmount = order.tax_amount && order.tax_amount > 0 ? order.tax_amount : (summary.tax_total > 0 ? summary.tax_total : (order.amount - summary.subtotal > 0 ? (order.amount - summary.subtotal) : 0));
  const displaySubtotal = order.amount - totalTaxAmount;

  // Split logic for fallback display
  const isInterState = tax_context?.supply_type === 'inter_state';
  const fallbackCGST = totalTaxAmount > 0 && !isInterState && summary.cgst_total === 0 ? totalTaxAmount / 2 : summary.cgst_total;
  const fallbackSGST = totalTaxAmount > 0 && !isInterState && summary.sgst_total === 0 ? totalTaxAmount / 2 : summary.sgst_total;
  const fallbackIGST = totalTaxAmount > 0 && isInterState && summary.igst_total === 0 ? totalTaxAmount : summary.igst_total;

  // Calculate Shipping Fee dynamically


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
              Order <span>#{orderData.order_id}</span>
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
            <span className={`order-status-badge-elite ${order.status?.toLowerCase().replace(/\s+/g, '-') || ''}`}>
              {order.status || 'Unknown'}
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
                  {items?.length || 0} Products
                </span>
              </div>
              <div className="elite-card-body !pt-4">
                <div className="order-items-list-elite">
                  {items && items.length > 0 ? (
                    items.map((item) => {
                      const rawItem = order.items?.find((i) => i.id === item.id)
                      const imageUrl = rawItem?.image || 'https://via.placeholder.com/100?text=No+Image'
                      
                      return (
                      <div key={item.id} className="order-item-elite">
                        <div className="order-item-thumb-wrap">
                          <img 
                            src={imageUrl} 
                            alt={item.product?.name} 
                            className="order-item-thumb"
                          />
                        </div>
                        <div className="order-item-info">
                          <h4 className="order-item-title">{item.product?.name}</h4>
                          <span className="text-xs font-bold text-gray-400">Variant: {item.variant?.name || 'Standard'}</span>
                          <div className="order-item-meta mt-1">
                            <span className="meta-pill primary">
                               Qty: {item.quantity}
                            </span>
                            <span className="meta-pill">
                               {formatINR(item.unit_price)} / unit
                            </span>
                            {(item.tax_breakup?.tax_total > 0 || (rawItem && rawItem.tax_amount && rawItem.tax_amount > 0)) && (
                             <span className="meta-pill text-xs">
                               Tax ({item.tax_type}) {rawItem?.slab ? `${rawItem.slab}%` : ''}: {formatINR(rawItem && rawItem.tax_amount && rawItem.tax_amount > 0 ? rawItem.tax_amount : (item.tax_breakup?.tax_total || 0))}
                             </span>
                            )}
                          </div>
                        </div>
                        <div className="order-item-price-total">
                          <p className="total-price-text">{formatINR(item.total)}</p>
                        </div>
                      </div>
                    )})
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
                    <span className="summary-label-elite">Subtotal (Without Tax)</span>
                    <span className="summary-value-elite text-gray-700">{formatINR(displaySubtotal)}</span>
                  </div>
                  
                  {/* Dynamic Tax Rows */}
                  {/* Dynamic Tax Rows (Including Fallbacks) */}
                  {fallbackCGST > 0 && (
                      <div className="summary-row-elite">
                        <span className="summary-label-elite text-xs">CGST</span>
                        <span className="summary-value-elite text-xs text-gray-500">+{formatINR(fallbackCGST)}</span>
                      </div>
                  )}
                  {fallbackSGST > 0 && (
                      <div className="summary-row-elite">
                        <span className="summary-label-elite text-xs">SGST</span>
                        <span className="summary-value-elite text-xs text-gray-500">+{formatINR(fallbackSGST)}</span>
                      </div>
                  )}
                  {fallbackIGST > 0 && (
                      <div className="summary-row-elite">
                        <span className="summary-label-elite text-xs">IGST</span>
                        <span className="summary-value-elite text-xs text-gray-500">+{formatINR(fallbackIGST)}</span>
                      </div>
                  )}

                  <div className="summary-row-elite pt-3 border-t border-gray-100">
                    <span className="summary-label-elite font-bold">
                      <Icon name="local_shipping" className="icon-xs" />
                      Shipping Charges
                    </span>
                    <span className="summary-value-elite">
                      <span className="meta-pill primary uppercase text-[10px] tracking-widest px-3 py-1">Additional</span>
                    </span>
                  </div>
                  <div className="elite-total-cta mt-4">
                    <div className="final-amount-block">
                        <h5>Final Amount</h5>
                        <p>{tax_context?.applied_tax} Inclusive</p>
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
                  <div className={`timeline-item-elite ${['shipped', 'delivered'].includes(order.status?.toLowerCase() || '') ? 'active' : ''}`}>
                    <div className="timeline-marker-elite"></div>
                    <div className="timeline-content-elite">
                      <h4>Shipment Details</h4>
                      <p>{order.status === 'Shipped' || order.status === 'Delivered' ? 'Your package is on its way to the delivery address.' : 'Your order is currently being prepared for dispatch.'}</p>
                    </div>
                  </div>
                  <div className={`timeline-item-elite ${order.status?.toLowerCase() === 'delivered' ? 'active' : ''}`}>
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
                {customer_address ? (
                  <div>
                    <div className="inline-flex items-center gap-2 bg-primary/5 px-4 py-1 rounded-full border border-primary/10 mb-6">
                      <Icon name="location" className="icon-xs text-primary" />
                      <span className="text-[10px] font-black uppercase text-primary tracking-widest">{customer_address.a_type}</span>
                    </div>
                    <p className="text-xl font-extrabold text-gray-900 leading-tight mb-2">{customer_address.address}</p>
                    {customer_address.extra_address && (
                      <p className="text-gray-500 font-bold mb-6 text-sm leading-relaxed">{customer_address.extra_address}</p>
                    )}
                    <div className="pt-6 border-t border-gray-100 mt-6 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1">City</p>
                        <p className="text-sm font-bold text-gray-900">{customer_address.city}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1">Zip Code</p>
                        <p className="text-sm font-bold text-gray-900">{customer_address.zipcode}</p>
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

          </div>
        </div>
      </div>
    </UserDashboardLayout>
  )
}
