import { UserDashboardLayout } from '../components/layout/UserDashboardLayout'
import { Icon } from '../components/ui/Icon'
import { useAuth } from '../context/AuthHook'

const recentOrders = [
  { id: '#TF-99021', date: 'Oct 18, 2023', items: '1 Item', amount: 'Rs 34,999', status: 'Shipped' },
  { id: '#TF-98845', date: 'Oct 12, 2023', items: '3 Items', amount: 'Rs 78,999', status: 'Delivered' },
  { id: '#TF-98721', date: 'Sep 28, 2023', items: '2 Items', amount: 'Rs 52,499', status: 'Processing' },
]

export function UserDashboardPage() {
  const { user } = useAuth()
  const displayName = user?.name || 'Customer'

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
          <strong>24</strong>
          <p className="up">+3 from last month</p>
        </article>
      </div>

      <section className="dash-panel">
        <div className="dash-panel-head">
          <h3>
            <Icon className="icon-sm" name="truck" /> Current Shipment
          </h3>
          <small>Arriving Thursday, Oct 24</small>
        </div>
        <div className="shipment-row">
          <img
            alt="Velvet chair"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiilh-Tazwkh6k9coXcjo1wpUqJCB47BjrSDa_py9foAo_80cEn5aap3Os7v0wTOMcg9267UFViieJRXaHga0Aq-P9LttYp2CZWuzjq7BY24pDh3RxB22-ZzAEvtAnBwXwEARyrRcvtLZx9LS7W2lU09pQr90rdVZoK6vpLn5p7pBn_tFa2sedOz5ONpjXCkbEy5t4IrqpCqgjUV-ELa5bQPCafGkV-nIdjfgV14_ZDmTSqRYCfgfjuzWo5NnAu9pjd-efCzWu6pCn"
          />
          <div className="shipment-info">
            <h4>Velvet Occasional Chair</h4>
            <p>Order #TF-99021 • Standard Shipping</p>
            <div className="shipment-track">
              <div className="active-line" />
            </div>
            <div className="shipment-steps">
              <span className="active">Confirmed</span>
              <span className="active">Processing</span>
              <span className="active">In Transit</span>
              <span>Delivered</span>
            </div>
          </div>
          <a href="#">Track Package</a>
        </div>
      </section>

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
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.date}</td>
                  <td>{order.items}</td>
                  <td>{order.amount}</td>
                  <td>
                    <span className={`status-pill ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <button className="more-btn" type="button">
                      <Icon className="icon-sm" name="more" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </UserDashboardLayout>
  )
}
