const DB_BASE = 'https://raw.githubusercontent.com/kardeiro/HailFiles-Database/main'

export function escapeHtml(str) {
  if (typeof str !== 'string') return ''
  return str.replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]))
}

export function resolveDbUrl(path) {
  if (!path) return ''
  if (/^https?:\/\//.test(path)) return path
  return DB_BASE + '/' + path.replace(/^\/+/, '')
}

export function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T12:00:00')
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })
}

export { DB_BASE }
