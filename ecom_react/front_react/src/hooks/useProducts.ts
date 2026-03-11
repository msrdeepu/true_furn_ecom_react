import { useEffect, useState } from 'react'
import { productsApi, type ApiProduct, type ApiVariant } from '../api'

export type { ApiProduct, ApiVariant }

type State = {
    products: ApiProduct[]
    variants: ApiVariant[]
    isLoading: boolean
    error: string | null
}

// Module-level cache so data is only fetched once per page load
let cachedProducts: ApiProduct[] | null = null
let cachedVariants: ApiVariant[] | null = null
let inflight: Promise<void> | null = null

async function fetchAll() {
    const [products, variants] = await Promise.all([
        productsApi.all(),
        productsApi.allVariants(),
    ])
    cachedProducts = products
    cachedVariants = variants
}

export function useProducts(): State {
    const [state, setState] = useState<State>({
        products: cachedProducts ?? [],
        variants: cachedVariants ?? [],
        isLoading: !cachedProducts,
        error: null,
    })

    useEffect(() => {
        if (cachedProducts && cachedVariants) {
            setState({ products: cachedProducts, variants: cachedVariants, isLoading: false, error: null })
            return
        }
        if (!inflight) {
            inflight = fetchAll()
        }
        let isMounted = true
        inflight
            .then(() => {
                if (isMounted) {
                    setState({
                        products: cachedProducts!,
                        variants: cachedVariants!,
                        isLoading: false,
                        error: null,
                    })
                }
            })
            .catch((err) => {
                if (isMounted) {
                    setState((s) => ({ ...s, isLoading: false, error: err.message ?? 'Failed to load products' }))
                }
                inflight = null
            })
        return () => { isMounted = false }
    }, [])

    return state
}
