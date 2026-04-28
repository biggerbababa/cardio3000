import styles from './ProfileCard.module.css'

export default function ProfileCard({ user, onLogout }) {
  return (
    <div className={styles.container}>
      <div className={styles.card}>

        {/* Avatar */}
        <div className={styles.avatarWrap}>
          <img
            className={styles.avatar}
            src={user.imageUrl}
            alt={user.name}
            referrerPolicy="no-referrer"
          />
          <span className={styles.onlineBadge} title="Online" />
        </div>

        {/* Name & Email */}
        <div className={styles.info}>
          <h2 className={styles.name}>สวัสดี, {user.givenName}! 👋</h2>
          <p className={styles.email}>{user.email}</p>
        </div>

        {/* Tags */}
        <div className={styles.tagRow}>
          <span className={`${styles.tag} ${styles.tagGoogle}`}>Google Account</span>
          <span className={styles.tag}>Verified</span>
        </div>

        <div className={styles.divider} />

        {/* Logout */}
        <button className={styles.logoutBtn} onClick={onLogout}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          ออกจากระบบ
        </button>

      </div>
    </div>
  )
}
