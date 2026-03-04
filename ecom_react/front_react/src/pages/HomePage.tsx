import { Icon } from '../components/ui/Icon'
import { useCart } from '../context/CartContext'

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

const trendingItems = [
  {
    id: 'nordic-oak-chair',
    name: 'Nordic Oak Chair',
    rating: '4.9 (124)',
    amount: 20499,
    price: 'Rs 20,499',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAaPclcPUEE_iWnGrnJsEHI69E9rbZJMvf01BAPzrdiBsOBIBzMsQKqdzAqWuexgLX1SECDwcLJUQ4wLx-V4920sxccgW1ptNciqnaM16vIMnB0MuzhhFJ4GtYoI1mkkjWrZrblrSmYnXul2aAeCaqqiq3Hd47hlUAE2kQ3-TAp68uzbInphGLM_x0Ik1f4DV9eaQcJujF8io1TKe0TmEd5MeH-ZIpyJXJ_Dx3sLBd8IkCb_OIJJY4LKskBFoyWeyM7iGNOW1YrkltV',
  },
  {
    id: 'lunar-desk-lamp',
    name: 'Lunar Desk Lamp',
    rating: '4.8 (89)',
    amount: 6999,
    price: 'Rs 6,999',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAnyQer2ieNId7MqjKMhgsLV5gNNWHdvlVt2cl2kHAHchtCLOUO1KfsamN3sK9UaIaQhVQquIDnOP6BDdiDA7L7nnaDOc24qaobLolvPDCe08iJfr1ODLDAkMX4-ZIC5l4djApVY7JQP4OzEO01laM_hR_Wy1Q0SXft6o0muokFCOwUmddWmpxF7wTDrISTWrLtcPpQ9y7U-soTemAYUAvhQOrWl2kZxYoq8O-KwbmU5l8k1wOqdlDckS3ABwzlnffhr_ewejgNygdl',
  },
  {
    id: 'marble-accent-table',
    name: 'Marble Accent Table',
    rating: '5.0 (56)',
    amount: 32999,
    price: 'Rs 32,999',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCSIlXIXfqf9dgwPOJtnOnQo6mcu65MwE8WOiyvFiMSsuLVk-RfRQfOaXYm4D6C5Z_tMhMutX0rahdRvJqCsQkYBnIic31m7-_EEH1QUC6bohcbs_i51MaVMDx_D3jfzcsEMgZxw2CORFVK9yNCA_H8b5NMv9MqRi7oZfdIy5XtXyzgDtX9_A2sqDVPTn3rxX8Pncywxt2gUMNYxyld0y6rpuNQGd59xnilAnl6lKHAG2ms901t0eopamZk6kCT9G5YkMasUvBn-SZl',
  },
  {
    id: 'cloud-lounge-chair',
    name: 'Cloud Lounge Chair',
    rating: '4.7 (210)',
    amount: 52999,
    price: 'Rs 52,999',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAZq61gH-yTF97e44qn1IHy2GflKczdL4NLe4eOSNf7O1uUBgsetEwk0C1vgNbrxJSrZLnavYh-DSUMgaswlyj2arZdfHuZdmK4OBwesYHdHUaqnQCOQwwTH6X7k5GLDopyxKNO7PILz0ZoLvShprysXk1pnmSA6rUexFGLzLLMgj96R2dFaZun1As7PFk062SjzaEuQoUBOG03uO5mksWQnBY-a3btag9IY3y4HBJYjonQtQkfYwk76mDFW2cQ34fLqfxc3LrbIBFQ',
  },
]

export function HomePage() {
  const { addToCart } = useCart()

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
            {trendingItems.map((item) => (
              <a key={item.name} className="product-card" href="/product">
                <div className="product-image-wrap">
                  <img src={item.image} alt={item.name} />
                  <button
                    className="product-cart-btn"
                    onClick={(event) => {
                      event.preventDefault()
                      event.stopPropagation()
                      addToCart({
                        id: item.id,
                        name: item.name,
                        price: item.amount,
                        image: item.image,
                      })
                    }}
                    type="button"
                  >
                    <Icon name="add_shopping_cart" className="icon-sm" />
                  </button>
                </div>
                <div className="product-meta">
                  <div>
                    <h4>{item.name}</h4>
                    <div className="rating-line">
                      <Icon name="star" className="icon-xs" />
                      <small>{item.rating}</small>
                    </div>
                  </div>
                  <strong>{item.price}</strong>
                </div>
              </a>
            ))}
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
