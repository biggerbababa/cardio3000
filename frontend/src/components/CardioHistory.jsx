import { useState, useEffect } from 'react'
import { getWeekLogs } from '../services/api'
import styles from './CardioHistory.module.css'

const GOAL = 300
const DAY_LABELS = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา']

function getPastWeeks(count) {
  const weeks = []
  const now = new Date()
  const day = now.getDay()
  const diffToMonday = day === 0 ? -6 : 1 - day

  for (let w = 0; w < count; w++) {
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now)
      d.setDate(now.getDate() + diffToMonday + i - w * 7)
      return d.toISOString().slice(0, 10)
    })
    weeks.push(weekDays)
  }
  return weeks
}

function formatWeekLabel(weekDays) {
  const start = new Date(weekDays[0])
  const end = new Date(weekDays[6])
  const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
  const startStr = `${start.getDate()} ${months[start.getMonth()]}`
  const endStr = `${end.getDate()} ${months[end.getMonth()]} ${end.getFullYear()}`
  return `${startStr} – ${endStr}`
}

export default function CardioHistory() {
  const [weeks] = useState(() => getPastWeeks(8))
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)
  const todayKey = new Date().toISOString().slice(0, 10)

  useEffect(() => {
    const allDates = weeks.flat()
    getWeekLogs(allDates)
      .then(result => setData(result))
      .catch(err => console.error('History fetch error:', err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className={styles.loadingWrap}>
        <div className={styles.loadingSpinner} />
        <p>กำลังโหลดประวัติ...</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <p className={styles.subtitle}>ย้อนหลัง 8 สัปดาห์</p>

      {weeks.map((weekDays, wi) => {
        const total = weekDays.reduce((s, d) => s + (data[d] || 0), 0)
        const pct = Math.min(Math.round((total / GOAL) * 100), 100)
        const isCurrentWeek = wi === 0
        const maxBar = Math.max(...weekDays.map(d => data[d] || 0), 1)

        return (
          <div key={weekDays[0]} className={`${styles.weekCard} ${isCurrentWeek ? styles.currentWeek : ''}`}>
            <div className={styles.weekHeader}>
              <div>
                {isCurrentWeek && <span className={styles.badge}>สัปดาห์นี้</span>}
                <span className={styles.weekLabel}>{formatWeekLabel(weekDays)}</span>
              </div>
              <div className={styles.weekTotal}>
                <span className={`${styles.totalMin} ${pct >= 100 ? styles.goalDone : ''}`}>
                  {total} นาที
                </span>
                <span className={styles.totalPct}>{pct}%</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className={styles.progressTrack}>
              <div
                className={`${styles.progressFill} ${pct >= 100 ? styles.progressDone : ''}`}
                style={{ width: `${pct}%` }}
              />
            </div>

            {/* Day bars */}
            <div className={styles.dayBars}>
              {weekDays.map((d, i) => {
                const mins = data[d] || 0
                const barH = maxBar > 0 ? Math.round((mins / maxBar) * 48) : 0
                const isToday = d === todayKey
                return (
                  <div key={d} className={styles.dayCol}>
                    <span className={styles.dayMin}>{mins > 0 ? mins : ''}</span>
                    <div className={styles.barTrack}>
                      <div
                        className={`${styles.barFill} ${isToday ? styles.barToday : ''}`}
                        style={{ height: `${barH}px` }}
                      />
                    </div>
                    <span className={`${styles.dayLabel} ${isToday ? styles.dayLabelToday : ''}`}>
                      {DAY_LABELS[i]}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      <div style={{ height: 24 }} />
    </div>
  )
}
