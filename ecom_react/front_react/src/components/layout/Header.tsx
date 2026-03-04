import { Icon } from '../ui/Icon'
import { useCart } from '../../context/CartContext'

export function Header() {
  const { totalItems } = useCart()

  return (
    <header className="site-header">
      <div className="container nav-row">
        <div className="nav-left">
          <div className="brand-wrap">
            <Icon name="chair" className="brand-icon" />
            <h2 className="brand-title">TRUE FURN</h2>
          </div>
          <nav className="main-nav">
            <a className="nav-link" href="/shop">
              Shop
            </a>
            <a className="nav-link" href="#">
              Collections
            </a>
            <a className="nav-link" href="/shop">
              Living Room
            </a>
            <a className="nav-link" href="/shop">
              Bedroom
            </a>
            <a className="nav-link" href="/shop">
              Office
            </a>
          </nav>
        </div>
        <div className="nav-right">
          <div className="search-box">
            <Icon name="search" className="icon-muted icon-sm" />
            <input
              className="search-input"
              placeholder="Search furniture..."
              type="text"
            />
          </div>
          <a className="icon-btn cart-icon-btn" href="/cart">
            <Icon name="shopping_cart" className="icon-md" />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </a>
          <button className="icon-btn">
            <Icon name="person" className="icon-md" />
          </button>
        </div>
      </div>
    </header>
  )
}
