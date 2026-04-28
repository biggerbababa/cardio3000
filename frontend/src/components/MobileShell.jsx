import { useState } from 'react'
import styles from './MobileShell.module.css'
import MainMenu from './MainMenu'
import ProfileTab from './ProfileTab'

// Tab Bar Icons
const HomeIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3 9.5L12 3L21 9.5V20C21 20.5523 20.5523 21 20 21H15V15H9V21H4C3.44772 21 3 20.5523 3 20V9.5Z"
      fill={active ? '#4285f4' : 'none'}
      stroke={active ? '#4285f4' : '#aaaaaa'}
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
)

const ProfileIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle
      cx="12"
      cy="8"
      r="4"
      fill={active ? '#4285f4' : 'none'}
      stroke={active ? '#4285f4' : '#aaaaaa'}
      strokeWidth="1.8"
    />
    <path
      d="M4 20C4 17.2386 7.58172 15 12 15C16.4183 15 20 17.2386 20 20"
      stroke={active ? '#4285f4' : '#aaaaaa'}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
)

export default function MobileShell({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('home')

  return (
    <div className={styles.phoneFrame}>
      {/* Page Content */}
      <div className={styles.content}>
        {activeTab === 'home' && <MainMenu user={user} />}
        {activeTab === 'profile' && <ProfileTab user={user} onLogout={onLogout} />}
      </div>

      {/* Bottom Tab Bar */}
      <div className={styles.tabBar}>
        <button
          className={`${styles.tabItem} ${activeTab === 'home' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('home')}
        >
          <HomeIcon active={activeTab === 'home'} />
          <span>หน้าหลัก</span>
        </button>
        <button
          className={`${styles.tabItem} ${activeTab === 'profile' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <ProfileIcon active={activeTab === 'profile'} />
          <span>โปรไฟล์</span>
        </button>
      </div>
    </div>
  )
}
