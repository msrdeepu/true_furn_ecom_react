import { useEffect, useState } from 'react'
import { UserDashboardLayout } from '../components/layout/UserDashboardLayout'
import { Icon } from '../components/ui/Icon'
import { addressApi, settingsApi, type ApiAddress, type ApiCountry, type ApiState, type ApiDistrict } from '../api'
import { useAuth } from '../context/AuthHook'
import { useToast } from '../context/ToastContext'
import Select from 'react-select'

export function UserShippingAddressesPage() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [addresses, setAddresses] = useState<ApiAddress[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editingAddress, setEditingAddress] = useState<ApiAddress | null>(null)

  // Form State
  const [formData, setFormData] = useState<Partial<ApiAddress>>({
    a_type: 'Home',
    address: '',
    extra_address: '',
    country_id: null,
    state_id: null,
    district_id: null,
    city: '',
    zipcode: '',
    location: '',
    contact_number: '+91 ',
  })

  // Dropdown Data
  const [countries, setCountries] = useState<ApiCountry[]>([])
  const [states, setStates] = useState<ApiState[]>([])
  const [districts, setDistricts] = useState<ApiDistrict[]>([])
  const [isLoadingSettings, setIsLoadingSettings] = useState(false)

  const fetchAddresses = async () => {
    if (!user) return
    setIsLoading(true)
    try {
      const data = await addressApi.list(user.id)
      setAddresses(data)
    } catch (err: any) {
      showToast('Failed to load addresses: ' + err.message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAddresses()
    fetchCountries()
  }, [user?.id])

  const fetchCountries = async () => {
    try {
      const data = await settingsApi.getCountries()
      setCountries(data)
    } catch (err) {
      console.error('Failed to load countries', err)
    }
  }

  const fetchStates = async (countryId: number) => {
    try {
      setIsLoadingSettings(true)
      const data = await settingsApi.getStates(countryId)
      setStates(data)
    } catch (err) {
      console.error('Failed to load states', err)
    } finally {
      setIsLoadingSettings(false)
    }
  }

  const fetchDistricts = async (stateId: number) => {
    try {
      setIsLoadingSettings(true)
      const data = await settingsApi.getDistricts(stateId)
      setDistricts(data)
    } catch (err) {
      console.error('Failed to load districts', err)
    } finally {
      setIsLoadingSettings(false)
    }
  }

  const handleOpenModal = (address: ApiAddress | null = null) => {
    if (address) {
      setEditingAddress(address)
      setFormData({
        a_type: address.a_type,
        address: address.address,
        extra_address: address.extra_address || '',
        country_id: address.country_id || null,
        state_id: address.state_id || null,
        district_id: address.district_id || null,
        city: address.city || '',
        zipcode: address.zipcode || '',
        location: address.location || '',
        contact_number: address.contact_number?.startsWith('+91 ') ? address.contact_number : `+91 ${address.contact_number || ''}`.trim(),
      })
      if (address.country_id) fetchStates(address.country_id)
      if (address.state_id) fetchDistricts(address.state_id)
    } else {
      setEditingAddress(null)
      setFormData({
        a_type: 'Home',
        address: '',
        extra_address: '',
        country_id: null,
        state_id: null,
        district_id: null,
        city: '',
        zipcode: '',
        location: '',
        contact_number: '+91 ',
      })
      setStates([])
      setDistricts([])
    }
    setIsModalOpen(true)
  }

  const handleCountryChange = (selectedOption: any) => {
    const countryId = selectedOption ? selectedOption.value : null
    setFormData({ ...formData, country_id: countryId, state_id: null, district_id: null })
    setStates([])
    setDistricts([])
    if (countryId) fetchStates(countryId)
  }

  const handleStateChange = (selectedOption: any) => {
    const stateId = selectedOption ? selectedOption.value : null
    setFormData({ ...formData, state_id: stateId, district_id: null })
    setDistricts([])
    if (stateId) fetchDistricts(stateId)
  }

  const handleDistrictChange = (selectedOption: any) => {
    const districtId = selectedOption ? selectedOption.value : null
    setFormData({ ...formData, district_id: districtId })
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (!val.startsWith('+91 ')) {
        // If they try to delete the prefix, force it back
        val = '+91 ';
    }
    // Only allow digits after prefix
    const numberPart = val.substring(4).replace(/\D/g, '');
    // Limit to 10 digits
    const truncatedNumber = numberPart.substring(0, 10);
    setFormData({ ...formData, contact_number: `+91 ${truncatedNumber}` });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate Phone Number
    const phoneDigits = formData.contact_number?.substring(4) || '';
    if (phoneDigits.length !== 10) {
        showToast('Please enter a valid 10-digit Indian phone number.', 'error');
        return;
    }

    if (!user) return
    setIsSaving(true)
    try {
      if (editingAddress) {
        await addressApi.update(editingAddress.id, formData)
        showToast('Address updated successfully', 'success')
      } else {
        await addressApi.create({ ...formData, user_id: user.id })
        showToast('Address added successfully', 'success')
      }
      setIsModalOpen(false)
      fetchAddresses()
    } catch (err: any) {
      showToast('Error: ' + err.message, 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this address?')) return
    try {
      await addressApi.delete(id)
      showToast('Address deleted', 'success')
      fetchAddresses()
    } catch (err: any) {
      showToast('Delete failed: ' + err.message, 'error')
    }
  }

  return (
    <UserDashboardLayout
      active="addresses"
      subtitle="Manage your delivery locations for faster checkout."
      title="Shipping Addresses"
    >
      <div className="addresses-content">
        {isLoading ? (
          <div className="loading-state">
            <p>Loading your addresses...</p>
          </div>
        ) : addresses.length === 0 ? (
          <div className="address-empty-state">
            <div className="empty-icon">
              <Icon name="location" className="icon-lg" />
            </div>
            <h3>No Addresses Found</h3>
            <p>You haven't added any shipping addresses yet. Add one to make checkout faster!</p>
            <button className="btn-primary" onClick={() => handleOpenModal()} type="button">
              <Icon name="plus" className="icon-sm" /> Add Your First Address
            </button>
          </div>
        ) : (
          <div className="addresses-grid">
            {addresses.map((addr) => (
              <article className="address-card" key={addr.id}>
                <div className="address-head">
                  <h3>
                    <Icon className="icon-sm" name={addr.a_type.toLowerCase() === 'home' ? 'home' : 'business'} /> {addr.a_type}
                  </h3>
                </div>
                <strong>{user?.name} {user?.lname}</strong>
                {addr.contact_number && (
                    <p className="text-sm font-bold text-gray-600 mb-2 flex items-center gap-2">
                        <Icon name="phone" className="icon-xs" /> {addr.contact_number}
                    </p>
                )}
                <p>{addr.address}</p>
                {addr.extra_address && <p>{addr.extra_address}</p>}
                <p>
                  {[
                    addr.district?.name || addr.city,
                    addr.state?.name,
                    addr.country?.name,
                    addr.zipcode
                  ].filter(Boolean).join(', ')}
                </p>
                <div className="address-actions">
                  <button onClick={() => handleOpenModal(addr)} type="button">
                    <Icon className="icon-sm" name="edit" /> Edit
                  </button>
                  <button className="danger" onClick={() => handleDelete(addr.id)} type="button">
                    <Icon className="icon-sm" name="trash" /> Remove
                  </button>
                </div>
              </article>
            ))}

            <button className="address-add-card" onClick={() => handleOpenModal()} type="button">
              <span>
                <Icon className="icon-md" name="plus" />
              </span>
              <h4>Add Another Address</h4>
              <p>Vacation home or family residence?</p>
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content address-modal">
            <div className="modal-header">
              <h3>{editingAddress ? 'Edit Address' : 'New Address'}</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                <Icon name="close" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Address Type (Home/Work/etc)</label>
                <input
                  value={formData.a_type || ''}
                  onChange={(e) => setFormData({ ...formData, a_type: e.target.value })}
                  required
                  type="text"
                />
              </div>
              <div className="form-group">
                <label>Address Line 1</label>
                <input
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  type="text"
                />
              </div>
              <div className="form-group">
                <label>Address Line 2 (Optional)</label>
                <input
                  value={formData.extra_address || ''}
                  onChange={(e) => setFormData({ ...formData, extra_address: e.target.value })}
                  type="text"
                />
              </div>
              <div className="form-group">
                <label>Contact Number</label>
                <input
                  value={formData.contact_number || '+91 '}
                  onChange={handlePhoneChange}
                  placeholder="+91 9999999999"
                  required
                  type="tel"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Country</label>
                  <Select
                    className="react-select-container"
                    classNamePrefix="react-select"
                    value={countries.map(c => ({ value: c.id, label: c.name })).find(op => op.value === formData.country_id) || null}
                    onChange={handleCountryChange}
                    options={countries.map(c => ({ value: c.id, label: c.name }))}
                    placeholder="Select Country"
                    isClearable
                    required
                  />
                </div>
                <div className="form-group">
                  <label>State {isLoadingSettings && <small className="text-muted ml-2">Loading...</small>}</label>
                  <Select
                    className="react-select-container"
                    classNamePrefix="react-select"
                    value={states.map(s => ({ value: s.id, label: s.name })).find(op => op.value === formData.state_id) || null}
                    onChange={handleStateChange}
                    options={states.map(s => ({ value: s.id, label: s.name }))}
                    placeholder="Select State"
                    isDisabled={!formData.country_id || states.length === 0}
                    isClearable
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>District {isLoadingSettings && <small className="text-muted ml-2">Loading...</small>}</label>
                  <Select
                    className="react-select-container"
                    classNamePrefix="react-select"
                    value={districts.map(d => ({ value: d.id, label: d.name })).find(op => op.value === formData.district_id) || null}
                    onChange={handleDistrictChange}
                    options={districts.map(d => ({ value: d.id, label: d.name }))}
                    placeholder="Select District"
                    isDisabled={!formData.state_id || districts.length === 0}
                    isClearable
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Zipcode / PIN Code</label>
                  <input
                    value={formData.zipcode || ''}
                    onChange={(e) => setFormData({ ...formData, zipcode: e.target.value })}
                    type="text"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Location / Landmark</label>
                <input
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  type="text"
                />
              </div>
              <div className="modal-footer">
                <button className="btn-secondary" onClick={() => setIsModalOpen(false)} type="button">
                  Cancel
                </button>
                <button className="btn-primary" disabled={isSaving} type="submit">
                  {isSaving ? 'Saving...' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </UserDashboardLayout>
  )
}
