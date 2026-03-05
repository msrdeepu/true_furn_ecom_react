import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="678902879271-gjctu86jq6ri2lp7p5598sorocvev0um.apps.googleusercontent.com">
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
