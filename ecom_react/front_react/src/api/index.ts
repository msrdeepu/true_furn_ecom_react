// ─── Central API Configuration ───────────────────────────────────────────────
// Change BASE_URL here to point to a different environment.
const BASE_URL = 'https://treefurnadmin.dgbits.ai'

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
    return {
        Accept: 'application/json',
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
            await initCsrf() // Ensure session/CSRF environment is ready
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

// ─── Add more API groups below as the app grows ───────────────────────────────
// export const productsApi = { ... }
// export const ordersApi   = { ... }
