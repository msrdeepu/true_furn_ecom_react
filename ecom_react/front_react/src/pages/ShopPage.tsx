import { useState, useMemo } from 'react'
import { useCart } from '../context/CartContext'
import { useProducts } from '../hooks/useProducts'
import { getImageUrl } from '../api'
import { Icon } from '../components/ui/Icon'

const PLACEHOLDER =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBiilh-Tazwkh6k9coXcjo1wpUqJCB47BjrSDa_py9foAo_80cEn5aap3Os7v0wTOMcg9267UFViieJRXaHga0Aq-P9LttYp2CZWuzjq7BY24pDh3RxB22-ZzAEvtAnBwXwEARyrRcvtLZx9LS7W2lU09pQr90rdVZoK6vpLn5p7pBn_tFa2sedOz5ONpjXCkbEy5t4IrqpCqgjUV-ELa5bQPCafGkV-nIdjfgV14_ZDmTSqRYCfgfjuzWo5NnAu9pjd-efCzWu6pCn'

type SortKey = 'featured' | 'price-asc' | 'price-desc'

function formatPrice(n: number) {
  return `Rs ${n.toLocaleString('en-IN')}`
}

export function ShopPage() {
  const { addToCart } = useCart()
  const { variants, products, isLoading, error } = useProducts()

  // Parse search query from URL
  const searchParams = new URLSearchParams(window.location.search)
  const query = searchParams.get('q') || ''
  
  const [sort, setSort] = useState<SortKey>('featured')
  const [selectedRoomTypes, setSelectedRoomTypes] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null)

  // Build unique room types from products for filter
  const roomTypes = useMemo(() => {
    const types = products.map((p) => p.room_type).filter(Boolean) as string[]
    return [...new Set(types)].sort()
  }, [products])

  const toggleRoomType = (rt: string) => {
    setSelectedRoomTypes((prev) =>
      prev.includes(rt) ? prev.filter((x) => x !== rt) : [...prev, rt]
    )
  }

  // Map product_id → room_type for filtering
  const productRoomMap = useMemo(() => {
    const m: Record<string, string> = {}
    products.forEach((p) => { m[String(p.id)] = p.room_type ?? '' })
    return m
  }, [products])

  // Compute min/max price bounds from live data
  const { minPrice, maxPrice } = useMemo(() => {
    // Case-insensitive check for 'active'
    const active = variants.filter((v) => v.variant?.status?.toLowerCase() === 'active')
    if (active.length === 0) return { minPrice: 0, maxPrice: 1000000 }
    const prices = active.map((v) => +(v.pricing?.selling_price || v.pricing?.mrp || 0))
    return { minPrice: Math.min(...prices), maxPrice: Math.max(...prices) }
  }, [variants])

  // Initialise price range once data loads
  const effectivePriceRange: [number, number] = priceRange ?? [minPrice, maxPrice]

  const sorted = useMemo(() => {
    let list = variants.filter((v) => v.variant?.status?.toLowerCase() === 'active')

    if (selectedRoomTypes.length > 0) {
      list = list.filter((v) => selectedRoomTypes.includes(productRoomMap[String(v.product?.id)]))
    }

    // Search filter
    if (query) {
      const q = query.toLowerCase()
      list = list.filter((v) => {
        const pName = (v.product?.name || '').toLowerCase()
        const vName = (v.variant?.name || '').toLowerCase()
        const sku = (v.variant?.sku || '').toLowerCase()
        return pName.includes(q) || vName.includes(q) || sku.includes(q)
      })
    }

    // Price range filter
    const [lo, hi] = priceRange ?? [minPrice, maxPrice]
    list = list.filter((v) => {
      const p = +(v.pricing?.selling_price || v.pricing?.mrp || 0)
      return p >= lo && p <= hi
    })

    if (sort === 'price-asc') return [...list].sort((a, b) => +(a.pricing?.selling_price || a.pricing?.mrp || 0) - +(b.pricing?.selling_price || b.pricing?.mrp || 0))
    if (sort === 'price-desc') return [...list].sort((a, b) => +(b.pricing?.selling_price || b.pricing?.mrp || 0) - +(a.pricing?.selling_price || a.pricing?.mrp || 0))
    return list
  }, [variants, sort, selectedRoomTypes, productRoomMap, priceRange, minPrice, maxPrice, query])

  const getVariantImage = (images: string[]) => {
    const first = images[0]
    return getImageUrl(first) ?? PLACEHOLDER
  }

  if (error) {
    return (
      <section className="shop-page">
        <div className="container">
          <p style={{ color: 'var(--clr-error, #e53e3e)', padding: '2rem 0' }}>
            Failed to load products: {error}
          </p>
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
          <span>{'>'}</span>
          <strong>All Furniture</strong>
        </div>

        <div className="shop-head">
          <div>
            <h1>All Furniture</h1>
            <p>
              Curated collection of premium pieces designed for timeless comfort
              and modern elegance.
              {!isLoading && <> &mdash; <strong>{sorted.length}</strong> items {query && `found for "${query}"`}</>}
            </p>
          </div>
          <div className="shop-sort">
            <label htmlFor="sort-by">Sort by</label>
            <select
              id="sort-by"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price Low to High</option>
              <option value="price-desc">Price High to Low</option>
            </select>
          </div>
        </div>

        <div className="shop-layout">
          <aside className="shop-filters">
            {/* Room Type filter */}
            <div className="filter-group">
              <h3>Room Type</h3>
              {roomTypes.length === 0 && isLoading ? (
                <div className="skeleton-line skeleton-line-sm" style={{ width: '80%' }} />
              ) : (
                roomTypes.map((rt) => (
                  <label
                    className={`filter-row${selectedRoomTypes.includes(rt) ? ' active' : ''}`}
                    key={rt}
                  >
                    <input
                      checked={selectedRoomTypes.includes(rt)}
                      onChange={() => toggleRoomType(rt)}
                      type="checkbox"
                    />
                    <span>{rt}</span>
                  </label>
                ))
              )}
              {selectedRoomTypes.length > 0 && (
                <button
                  className="shop-btn-view"
                  onClick={() => setSelectedRoomTypes([])}
                  style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}
                  type="button"
                >
                  Clear filter
                </button>
              )}
            </div>

            {/* Price Range filter */}
            <div className="filter-group">
              <h3>Price Range</h3>
              {isLoading ? (
                <div className="skeleton-line skeleton-line-sm" style={{ width: '100%' }} />
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.82rem', fontWeight: 600 }}>
                    <span>{formatPrice(effectivePriceRange[0])}</span>
                    <span>{formatPrice(effectivePriceRange[1])}</span>
                  </div>
                  <input
                    className="price-range"
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    value={effectivePriceRange[0]}
                    onChange={(e) => {
                      const val = Math.min(+e.target.value, effectivePriceRange[1] - 1)
                      setPriceRange([val, effectivePriceRange[1]])
                    }}
                    style={{ marginBottom: '0.4rem' }}
                  />
                  <input
                    className="price-range"
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    value={effectivePriceRange[1]}
                    onChange={(e) => {
                      const val = Math.max(+e.target.value, effectivePriceRange[0] + 1)
                      setPriceRange([effectivePriceRange[0], val])
                    }}
                  />
                  <div className="range-labels" style={{ marginTop: '0.25rem' }}>
                    <span>{formatPrice(minPrice)}</span>
                    <span>{formatPrice(maxPrice)}</span>
                  </div>
                  {priceRange && (
                    <button
                      className="shop-btn-view"
                      onClick={() => setPriceRange(null)}
                      style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}
                      type="button"
                    >
                      Reset range
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Availability */}
            <div className="filter-group">
              <h3>Availability</h3>
              <label className="filter-row active">
                <input defaultChecked readOnly type="checkbox" />
                <span>In Stock</span>
              </label>
            </div>
          </aside>

          <div className="shop-products">
            {isLoading ? (
              <div className="shop-grid">
                {Array.from({ length: 6 }).map((_, i) => (
                  <article className="shop-card" key={i}>
                    <div className="shop-image-wrap">
                      <div className="skeleton-card" style={{ height: '220px', borderRadius: '12px' }} />
                    </div>
                    <div className="shop-card-body">
                      <div className="skeleton-line skeleton-line-sm" />
                      <div className="skeleton-line skeleton-line-lg" style={{ margin: '0.5rem 0' }} />
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="shop-grid">
                {sorted.map((variant) => {
                  const imgSrc = getVariantImage(variant.media?.images || [])
                  const price = +(variant.pricing?.selling_price || variant.pricing?.mrp || 0)
                  const mrp = +(variant.pricing?.mrp || 0)
                  const hasDiscount = mrp > price
                  const discountPct = hasDiscount ? Math.round(((mrp - price) / mrp) * 100) : 0
                  const inv = variant.inventory
                  let stockBadge = 'In Stock'
                  if (inv) {
                    if (inv.stock_detail?.toLowerCase() === 'out of stock' && inv.available_after_days) {
                      stockBadge = `Ships in ${inv.available_after_days} Days`
                    } else {
                      stockBadge = inv.stock_detail || 'In Stock'
                    }
                  }
                  const discountBadge = discountPct > 0 ? `${discountPct}% OFF` : null
                  const variantDisplayName = variant.variant?.vname || variant.variant?.name || variant.product?.name || 'Unnamed Product'

                  return (
                    <article key={variant.id} className="shop-card">
                      <div className="shop-image-wrap">
                        <div className="shop-badge">{stockBadge}</div>
                        <a href={`/product?vid=${variant.id}`}>
                          <img src={imgSrc} alt={variantDisplayName} />
                        </a>
                      </div>
                      <div className="shop-card-body">
                        <h4 className="shop-card-title">
                          {variantDisplayName}
                        </h4>
                        {variant.variant?.variant_model && (
                          <div className="badge-model">
                            MODEL: {variant.variant.variant_model}
                          </div>
                        )}
                        <div style={{ marginTop: '0.4rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <strong>{formatPrice(price)}</strong>
                            {discountBadge && <span className="badge-discount">{discountBadge}</span>}
                          </div>
                          {variant.attributes?.material && (
                            <small style={{ display: 'block', opacity: 0.6, fontSize: '0.85rem', marginTop: '2px' }}>
                              {variant.attributes.material}{variant.attributes.color ? ` · ${variant.attributes.color}` : ''}
                            </small>
                          )}
                        </div>
                        <div className="shop-card-actions">
                          <button
                            className="shop-btn-add"
                            onClick={() =>
                              addToCart({
                                id: `variant-${variant.id}`,
                                name: `${variant.product?.name || 'Product'} – ${variantDisplayName}`,
                                price,
                                image: imgSrc,
                                meta: variant.variant?.sku ? `SKU: ${variant.variant.sku}` : undefined,
                                variant_model: variant.variant?.variant_model || undefined
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
                })}
                {sorted.length === 0 && (
                  <div className="empty-state">
                    <Icon name="search" className="icon-empty" />
                    <h3>No products found</h3>
                    <p>We couldn't find any products matching your current filters. Try adjusting them to see more options.</p>
                    <button 
                      className="btn-explore"
                      onClick={() => {
                        setSelectedRoomTypes([])
                        setPriceRange(null)
                      }}
                    >
                      Reset All Filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
