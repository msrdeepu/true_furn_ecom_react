import { Icon } from '../ui/Icon'

const shopLinks = [
  { label: 'All Products', href: '/shop' },
  { label: 'Living Room', href: '/shop' },
  { label: 'Bedroom', href: '/shop' },
  { label: 'Office', href: '/shop' },
  { label: 'New Arrivals', href: '/shop' },
]

const supportLegalLinks = [
  { label: 'Terms & Conditions', href: '/terms-condition' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Disclaimer', href: '/disclaimer' },
  { label: 'Shipping Policy', href: '/shipping-policy' },
  { label: 'Refund Policy', href: '/refund-policy' },
  { label: 'Contact Us', href: '/contact' },
]

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand-block">
            <a className="brand-wrap" href="/">
              <img src="/logos/tree_furn_logo.png" alt="TREEFURN" className="brand-logo" />
            </a>
            <p className="footer-text">
              Elevating your living spaces with premium, handcrafted furniture. 
              The firm TREEFURN combines sustainable materials with timeless design 
              to create homes that inspire and endure.
            </p>
            <div className="footer-socials">
              <a className="social-btn facebook" href="#" aria-label="Facebook">
                <Icon name="facebook" className="icon-sm" />
              </a>
              <a className="social-btn instagram" href="#" aria-label="Instagram">
                <Icon name="instagram" className="icon-sm" />
              </a>
              <a className="social-btn linkedin" href="#" aria-label="LinkedIn">
                <Icon name="linkedin" className="icon-sm" />
              </a>
              <a className="social-btn x-twitter" href="#" aria-label="X (Twitter)">
                <Icon name="twitter" className="icon-sm" />
              </a>
              <a className="social-btn youtube" href="#" aria-label="YouTube">
                <Icon name="youtube" className="icon-sm" />
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h5>Shop</h5>
            <ul>
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <a className="footer-link" href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h5>Support & Legal</h5>
            <ul>
              {supportLegalLinks.map((link) => (
                <li key={link.label}>
                  <a className="footer-link" href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="footer-col">
            <h5>Locate Us</h5>
            <div className="footer-map-wrap" style={{ 
              borderRadius: '12px', 
              overflow: 'hidden', 
              border: '1px solid #e2e8f0',
              height: '140px',
              width: '100%'
            }}>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3746.3048823272857!2d79.4225155!3d13.622625999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bad63fcfc48c89f%3A0x6c17d29f9b857412!2sTree%20Furn!5e1!3m2!1sen!2sin!4v1773466282545!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps"
              ></iframe>
            </div>
            <p className="footer-link" style={{ marginTop: '0.6rem', fontSize: '0.8rem', opacity: 0.8 }}>
              Visit our store and see our premium furniture in person.
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>Copyright 2026 TREEFURN Inc. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="/privacy-policy">
              Privacy Policy
            </a>
            <a href="/terms-condition">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

