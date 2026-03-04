import { useCart } from '../context/CartContext'

const products = [
  {
    id: 'velvet-accent-chair',
    badge: 'Best Seller',
    rating: '4.8 (120)',
    name: 'Velvet Accent Chair',
    amount: 36999,
    price: 'Rs 36,999',
    meta: 'Color: Emerald Green | SKU: TF-9920',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBiilh-Tazwkh6k9coXcjo1wpUqJCB47BjrSDa_py9foAo_80cEn5aap3Os7v0wTOMcg9267UFViieJRXaHga0Aq-P9LttYp2CZWuzjq7BY24pDh3RxB22-ZzAEvtAnBwXwEARyrRcvtLZx9LS7W2lU09pQr90rdVZoK6vpLn5p7pBn_tFa2sedOz5ONpjXCkbEy5t4IrqpCqgjUV-ELa5bQPCafGkV-nIdjfgV14_ZDmTSqRYCfgfjuzWo5NnAu9pjd-efCzWu6pCn',
  },
  {
    id: 'minimalist-oak-desk',
    badge: 'Sustainable',
    rating: '4.9 (85)',
    name: 'Minimalist Oak Desk',
    amount: 69999,
    price: 'Rs 69,999',
    meta: 'Finish: Natural Oak | SKU: TF-3011',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCSIlXIXfqf9dgwPOJtnOnQo6mcu65MwE8WOiyvFiMSsuLVk-RfRQfOaXYm4D6C5Z_tMhMutX0rahdRvJqCsQkYBnIic31m7-_EEH1QUC6bohcbs_i51MaVMDx_D3jfzcsEMgZxw2CORFVK9yNCA_H8b5NMv9MqRi7oZfdIy5XtXyzgDtX9_A2sqDVPTn3rxX8Pncywxt2gUMNYxyld0y6rpuNQGd59xnilAnl6lKHAG2ms901t0eopamZk6kCT9G5YkMasUvBn-SZl',
  },
  {
    id: 'leather-loveseat',
    badge: 'New Arrival',
    rating: '4.7 (200)',
    name: 'Leather Loveseat',
    amount: 98999,
    price: 'Rs 98,999',
    meta: 'Color: Tan | SKU: TF-4182',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAAVkT360PGFttzAE2aT3usnBm_dBYbfrzT2IdQf17DT0ltaYit0dlYb7IDXPFJRsW9YYQd3DTI7K6Kf6Ug9qQgjM-atC0MU13idZFyLJKuXFJBbo-Ml8PPCXnYm-AZvs1xSDnnarbtzX8jC0zkpAkeVUPfpTiRLkEFvoNR1PJB_6RL15Q-imiGcOaZ0P7qmZucqMho1NIngkonx_xKGJ9ci4zQ6dU7vvRQm1K_OGtISpCELz0V9bYxkso_L_yLTtoZa5akKEC9Lkvf',
  },
  {
    id: 'marble-coffee-table',
    badge: 'Handmade',
    rating: '4.6 (45)',
    name: 'Marble Coffee Table',
    amount: 49999,
    price: 'Rs 49,999',
    meta: 'Size: Large | SKU: TF-1042',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCSIlXIXfqf9dgwPOJtnOnQo6mcu65MwE8WOiyvFiMSsuLVk-RfRQfOaXYm4D6C5Z_tMhMutX0rahdRvJqCsQkYBnIic31m7-_EEH1QUC6bohcbs_i51MaVMDx_D3jfzcsEMgZxw2CORFVK9yNCA_H8b5NMv9MqRi7oZfdIy5XtXyzgDtX9_A2sqDVPTn3rxX8Pncywxt2gUMNYxyld0y6rpuNQGd59xnilAnl6lKHAG2ms901t0eopamZk6kCT9G5YkMasUvBn-SZl',
  },
  {
    id: 'modern-floor-lamp',
    badge: 'Lighting',
    rating: '4.8 (150)',
    name: 'Modern Floor Lamp',
    amount: 20999,
    price: 'Rs 20,999',
    meta: 'Matte Black | SKU: TF-5520',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAnyQer2ieNId7MqjKMhgsLV5gNNWHdvlVt2cl2kHAHchtCLOUO1KfsamN3sK9UaIaQhVQquIDnOP6BDdiDA7L7nnaDOc24qaobLolvPDCe08iJfr1ODLDAkMX4-ZIC5l4djApVY7JQP4OzEO01laM_hR_Wy1Q0SXft6o0muokFCOwUmddWmpxF7wTDrISTWrLtcPpQ9y7U-soTemAYUAvhQOrWl2kZxYoq8O-KwbmU5l8k1wOqdlDckS3ABwzlnffhr_ewejgNygdl',
  },
  {
    id: 'walnut-dining-table',
    badge: 'Limited Edition',
    rating: '4.9 (30)',
    name: 'Walnut Dining Table',
    amount: 89999,
    price: 'Rs 89,999',
    meta: '6 Seater | SKU: TF-6210',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDhslV3MriTEtC8QTFn6QSBhEKsOlcVTI96-pcaaq7z3_WAu0OSQjjvpiacvZWcq8d9FKIpOJ5Kyf3DSy6Obh9pncvosUZfX7kzzfaW6lmm1I-tYEaiLH3-fHCtsJCC_sBzMzeYJ0JuUNBoJHSXAmFX6K8GpVvdaPaDr0oZ0WkrzZXmX4zrPMhZXJuCbPK7wg6-etLq4jGW-bmWQxmP-XrjzPtkg4JkaQrRB18U0CawPnsD1jmKnpHI8-kUI05dlb3Zhx_Gl0yMFcc8',
  },
]

export function ShopPage() {
  const { addToCart } = useCart()

  return (
    <section className="shop-page">
      <div className="container">
        <div className="shop-breadcrumbs">
          <a href="/">Home</a>
          <span>{'>'}</span>
          <a href="/shop">Shop</a>
          <span>{'>'}</span>
          <strong>All Furniture</strong>
        </div>

        <div className="shop-head">
          <div>
            <h1>All Furniture</h1>
            <p>
              Curated collection of premium pieces designed for timeless comfort
              and modern elegance.
            </p>
          </div>
          <div className="shop-sort">
            <label htmlFor="sort-by">Sort by</label>
            <select id="sort-by" defaultValue="Featured">
              <option>Featured</option>
              <option>Price Low to High</option>
              <option>Price High to Low</option>
              <option>Best Rating</option>
            </select>
          </div>
        </div>

        <div className="shop-layout">
          <aside className="shop-filters">
            <div className="filter-group">
              <h3>Category</h3>
              <label className="filter-row">
                <input type="checkbox" />
                <span>Sofas</span>
                <small>24</small>
              </label>
              <label className="filter-row active">
                <input defaultChecked type="checkbox" />
                <span>Chairs</span>
                <small>18</small>
              </label>
              <label className="filter-row">
                <input type="checkbox" />
                <span>Tables</span>
                <small>12</small>
              </label>
              <label className="filter-row">
                <input type="checkbox" />
                <span>Lighting</span>
                <small>31</small>
              </label>
              <label className="filter-row">
                <input type="checkbox" />
                <span>Bedroom</span>
                <small>15</small>
              </label>
            </div>

            <div className="filter-group">
              <h3>Price Range</h3>
              <input
                className="price-range"
                type="range"
                min={0}
                max={100000}
                defaultValue={45000}
              />
              <div className="range-labels">
                <span>Rs 0</span>
                <span>Rs 1,00,000+</span>
              </div>
            </div>

            <div className="filter-group">
              <h3>Material</h3>
              <label className="filter-row">
                <input type="checkbox" />
                <span>Wood</span>
              </label>
              <label className="filter-row">
                <input type="checkbox" />
                <span>Metal</span>
              </label>
              <label className="filter-row">
                <input type="checkbox" />
                <span>Fabric</span>
              </label>
              <label className="filter-row active">
                <input defaultChecked type="checkbox" />
                <span>Velvet</span>
              </label>
            </div>

            <div className="filter-group">
              <h3>Color</h3>
              <div className="color-pills">
                <button className="color-pill color-blue active" type="button"></button>
                <button className="color-pill color-white" type="button"></button>
                <button className="color-pill color-brown" type="button"></button>
                <button className="color-pill color-green" type="button"></button>
                <button className="color-pill color-light-blue" type="button"></button>
              </div>
            </div>

            <div className="filter-group">
              <h3>Availability</h3>
              <label className="filter-row active">
                <input defaultChecked type="checkbox" />
                <span>In stock</span>
              </label>
              <label className="filter-row">
                <input type="checkbox" />
                <span>New arrivals</span>
              </label>
            </div>
          </aside>

          <div className="shop-products">
            <div className="shop-grid">
              {products.map((item) => (
                <article key={item.name} className="shop-card">
                  <div className="shop-image-wrap">
                    <a href="/product">
                      <img src={item.image} alt={item.name} />
                    </a>
                  </div>
                  <div className="shop-card-body">
                    <div className="shop-card-top">
                      <small>{item.badge}</small>
                      <span>{`* ${item.rating}`}</span>
                    </div>
                    <h4>{item.name}</h4>
                    <strong>{item.price}</strong>
                    <div className="shop-card-actions">
                      <button
                        className="shop-btn-add"
                        onClick={() =>
                          addToCart({
                            id: item.id,
                            name: item.name,
                            price: item.amount,
                            image: item.image,
                            meta: item.meta,
                          })
                        }
                        type="button"
                      >
                        Add to Cart
                      </button>
                      <a className="shop-btn-view" href="/product">
                        View Details
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="shop-pagination">
              <button type="button">{'<'}</button>
              <button className="active" type="button">
                1
              </button>
              <button type="button">2</button>
              <button type="button">3</button>
              <span>...</span>
              <button type="button">12</button>
              <button type="button">{'>'}</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
