import { UserDashboardLayout } from '../components/layout/UserDashboardLayout'
import { Icon } from '../components/ui/Icon'

export function UserAccountSettingsPage() {
  return (
    <UserDashboardLayout
      active="settings"
      subtitle="Update your profile information and manage your account security."
      title="Account Settings"
    >
      <div className="settings-breadcrumbs">
        <a href="/account">Account</a>
        <span>{'>'}</span>
        <strong>Settings</strong>
      </div>

      <section className="settings-panel">
        <div className="settings-panel-head">
          <h3>Profile Information</h3>
          <p>Update your basic profile details here.</p>
        </div>
        <div className="settings-grid">
          <label>
            <span>First Name</span>
            <input defaultValue="Alex" type="text" />
          </label>
          <label>
            <span>Last Name</span>
            <input defaultValue="Johnson" type="text" />
          </label>
          <label>
            <span>Email Address</span>
            <input defaultValue="alex.j@example.com" type="email" />
          </label>
          <label>
            <span>Phone Number</span>
            <input defaultValue="+1 (555) 000-0000" type="text" />
          </label>
        </div>
        <div className="settings-actions">
          <button className="btn-primary" type="button">
            Update Profile
          </button>
        </div>
      </section>

      <section className="settings-panel">
        <div className="settings-panel-head">
          <h3>Security & Password</h3>
          <p>Ensure your account is using a long, random password to stay secure.</p>
        </div>
        <div className="settings-password-grid">
          <label>
            <span>Current Password</span>
            <div className="password-input-wrap">
              <input defaultValue="........" type="password" />
              <button type="button">
                <Icon className="icon-sm" name="visibility" />
              </button>
            </div>
          </label>
          <label>
            <span>New Password</span>
            <input defaultValue="........" type="password" />
          </label>
          <label>
            <span>Confirm New Password</span>
            <input defaultValue="........" type="password" />
          </label>
        </div>
        <div className="settings-actions">
          <button className="btn-dark" type="button">
            Change Password
          </button>
        </div>
      </section>

      <section className="settings-danger">
        <div>
          <h4>Deactivate Account</h4>
          <p>Once you delete your account, there is no going back. Please be certain.</p>
        </div>
        <button type="button">Deactivate</button>
      </section>
    </UserDashboardLayout>
  )
}
