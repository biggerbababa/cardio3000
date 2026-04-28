import styles from './ProfileTab.module.css'

const InfoRow = ({ icon, label, value }) => (
  <div className={styles.infoRow}>
    <span className={styles.infoIcon}>{icon}</span>
    <div className={styles.infoContent}>
      <span className={styles.infoLabel}>{label}</span>
      <span className={styles.infoValue}>{value || '—'}</span>
    </div>
  </div>
)

export default function ProfileTab({ user, onLogout }) {
  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.headerBar}>
        <span className={styles.headerTitle}>โปรไฟล์</span>
      </div>

      {/* Hero Card */}
      <div className={styles.heroCard}>
        <div className={styles.coverBg} />
        <div className={styles.heroBody}>
          <div className={styles.avatarWrap}>
            <img
              className={styles.avatar}
              src={user.imageUrl}
              alt={user.name}
              referrerPolicy="no-referrer"
            />
            <span className={styles.onlineDot} />
          </div>
          <h2 className={styles.name}>{user.name}</h2>
          <p className={styles.emailBadge}>{user.email}</p>
          <div className={styles.badges}>
            <span className={styles.badgeGoogle}>
              <svg width="14" height="14" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Google Account
            </span>
            <span className={styles.badgeVerified}>✓ Verified</span>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>ข้อมูลบัญชี</div>
        <div className={styles.card}>
          <InfoRow icon="👤" label="ชื่อ-นามสกุล" value={user.name} />
          <div className={styles.divider} />
          <InfoRow icon="🙋" label="ชื่อจริง" value={user.givenName} />
          <div className={styles.divider} />
          <InfoRow icon="📧" label="อีเมล" value={user.email} />
          <div className={styles.divider} />
          <InfoRow icon="🔑" label="User ID" value={user.id} />
        </div>
      </div>

      {/* Account Status Section */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>สถานะบัญชี</div>
        <div className={styles.card}>
          <div className={styles.statusRow}>
            <div className={styles.statusItem}>
              <span className={styles.statusDot} style={{ background: '#34a853' }} />
              <span className={styles.statusText}>เชื่อมต่อแล้ว</span>
            </div>
            <span className={styles.statusBadge} style={{ background: '#e6f4ea', color: '#34a853' }}>ออนไลน์</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.statusRow}>
            <div className={styles.statusItem}>
              <span className={styles.statusDot} style={{ background: '#4285f4' }} />
              <span className={styles.statusText}>ยืนยันตัวตนแล้ว</span>
            </div>
            <span className={styles.statusBadge} style={{ background: '#e8f0fe', color: '#4285f4' }}>Google OAuth2</span>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className={styles.section}>
        <button className={styles.logoutBtn} onClick={onLogout}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          ออกจากระบบ
        </button>
      </div>

      <div className={styles.bottomSpacer} />
    </div>
  )
}
