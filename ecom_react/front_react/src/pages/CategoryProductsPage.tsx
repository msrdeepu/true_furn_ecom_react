import { useState, useEffect, useMemo } from 'react'
import { useCart } from '../context/CartContext'
import { productsApi, getImageUrl } from '../api'
import type { ApiCategoryResponse } from '../api'
import { Icon } from '../components/ui/Icon'

const PLACEHOLDER =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBiilh-Tazwkh6k9coXcjo1wpUqJCB47BjrSDa_py9foAo_80cEn5aap3Os7v0wTOMcg9267UFViieJRXaHga0Aq-P9LttYp2CZWuzjq7BY24pDh3RxB22-ZzAEvtAnBwXwEARyrRcvtLZx9LS7W2lU09pQr90rdVZoK6vpLn5p7pBn_tFa2sedOz5ONpjXCkbEy5t4IrqpCqgjUV-ELa5bQPCafGkV-nIdjfgV14_ZDmTSqRYCfgfjuzWo5NnAu9pjd-efCzWu6pCn'

function formatPrice(n: number | string) {
  const num = typeof n === 'string' ? parseFloat(n) : n
  return `Rs ${num.toLocaleString('en-IN')}`
}

export function CategoryProductsPage() {
  const { addToCart } = useCart()
  const [data, setData] = useState<ApiCategoryResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sort, setSort] = useState<'featured' | 'price-asc' | 'price-desc'>('featured')

  // Get slug from path: /category/slug
  const slug = window.location.pathname.split('/').pop() || ''

  useEffect(() => {
    async function load() {
      if (!slug) return
      setIsLoading(true)
      try {
        const res = await productsApi.getByCategory(slug)
        setData(res)
      } catch (err: any) {
        setError(err.message || 'Failed to load category products')
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [slug])

  const sortedVariants = useMemo(() => {
    if (!data?.variants) return []
    let list = [...data.variants]
    if (sort === 'price-asc') {
      list.sort((a, b) => (parseFloat(String(a.price)) - parseFloat(String(b.price))))
    } else if (sort === 'price-desc') {
      list.sort((a, b) => (parseFloat(String(b.price)) - parseFloat(String(a.price))))
    }
    return list
  }, [data, sort])

  if (error) {
    return (
      <section className="shop-page">
        <div className="container">
          <div className="empty-state">
            <Icon name="error_outline" className="icon-empty" style={{ color: 'var(--clr-error)' }} />
            <h3>{error}</h3>
            <p>We couldn't find the page you were looking for. Feel free to browse our main collection instead!</p>
            <a href="/shop" className="btn-explore">
              <Icon name="chevron_right" className="icon-sm" />
              Back to Shop
            </a>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="shop-page">
      <div className="container">
        <div className="shop-breadcrumbs">
          <a href="/">Home</a>
          <span>{'>'}</span>
          <a href="/shop">Shop</a>
          {data?.category && (
            <>
              <span>{'>'}</span>
              <strong>{data.category.name}</strong>
            </>
          )}
        </div>

        <div className="shop-head">
          <div>
            <h1>{data?.category?.name || 'Category'}</h1>
            <p>
              Explore our {data?.category?.name.toLowerCase()} collection.
              {!isLoading && sortedVariants.length > 0 && (
                <> &mdash; <strong>{sortedVariants.length}</strong> items found</>
              )}
            </p>
          </div>
          <div className="shop-sort">
            <label htmlFor="sort-by">Sort by</label>
            <select
              id="sort-by"
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price Low to High</option>
              <option value="price-desc">Price High to Low</option>
            </select>
          </div>
        </div>

        <div className="shop-grid">
          {isLoading ? (
             Array.from({ length: 4 }).map((_, i) => (
              <article className="shop-card" key={i}>
                <div className="shop-image-wrap">
                  <div className="skeleton-card" style={{ height: '220px', borderRadius: '12px' }} />
                </div>
                <div className="shop-card-body">
                  <div className="skeleton-line skeleton-line-sm" />
                  <div className="skeleton-line skeleton-line-lg" style={{ margin: '0.5rem 0' }} />
                </div>
              </article>
            ))
          ) : (
            sortedVariants.map((variant) => {
              const imgSrc = getImageUrl(variant.images[0]) ?? PLACEHOLDER
              const price = parseFloat(String(variant.price))
              const mrp = parseFloat(String(variant.mrp))
              const hasOffer = variant.offer_price && parseFloat(String(variant.offer_price)) < price
              const finalPrice = hasOffer ? parseFloat(String(variant.offer_price)) : price
              const discountPct = Math.round(((mrp - finalPrice) / mrp) * 100)
              
              const inv = variant.totalstock
              let stockBadge = 'In Stock'
              if (inv === 0 || variant.stock === 0) {
                 stockBadge = 'Out of Stock'
              }
              const discountBadge = discountPct > 0 ? `${discountPct}% OFF` : null
              const name = variant.vname || variant.variant_name || variant.product_name || 'Unnamed'

              return (
                <article key={variant.id} className="shop-card">
                  <div className="shop-image-wrap">
                    <div className="shop-badge">{stockBadge}</div>
                    <a href={`/product?vid=${variant.id}`}>
                      <img src={imgSrc} alt={name} />
                    </a>
                  </div>
                  <div className="shop-card-body">
                    <h4 className="shop-card-title">{name}</h4>
                    <div style={{ marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong>{formatPrice(finalPrice)}</strong>
                      {discountBadge && <span className="badge-discount">{discountBadge}</span>}
                      {hasOffer && (
                        <small style={{ marginLeft: '0.5rem', textDecoration: 'line-through', opacity: 0.5 }}>
                          {formatPrice(mrp)}
                        </small>
                      )}
                    </div>
                    <div className="shop-card-actions">
                      <button
                        className="shop-btn-add"
                        onClick={() =>
                          addToCart({
                            id: `variant-${variant.id}`,
                            name: name,
                            price: finalPrice,
                            image: imgSrc
                          })
                        }
                        type="button"
                      >
                        Add to Cart
                      </button>
                      <a className="shop-btn-view" href={`/product?vid=${variant.id}`}>
                        View Details
                      </a>
                    </div>
                  </div>
                </article>
              )
            })
          )}
          {!isLoading && sortedVariants.length === 0 && (
            <div className="empty-state">
              <Icon name="shopping_bag" className="icon-empty" />
              <h3>Collection coming soon</h3>
              <p>We're currently updating this category with our latest premium pieces. Check back shortly!</p>
              <a href="/shop" className="btn-explore">
                <Icon name="add_shopping_cart" className="icon-sm" />
                Browse All Products
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
