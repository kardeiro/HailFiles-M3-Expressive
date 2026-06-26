import { DB_BASE } from './helpers'

const CACHE_KEY = 'hailfiles-index-v1'
const CACHE_TTL_MS = 60 * 60 * 1000

export async function loadIndex(force = false) {
  if (!force) {
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null')
      if (cached && cached.timestamp && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
        return cached.data
      }
    } catch (_) {}
  }

  const INDEX_URL = DB_BASE + '/index.json'
  const res = await fetch(INDEX_URL, { cache: 'no-cache' })
  if (!res.ok) throw new Error('HTTP ' + res.status)
  const data = await res.json()
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data }))
  } catch (_) {}
  return data
}

export async function loadAppDetail(id) {
  const url = DB_BASE + '/apps/' + encodeURIComponent(id) + '.json'
  const res = await fetch(url)
  if (!res.ok) throw new Error('HTTP ' + res.status)
  return res.json()
}

export async function reloadAppDetail(id) {
  const url = DB_BASE + '/apps/' + encodeURIComponent(id) + '.json?_=' + Date.now()
  const res = await fetch(url)
  if (!res.ok) throw new Error('HTTP ' + res.status)
  return res.json()
}
