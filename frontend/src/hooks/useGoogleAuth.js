import { useState, useCallback } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import { loginWithGoogle, clearToken, getSavedUser, isTokenValid } from '../services/api'

/**
 * Custom Hook: useGoogleAuth
 * จัดการ Google OAuth2 login / logout / profile state
 * หลัง Google login → ส่ง accessToken ไปยัง backend เพื่อรับ JWT ของเรา
 */
export function useGoogleAuth() {
  const [user, setUser] = useState(() => {
    // Restore session from localStorage if JWT is still valid
    if (isTokenValid()) {
      const saved = getSavedUser()
      return saved || null
    }
    clearToken()
    return null
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // ── Login ───────────────────────────────────────────────────────────
  const _googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Call our backend — verifies token, upserts user, returns JWT
        const userProfile = await loginWithGoogle(tokenResponse.access_token)
        setUser({
          id: userProfile.id,
          googleId: userProfile.googleId,
          name: userProfile.name,
          email: userProfile.email,
          imageUrl: userProfile.imageUrl,
          givenName: userProfile.givenName,
        })
        setError(null)
      } catch (err) {
        setError('เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่')
        console.error('Backend login error:', err)
      } finally {
        setIsLoading(false)
      }
    },
    onError: (err) => {
      if (err.error !== 'access_denied') {
        setError('Login ไม่สำเร็จ กรุณาลองใหม่')
      }
      setIsLoading(false)
      console.error('Google login error:', err)
    },
  })

  const login = useCallback(() => {
    setError(null)
    setIsLoading(true)
    _googleLogin()
  }, [_googleLogin])

  // ── Logout ──────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    clearToken()
    setUser(null)
    setError(null)
  }, [])

  return { user, isLoading, error, login, logout }
}

