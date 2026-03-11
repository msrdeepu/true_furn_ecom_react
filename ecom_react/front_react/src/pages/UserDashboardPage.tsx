import { useEffect, useState } from 'react'
import { UserDashboardLayout } from '../components/layout/UserDashboardLayout'
import { Icon } from '../components/ui/Icon'
import { useAuth } from '../context/AuthHook'
import { orderApi } from '../api'
import type { ApiOrder } from '../api'
import { formatINR } from '../context/CartContext'

export function UserDashboardPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<ApiOrder[]>([])
  const [latestOrder, setLatestOrder] = useState<ApiOrder | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const displayName = user?.name || 'Customer'

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [allOrders, latest] = await Promise.all([
        orderApi.list(user!.id),
        orderApi.latest(user!.id)
      ])
      setOrders(allOrders)
      setLatestOrder(latest)
    } catch (err) {
      console.error('Failed to fetch dashboard data', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Get status steps for tracking line
  const getStatusProgress = (status: string) => {
    const steps = ['Confirmed', 'Processing', 'In-Progress', 'Shipped', 'Delivered']
    const currentIndex = steps.findIndex(s => s.toLowerCase() === status.toLowerCase())
    if (currentIndex === -1) return 20 // Default small progress
    return ((currentIndex + 1) / steps.length) * 100
  }

  const isStepActive = (step: string, currentStatus: string) => {
    const steps = ['Confirmed', 'Processing', 'In-Progress', 'Shipped', 'Delivered']
    const stepIdx = steps.indexOf(step)
    const currentIdx = steps.findIndex(s => s.toLowerCase() === currentStatus.toLowerCase())
    return stepIdx <= currentIdx
  }

  return (
    <UserDashboardLayout
      actionHref="/shop"
      actionLabel="Browse Shop"
      active="dashboard"
      subtitle="Your personalized interior inspiration and order status."
      title={`Welcome back, ${displayName}`}
    >
      <div className="dash-stats single-stat">
        <article>
          <h4>Total Orders</h4>
          <strong>{orders.length}</strong>
          <p className="up">Real-time status</p>
        </article>
      </div>

      {latestOrder && latestOrder.status.toLowerCase() !== 'delivered' && (
        <section className="dash-panel">
          <div className="dash-panel-head">
            <h3>
              <Icon className="icon-sm" name="truck" /> Current Shipment
            </h3>
            <small>Ordered {new Date(latestOrder.created_at).toLocaleDateString()}</small>
          </div>
          <div className="shipment-row">
            <img
              alt={latestOrder.items?.[0]?.name || 'Product'}
              src={latestOrder.items?.[0]?.image || 'https://via.placeholder.com/100'}
            />
            <div className="shipment-info">
              <h4>{latestOrder.items?.[0]?.name || 'Recent Order'}</h4>
              <p>Order #{latestOrder.paypal_orderid || latestOrder.id} • Standard Shipping</p>
              <div className="shipment-track">
                <div className="active-line" style={{ width: `${getStatusProgress(latestOrder.status)}%` }} />
              </div>
              <div className="shipment-steps">
                <span className={isStepActive('Confirmed', latestOrder.status) ? 'active' : ''}>Confirmed</span>
                <span className={isStepActive('Processing', latestOrder.status) ? 'active' : ''}>Processing</span>
                <span className={isStepActive('In-Progress', latestOrder.status) || isStepActive('Shipped', latestOrder.status) ? 'active' : ''}>Transit</span>
                <span className={isStepActive('Delivered', latestOrder.status) ? 'active' : ''}>Delivered</span>
              </div>
            </div>
            <a href={`/account/orders/${latestOrder.id}`}>View Details</a>
          </div>
        </section>
      )}

      <section className="dash-panel">
        <div className="dash-panel-head">
          <h3>Recent Orders</h3>
          <a href="/account/orders">View All</a>
        </div>
        <div className="orders-table-wrap">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>Loading orders...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>No orders found</td></tr>
              ) : (
                orders.slice(0, 5).map((order) => (
                  <tr key={order.id}>
                    <td>#{order.paypal_orderid || order.id}</td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                    <td>{order.items?.length || 0} Items</td>
                    <td>{formatINR(order.amount)}</td>
                    <td>
                      <span className={`status-pill ${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <a className="more-btn" href={`/account/orders/${order.id}`}>
                        <Icon className="icon-sm" name="visibility" />
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

    </UserDashboardLayout>
  )
}
