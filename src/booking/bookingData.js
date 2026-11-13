// ----- Demo time slots (simulated split morning / evening schedule) -----
export const TIME_SLOTS = [
  '10:00',
  '10:45',
  '11:30',
  '12:15',
  '13:00',
  '16:00',
  '16:45',
  '17:30',
  '18:15',
  '19:00',
  '19:45',
  '20:30',
]

const STORAGE_KEY = 'fivepaws_bookings'

// Simple deterministic string hash → used to simulate which slots are "already booked".
function hashString(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

// Deterministic set of simulated-booked slots for a given date (demo only).
export function getSimulatedBooked(dateStr) {
  if (!dateStr) return new Set()
  const booked = new Set()
  const base = hashString(dateStr)
  TIME_SLOTS.forEach((slot, i) => {
    // ~35% of slots appear unavailable, stable per-date
    if ((hashString(dateStr + slot) + base + i) % 100 < 35) {
      booked.add(slot)
    }
  })
  return booked
}

// ----- localStorage persistence -----
export function loadBookings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveBooking(booking) {
  try {
    const all = loadBookings()
    all.push(booking)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  } catch {
    /* storage unavailable — demo still works in-session */
  }
}

export function isSlotTakenBySession(dateStr, time) {
  return loadBookings().some(
    (b) => b.schedule?.date === dateStr && b.schedule?.time === time,
  )
}

export function getLastBooking() {
  const all = loadBookings()
  return all.length ? all[all.length - 1] : null
}

// ----- Helpers -----
export function todayISO() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  const tz = d.getTimezoneOffset() * 60000
  return new Date(d - tz).toISOString().slice(0, 10)
}

export function makeRef() {
  const n = Math.floor(100000 + Math.random() * 900000)
  return `FPC-${n}`
}

export function formatDate(dateStr, locale = 'en') {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

// ----- Validators -----
export function isValidPhone(phone) {
  if (!phone) return false
  const digits = phone.replace(/[^\d]/g, '')
  return /^[+\d][\d\s()+-]{6,}$/.test(phone.trim()) && digits.length >= 8 && digits.length <= 15
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())
}
