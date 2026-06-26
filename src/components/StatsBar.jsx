import { formatDate } from '../utils/helpers'

export default function StatsBar({ total, lastUpdateDate, apps }) {
  let displayDate = lastUpdateDate
  if (!displayDate && apps.length > 0) {
    const dates = apps
      .filter(a => a.updated)
      .map(a => new Date(a.updated + 'T12:00:00').getTime())
      .filter(t => !isNaN(t))
    if (dates.length > 0) {
      displayDate = formatDate(new Date(Math.max(...dates)).toISOString().slice(0, 10))
    }
  } else if (displayDate) {
    displayDate = formatDate(displayDate)
  }

  return (
    <div className="stats-bar" role="status" aria-live="polite">
      <div className="stats-bar-inner">
        <span className="stat">
          <span className="material-symbols-outlined">apps</span>
          <span className="stat-value">{total}</span> apps
        </span>
        {displayDate && (
          <span className="stat">
            <span className="material-symbols-outlined">schedule</span>
            <span className="stat-value">{displayDate}</span>
          </span>
        )}
      </div>
    </div>
  )
}
