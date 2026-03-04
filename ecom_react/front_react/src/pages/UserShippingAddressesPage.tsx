import { UserDashboardLayout } from '../components/layout/UserDashboardLayout'
import { Icon } from '../components/ui/Icon'

export function UserShippingAddressesPage() {
  return (
    <UserDashboardLayout
      active="addresses"
      subtitle="Manage your delivery locations for faster checkout."
      title="Shipping Addresses"
      actionLabel="Add New Address"
      actionHref="#"
    >
      <div className="addresses-grid">
        <article className="address-card default">
          <div className="address-head">
            <h3>
              <Icon className="icon-sm" name="home" /> Home
            </h3>
            <span>Default</span>
          </div>
          <strong>John Alexander</strong>
          <p>123 Luxury Lane, Suite 456</p>
          <p>Beverly Hills, CA 90210</p>
          <p>United States</p>
          <p className="address-phone">
            <Icon className="icon-sm" name="phone" /> +1 (555) 000-1111
          </p>
          <div className="address-actions">
            <button type="button">
              <Icon className="icon-sm" name="edit" /> Edit
            </button>
            <button className="muted" type="button">
              <Icon className="icon-sm" name="trash" /> Remove
            </button>
          </div>
        </article>

        <article className="address-card">
          <div className="address-head">
            <h3>
              <Icon className="icon-sm" name="business" /> Office
            </h3>
          </div>
          <strong>John Alexander (Design Studio)</strong>
          <p>888 Creative Plaza, 12th Floor</p>
          <p>Santa Monica, CA 90401</p>
          <p>United States</p>
          <p className="address-phone">
            <Icon className="icon-sm" name="phone" /> +1 (555) 999-2222
          </p>
          <div className="address-actions">
            <button type="button">
              <Icon className="icon-sm" name="edit" /> Edit
            </button>
            <button className="danger" type="button">
              <Icon className="icon-sm" name="trash" /> Remove
            </button>
          </div>
        </article>

        <button className="address-add-card" type="button">
          <span>
            <Icon className="icon-md" name="plus" />
          </span>
          <h4>Add Another Address</h4>
          <p>Vacation home or family residence?</p>
        </button>
      </div>
    </UserDashboardLayout>
  )
}
