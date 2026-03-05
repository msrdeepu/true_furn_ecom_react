import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../../context/AuthHook'
import { useState } from 'react'

export function GoogleLoginButton() {
    const { googleLogin } = useAuth()
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleSuccess = async (credentialResponse: any) => {
        if (!credentialResponse.credential) return

        setIsLoading(true)
        setError(null)
        try {
            await googleLogin(credentialResponse.credential)
            window.history.pushState({}, '', '/account/dashboard')
            window.dispatchEvent(new PopStateEvent('popstate'))
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Google login failed')
        } finally {
            setIsLoading(false)
        }
    }

    const handleError = () => {
        setError('Google Sign-In failed. Please try again.')
    }

    return (
        <div className="auth-socials">
            {error && <p className="auth-error" style={{ marginBottom: '1rem' }}>{error}</p>}

            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={handleError}
                    useOneTap
                    theme="outline"
                    size="large"
                    text="continue_with"
                    shape="rectangular"
                    width="100%"
                />
            </div>

            {isLoading && (
                <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
                    Signing you in...
                </p>
            )}
        </div>
    )
}
