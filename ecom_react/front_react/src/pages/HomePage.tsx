import { useEffect, useState, useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { Icon } from '../components/ui/Icon'
import { useCart } from '../context/CartContext'
import { useProducts } from '../hooks/useProducts'
import { useToast } from '../context/ToastContext'
import { getImageUrl, productsApi, whatsappApi, type ApiFeaturedProduct, type ApiTopSeller } from '../api'

const featuredCollections = [
// ... (rest of collections)
  {
    title: 'Living Room',
    subtitle: 'Sofas, Coffee Tables, Lighting',
    href: '/category/living-room',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAAVkT360PGFttzAE2aT3usnBm_dBYbfrzT2IdQf17DT0ltaYit0dlYb7IDXPFJRsW9YYQd3DTI7K6Kf6Ug9qQgjM-atC0MU13idZFyLJKuXFJBbo-Ml8PPCXnYm-AZvs1xSDnnarbtzX8jC0zkpAkeVUPfpTiRLkEFvoNR1PJB_6RL15Q-imiGcOaZ0P7qmZucqMho1NIngkonx_xKGJ9ci4zQ6dU7vvRQm1K_OGtISpCELz0V9bYxkso_L_yLTtoZa5akKEC9Lkvf',
  },
  {
    title: 'Bedroom',
    subtitle: 'Beds, Nightstands, Textiles',
    href: '/category/bedroom',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAMLZy1doiS-FhB6JOjdlAKrKoRzfRkBr7LJD_yWrRJPlpDLZEOmUA-Dc3Cc6rseksbqs7VbslO_XCbyOUiWLJXQRuPXfNwkqOmiNynzTynk43_yexS1gnL_wbBOxOdTJqsMVQV2DfHjEt6uMFJgwkNUzulp16SfPV2yezMmlvVtUpCgOgbnmu6gB0JoqklIZnQ7m2EyqimJAbjyHkTzEzEuj0C8hjXIUbyGi28CRcKexWDFv_Vkf6phMMP5yT6tYBCqwahmGxiVy1W',
  },
  {
    title: 'Office',
    subtitle: 'Desks, Ergonomic Chairs, Storage',
    href: '/category/office',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDhslV3MriTEtC8QTFn6QSBhEKsOlcVTI96-pcaaq7z3_WAu0OSQjjvpiacvZWcq8d9FKIpOJ5Kyf3DSy6Obh9pncvosUZfX7kzzfaW6lmm1I-tYEaiLH3-fHCtsJCC_sBzMzeYJ0JuUNBoJHSXAmFX6K8GpVvdaPaDr0oZ0WkrzZXmX4zrPMhZXJuCbPK7wg6-etLq4jGW-bmWQxmP-XrjzPtkg4JkaQrRB18U0CawPnsD1jmKnpHI8-kUI05dlb3Zhx_Gl0yMFcc8',
  },
]

const PLACEHOLDER =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBiilh-Tazwkh6k9coXcjo1wpUqJCB47BjrSDa_py9foAo_80cEn5aap3Os7v0wTOMcg9267UFViieJRXaHga0Aq-P9LttYp2CZWuzjq7BY24pDh3RxB22-ZzAEvtAnBwXwEARyrRcvtLZx9LS7W2lU09pQr90rdVZoK6vpLn5p7pBn_tFa2sedOz5ONpjXCkbEy5t4IrqpCqgjUV-ELa5bQPCafGkV-nIdjfgV14_ZDmTSqRYCfgfjuzWo5NnAu9pjd-efCzWu6pCn'

export function HomePage() {
  const { addToCart } = useCart()
  const { showToast } = useToast()
  useProducts()
  
  const [featuredProducts, setFeaturedProducts] = useState<ApiFeaturedProduct[]>([])
  const [isFeaturedLoading, setIsFeaturedLoading] = useState(true)

  const [topSellers, setTopSellers] = useState<ApiTopSeller[]>([])
  const [isTopSellersLoading, setIsTopSellersLoading] = useState(true)

  // WhatsApp Subscription State
  const waRecaptchaRef = useRef<ReCAPTCHA>(null)
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [waData, setWaData] = useState({ name: '', phone: '' })

  useEffect(() => {
    fetchFeaturedProducts()
    fetchTopSellers()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      const data = await productsApi.getFeatured()
      setFeaturedProducts(data)
    } catch (err) {
      console.error('Failed to fetch featured products', err)
    } finally {
      setIsFeaturedLoading(false)
    }
  }

  const fetchTopSellers = async () => {
    try {
      const data = await productsApi.getTopSellers()
      setTopSellers(data)
    } catch (err) {
      console.error('Failed to fetch top sellers', err)
    } finally {
      setIsTopSellersLoading(false)
    }
  }

  const handleWaSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const captchaToken = waRecaptchaRef.current?.getValue()
    if (!captchaToken) {
      showToast('Please complete the reCAPTCHA verification.', 'error')
      return
    }

    setIsSubscribing(true)
    try {
      const res = await whatsappApi.subscribe({
        ...waData,
        captcha_token: captchaToken
      })
      if (res.status) {
        showToast('Successfully subscribed to WhatsApp updates!', 'success')
        setWaData({ name: '', phone: '' })
        waRecaptchaRef.current?.reset()
      } else {
        showToast(res.message || 'Subscription failed.', 'error')
      }
    } catch (err) {
      console.error('WhatsApp subscription error:', err)
      showToast('An error occurred. Please try again.', 'error')
    } finally {
      setIsSubscribing(false)
    }
  }

  // Show up to 4 active variants as trending items

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

      {/* NEW: Featured Products Section with Infinity Scroll */}
      <section className="featured-products-section" style={{ padding: '4.5rem 0', background: '#f8fafc' }}>
        <div className="container">
          <div className="section-head" style={{ marginBottom: '2.5rem' }}>
            <div>
              <h2 style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: '0.5rem' }}>Featured Products</h2>
              <p style={{ color: '#64748b' }}>Handpicked pieces from our newest arrivals, curated just for you.</p>
            </div>
          </div>

          <div className="marquee-container">
            <div className="marquee-track">
              {isFeaturedLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="featured-product-card" style={{ height: '400px' }}>
                    <div className="skeleton-card" style={{ height: '100%' }} />
                  </div>
                ))
                : [...featuredProducts, ...featuredProducts].map((fp, idx) => {
                  const imgSrc = getImageUrl(fp.image) ?? PLACEHOLDER
                  const priceValue = parseFloat(fp.price.selling_price)
                  const mrpValue = parseFloat(fp.price.mrp)
                  const hasDiscount = mrpValue > priceValue
                  const discountPct = hasDiscount ? Math.round(((mrpValue - priceValue) / mrpValue) * 100) : 0

                  return (
                    <div key={`${fp.featured_id}-${idx}`} className="featured-product-card">
                      <div className="fp-image-wrap">
                        {discountPct > 0 && (
                          <div className="shop-badge" style={{ background: '#ef4444' }}>{discountPct}% OFF</div>
                        )}
                        <img src={imgSrc} alt={fp.variant.name} />
                        
                        <div className="fp-overlay">
                          <button
                            className="fp-btn fp-btn-primary"
                            onClick={() => addToCart({
                              id: `variant-${fp.variant_id}`,
                              name: `${fp.product.name} – ${fp.variant.name}`,
                              price: priceValue,
                              image: imgSrc,
                            })}
                          >
                            <Icon name="add_shopping_cart" className="icon-sm" /> Add to Cart
                          </button>
                          <a href={`/product?vid=${fp.variant_id}`} className="fp-btn fp-btn-outline">
                            <Icon name="visibility" className="icon-sm" /> View Details
                          </a>
                        </div>
                      </div>
                      
                      <div className="product-meta" style={{ padding: '1.2rem' }}>
                        <div>
                          <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1e293b' }}>{fp.variant.name}</h4>
                          {fp.variant.model && (
                            <div className="badge-model" style={{ marginTop: '0.3rem', fontSize: '0.7rem' }}>
                              MODEL: {fp.variant.model}
                            </div>
                          )}
                          <div style={{ marginTop: '0.8rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <strong style={{ fontSize: '1.3rem', color: 'var(--primary)' }}>
                              Rs {priceValue.toLocaleString('en-IN')}
                            </strong>
                            {hasDiscount && (
                              <span style={{ fontSize: '0.9rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                                Rs {mrpValue.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
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
            <a href="/shop">
              Shop Now <Icon name="chevron_right" className="icon-sm" />
            </a>
          </div>

          <div className="featured-grid">
            {featuredCollections.map((item) => (
              <a key={item.title} className="featured-card" href={item.href}>
                <img src={item.image} alt={item.title} />
                <div className="featured-overlay">
                  <h3>{item.title}</h3>
                  <p>{item.subtitle}</p>
                  <span>Shop Collection</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="trending-section">
        <div className="container">
          <h2 style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: '2.5rem' }}>Trending Now</h2>
          
          <div className="marquee-container trending-marquee-container">
            <div className="marquee-track trending-marquee-track">
              {isTopSellersLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="product-card" style={{ height: '400px' }}>
                    <div className="skeleton-card" style={{ height: '100%' }} />
                  </div>
                ))
                : [...topSellers, ...topSellers].map((ts, idx) => {
                  const imgSrc = getImageUrl(ts.image) ?? PLACEHOLDER
                  const priceValue = parseFloat(ts.price)
                  const mrpValue = parseFloat(ts.mrp)
                  const hasDiscount = mrpValue > priceValue
                  const discountPct = hasDiscount ? Math.round(((mrpValue - priceValue) / mrpValue) * 100) : 0
                  const discountBadge = discountPct > 0 ? `${discountPct}% OFF` : null

                  return (
                    <div key={`${ts.id}-${idx}`} className="top-seller-card">
                      <div className="product-image-wrap ts-image-wrap">
                        <div className="shop-badge">Top Seller</div>
                        <img src={imgSrc} alt={ts.variant_name} />
                        
                        <div className="fp-overlay">
                          <button
                            className="fp-btn fp-btn-primary"
                            onClick={() => addToCart({
                              id: `variant-${ts.variant_id}`,
                              name: `${ts.product_name} – ${ts.variant_name}`,
                              price: priceValue,
                              image: imgSrc,
                            })}
                          >
                            <Icon name="add_shopping_cart" className="icon-sm" /> Add to Cart
                          </button>
                          <a href={`/product?vid=${ts.variant_id}`} className="fp-btn fp-btn-outline">
                            <Icon name="visibility" className="icon-sm" /> View Details
                          </a>
                        </div>
                      </div>

                      <div className="product-meta" style={{ padding: '1.2rem' }}>
                        <div>
                          <h4 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{ts.variant_name || ts.product_name}</h4>
                          {ts.model && (
                            <div className="badge-model" style={{ marginTop: '0.3rem' }}>
                              MODEL: {ts.model}
                            </div>
                          )}
                          <div className="rating-line" style={{ marginTop: '0.8rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <strong style={{ fontSize: '1.4rem', color: 'var(--primary)' }}>
                                Rs {priceValue.toLocaleString('en-IN')}
                              </strong>
                              {discountBadge && <span className="badge-discount">{discountBadge}</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
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
          <h2>Join Our WhatsApp Community</h2>
          <p>
            Get exclusive early access to new collections and home styling tips 
            directly on your phone.
          </p>
          <form className="whatsapp-form-elite" onSubmit={handleWaSubmit}>
            <div className="wa-input-row">
              <input 
                placeholder="Your Name" 
                type="text" 
                value={waData.name}
                onChange={(e) => setWaData({ ...waData, name: e.target.value })}
                required 
              />
              <input 
                placeholder="WhatsApp Number" 
                type="tel" 
                value={waData.phone}
                onChange={(e) => setWaData({ ...waData, phone: e.target.value })}
                required 
              />
            </div>
            
            <div className="wa-captcha-row">
              <ReCAPTCHA
                ref={waRecaptchaRef}
                sitekey="6LccKowsAAAAAJzuNCa-K0H3VKupzHj6VfMZna9G"
              />
            </div>

            <div className="wa-submit-row">
              <button className="btn-whatsapp-join" type="submit" disabled={isSubscribing}>
                {isSubscribing ? 'Joining...' : 'Join Now'}
              </button>
            </div>
          </form>
          <small>We value your privacy. No spam, only premium updates.</small>
        </div>
      </section>
    </>
  )
}
