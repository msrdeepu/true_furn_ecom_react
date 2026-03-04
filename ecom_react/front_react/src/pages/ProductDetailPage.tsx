import { useRef, useState } from 'react'
import { Icon } from '../components/ui/Icon'
import { useCart } from '../context/CartContext'

const relatedProducts = [
  {
    name: 'Oak Side Table',
    sub: 'Nordic Collection',
    price: 'Rs 14,999',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCSIlXIXfqf9dgwPOJtnOnQo6mcu65MwE8WOiyvFiMSsuLVk-RfRQfOaXYm4D6C5Z_tMhMutX0rahdRvJqCsQkYBnIic31m7-_EEH1QUC6bohcbs_i51MaVMDx_D3jfzcsEMgZxw2CORFVK9yNCA_H8b5NMv9MqRi7oZfdIy5XtXyzgDtX9_A2sqDVPTn3rxX8Pncywxt2gUMNYxyld0y6rpuNQGd59xnilAnl6lKHAG2ms901t0eopamZk6kCT9G5YkMasUvBn-SZl',
  },
  {
    name: 'Arc Floor Lamp',
    sub: 'Modern Lighting',
    price: 'Rs 17,499',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAnyQer2ieNId7MqjKMhgsLV5gNNWHdvlVt2cl2kHAHchtCLOUO1KfsamN3sK9UaIaQhVQquIDnOP6BDdiDA7L7nnaDOc24qaobLolvPDCe08iJfr1ODLDAkMX4-ZIC5l4djApVY7JQP4OzEO01laM_hR_Wy1Q0SXft6o0muokFCOwUmddWmpxF7wTDrISTWrLtcPpQ9y7U-soTemAYUAvhQOrWl2kZxYoq8O-KwbmU5l8k1wOqdlDckS3ABwzlnffhr_ewejgNygdl',
  },
  {
    name: 'Velvet 3-Seater',
    sub: 'Luxe Series',
    price: 'Rs 98,999',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAAVkT360PGFttzAE2aT3usnBm_dBYbfrzT2IdQf17DT0ltaYit0dlYb7IDXPFJRsW9YYQd3DTI7K6Kf6Ug9qQgjM-atC0MU13idZFyLJKuXFJBbo-Ml8PPCXnYm-AZvs1xSDnnarbtzX8jC0zkpAkeVUPfpTiRLkEFvoNR1PJB_6RL15Q-imiGcOaZ0P7qmZucqMho1NIngkonx_xKGJ9ci4zQ6dU7vvRQm1K_OGtISpCELz0V9bYxkso_L_yLTtoZa5akKEC9Lkvf',
  },
  {
    name: 'Boho Wool Rug',
    sub: 'Textiles',
    price: 'Rs 27,999',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDIlbUGkhkYbXlDKF0jCrl3q2GR8urTLq-8kf-_sc_5JeuvYq3Ev44GTENpE71j8tfiQp2R7MSkUHeHUyCtssDL3KpLeImlyaDu71fNm48qZ0e2jgpbLMXCl0orPp4VENRRXtdx_8hr5JKCtUAhe8R_ehmCAaHeCc6qJsPUxi7HJDjEQ-SaJvLSBX4YNJgQMdOqf70NMae_BFVjJP-FOy02gtDMvxWuiS389IrrGZrG7YKbBzh6oWazRCXhdxt_dnyd0GeH9INk16DX',
  },
]

const thumbs = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBiilh-Tazwkh6k9coXcjo1wpUqJCB47BjrSDa_py9foAo_80cEn5aap3Os7v0wTOMcg9267UFViieJRXaHga0Aq-P9LttYp2CZWuzjq7BY24pDh3RxB22-ZzAEvtAnBwXwEARyrRcvtLZx9LS7W2lU09pQr90rdVZoK6vpLn5p7pBn_tFa2sedOz5ONpjXCkbEy5t4IrqpCqgjUV-ELa5bQPCafGkV-nIdjfgV14_ZDmTSqRYCfgfjuzWo5NnAu9pjd-efCzWu6pCn',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAAVkT360PGFttzAE2aT3usnBm_dBYbfrzT2IdQf17DT0ltaYit0dlYb7IDXPFJRsW9YYQd3DTI7K6Kf6Ug9qQgjM-atC0MU13idZFyLJKuXFJBbo-Ml8PPCXnYm-AZvs1xSDnnarbtzX8jC0zkpAkeVUPfpTiRLkEFvoNR1PJB_6RL15Q-imiGcOaZ0P7qmZucqMho1NIngkonx_xKGJ9ci4zQ6dU7vvRQm1K_OGtISpCELz0V9bYxkso_L_yLTtoZa5akKEC9Lkvf',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAaPclcPUEE_iWnGrnJsEHI69E9rbZJMvf01BAPzrdiBsOBIBzMsQKqdzAqWuexgLX1SECDwcLJUQ4wLx-V4920sxccgW1ptNciqnaM16vIMnB0MuzhhFJ4GtYoI1mkkjWrZrblrSmYnXul2aAeCaqqiq3Hd47hlUAE2kQ3-TAp68uzbInphGLM_x0Ik1f4DV9eaQcJujF8io1TKe0TmEd5MeH-ZIpyJXJ_Dx3sLBd8IkCb_OIJJY4LKskBFoyWeyM7iGNOW1YrkltV',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAMLZy1doiS-FhB6JOjdlAKrKoRzfRkBr7LJD_yWrRJPlpDLZEOmUA-Dc3Cc6rseksbqs7VbslO_XCbyOUiWLJXQRuPXfNwkqOmiNynzTynk43_yexS1gnL_wbBOxOdTJqsMVQV2DfHjEt6uMFJgwkNUzulp16SfPV2yezMmlvVtUpCgOgbnmu6gB0JoqklIZnQ7m2EyqimJAbjyHkTzEzEuj0C8hjXIUbyGi28CRcKexWDFv_Vkf6phMMP5yT6tYBCqwahmGxiVy1W',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDhslV3MriTEtC8QTFn6QSBhEKsOlcVTI96-pcaaq7z3_WAu0OSQjjvpiacvZWcq8d9FKIpOJ5Kyf3DSy6Obh9pncvosUZfX7kzzfaW6lmm1I-tYEaiLH3-fHCtsJCC_sBzMzeYJ0JuUNBoJHSXAmFX6K8GpVvdaPaDr0oZ0WkrzZXmX4zrPMhZXJuCbPK7wg6-etLq4jGW-bmWQxmP-XrjzPtkg4JkaQrRB18U0CawPnsD1jmKnpHI8-kUI05dlb3Zhx_Gl0yMFcc8',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDcMTn0bRrWmRa2sCUFLtiWRqm-YHTJYlKakrAgfmhDdIhbqGzKFDaJnvVyn0FVDi5BAEFRzZASI3icY5snmlTnMRiMO4ZqzPPZk6U17zUrfqypyQzfztEv8EH1csgr2ccQ0XfKbEGmel7Bd9lW7x2PTzc4LC1A9KxHuiQoQwUNrHK-WuGfAMhz3xBeO9VnoFUNHEZgR2YNMNOdcfLjrqZvpBc5Wl49t38lwXI8UfDoGOrq0JoqAgXf3gVKt-gwLYBVQB4JmFfsY3pl',
]

export function ProductDetailPage() {
  const { addToCart } = useCart()
  const thumbsRef = useRef<HTMLDivElement>(null)
  const [zoomStyle, setZoomStyle] = useState({ x: '50%', y: '50%' })

  const scrollThumbs = (direction: 'left' | 'right') => {
    const el = thumbsRef.current
    if (!el) return
    const offset = direction === 'left' ? -320 : 320
    el.scrollBy({ left: offset, behavior: 'smooth' })
  }

  const onImageMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    setZoomStyle({ x: `${x}%`, y: `${y}%` })
  }

  return (
    <section className="product-page">
      <div className="container">
        <div className="product-top">
          <div className="product-gallery">
            <div
              className="product-main-image"
              onMouseMove={onImageMove}
              style={
                {
                  '--zoom-x': zoomStyle.x,
                  '--zoom-y': zoomStyle.y,
                } as React.CSSProperties
              }
            >
              <img src={thumbs[0]} alt="Velvet Accent Chair" />
            </div>
            <div className="product-thumbs-wrap">
              <button
                aria-label="Scroll left"
                className="thumb-scroll-btn"
                onClick={() => scrollThumbs('left')}
                type="button"
              >
                {'<'}
              </button>
              <div className="product-thumbs" ref={thumbsRef}>
                {thumbs.map((thumb, index) => (
                  <button
                    className={`product-thumb ${index === 0 ? 'active' : ''}`}
                    key={`${thumb}-${index}`}
                    type="button"
                  >
                    <img src={thumb} alt="Product view" />
                  </button>
                ))}
              </div>
              <button
                aria-label="Scroll right"
                className="thumb-scroll-btn"
                onClick={() => scrollThumbs('right')}
                type="button"
              >
                {'>'}
              </button>
            </div>
          </div>

          <div className="product-info">
            <div className="product-bread">
              <a href="/">Living Room</a>
              <span>/</span>
              <a href="/shop">Chairs</a>
              <span>/</span>
              <strong>Accent Chairs</strong>
            </div>
            <h1>Velvet Accent Chair</h1>
            <div className="product-rating-line">
              <div className="stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icon key={i} name="star" className="icon-xs" />
                ))}
              </div>
              <span>4.8</span>
              <small>|</small>
              <small>120 verified reviews</small>
            </div>
            <div className="product-price">Rs 36,999</div>

            <div className="product-option-title">Choose Color</div>
            <div className="product-color-row">
              <button className="color-pill color-green active" type="button"></button>
              <button className="color-pill color-blue" type="button"></button>
              <button className="color-pill color-brown" type="button"></button>
            </div>

            <div className="product-option-title">Product Description</div>
            <p className="product-desc">
              Experience unparalleled comfort with our signature Velvet Accent
              Chair. Meticulously upholstered in premium, high-density velvet
              that feels as luxurious as it looks.
            </p>

            <div className="product-option-title">Key Features</div>
            <ul className="product-features">
              <li>Solid wood reinforced legs</li>
              <li>Premium stain-resistant velvet</li>
              <li>Ergonomic lumbar support</li>
              <li>High-resilience foam cushion</li>
            </ul>

            <div className="product-cta-row">
              <button
                className="btn-primary"
                onClick={() =>
                  addToCart({
                    id: 'velvet-accent-chair',
                    name: 'Velvet Accent Chair',
                    price: 36999,
                    image: thumbs[0],
                    meta: 'Color: Emerald Green | SKU: TF-9920',
                  })
                }
                type="button"
              >
                Add to Cart
              </button>
              <a
                className="btn-dark buy-now-link"
                href="/cart"
                onClick={() =>
                  addToCart({
                    id: 'velvet-accent-chair',
                    name: 'Velvet Accent Chair',
                    price: 36999,
                    image: thumbs[0],
                    meta: 'Color: Emerald Green | SKU: TF-9920',
                  })
                }
              >
                Buy Now
              </a>
            </div>

            <div className="product-policy-row">
              <span>Free Shipping</span>
              <span>2 Year Warranty</span>
              <span>30 Day Returns</span>
            </div>
          </div>
        </div>

        <div className="review-strip">
          <div className="review-score">
            <h2>4.8</h2>
            <div className="stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <Icon key={i} name="star" className="icon-xs" />
              ))}
            </div>
            <p>Based on 120 reviews</p>
          </div>
          <div className="review-bars">
            {[80, 10, 5, 3, 2].map((pct, idx) => (
              <div className="review-bar-row" key={idx}>
                <span>{5 - idx}</span>
                <div className="review-track">
                  <div className="review-fill" style={{ width: `${pct}%` }} />
                </div>
                <small>{pct}%</small>
              </div>
            ))}
          </div>
        </div>

        <div className="related-section">
          <div className="related-head">
            <h3>You May Also Like</h3>
            <a href="/shop">View All</a>
          </div>
          <div className="related-grid">
            {relatedProducts.map((item) => (
              <a className="related-card" href="/product" key={item.name}>
                <div className="related-img">
                  <img src={item.image} alt={item.name} />
                </div>
                <h4>{item.name}</h4>
                <small>{item.sub}</small>
                <strong>{item.price}</strong>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
