import {
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react'
import { authApi, type ApiUser } from '../api'
import { AuthContext } from './AuthHook'

const AUTH_STORAGE_KEY = 'truefurn_auth_user'

function readStoredUser(): ApiUser | null {
  if (typeof window === 'undefined') return null

  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as ApiUser
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
    return null
  }
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<ApiUser | null>(() => readStoredUser())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
  }, [user])

  useEffect(() => {
    if (user) return
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
  }, [user])

  // On mount, try to refresh from the backend session. If that check fails,
  // keep the locally cached user so refreshes don't blank the UI.
  useEffect(() => {
    let isMounted = true
    const storedUser = readStoredUser()

    authApi.me().then((u) => {
      if (!isMounted) return

      if (u) {
        setUser(u)
      } else if (!storedUser) {
        setUser(null)
      }

      setIsLoading(false)
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

  const updateUser = (newUser: ApiUser) => {
    setUser(newUser)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, googleLogin, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}
