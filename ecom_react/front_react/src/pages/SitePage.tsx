import { useEffect, useState } from 'react'
import { type ApiSitePage, sitePagesApi } from '../api'

interface SitePageProps {
    slug: string
}

export function SitePage({ slug }: SitePageProps) {
    const [page, setPage] = useState<ApiSitePage | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        setIsLoading(true)
        setError(null)
        setPage(null)

        sitePagesApi
            .getPage(slug)
            .then((data) => {
                setPage(data)
                document.title = `${data.title} — TRUE FURN`
            })
            .catch(() => {
                setError('Page not found.')
            })
            .finally(() => setIsLoading(false))
    }, [slug])

    const bodies = page
        ? ([page.body1, page.body2, page.body3, page.body4, page.body5] as (string | null)[]).filter(
            Boolean
        )
        : []

    return (
        <section className="site-policy-page">
            <div className="container">
                {/* Breadcrumbs */}
                <div className="shop-breadcrumbs">
                    <a href="/">Home</a>
                    <span>{'>'}</span>
                    <strong>{isLoading ? '…' : (page?.title ?? 'Page')}</strong>
                </div>

                {/* Loading Skeleton */}
                {isLoading && (
                    <div className="policy-skeleton">
                        <div className="skeleton-line skeleton-line-lg" style={{ marginBottom: '2rem', height: '2.5rem', width: '40%' }} />
                        <div className="skeleton-line" style={{ marginBottom: '0.75rem' }} />
                        <div className="skeleton-line" style={{ marginBottom: '0.75rem' }} />
                        <div className="skeleton-line" style={{ marginBottom: '0.75rem', width: '80%' }} />
                        <div className="skeleton-line" style={{ marginBottom: '0.75rem' }} />
                        <div className="skeleton-line" style={{ width: '60%' }} />
                    </div>
                )}

                {/* Error State */}
                {!isLoading && error && (
                    <div className="policy-error">
                        <h1>404 — Page Not Found</h1>
                        <p>{error}</p>
                        <a className="btn-primary" href="/">
                            Return Home
                        </a>
                    </div>
                )}

                {/* Page Content */}
                {!isLoading && page && (
                    <article className="policy-content">
                        <h1 className="policy-title">{page.title}</h1>
                        {bodies.length === 0 && (
                            <p className="policy-empty">No content available for this page yet.</p>
                        )}
                        {bodies.map((body, idx) => (
                            <div
                                key={idx}
                                className="policy-body"
                                // API returns trusted HTML from the CMS rich-text editor
                                // eslint-disable-next-line react/no-danger
                                dangerouslySetInnerHTML={{ __html: body as string }}
                            />
                        ))}
                    </article>
                )}
            </div>
        </section>
    )
}
