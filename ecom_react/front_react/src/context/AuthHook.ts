import { createContext, useContext } from 'react'
import type { ApiUser } from '../api'

export type AuthContextValue = {
    user: ApiUser | null
    isLoading: boolean
    login: (email: string, password: string) => Promise<void>
    register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>
    googleLogin: (credential: string) => Promise<void>
    logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
    return ctx
}
