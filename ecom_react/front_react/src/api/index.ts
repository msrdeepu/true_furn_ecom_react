// ─── Central API Configuration ───────────────────────────────────────────────
// Change BASE_URL here to point to a different environment.
export const BASE_URL = 'https://app.treefurn.com'

// ─── Centralized Configuration Keys ──────────────────────────────────────────
export const GOOGLE_CLIENT_ID = '525287334488-2q3lg81tpg43e128bmrc4g092j8o643l.apps.googleusercontent.com'
export const RAZORPAY_KEY = 'rzp_test_SBtNcZ7HVMluKm'

// ─── Utilities ────────────────────────────────────────────────────────────────

/** Read the XSRF-TOKEN cookie set by Laravel Sanctum */
function getXsrfToken(): string | null {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/)
    return match ? decodeURIComponent(match[1]) : null
}

/** Fetch the Sanctum CSRF cookie before mutating requests */
async function initCsrf(): Promise<void> {
    await fetch(`${BASE_URL}/sanctum/csrf-cookie`, {
        credentials: 'include',
    })
}

/** Get default headers for all API requests */
function getCommonHeaders(): Record<string, string> {
    const xsrf = getXsrfToken()
    if (!xsrf && (document.cookie.includes('XSRF-TOKEN'))) {
        console.warn('XSRF-TOKEN cookie exists but getXsrfToken failed to parse it. Cookie string:', document.cookie)
    }
    return {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...(xsrf ? { 'X-XSRF-TOKEN': xsrf } : {}),
    }
}

/** Base fetch wrapper — always sends credentials & JSON headers */
async function apiFetch<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
        credentials: 'include',
        ...options,
        headers: {
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
            'Content-Type': 'application/json',
            ...getCommonHeaders(),
            ...(options.headers ?? {}),
        },
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
        // Laravel validation errors come in data.errors, fallback to data.message
        const msg =
            data?.message ||
            Object.values(data?.errors ?? {}).flat().join(' ') ||
            'Something went wrong'
        throw new Error(msg as string)
    }

    return data as T
}

// ─── Auth API ─────────────────────────────────────────────────────────────────

export type ApiUser = {
    id: number
    name: string
    lname?: string
    email: string
    avatar?: string
    level?: string
    type?: string
    mobile?: string
    phone?: string
}

/** URL to kick off Google OAuth — navigates away from the SPA */
export const GOOGLE_AUTH_URL = `${BASE_URL}/api/auth/google/redirect`

export const authApi = {
    /** Login with email + password — returns the authenticated user */
    async login(email: string, password: string): Promise<ApiUser> {
        await initCsrf()
        const data = await apiFetch<{ user: ApiUser }>('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        })
        return data.user
    },

    /** Register a new account — auto-logs in, returns the new user */
    async register(name: string, email: string, password: string, passwordConfirmation: string): Promise<ApiUser> {
        await initCsrf()
        const data = await apiFetch<{ user: ApiUser }>('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password, password_confirmation: passwordConfirmation }),
        })
        return data.user
    },

    /** Fetch the current authenticated user, or null if guest */
    async me(): Promise<ApiUser | null> {
        try {
            const data = await apiFetch<{ user: ApiUser }>('/api/auth/me')
            return data.user
        } catch {
            return null
        }
    },

    /** Logout the current session */
    async logout(): Promise<void> {
        await initCsrf()
        await apiFetch('/api/auth/logout', { method: 'POST' })
    },

    /** Login with Google identity token */
    async googleLogin(credential: string): Promise<ApiUser> {
        await initCsrf()
        const data = await apiFetch<{ user: ApiUser }>('/api/auth/google/token', {
            method: 'POST',
            body: JSON.stringify({ token: credential }),
        })
        return data.user
    },
}

// ─── Products API ────────────────────────────────────────────────────────────

export type ApiProduct = {
    id: number
    name: string
    slug: string
    description?: string
    room_type?: string
    product_type?: string
    categoriesset?: string[]
    tagsset?: string[]
    brand_name?: string
    warranty_months?: number
    assembly_required?: boolean
    status: string
    image?: string | null
}

export type ApiVariant = {
    id: number
    product: {
        id: number
        name: string
    }
    variant: {
        name: string | null
        vname?: string | null
        variant_model: string | null
        sku: string | null
        barcode: string | null
        status: string
    }
    attributes: {
        material: string | null
        finish: string | null
        color: string | null
        size: string | null
        upholstery: string | null
    }
    dimensions: {
        length_mm: string | null
        width_mm: string | null
        breadth_mm: string | null
        height_mm: string | null
        weight: string | null
    }
    inventory: {
        enabled: boolean
        stock_status: string | null
        stock_detail?: string | null
        available_after_days?: number | null
        quantity: string | null
        min_order_qty: string | null
        max_order_qty: string | null
        alert_qty: string | null
    }
    pricing: {
        mrp: string
        cost: string | null
        selling_price: string | null
        offer_price: string | null
        currency: string
        discount_percent: string | null
        customer_discount_percent: string | null
        dealer_discount_percent: string | null
        distributor_discount_percent: string | null
    }
    tax: {
        mode: string
        label: string | null
        percent: string
    }
    offer: {
        active: boolean
        start_at: string | null
        end_at: string | null
    }
    fulfillment: {
        lead_time_days: number | null
        assembly_required: boolean
        warranty_months: number | null
    }
    content: {
        description_html: string | null
        specification_html: string | null
        brand_collection_overview_html: string | null
        seller_notes_html: string | null
        warranty_html: string | null
    }
    media: {
        images: string[]
    }
    timestamps: {
        created_at: string
        updated_at: string
    }
}

export type ApiCategoryVariant = {
    id: number
    product_id: number
    product_name: string | null
    variant_name: string | null
    vname?: string | null
    color: string | null
    size: string | null
    mrp: string | number
    price: string | number
    offer_price: string | number | null
    stock: number | string | null
    totalstock: number | string | null
    images: string[]
}

export type ApiCategoryResponse = {
    status: boolean
    category: {
        id: number
        name: string
        slug: string
    }
    variants: ApiCategoryVariant[]
}

/** Constructs a full image URL from the relative paths returned by the backend */
export function getImageUrl(path: string | null | undefined): string | null {
    if (!path) return null
    // Already a full URL
    if (path.startsWith('http')) return path
    // Strip a leading slash so we don't double-up
    const clean = path.startsWith('/') ? path.slice(1) : path
    return `${BASE_URL}/${clean}`
}

export type ApiFeaturedProduct = {
    featured_id: number
    variant_id: number
    product: {
        id: number
        name: string
        slug: string
    }
    variant: {
        name: string
        model: string | null
        sku: string | null
    }
    price: {
        mrp: string
        selling_price: string
        offer_price: string
    }
    image: string | null
}

export type ApiTopSeller = {
    id: number
    variant_id: number
    product_name: string
    product_slug: string
    variant_name: string
    model: string | null
    price: string
    mrp: string
    image: string | null
}

export const productsApi = {
    /** Fetch all products */
    async all(): Promise<ApiProduct[]> {
        const data = await apiFetch<{ status: boolean; data: ApiProduct[] }>('/api/allproducts')
        return data.data
    },

    /** Fetch all variants */
    async allVariants(): Promise<ApiVariant[]> {
        const data = await apiFetch<{ status: boolean; data: ApiVariant[] }>('/api/variants')
        return data.data
    },

    /** Fetch products by category slug */
    async getByCategory(slug: string): Promise<ApiCategoryResponse> {
        return apiFetch<ApiCategoryResponse>(`/api/category/${slug}/products`)
    },

    /** Fetch featured products */
    async getFeatured(): Promise<ApiFeaturedProduct[]> {
        const data = await apiFetch<{ status: boolean; data: ApiFeaturedProduct[] }>('/api/featured-products')
        return data.data
    },

    /** Fetch top sellers */
    async getTopSellers(): Promise<ApiTopSeller[]> {
        const data = await apiFetch<{ status: boolean; data: ApiTopSeller[] }>('/api/topseller')
        return data.data
    },
}

// ─── Cart API ────────────────────────────────────────────────────────────────

export type ApiCartItem = {
    id: string | number
    quantity: string | number
    variant_id: string | number
    variant_name?: string
    color_name?: string
    size_label?: string
    product_name?: string
    brand_name?: string
    variant_model?: string
    name?: string // fallback
    price: string | number
    image?: string // legacy fallback
    images?: string[]
}

export const cartApi = {
    /** Add a product to the backend cart */
    async add(userId: number, variantId: number): Promise<{ status: boolean; message: string }> {
        await initCsrf()
        return apiFetch('/api/cart-items/add', {
            method: 'POST',
            body: JSON.stringify({ user_id: userId, variant_id: variantId }),
        })
    },

    /** Fetch all cart items for a user */
    async get(userId: number): Promise<ApiCartItem[]> {
        return apiFetch(`/api/cart-items/${userId}`)
    },

    /** Update quantity of a cart item */
    async update(cartId: number, quantity: number): Promise<{ status: boolean; message: string }> {
        await initCsrf()
        return apiFetch('/api/cart-items/update', {
            method: 'POST',
            body: JSON.stringify({ cart_id: cartId, quantity }),
        })
    },

    /** Remove an item from the cart */
    async remove(cartId: number): Promise<{ status: boolean; message: string }> {
        await initCsrf()
        return apiFetch(`/api/cart-items-remove/${cartId}`, {
            method: 'DELETE',
        })
    },

    /** Get total number of items in cart for a user */
    async count(userId: number): Promise<{ count: number }> {
        return apiFetch(`/api/cart-items/count/${userId}`)
    },

    /** Clear all cart items for logged user */
    async clear(userId: number): Promise<{ status: boolean; message: string }> {
        await initCsrf()
        return apiFetch(`/api/cart/clear/${userId}`, {
            method: 'POST',
        })
    },
}

// ─── Site Pages API ───────────────────────────────────────────────────────────

export type ApiSitePage = {
    id: string
    slug: string
    title: string
    meta_description: string | null
    body1: string | null
    body2: string | null
    body3: string | null
    body4: string | null
    body5: string | null
    image1: string | null
    image2: string | null
    image3: string | null
    created_at: string
    updated_at: string
}

export const sitePagesApi = {
    /** Fetch a single site page by slug */
    async getPage(slug: string): Promise<ApiSitePage> {
        const data = await apiFetch<{ status: boolean; data: ApiSitePage }>(`/api/sitepages/${slug}`)
        return data.data
    },
}

// ─── Add more API groups below as the app grows ───────────────────────────────
// export const ordersApi = { ... }

// ─── Payment API ──────────────────────────────────────────────────────────────

export type RazorpayOrderResponse = {
    status: boolean;
    razorpay_order_id: string;
    amount: number;
    currency: string;
    order_db_id: number;
    message?: string;
}

export type PhonePeOrderResponse = {
    status: boolean;
    message: string;
    order_db_id: number;
    merchant_order_id: string;
    phonepe_order_id: string;
    redirect_url: string;
    state: string;
}

export type CODOrderResponse = {
    status: boolean;
    message: string;
    order_db_id: number;
    payment_method: string;
    payment_status: string;
    order_status: string;
}

export const paymentApi = {
    /** Create a Razorpay order via backend */
    async createRazorpayOrder(data: {
        user_id: number;
        amount: number;
        email: string;
        order_tax_amount?: number;
        address_id: number;
        items: any[];
    }): Promise<RazorpayOrderResponse> {
        await initCsrf()
        return apiFetch('/api/payment/razorpay/order', {
            method: 'POST',
            body: JSON.stringify(data),
        })
    },

    /** Verify Razorpay signature via backend */
    async verifyRazorpayPayment(data: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
    }): Promise<{ status: boolean; message: string }> {
        await initCsrf()
        return apiFetch('/api/payment/razorpay/verify', {
            method: 'POST',
            body: JSON.stringify(data),
        })
    },

    /** Create a PhonePe order via backend */
    async createPhonePeOrder(data: {
        user_id: number;
        amount: number;
        email: string;
        order_tax_amount?: number;
        address_id: number;
        items: any[];
    }): Promise<PhonePeOrderResponse> {
        await initCsrf()
        return apiFetch('/api/phonepe/create-order', {
            method: 'POST',
            body: JSON.stringify(data),
        })
    },

    /** Create a Cash on Delivery order via backend */
    async createCODOrder(data: {
        user_id: number;
        amount: number;
        email: string;
        order_tax_amount?: number;
        address_id: number;
        items: any[];
    }): Promise<CODOrderResponse> {
        await initCsrf()
        return apiFetch('/api/payment/cod/place-order', {
            method: 'POST',
            body: JSON.stringify(data),
        })
    }
}

// ─── Settings API (Country, State, District) ─────────────────────────────────

export type ApiCountry = {
    id: number
    name: string
}

export type ApiState = {
    id: number
    name: string
    country_id: number
}

export type ApiDistrict = {
    id: number
    name: string
    state_id: number
}

export const settingsApi = {
    async getCountries(): Promise<ApiCountry[]> {
        const data = await apiFetch<{ status: boolean; data: ApiCountry[] }>('/api/settings/countries')
        return data.data
    },

    async getStates(countryId: number): Promise<ApiState[]> {
        await initCsrf()
        const data = await apiFetch<{ status: boolean; data: ApiState[] }>('/api/settings/states', {
            method: 'POST',
            body: JSON.stringify({ country_id: countryId })
        })
        return data.data
    },

    async getDistricts(stateId: number): Promise<ApiDistrict[]> {
        await initCsrf()
        const data = await apiFetch<{ status: boolean; data: ApiDistrict[] }>('/api/settings/districts', {
            method: 'POST',
            body: JSON.stringify({ state_id: stateId })
        })
        return data.data
    }
}
// ─── Address API ──────────────────────────────────────────────────────────────
export type ApiAddress = {
    id: number
    user_id: number
    a_type: string // e.g., 'Home', 'Work'
    country_id?: number | null // DB stores country ID
    state_id?: number | null // DB stores state ID
    district_id?: number | null // DB stores district ID
    address: string // Line 1
    extra_address?: string | null // Line 2
    location?: string | null
    city?: string | null
    zipcode?: string | null
    contact_number?: string | null // NEW: Added contact number
    created_at?: string
    updated_at?: string
    // Relationships if pre-loaded
    country?: ApiCountry | null
    state?: ApiState | null
    district?: ApiDistrict | null
}

export const addressApi = {
    /** Get all addresses for a user */
    async list(userId: number): Promise<ApiAddress[]> {
        const data = await apiFetch<{ status: boolean; data: ApiAddress[] }>(`/api/addresses?user_id=${userId}`)
        return data.data
    },

    /** Create a new address */
    async create(data: Partial<ApiAddress>): Promise<ApiAddress> {
        await initCsrf()
        const response = await apiFetch<{ status: boolean; data: ApiAddress }>('/api/addresses', {
            method: 'POST',
            body: JSON.stringify(data),
        })
        return response.data
    },

    /** Show a single address */
    async get(id: number): Promise<ApiAddress> {
        const data = await apiFetch<{ status: boolean; data: ApiAddress }>(`/api/addresses/${id}`)
        return data.data
    },

    /** Update an existing address */
    async update(id: number, data: Partial<ApiAddress>): Promise<ApiAddress> {
        await initCsrf()
        const response = await apiFetch<{ status: boolean; data: ApiAddress }>(`/api/addresses/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        })
        return response.data
    },

    /** Delete an address */
    async delete(id: number): Promise<{ status: boolean; message: string }> {
        await initCsrf()
        return apiFetch(`/api/addresses/${id}`, {
            method: 'DELETE',
        })
    },
}

// ─── Order API ──────────────────────────────────────────────────────────────
export type ApiOrderItem = {
    id: number
    order_id: number
    product_id: number | null
    variant_id: number | null
    name: string
    image: string | null
    quantity: number
    price: number
    unit_total: number
    variant_model?: string | null
    tax_amount?: number
    slab?: number
}

export type ApiOrder = {
    id: number
    user_id: number
    amount: number
    tax_amount?: number
    email_address: string
    paypal_orderid: string | null
    reference_id: string | null
    address_id: number | null
    payment_status: string // e.g. 'PENDING', 'COMPLETED'
    status: string // e.g. 'In-Progress', 'Shipped', 'Delivered'
    created_at: string
    items?: ApiOrderItem[]
    address?: any // Replace with ApiAddress if available in same file or import
    coupon_code?: string | null
    discount_type?: string | null
    discount_amount?: number
}

export type ApiOrderDetails = {
    order_id: number;
    order_number: string | null;
    tax_context: {
        company_state_id: number;
        address_state_id: number;
        supply_type: string;
        applied_tax: string;
    };
    delivery_partner: {
        id: number;
        name: string | null;
        mobile: string | null;
        email: string | null;
        vendor_type: string | null;
    } | null;
    customer_address: any;
    items: {
        id: number;
        image: string | null; // NEW PROPERTY
        product: { id: number; name: string };
        variant: {
            id: number;
            name: string;
            variant_model: string | null;
            hsn_code: string;
            tax_mode: string;
            cgst_percent: number;
            sgst_percent: number;
            igst_percent: number;
            cess_percent: number;
        };
        quantity: number;
        unit_price: number;
        subtotal: number;
        tax_type: string;
        tax_breakup: {
            cgst: number;
            sgst: number;
            igst: number;
            cess: number;
            tax_total: number;
        };
        total: number;
    }[];
    summary: {
        subtotal: number;
        cgst_total: number;
        sgst_total: number;
        igst_total: number;
        cess_total: number;
        tax_total: number;
        grand_total: number;
    };
    order: ApiOrder;
}

export const orderApi = {
    /** Get all orders for the current user */
    async list(userId?: number): Promise<ApiOrder[]> {
        const url = userId ? `/api/orders?user_id=${userId}` : '/api/orders'
        const data = await apiFetch<{ status: boolean; data: ApiOrder[] }>(url)
        return data.data
    },

    /** Get the latest order (Current Shipment) */
    async latest(userId?: number): Promise<ApiOrder | null> {
        const url = userId ? `/api/orders/latest?user_id=${userId}` : '/api/orders/latest'
        const data = await apiFetch<{ status: boolean; data: ApiOrder | null }>(url)
        return data.data
    },

    /** Get specific order details */
    async get(id: number): Promise<ApiOrderDetails> {
        const data = await apiFetch<{ status: boolean; data: ApiOrderDetails }>(`/api/orders/${id}`)
        return data.data
    },
}

// ─── Profile API ──────────────────────────────────────────────────────────────
export const profileApi = {
    /** Update basic profile */
    async updateProfile(data: { name: string; lname: string; email: string; phone?: string; user_id?: number }): Promise<{ status: boolean; message: string; user?: ApiUser }> {
        await initCsrf()
        return apiFetch('/api/profile/update', {
            method: 'PUT',
            body: JSON.stringify(data),
        })
    },

    /** Update password */
    async updatePassword(data: { current_password: string; new_password: string; user_id?: number }): Promise<{ status: boolean; message: string }> {
        await initCsrf()
        return apiFetch('/api/profile/password', {
            method: 'PUT',
            body: JSON.stringify(data),
        })
    },
}

// ─── Coupon API ──────────────────────────────────────────────────────────────
export type ApiCoupon = {
    id: number
    code: string
    type: 'PERCENT' | 'FLAT'
    discount: number
}

export const couponApi = {
    /** Verify a promo code */
    async verify(code: string): Promise<{ status: boolean; message: string; data?: ApiCoupon }> {
        await initCsrf()
        return apiFetch('/api/coupons/verify', {
            method: 'POST',
            body: JSON.stringify({ code }),
        })
    },
}

// ─── Contact API ─────────────────────────────────────────────────────────────
export const contactApi = {
    /** Submit contact form */
    async submit(data: {
        name: string
        email: string
        mobile: string
        subject: string
        address: string
        message: string
        captcha_token: string
    }): Promise<{ status: boolean; message: string }> {
        await initCsrf()
        return apiFetch('/api/contact/store', {
            method: 'POST',
            body: JSON.stringify(data),
        })
    },
}

// ─── WhatsApp Subscription API ───────────────────────────────────────────────
export const whatsappApi = {
    /** Subscribe to WhatsApp updates */
    async subscribe(data: {
        name: string
        phone: string
        captcha_token: string
    }): Promise<{ status: boolean; message: string }> {
        await initCsrf()
        return apiFetch('/api/whatsapp/subscribe', {
            method: 'POST',
            body: JSON.stringify(data),
        })
    },
}
