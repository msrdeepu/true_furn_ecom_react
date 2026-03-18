import { useRef, useState, useMemo, useEffect } from 'react'
import { Icon } from '../components/ui/Icon'
import { useCart } from '../context/CartContext'
import { useProducts } from '../hooks/useProducts'
import { getImageUrl } from '../api'
import { DefaultDeliveryInfo } from '../components/product/DefaultDeliveryInfo'
import { DefaultWarrantyInfo } from '../components/product/DefaultWarrantyInfo'

const PLACEHOLDER =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBiilh-Tazwkh6k9coXcjo1wpUqJCB47BjrSDa_py9foAo_80cEn5aap3Os7v0wTOMcg9267UFViieJRXaHga0Aq-P9LttYp2CZWuzjq7BY24pDh3RxB22-ZzAEvtAnBwXwEARyrRcvtLZx9LS7W2lU09pQr90rdVZoK6vpLn5p7pBn_tFa2sedOz5ONpjXCkbEy5t4IrqpCqgjUV-ELa5bQPCafGkV-nIdjfgV14_ZDmTSqRYCfgfjuzWo5NnAu9pjd-efCzWu6pCn'

function formatPrice(n: number) {
  return `Rs ${n.toLocaleString('en-IN')}`
}

export function ProductDetailPage() {
  const { addToCart } = useCart()
  const { variants, products, isLoading } = useProducts()
  const thumbsRef = useRef<HTMLDivElement>(null)
  const [activeThumb, setActiveThumb] = useState(0)
  const [activeTab, setActiveTab] = useState<string>('')
  const [zoomStyle, setZoomStyle] = useState({ x: '50%', y: '50%' })

  // Read variant id from URL ?vid=
  const vidParam = new URLSearchParams(window.location.search).get('vid')
  const variantId = vidParam ? parseInt(vidParam, 10) : null

  const variant = useMemo(
    () => (variantId != null ? variants.find((v) => v.id === variantId) : variants[0]),
    [variants, variantId]
  )

  // Auto-set the first available tab when variant changes
  useEffect(() => {
    if (variant?.content) {
      const tabs = [
        { id: 'description', val: variant.content.description_html },
        { id: 'specification', val: variant.content.specification_html },
        { id: 'brand', val: variant.content.brand_collection_overview_html },
        { id: 'seller', val: variant.content.seller_notes_html },
        { id: 'warranty', val: variant.content.warranty_html },
      ]
      const first = tabs.find((t) => !!t.val)
      if (first) setActiveTab(first.id)
    }
  }, [variant])

  const product = useMemo(
    () => (variant?.product ? products.find((p) => p.id === variant.product?.id) : null),
    [products, variant]
  )

  // Reset active image when variant changes
  useEffect(() => {
    setActiveThumb(0)
  }, [variant?.id])



  // Related: variants from other products (up to 4)
  const related = useMemo(
    () =>
      variant?.product?.id
        ? variants.filter((v) => v.product?.id !== variant.product.id).slice(0, 4)
        : variants.slice(0, 4),
    [variants, variant]
  )

  const thumbs = useMemo(() => {
    if (!variant) return [PLACEHOLDER]
    const imgs = (variant.media?.images || []).map((img) => getImageUrl(img) ?? PLACEHOLDER)
    return imgs.length > 0 ? imgs : [PLACEHOLDER]
  }, [variant])

  const scrollThumbs = (direction: 'left' | 'right') => {
    const el = thumbsRef.current
    if (!el) return
    el.scrollBy({ left: direction === 'left' ? -320 : 320, behavior: 'smooth' })
  }

  const onImageMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    setZoomStyle({ x: `${x}%`, y: `${y}%` })
  }

  if (isLoading) {
    return (
      <section className="product-page">
        <div className="container">
          <div className="product-top">
            <div className="skeleton-card" style={{ height: '420px', flex: 1, borderRadius: '16px' }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="skeleton-line skeleton-line-sm" style={{ width: '40%' }} />
              <div className="skeleton-line skeleton-line-lg" style={{ width: '80%' }} />
              <div className="skeleton-line skeleton-line-sm" style={{ width: '30%' }} />
              <div className="skeleton-line skeleton-line-lg" />
              <div className="skeleton-line skeleton-line-lg" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (!variant) {
    return (
      <section className="product-page">
        <div className="container" style={{ padding: '4rem 0', textAlign: 'center', opacity: 0.5 }}>
          <Icon name="image" className="icon-lg" />
          <p style={{ marginTop: '1rem' }}>Product not found.</p>
          <a className="btn-primary" href="/shop" style={{ display: 'inline-block', marginTop: '1.5rem' }}>
            Back to Shop
          </a>
        </div>
      </section>
    )
  }

  const price = +(variant.pricing?.selling_price || variant.pricing?.mrp || 0)
  const mrp = +(variant.pricing?.mrp || 0)
  const hasDiscount = mrp > price
  const discountPct = hasDiscount ? Math.round(((mrp - price) / mrp) * 100) : 0
  const variantDisplayName = variant.variant?.vname || variant.variant?.name || variant.product?.name || 'Unnamed Product'

  return (
    <section className="product-page">
      <div className="container">
        <div className="product-top">
          {/* Gallery */}
          <div className="product-gallery">
            <div
              className="product-main-image"
              onMouseMove={onImageMove}
              style={{ '--zoom-x': zoomStyle.x, '--zoom-y': zoomStyle.y } as React.CSSProperties}
            >
              <img src={thumbs[activeThumb]} alt={variantDisplayName} />
            </div>
            {thumbs.length > 1 && (
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
                      className={`product-thumb ${index === activeThumb ? 'active' : ''}`}
                      key={`${thumb}-${index}`}
                      onClick={() => setActiveThumb(index)}
                      type="button"
                    >
                      <img src={thumb} alt={`View ${index + 1}`} />
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
            )}
          </div>

          {/* Info */}
          <div className="product-info">
            {(() => {
              const inv = variant.inventory
              let stockBadge = 'In Stock'
              if (inv) {
                if (inv.stock_detail?.toLowerCase() === 'out of stock' && inv.available_after_days) {
                  stockBadge = `Ships in ${inv.available_after_days} Days`
                } else {
                  stockBadge = inv.stock_detail || 'In Stock'
                }
              }
              // Offer priority
              if (discountPct > 0) {
                stockBadge = `${discountPct}% OFF`
              }
              
              return (
                <div className="pdp-status-badge">
                  {stockBadge}
                </div>
              )
            })()}
            <div className="product-bread">
              <a href="/">Home</a>
              <span>/</span>
              <a href="/shop">Shop</a>
              {product?.room_type && (
                <>
                  <span>/</span>
                  <span>{product.room_type}</span>
                </>
              )}
            </div>

            <h1 className="mb-1">{variantDisplayName}</h1>
            <div className="flex items-center gap-3 mb-4">
              {variant.variant?.variant_model && (
                <span className="text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary px-3 py-1 rounded-full">
                  Model: {variant.variant.variant_model}
                </span>
              )}
            </div>

            <div className="product-price">
              {formatPrice(price)}
              {hasDiscount && (
                <>
                  {' '}
                  <small style={{ textDecoration: 'line-through', opacity: 0.5, fontSize: '0.9em' }}>
                    {formatPrice(mrp)}
                  </small>
                  {' '}
                </>
              )}
            </div>

            {/* Specs (Brief) */}
            <div className="product-option-title">Specifications</div>
            <ul className="product-features">
              {variant.attributes?.material && <li>Material: {variant.attributes.material}</li>}
              {variant.attributes?.finish && <li>Finish: {variant.attributes.finish}</li>}
              {variant.attributes?.color && <li>Color: {variant.attributes.color}</li>}
              {variant.dimensions?.weight && <li>Weight: {variant.dimensions.weight}</li>}
              {(variant.dimensions?.length_mm || variant.dimensions?.width_mm || variant.dimensions?.breadth_mm || variant.dimensions?.height_mm) && (
                <li>
                  Dimensions: {[
                    variant.dimensions.length_mm,
                    variant.dimensions.width_mm || variant.dimensions.breadth_mm,
                    variant.dimensions.height_mm
                  ].filter(Boolean).join(' × ')} mm
                </li>
              )}
              {variant.fulfillment?.warranty_months && (
                <li>Warranty: {variant.fulfillment.warranty_months} months</li>
              )}
              {variant.fulfillment?.assembly_required && <li>Assembly required</li>}
            </ul>



            <div className="product-cta-row">
              <button
                className="btn-primary"
                onClick={() =>
                  addToCart({
                    id: `variant-${variant.id}`,
                    name: `${variant.product?.name || 'Product'} – ${variantDisplayName}`,
                    price,
                    image: thumbs[0],
                    meta: variant.variant?.sku ? `SKU: ${variant.variant.sku}` : undefined,
                    variant_model: variant.variant?.variant_model || undefined
                  })
                }
                type="button"
              >
                Add to Cart
              </button>
              <button
                className="btn-dark"
                onClick={() => {
                  addToCart({
                    id: `variant-${variant.id}`,
                    name: `${variant.product?.name || 'Product'} – ${variantDisplayName}`,
                    price,
                    image: thumbs[0],
                    meta: variant.variant?.sku ? `SKU: ${variant.variant.sku}` : undefined,
                    variant_model: variant.variant?.variant_model || undefined
                  });
                  // Programmatic navigation to Cart
                  window.location.href = '/cart';
                }}
                type="button"
              >
                Buy Now
              </button>
            </div>


          </div>
        </div>

        {/* Tabbed Content */}
        {variant.content && (
          <div className="product-details-tabs">
            <div className="tabs-nav">
              <button
                className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
                onClick={() => setActiveTab('description')}
              >
                Product Description
              </button>
              <button
                className={`tab-btn ${activeTab === 'specification' ? 'active' : ''}`}
                onClick={() => setActiveTab('specification')}
              >
                Specifications
              </button>
              <button
                className={`tab-btn ${activeTab === 'brand' ? 'active' : ''}`}
                onClick={() => setActiveTab('brand')}
              >
                Brand & Collection
              </button>
              <button
                className={`tab-btn ${activeTab === 'seller' ? 'active' : ''}`}
                onClick={() => setActiveTab('seller')}
              >
                Delivery Details
              </button>
              <button
                className={`tab-btn ${activeTab === 'warranty' ? 'active' : ''}`}
                onClick={() => setActiveTab('warranty')}
              >
                Warranty
              </button>
            </div>
            <div className="tab-pane">
              {activeTab === 'description' && (
                <div className="rich-text-content">
                  {variant.content.description_html ? (
                    <div dangerouslySetInnerHTML={{ __html: variant.content.description_html }} />
                  ) : (
                    <p style={{ opacity: 0.5 }}>Product description is not available.</p>
                  )}
                </div>
              )}
              {activeTab === 'specification' && (
                <div className="rich-text-content">
                  {variant.content.specification_html ? (
                    <div dangerouslySetInnerHTML={{ __html: variant.content.specification_html }} />
                  ) : (
                    <p style={{ opacity: 0.5 }}>Technical specifications are not available for this item.</p>
                  )}
                </div>
              )}
              {activeTab === 'brand' && (
                <div className="rich-text-content">
                  {variant.content.brand_collection_overview_html ? (
                    <div dangerouslySetInnerHTML={{ __html: variant.content.brand_collection_overview_html }} />
                  ) : (
                    <p style={{ opacity: 0.5 }}>Brand and collection details are currently under review.</p>
                  )}
                </div>
              )}
              {activeTab === 'seller' && (
                <div className="rich-text-content">
                  {variant.content.seller_notes_html ? (
                    <div dangerouslySetInnerHTML={{ __html: variant.content.seller_notes_html }} />
                  ) : (
                    <DefaultDeliveryInfo />
                  )}
                </div>
              )}
              {activeTab === 'warranty' && (
                <div className="rich-text-content">
                  {variant.content.warranty_html ? (
                    <div dangerouslySetInnerHTML={{ __html: variant.content.warranty_html }} />
                  ) : (
                    <DefaultWarrantyInfo />
                  )}
                </div>
              )}
            </div>
          </div>
        )}


        {/* Related Products */}
        {related.length > 0 && (
          <div className="related-section">
            <div className="related-head">
              <h3>You May Also Like</h3>
              <a href="/shop">View All</a>
            </div>
            <div className="related-grid">
              {related.map((item) => {
                const img = getImageUrl(item.media?.images?.[0]) ?? PLACEHOLDER
                const itemPrice = +(item.pricing?.selling_price || item.pricing?.mrp || 0)
                const itemDisplayName = item.variant?.name || item.product?.name || 'Unnamed Product'
                return (
                  <div className="related-card" key={item.id}>
                    <a href={`/product?vid=${item.id}`}>
                      <div className="related-img">
                        <img src={img} alt={itemDisplayName} />
                      </div>
                    </a>
                    <h4>
                      {itemDisplayName}
                      {item.variant?.variant_model && (
                        <span className="block text-[10px] font-black text-primary/60 uppercase tracking-tighter mt-1">
                          Model: {item.variant.variant_model}
                        </span>
                      )}
                    </h4>
                    <small>{item.product?.name}</small>
                    <strong>{formatPrice(itemPrice)}</strong>
                    <div className="shop-card-actions" style={{ marginTop: '0.75rem' }}>
                      <button
                        className="shop-btn-add"
                        onClick={() =>
                          addToCart({
                            id: `variant-${item.id}`,
                            name: `${item.product?.name || 'Product'} – ${itemDisplayName}`,
                            price: itemPrice,
                            image: img,
                            variant_model: item.variant?.variant_model || undefined
                          })
                        }
                        type="button"
                      >
                        Add to Cart
                      </button>
                      <a className="shop-btn-view" href={`/product?vid=${item.id}`}>
                        View Details
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
