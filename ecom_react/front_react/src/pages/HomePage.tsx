import { Icon } from '../components/ui/Icon'
import { useCart } from '../context/CartContext'
import { useProducts } from '../hooks/useProducts'
import { getImageUrl } from '../api'

const featuredItems = [
  {
    title: 'Living Room',
    subtitle: 'Sofas, Coffee Tables, Lighting',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAAVkT360PGFttzAE2aT3usnBm_dBYbfrzT2IdQf17DT0ltaYit0dlYb7IDXPFJRsW9YYQd3DTI7K6Kf6Ug9qQgjM-atC0MU13idZFyLJKuXFJBbo-Ml8PPCXnYm-AZvs1xSDnnarbtzX8jC0zkpAkeVUPfpTiRLkEFvoNR1PJB_6RL15Q-imiGcOaZ0P7qmZucqMho1NIngkonx_xKGJ9ci4zQ6dU7vvRQm1K_OGtISpCELz0V9bYxkso_L_yLTtoZa5akKEC9Lkvf',
  },
  {
    title: 'Bedroom',
    subtitle: 'Beds, Nightstands, Textiles',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAMLZy1doiS-FhB6JOjdlAKrKoRzfRkBr7LJD_yWrRJPlpDLZEOmUA-Dc3Cc6rseksbqs7VbslO_XCbyOUiWLJXQRuPXfNwkqOmiNynzTynk43_yexS1gnL_wbBOxOdTJqsMVQV2DfHjEt6uMFJgwkNUzulp16SfPV2yezMmlvVtUpCgOgbnmu6gB0JoqklIZnQ7m2EyqimJAbjyHkTzEzEuj0C8hjXIUbyGi28CRcKexWDFv_Vkf6phMMP5yT6tYBCqwahmGxiVy1W',
  },
  {
    title: 'Office',
    subtitle: 'Desks, Ergonomic Chairs, Storage',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDhslV3MriTEtC8QTFn6QSBhEKsOlcVTI96-pcaaq7z3_WAu0OSQjjvpiacvZWcq8d9FKIpOJ5Kyf3DSy6Obh9pncvosUZfX7kzzfaW6lmm1I-tYEaiLH3-fHCtsJCC_sBzMzeYJ0JuUNBoJHSXAmFX6K8GpVvdaPaDr0oZ0WkrzZXmX4zrPMhZXJuCbPK7wg6-etLq4jGW-bmWQxmP-XrjzPtkg4JkaQrRB18U0CawPnsD1jmKnpHI8-kUI05dlb3Zhx_Gl0yMFcc8',
  },
]

const PLACEHOLDER =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBiilh-Tazwkh6k9coXcjo1wpUqJCB47BjrSDa_py9foAo_80cEn5aap3Os7v0wTOMcg9267UFViieJRXaHga0Aq-P9LttYp2CZWuzjq7BY24pDh3RxB22-ZzAEvtAnBwXwEARyrRcvtLZx9LS7W2lU09pQr90rdVZoK6vpLn5p7pBn_tFa2sedOz5ONpjXCkbEy5t4IrqpCqgjUV-ELa5bQPCafGkV-nIdjfgV14_ZDmTSqRYCfgfjuzWo5NnAu9pjd-efCzWu6pCn'

export function HomePage() {
  const { addToCart } = useCart()
  const { variants, isLoading } = useProducts()

  // Show up to 4 active variants as trending items
  const trendingItems = variants.filter((v) => v.variant.status === 'Active').slice(0, 4)

  return (
    <>
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-content">
            <div className="pill">New Collection 2026</div>
            <h1>
              Elevate Your Space with <span>Timeless</span> Design
            </h1>
            <p>
              Discover our curated collection of contemporary furniture, crafted
              for modern living and lasting comfort. Sustainable materials meet
              masterful craftsmanship.
            </p>
            <div className="hero-actions">
              <a className="btn-primary" href="/shop">
                Shop Now
              </a>
              <button className="btn-ghost">
                View Lookbook <Icon name="arrow_forward" className="icon-sm" />
              </button>
            </div>
          </div>
          <div className="hero-image-wrap">
            <img
              className="hero-image"
              alt="Modern minimal emerald green sofa in a bright living room"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiilh-Tazwkh6k9coXcjo1wpUqJCB47BjrSDa_py9foAo_80cEn5aap3Os7v0wTOMcg9267UFViieJRXaHga0Aq-P9LttYp2CZWuzjq7BY24pDh3RxB22-ZzAEvtAnBwXwEARyrRcvtLZx9LS7W2lU09pQr90rdVZoK6vpLn5p7pBn_tFa2sedOz5ONpjXCkbEy5t4IrqpCqgjUV-ELa5bQPCafGkV-nIdjfgV14_ZDmTSqRYCfgfjuzWo5NnAu9pjd-efCzWu6pCn"
            />
            <div className="hero-badge">
              <div className="avatar-stack">
                <div className="avatar a1"></div>
                <div className="avatar a2"></div>
                <div className="avatar a3"></div>
              </div>
              <div>
                <p>2.5k+ Happy Customers</p>
                <small>Join our growing community</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="featured-section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Featured Collections</h2>
              <p>
                Explore our signature series designed to harmonize with every
                corner of your home.
              </p>
            </div>
            <a href="#">
              Browse all collections <Icon name="chevron_right" className="icon-sm" />
            </a>
          </div>

          <div className="featured-grid">
            {featuredItems.map((item) => (
              <div key={item.title} className="featured-card">
                <img src={item.image} alt={item.title} />
                <div className="featured-overlay">
                  <h3>{item.title}</h3>
                  <p>{item.subtitle}</p>
                  <span>Shop Collection</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="trending-section">
        <div className="container">
          <h2>Trending Now</h2>
          <div className="trending-row">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="product-card">
                  <div className="skeleton-card" style={{ height: '240px', borderRadius: '12px' }} />
                  <div className="product-meta" style={{ padding: '0.75rem 0' }}>
                    <div className="skeleton-line skeleton-line-lg" />
                  </div>
                </div>
              ))
              : trendingItems.map((variant) => {
                const imgSrc = getImageUrl(variant.media.images[0]) ?? PLACEHOLDER
                const price = +(variant.pricing.selling_price ?? 0)
                return (
                  <a key={variant.id} className="product-card" href={`/product?vid=${variant.id}`}>
                    <div className="product-image-wrap">
                      <img src={imgSrc} alt={variant.variant.name ?? ''} />
                      <button
                        className="product-cart-btn"
                        onClick={(event) => {
                          event.preventDefault()
                          event.stopPropagation()
                          addToCart({
                            id: `variant-${variant.id}`,
                            name: `${variant.product.name} – ${variant.variant.name}`,
                            price,
                            image: imgSrc,
                          })
                        }}
                        type="button"
                      >
                        <Icon name="add_shopping_cart" className="icon-sm" />
                      </button>
                    </div>
                    <div className="product-meta">
                      <div>
                        <h4>{variant.variant.name}</h4>
                        <div className="rating-line">
                          <small>{variant.product.name}</small>
                        </div>
                      </div>
                      <strong>Rs {price.toLocaleString('en-IN')}</strong>
                    </div>
                  </a>
                )
              })}
          </div>
        </div>
      </section>

      <section className="story-section">
        <div className="container story-grid">
          <div className="story-images">
            <img
              className="story-img-up"
              alt="Close up of carpenter hands working with wood"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcMTn0bRrWmRa2sCUFLtiWRqm-YHTJYlKakrAgfmhDdIhbqGzKFDaJnvVyn0FVDi5BAEFRzZASI3icY5snmlTnMRiMO4ZqzPPZk6U17zUrfqypyQzfztEv8EH1csgr2ccQ0XfKbEGmel7Bd9lW7x2PTzc4LC1A9KxHuiQoQwUNrHK-WuGfAMhz3xBeO9VnoFUNHEZgR2YNMNOdcfLjrqZvpBc5Wl49t38lwXI8UfDoGOrq0JoqAgXf3gVKt-gwLYBVQB4JmFfsY3pl"
            />
            <img
              alt="Raw sustainable oak wood planks"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIlbUGkhkYbXlDKF0jCrl3q2GR8urTLq-8kf-_sc_5JeuvYq3Ev44GTENpE71j8tfiQp2R7MSkUHeHUyCtssDL3KpLeImlyaDu71fNm48qZ0e2jgpbLMXCl0orPp4VENRRXtdx_8hr5JKCtUAhe8R_ehmCAaHeCc6qJsPUxi7HJDjEQ-SaJvLSBX4YNJgQMdOqf70NMae_BFVjJP-FOy02gtDMvxWuiS389IrrGZrG7YKbBzh6oWazRCXhdxt_dnyd0GeH9INk16DX"
            />
          </div>
          <div className="story-content">
            <h2>Crafted with Conscious Purpose</h2>
            <p>
              Since 2012, TRUE FURN has been dedicated to bridging the gap
              between high-end design and environmental responsibility. Every
              piece is handmade using FSC-certified hardwoods and low-impact
              finishes.
            </p>
            <div className="story-points">
              <div>
                <Icon name="eco" className="icon-lg" />
                <h4>100% Sustainable</h4>
                <small>Responsibly sourced materials only.</small>
              </div>
              <div>
                <Icon name="handyman" className="icon-lg" />
                <h4>Lifetime Warranty</h4>
                <small>Built to last for generations.</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="newsletter-section">
        <div className="container newsletter-box">
          <h2>Join Our Community</h2>
          <p>
            Subscribe for exclusive early access to new collections and home
            styling tips from our designers.
          </p>
          <form>
            <input placeholder="Enter your email" type="email" />
            <button className="btn-primary" type="submit">
              Subscribe
            </button>
          </form>
          <small>By subscribing, you agree to our Privacy Policy.</small>
        </div>
      </section>
    </>
  )
}
