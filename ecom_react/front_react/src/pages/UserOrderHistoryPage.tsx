import { useEffect, useState } from 'react'
import { UserDashboardLayout } from '../components/layout/UserDashboardLayout'
import { Icon } from '../components/ui/Icon'
import { useAuth } from '../context/AuthHook'
import { orderApi } from '../api'
import type { ApiOrder } from '../api'
import { formatINR } from '../context/CartContext'

export function UserOrderHistoryPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<ApiOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Status')

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      const data = await orderApi.list(user!.id)
      setOrders(data)
    } catch (err) {
      console.error('Failed to fetch orders', err)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = (order.paypal_orderid || order.id.toString()).toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'All Status' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <UserDashboardLayout
      active="orders"
      subtitle="Review your past purchases and track current shipments."
      title="Order History"
    >
      <div className="orders-filters dash-panel p-4 mb-6">
        <div className="flex-between flex-wrap gap-4">
          <div className="search-box-wrap flex-1 min-w-[300px]">
            <Icon name="search" className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by Order ID or Date..." 
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <select 
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All Status</option>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Delivered</option>
              <option>Cancelled</option>
            </select>
            <select className="filter-select">
              <option>Last 6 Months</option>
              <option>Last Year</option>
              <option>2023</option>
            </select>
          </div>
        </div>
      </div>

      <section className="dash-panel">
        <div className="orders-table-wrap">
          <table className="orders-table">
            <thead>
              <tr>
                <th>ORDER ID</th>
                <th>DATE</th>
                <th>STATUS</th>
                <th>TOTAL</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem' }}>Loading order history...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '5rem' }}>
                    <Icon name="history" className="text-muted opacity-20 mb-4" style={{ fontSize: '4rem' }} />
                    <h3 className="text-lg font-bold">No orders found</h3>
                    <p className="text-muted">You haven't placed any orders yet.</p>
                    <a href="/shop" className="btn-primary mt-4 inline-block">Start Shopping</a>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <a href={`/account/orders/${order.id}`} className="order-link">
                        #{order.paypal_orderid || order.id}
                      </a>
                    </td>
                    <td>{new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td>
                      <span className={`status-pill ${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="font-bold">{formatINR(order.amount)}</td>
                    <td>
                      <div className="flex gap-2">
                        <a href={`/account/orders/${order.id}`} className="btn-action-sm">VIEW DETAILS</a>
                        {order.status.toLowerCase() === 'shipped' && <button className="btn-action-sm">TRACK</button>}
                        {order.status.toLowerCase() === 'delivered' && <button className="btn-action-sm">INVOICE</button>}
                      </div>
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
