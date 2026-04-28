// ดึง client_id โดยตรงจากไฟล์ client_secret.json
import clientSecret from '../../client_secret_377717917837-su7kq4e18kkf5qpfmlm5l0hccsmjnmbg.apps.googleusercontent.com.json'

export const GOOGLE_CLIENT_ID = clientSecret.web.client_id

export const SCOPES = 'openid email profile'
