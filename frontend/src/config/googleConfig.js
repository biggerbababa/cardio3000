// ใช้ VITE env var เพื่อให้ build บน Vercel ได้
// ตั้งค่าใน Vercel dashboard: VITE_GOOGLE_CLIENT_ID
export const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  '377717917837-su7kq4e18kkf5qpfmlm5l0hccsmjnmbg.apps.googleusercontent.com'

export const SCOPES = 'openid email profile'
