import { useMemo, useState } from 'react'
import { UserDashboardLayout } from '../components/layout/UserDashboardLayout'
import { Icon } from '../components/ui/Icon'

type OrderStatus = 'Delivered' | 'Shipped' | 'Processing' | 'Cancelled'

type OrderItem = {
  id: string
  date: string
  status: OrderStatus
  total: string
  action: string
}

const allOrders: OrderItem[] = [
  { id: '#LX-99021', date: 'Oct 12, 2023', status: 'Delivered', total: 'Rs 1,42,900', action: 'View Details' },
  { id: '#LX-98845', date: 'Sep 28, 2023', status: 'Shipped', total: 'Rs 84,950', action: 'Track' },
  { id: '#LX-98712', date: 'Sep 15, 2023', status: 'Processing', total: 'Rs 2,19,000', action: 'View Details' },
  { id: '#LX-98554', date: 'Aug 30, 2023', status: 'Delivered', total: 'Rs 32,500', action: 'Invoice' },
  { id: '#LX-98301', date: 'Aug 12, 2023', status: 'Cancelled', total: 'Rs 54,000', action: 'Refunded' },
  { id: '#LX-98174', date: 'Jul 26, 2023', status: 'Delivered', total: 'Rs 76,400', action: 'View Details' },
  { id: '#LX-98092', date: 'Jul 10, 2023', status: 'Shipped', total: 'Rs 1,12,200', action: 'Track' },
  { id: '#LX-97980', date: 'Jun 28, 2023', status: 'Processing', total: 'Rs 48,990', action: 'View Details' },
  { id: '#LX-97861', date: 'Jun 14, 2023', status: 'Delivered', total: 'Rs 1,29,999', action: 'Invoice' },
  { id: '#LX-97735', date: 'May 30, 2023', status: 'Cancelled', total: 'Rs 22,450', action: 'Refunded' },
]

const pageSize = 5

export function UserOrderHistoryPage() {
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(allOrders.length / pageSize)

  const pagedOrders = useMemo(() => {
    const start = (page - 1) * pageSize
    return allOrders.slice(start, start + pageSize)
  }, [page])

  const pagesToShow = useMemo(() => {
    return Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1)
  }, [totalPages])

  return (
    <UserDashboardLayout
      active="orders"
      subtitle="Review your past purchases and track current shipments."
      title="Order History"
    >
      <div className="orders-page-center">
        <div className="orders-toolbar">
          <label className="orders-search">
            <Icon className="icon-sm" name="search" />
            <input placeholder="Search by Order ID or Date..." type="text" />
          </label>
          <select defaultValue="all">
            <option value="all">All Status</option>
            <option value="delivered">Delivered</option>
            <option value="shipped">Shipped</option>
            <option value="processing">Processing</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select defaultValue="6m">
            <option value="6m">Last 6 Months</option>
            <option value="12m">Last 12 Months</option>
            <option value="all">All Time</option>
          </select>
        </div>

        <section className="dash-panel">
          <div className="orders-table-wrap">
            <table className="orders-table order-history-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="order-id">{order.id}</td>
                    <td>{order.date}</td>
                    <td>
                      <span className={`status-pill ${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="order-total">{order.total}</td>
                    <td>
                      <button
                        className={`order-action-btn ${
                          order.action === 'Refunded' ? 'muted' : ''
                        }`}
                        type="button"
                      >
                        {order.action}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="orders-pagination-row">
          <p>{`Showing ${(page - 1) * pageSize + 1} to ${Math.min(
            page * pageSize,
            allOrders.length
          )} of ${allOrders.length} orders`}</p>

          <div className="orders-pagination">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              type="button"
            >
              {'<'}
            </button>
            {pagesToShow.map((p) => (
              <button
                className={page === p ? 'active' : ''}
                key={p}
                onClick={() => setPage(p)}
                type="button"
              >
                {p}
              </button>
            ))}
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              type="button"
            >
              {'>'}
            </button>
          </div>
        </div>
      </div>
    </UserDashboardLayout>
  )
}
