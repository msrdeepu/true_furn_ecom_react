import { useState, useEffect } from 'react'
import { UserDashboardLayout } from '../components/layout/UserDashboardLayout'
import { Icon } from '../components/ui/Icon'
import { useAuth } from '../context/AuthHook'
import { useToast } from '../context/ToastContext'
import { profileApi } from '../api'

export function UserAccountSettingsPage() {
  const { user, updateUser } = useAuth()
  const { showToast } = useToast()


  // Profile State
  const [profileData, setProfileData] = useState({
    name: '',
    lname: '',
    email: '',
    phone: '',
  })
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)

  // Password State
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  // Populate initial profile data when user loads
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        lname: user.lname || '',
        email: user.email || '',
        phone: user.mobile || user.phone || '',
      })
    }
  }, [user])

  // --- Handlers ---

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setIsUpdatingProfile(true)

    try {
      const response = await profileApi.updateProfile({ ...profileData, user_id: user.id })
      if (response.status && response.user) {
        updateUser(response.user)
        showToast('Profile updated successfully.', 'success')
      } else {
        showToast(response.message || 'Failed to update profile.', 'error')
      }
    } catch (err: any) {

      showToast(err.message || 'An error occurred updating profile.', 'error')
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (passwordData.new_password !== passwordData.confirm_password) {
      showToast('New passwords do not match.', 'error')
      return
    }

    if (passwordData.new_password.length < 8) {
        showToast('New password must be at least 8 characters.', 'error')
        return
    }

    setIsUpdatingPassword(true)

    try {
      const response = await profileApi.updatePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
        user_id: user.id
      })
      if (response.status) {
        showToast('Password updated successfully.', 'success')
        setPasswordData({ current_password: '', new_password: '', confirm_password: '' })
      } else {
        showToast(response.message || 'Failed to update password.', 'error')
      }
    } catch (err: any) {
      showToast(err.message || 'An error occurred updating password.', 'error')
    } finally {
      setIsUpdatingPassword(false)
    }
  }
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
          <h3>Security & Password</h3>
          <p>Ensure your account is using a long, random password to stay secure.</p>
        </div>
        <form onSubmit={handlePasswordSubmit}>
            <div className="settings-password-grid">
            <label>
                <span>Current Password</span>
                <div className="password-input-wrap">
                <input 
                    value={passwordData.current_password} 
                    onChange={e => setPasswordData({ ...passwordData, current_password: e.target.value })} 
                    type={showCurrentPassword ? "text" : "password"} 
                    required 
                />
                <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                    <Icon className="icon-sm" name={showCurrentPassword ? "visibility_off" : "visibility"} />
                </button>
                </div>
            </label>
            <label>
                <span>New Password</span>
                <div className="password-input-wrap">
                    <input 
                        value={passwordData.new_password} 
                        onChange={e => setPasswordData({ ...passwordData, new_password: e.target.value })} 
                        type={showNewPassword ? "text" : "password"} 
                        required 
                    />
                    <button type="button" onClick={() => setShowNewPassword(!showNewPassword)}>
                        <Icon className="icon-sm" name={showNewPassword ? "visibility_off" : "visibility"} />
                    </button>
                </div>
            </label>
            <label>
                <span>Confirm New Password</span>
                <div className="password-input-wrap">
                    <input 
                        value={passwordData.confirm_password} 
                        onChange={e => setPasswordData({ ...passwordData, confirm_password: e.target.value })} 
                        type={showConfirmPassword ? "text" : "password"} 
                        required 
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        <Icon className="icon-sm" name={showConfirmPassword ? "visibility_off" : "visibility"} />
                    </button>
                </div>
            </label>
            </div>
            <div className="settings-actions">
            <button className="btn-dark" type="submit" disabled={isUpdatingPassword}>
                {isUpdatingPassword ? 'Changing...' : 'Change Password'}
            </button>
            </div>
        </form>
      </section>

      <section className="settings-panel">
        <div className="settings-panel-head">
          <h3>Profile Information</h3>
          <p>Update your basic profile details here.</p>
        </div>
        <form onSubmit={handleProfileSubmit}>
            <div className="settings-grid">
            <label>
                <span>First Name</span>
                <input 
                    value={profileData.name} 
                    onChange={e => setProfileData({ ...profileData, name: e.target.value })} 
                    type="text" 
                    required 
                />
            </label>
            <label>
                <span>Last Name</span>
                <input 
                    value={profileData.lname} 
                    onChange={e => setProfileData({ ...profileData, lname: e.target.value })} 
                    type="text" 
                    required 
                />
            </label>
            <label>
                <span>Email Address</span>
                <input 
                    value={profileData.email} 
                    onChange={e => setProfileData({ ...profileData, email: e.target.value })} 
                    type="email" 
                    required 
                />
            </label>
            <label>
                <span>Phone Number</span>
                <input 
                    value={profileData.phone} 
                    onChange={e => setProfileData({ ...profileData, phone: e.target.value })} 
                    type="tel" 
                />
            </label>
            </div>
            <div className="settings-actions">
            <button className="btn-primary" type="submit" disabled={isUpdatingProfile}>
                {isUpdatingProfile ? 'Updating...' : 'Update Profile'}
            </button>
            </div>
        </form>
      </section>

    </UserDashboardLayout>
  )
}
