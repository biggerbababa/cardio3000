/**
 * api.js — Frontend API service
 * Communicates with NestJS backend using JWT stored in localStorage
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const TOKEN_KEY = 'cardio_jwt'
const USER_KEY = 'cardio_user'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function getSavedUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY))
  } catch {
    return null
  }
}

export function saveUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

/** Returns true if JWT exists and is not expired */
export function isTokenValid() {
  const token = getToken()
  if (!token) return false
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 > Date.now()
  } catch {
    return false
  }
}

async function request(path, options = {}) {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(err.message || 'Request failed')
  }

  return res.json()
}

// ── Auth ────────────────────────────────────────────────────────────────────

/**
 * Login with Google access token → returns { accessToken, user }
 */
export async function loginWithGoogle(googleAccessToken) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ accessToken: googleAccessToken }),
  })
  setToken(data.accessToken)
  saveUser(data.user)
  return data.user
}

// ── Cardio ───────────────────────────────────────────────────────────────────

/**
 * Get this week's cardio logs
 * @param {string[]} weekDates  Array of "YYYY-MM-DD" strings (Mon–Sun)
 * @returns {Record<string, number>}  { "2026-04-28": 45, ... }
 */
export async function getWeekLogs(weekDates) {
  const q = weekDates.join(',')
  return request(`/cardio/week?dates=${encodeURIComponent(q)}`)
}

/**
 * Log cardio minutes for a date (upserts)
 * @param {string} date  "YYYY-MM-DD"
 * @param {number} minutes
 */
export async function logCardio(date, minutes) {
  return request('/cardio/log', {
    method: 'POST',
    body: JSON.stringify({ date, minutes }),
  })
}

/**
 * Reset cardio for a specific date to 0
 * @param {string} date  "YYYY-MM-DD"
 */
export async function resetDay(date) {
  return request(`/cardio/day/${date}`, { method: 'DELETE' })
}
