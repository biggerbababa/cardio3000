import { useState, useEffect, useCallback } from 'react'
import styles from './MainMenu.module.css'
import { getWeekLogs, logCardio, resetDay as apiResetDay } from '../services/api'
import CardioHistory from './CardioHistory'

const GOAL = 300 // minutes per week
const QUICK_OPTIONS = [15, 20, 30, 45, 60, 90]

function getWeekDays() {
  const now = new Date()
  const day = now.getDay()
  const diff = (day === 0 ? -6 : 1 - day)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now)
    d.setDate(now.getDate() + diff + i)
    return d.toISOString().slice(0, 10)
  })
}

function getTodayKey() {
  return new Date().toISOString().slice(0, 10)
}

const DAY_LABELS = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา']

export default function MainMenu({ user }) {
  const [activeTab, setActiveTab] = useState('log')
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)
  const [customInput, setCustomInput] = useState('')
  const [showCustom, setShowCustom] = useState(false)
  const [flash, setFlash] = useState(false)

  const weekDays = getWeekDays()
  const todayKey = getTodayKey()

  // ── Fetch week data from backend ─────────────────────────────────────
  const fetchWeek = useCallback(async () => {
    try {
      const result = await getWeekLogs(weekDays)
      setData(result)
    } catch (err) {
      console.error('Failed to fetch week logs:', err)
    } finally {
      setLoading(false)
    }
  }, [weekDays.join(',')])

  useEffect(() => {
    fetchWeek()
  }, [fetchWeek])

  const weekTotal = weekDays.reduce((sum, d) => sum + (data[d] || 0), 0)
  const todayTotal = data[todayKey] || 0
  const progress = Math.min(weekTotal / GOAL, 1)
  const remaining = Math.max(GOAL - weekTotal, 0)

  async function addMinutes(min) {
    const newTotal = todayTotal + min
    // Optimistic update
    setData(prev => ({ ...prev, [todayKey]: newTotal }))
    setFlash(true)
    setTimeout(() => setFlash(false), 600)
    try {
      await logCardio(todayKey, newTotal)
    } catch (err) {
      console.error('Log cardio error:', err)
      // Rollback on error
      setData(prev => ({ ...prev, [todayKey]: todayTotal }))
    }
  }

  async function undoToday() {
    setData(prev => ({ ...prev, [todayKey]: 0 }))
    try {
      await apiResetDay(todayKey)
    } catch (err) {
      console.error('Reset day error:', err)
      setData(prev => ({ ...prev, [todayKey]: todayTotal }))
    }
  }

  function handleCustom() {
    const val = parseInt(customInput, 10)
    if (!isNaN(val) && val > 0) {
      addMinutes(val)
      setCustomInput('')
      setShowCustom(false)
    }
  }

  const pct = Math.round(progress * 100)
  const circumference = 2 * Math.PI * 54
  const strokeDash = circumference * progress

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <p className={styles.greeting}>สัปดาห์นี้</p>
            <h1 className={styles.title}>Cardio Tracker 🏃</h1>
          </div>
          {user?.imageUrl && (
            <img className={styles.avatar} src={user.imageUrl} alt="" referrerPolicy="no-referrer" />
          )}
        </div>
        <div className={styles.loadingWrap}>
          <div className={styles.loadingSpinner} />
          <p>กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <p className={styles.greeting}>สัปดาห์นี้</p>
          <h1 className={styles.title}>Cardio Tracker 🏃</h1>
        </div>
        {user?.imageUrl && (
          <img className={styles.avatar} src={user.imageUrl} alt="" referrerPolicy="no-referrer" />
        )}
      </div>

      {/* Tab Bar */}
      <div className={styles.tabBar}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'log' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('log')}
        >
          🏃 ล็อกคาร์ดิโอ
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'history' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('history')}
        >
          📊 ประวัติ
        </button>
      </div>

      {activeTab === 'history' ? (
        <CardioHistory />
      ) : (
      <>
      {/* Ring Progress */}
      <div className={`${styles.ringCard} ${flash ? styles.flash : ''}`}>
        <div className={styles.ringWrap}>
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle cx="70" cy="70" r="54" fill="none" stroke="#f0f0f0" strokeWidth="12" />
            <circle
              cx="70" cy="70" r="54"
              fill="none"
              stroke={pct >= 100 ? '#34a853' : '#4285f4'}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${strokeDash} ${circumference}`}
              transform="rotate(-90 70 70)"
              style={{ transition: 'stroke-dasharray 0.5s ease' }}
            />
          </svg>
          <div className={styles.ringInner}>
            <span className={styles.ringPct}>{pct}%</span>
            <span className={styles.ringMin}>{weekTotal} นาที</span>
          </div>
        </div>
        <div className={styles.ringInfo}>
          <div className={styles.ringGoalRow}>
            <span className={styles.ringGoalLabel}>เป้าหมาย</span>
            <span className={styles.ringGoalVal}>{GOAL} นาที/สัปดาห์</span>
          </div>
          {pct >= 100 ? (
            <div className={styles.goalReached}>🎉 บรรลุเป้าหมายสัปดาห์นี้แล้ว!</div>
          ) : (
            <div className={styles.ringRemain}>เหลืออีก <strong>{remaining} นาที</strong></div>
          )}
          <div className={styles.todayRow}>
            <span>วันนี้</span>
            <span className={styles.todayVal}>{todayTotal} นาที</span>
          </div>
        </div>
      </div>

      {/* Weekly bar chart */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>รายวันสัปดาห์นี้</div>
        <div className={styles.weekBars}>
          {weekDays.map((d, i) => {
            const mins = data[d] || 0
            const isToday = d === todayKey
            const barH = Math.min((mins / 120) * 56, 56)
            return (
              <div key={d} className={styles.barCol}>
                <span className={styles.barMin}>{mins > 0 ? mins : ''}</span>
                <div className={styles.barTrack}>
                  <div
                    className={`${styles.barFill} ${isToday ? styles.barToday : ''}`}
                    style={{ height: `${barH}px` }}
                  />
                </div>
                <span className={`${styles.barLabel} ${isToday ? styles.barLabelToday : ''}`}>
                  {DAY_LABELS[i]}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick Add */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>เพิ่มวันนี้ — เลือกนาที</div>
        <div className={styles.quickGrid}>
          {QUICK_OPTIONS.map(m => (
            <button key={m} className={styles.quickBtn} onClick={() => addMinutes(m)}>
              +{m}
            </button>
          ))}
        </div>

        <div className={styles.customRow}>
          {showCustom ? (
            <>
              <input
                className={styles.customInput}
                type="number"
                placeholder="ระบุนาที..."
                value={customInput}
                onChange={e => setCustomInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCustom()}
                autoFocus
              />
              <button className={styles.customConfirm} onClick={handleCustom}>✓</button>
              <button className={styles.customCancel} onClick={() => setShowCustom(false)}>✕</button>
            </>
          ) : (
            <button className={styles.customToggle} onClick={() => setShowCustom(true)}>
              ✏️ ระบุเอง
            </button>
          )}
        </div>
      </div>

      {/* Undo today */}
      {todayTotal > 0 && (
        <div className={styles.section}>
          <button className={styles.undoBtn} onClick={undoToday}>
            ↩ รีเซ็ตวันนี้ ({todayTotal} นาที)
          </button>
        </div>
      )}

      <div style={{ height: 16 }} />
      </>
      )}
    </div>
  )
}

