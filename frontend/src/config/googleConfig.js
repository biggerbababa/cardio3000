// ใช้ VITE env var เพื่อให้ build บน Vercel ได้
// ตั้งค่าใน Vercel dashboard: VITE_GOOGLE_CLIENT_ID
export const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  '377717917837-gg22ab1l8voelh3pvis69sdq6vrp2jsn.apps.googleusercontent.com'

export const SCOPES = 'openid email profile'
