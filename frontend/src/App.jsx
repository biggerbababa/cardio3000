import { GoogleOAuthProvider } from '@react-oauth/google'
import { useGoogleAuth } from './hooks/useGoogleAuth'
import LoginPage from './components/LoginPage'
import MobileShell from './components/MobileShell'
import { GOOGLE_CLIENT_ID } from './config/googleConfig'

function AuthFlow() {
  const { user, isLoading, error, login, logout } = useGoogleAuth()

  if (!user) {
    return <LoginPage onLogin={login} isLoading={isLoading} error={error} />
  }

  return <MobileShell user={user} onLogout={logout} />
}

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthFlow />
    </GoogleOAuthProvider>
  )
}
