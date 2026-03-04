import { Icon } from '../ui/Icon'

const shopLinks = [
  'All Products',
  'Living Room',
  'Bedroom',
  'Office',
  'New Arrivals',
]

const companyLinks = ['Our Story', 'Sustainability', 'Careers', 'Journal']

const supportLinks = [
  'Shipping & Returns',
  'Track Order',
  'Help Center',
  'Contact Us',
]

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand-block">
            <div className="brand-wrap">
              <Icon name="chair" className="brand-icon" />
              <h2 className="brand-title">TRUE FURN</h2>
            </div>
            <p className="footer-text">
              Designing for a better, more beautiful tomorrow. Your home,
              reimagined.
            </p>
            <div className="footer-socials">
              <a className="social-btn" href="#">
                <Icon name="public" className="icon-sm" />
              </a>
              <a className="social-btn" href="#">
                <Icon name="share" className="icon-sm" />
              </a>
              <a className="social-btn" href="#">
                <Icon name="image" className="icon-sm" />
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h5>Shop</h5>
            <ul>
              {shopLinks.map((link) => (
                <li key={link}>
                  <a className="footer-link" href="#">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h5>Company</h5>
            <ul>
              {companyLinks.map((link) => (
                <li key={link}>
                  <a className="footer-link" href="#">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h5>Support</h5>
            <ul>
              {supportLinks.map((link) => (
                <li key={link}>
                  <a className="footer-link" href="#">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>Copyright 2026 TRUE FURN Inc. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">
              Privacy Policy
            </a>
            <a href="#">
              Terms of Service
            </a>
            <a href="#">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
