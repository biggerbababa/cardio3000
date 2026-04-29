import styles from './LoginPage.module.css'

// Google "G" SVG icon
const GoogleIcon = () => (
  <svg className={styles.googleIcon} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
)

export default function LoginPage({ onLogin, isLoading, error }) {
  return (
    <div className={styles.phoneFrame}>
      <div className={styles.content}>
        <div className={styles.card}>
          {/* Brand */}
          <div className={styles.brand}>
            <div className={styles.logoCircle}>
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
              </svg>
            </div>
            <h1 className={styles.title}>ยินดีต้อนรับ</h1>
            <p className={styles.subtitle}>
              เข้าสู่ระบบด้วยบัญชี Google ของคุณ<br />
              เพื่อเริ่มต้นใช้งาน
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className={styles.errorBox}>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Google Login Button */}
          <button
            className={styles.googleBtn}
            onClick={onLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className={styles.spinner} />
            ) : (
              <GoogleIcon />
            )}
            {isLoading ? 'กำลังเชื่อมต่อ...' : 'Continue with Google'}
          </button>

          {/* Footer */}
          <p className={styles.footer}>
            การเข้าสู่ระบบถือว่าคุณยอมรับ<br />
            นโยบายความเป็นส่วนตัวของเรา
          </p>
        </div>
      </div>
    </div>
  )
}
