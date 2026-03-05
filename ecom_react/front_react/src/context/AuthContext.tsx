import {
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react'
import { authApi, type ApiUser } from '../api'
import { AuthContext } from './AuthHook'

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<ApiUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // On mount, check if there's an active session
  useEffect(() => {
    let isMounted = true
    authApi.me().then((u) => {
      if (isMounted) {
        setUser(u)
        setIsLoading(false)
      }
    }).catch(() => {
      if (isMounted) setIsLoading(false)
    })
    return () => { isMounted = false }
  }, [])

  const login = async (email: string, password: string) => {
    const u = await authApi.login(email, password)
    setUser(u)
  }

  const register = async (name: string, email: string, password: string, passwordConfirmation: string) => {
    const u = await authApi.register(name, email, password, passwordConfirmation)
    setUser(u)
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch (err) {
      console.warn('Backend logout failed, clearing local session anyway:', err)
    } finally {
      setUser(null)
    }
  }

  const googleLogin = async (credential: string) => {
    setIsLoading(true)
    try {
      const userData = await authApi.googleLogin(credential)
      setUser(userData)
    } catch (err) {
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, googleLogin }}>
      {children}
    </AuthContext.Provider>
  )
}
