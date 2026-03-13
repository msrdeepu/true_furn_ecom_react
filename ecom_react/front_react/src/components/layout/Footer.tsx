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
  { label: 'Contact Us', href: '#' },
]

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand-block">
            <div className="brand-wrap">
              <Icon name="chair" className="brand-icon" />
              <h2 className="brand-title">TREEFURN</h2>
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
            <a href="#">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

