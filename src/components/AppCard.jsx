import { escapeHtml, resolveDbUrl } from '../utils/helpers'

export default function AppCard({ app, index, onClick }) {
  return (
    <button
      className="card"
      role="listitem"
      data-app-id={app.id}
      style={{ '--enter-idx': index }}
      onClick={() => onClick(app.id)}
    >
      <div className="card-body">
        <div className="card-row">
          <img
            className="card-icon"
            src={escapeHtml(resolveDbUrl(app.icon))}
            alt=""
            width="64"
            height="64"
            loading="lazy"
            onError={e => { e.target.style.opacity = '0.2' }}
          />
          <div className="card-info">
            <div className="card-title">{escapeHtml(app.name || '')}</div>
            <div className="card-meta">
              {app.version ? <span className="meta-badge primary">v{escapeHtml(app.version)}</span> : null}
              {app.size ? <span className="meta-badge">{escapeHtml(app.size)}</span> : null}
              {app.category ? <span className="meta-badge">{escapeHtml(app.category)}</span> : null}
            </div>
          </div>
        </div>
        <div className="card-actions">
          <span className="btn btn-tonal btn-small" tabIndex="-1">
            <span className="material-symbols-outlined">visibility</span>
            Ver detalhes
          </span>
        </div>
      </div>
    </button>
  )
}
