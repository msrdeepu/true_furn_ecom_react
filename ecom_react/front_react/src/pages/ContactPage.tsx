import { Icon } from '../components/ui/Icon'

export function ContactPage() {
  return (
    <div className="contact-page-wrapper">
      <div className="container">
        {/* Breadcrumbs */}
        <div className="shop-breadcrumbs" style={{ marginBottom: '2rem' }}>
          <a href="/">Home</a>
          <span>{'>'}</span>
          <strong>Contact Us</strong>
        </div>

        <div className="contact-grid">
          {/* Left Column: Contact Form */}
          <div className="contact-form-section">
            <h1 className="contact-title">Get in Touch</h1>
            <p className="contact-subtitle">Have a question or looking for a custom piece? We'd love to hear from you.</p>

            <form className="contact-form-elite" onSubmit={(e) => e.preventDefault()}>
              <div className="form-row-dual">
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" placeholder="e.g. John" />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" placeholder="e.g. Doe" />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input type="email" placeholder="john@example.com" />
              </div>

              <div className="form-group">
                <label>Subject</label>
                <select>
                  <option>General Inquiry</option>
                  <option>Custom Furniture Request</option>
                  <option>Order Status</option>
                  <option>Feedback</option>
                </select>
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea rows={5} placeholder="How can we help you?"></textarea>
              </div>

              <button className="btn-primary" style={{ width: '100%', padding: '1rem', marginTop: '1rem' }}>
                Send Message
              </button>
            </form>
          </div>

          {/* Right Column: Info & Map */}
          <div className="contact-info-section">
            <div className="contact-card-elite">
              <h3 className="info-title">Store Information</h3>
              
              <div className="info-item">
                <div className="info-icon-box">
                  <Icon name="public" />
                </div>
                <div>
                  <strong>Our Showroom</strong>
                  <p>D.No: 19-4-121, d-12, Air Bypass Rd, near Annamaiaha circle, STV Nagar, Tirupati, Andhra Pradesh 517501</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon-box">
                  <Icon name="share" />
                </div>
                <div>
                  <strong>Phone Number</strong>
                  <p>08772244922</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon-box">
                  <Icon name="image" />
                </div>
                <div>
                  <strong>Email Support</strong>
                  <p>support@treefurn.com</p>
                </div>
              </div>
            </div>

            <div className="contact-map-card">
              <h3 className="info-title">Find Us on Map</h3>
              <div className="map-embed-container">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3746.3048823272857!2d79.4225155!3d13.622625999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bad63fcfc48c89f%3A0x6c17d29f9b857412!2sTree%20Furn!5e1!3m2!1sen!2sin!4v1773466282545!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Tree Furn Location"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
