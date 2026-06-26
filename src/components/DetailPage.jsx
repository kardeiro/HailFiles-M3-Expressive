import { useState, useEffect, useRef, useCallback } from 'react'
import { escapeHtml, resolveDbUrl, formatDate } from '../utils/helpers'
import { loadAppDetail } from '../utils/api'

export default function DetailPage({ appId, allApps, onClose, onReload }) {
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const lastFocusedRef = useRef(null)
  const scrollRef = useRef(null)
  const openRef = useRef(false)

  const fetchDetail = useCallback(async (id) => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const data = await loadAppDetail(id)
      setDetail(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!appId) return
    openRef.current = true
    lastFocusedRef.current = document.activeElement
    document.body.style.overflow = 'hidden'

    if (history.state?.view !== 'detail' || history.state?.id !== appId) {
      history.pushState({ view: 'detail', id: appId }, '', '#app/' + encodeURIComponent(appId))
    }

    fetchDetail(appId)

    return () => {
      openRef.current = false
      document.body.style.overflow = ''
    }
  }, [appId, fetchDetail])

  useEffect(() => {
    const handlePopState = (e) => {
      if (openRef.current && (!e.state || e.state.view !== 'detail')) {
        onClose()
      }
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && openRef.current) {
        onClose()
      }
    }

    const handleShare = async () => {
      if (!detail) return
      const shareData = {
        title: detail.name || 'HailFiles',
        text: detail.description || '',
        url: detail.file || (Array.isArray(detail.mirrors) && detail.mirrors[0]?.url) || window.location.href
      }
      try {
        if (navigator.share) {
          await navigator.share(shareData)
        } else {
          await navigator.clipboard.writeText(shareData.url)
        }
      } catch (_) {}
    }

    const shareBtn = document.getElementById('detailShareBtn')
    if (shareBtn) shareBtn.addEventListener('click', handleShare)

    window.addEventListener('popstate', handlePopState)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('popstate', handlePopState)
      document.removeEventListener('keydown', handleKeyDown)
      if (shareBtn) shareBtn.removeEventListener('click', handleShare)
    }
  }, [onClose, detail])

  const handleReload = async () => {
    if (!appId) return
    const icon = document.querySelector('#detailReloadBtn .material-symbols-outlined')
    if (icon) icon.classList.add('spin')
    try {
      const fresh = await onReload(appId)
      setDetail(fresh)
    } catch (err) {
      setError(err.message)
    } finally {
      if (icon) icon.classList.remove('spin')
    }
  }

  const indexEntry = allApps.find(a => a.id === appId) || {}

  if (!appId) return null

  return (
    <aside className="detail-page open" role="dialog" aria-modal="true" aria-labelledby="detailPageTitle" aria-hidden="false">
      <header className="detail-top-bar">
        <button className="icon-button" onClick={onClose} aria-label="Voltar">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="detail-top-bar-title" id="detailPageTitle">
          {loading ? 'Carregando…' : detail?.name || indexEntry.name || 'Detalhes'}
        </div>
        <button className="icon-button" id="detailShareBtn" aria-label="Compartilhar">
          <span className="material-symbols-outlined">share</span>
        </button>
        <button className="icon-button" id="detailReloadBtn" aria-label="Recarregar detalhes" onClick={handleReload}>
          <span className="material-symbols-outlined">refresh</span>
        </button>
      </header>
      <div className="detail-scroll" ref={scrollRef}>
        {loading && !detail ? (
          <div className="detail-content">
            <div className="detail-loading">
              <span className="material-symbols-outlined">progress_activity</span>
              <p>Carregando detalhes…</p>
            </div>
          </div>
        ) : error && !detail ? (
          <div className="detail-content">
            <div className="detail-error">
              <span className="material-symbols-outlined">cloud_off</span>
              <h3>Erro ao carregar</h3>
              <p>Não foi possível carregar os detalhes deste app. Verifique sua conexão e tente novamente.</p>
            </div>
          </div>
        ) : detail ? (
          <DetailContent app={detail} indexEntry={indexEntry} />
        ) : null}
      </div>
    </aside>
  )
}

function DetailContent({ app, indexEntry }) {
  const iconUrl = resolveDbUrl(app.icon || indexEntry.icon)
  const screenshots = (app.screenshots || []).map(resolveDbUrl)
  const description = app.longDescription || app.description || ''
  const changelog = app.changelog || []
  const permissions = app.permissions || []
  const tags = app.tags || []
  const mirrors = Array.isArray(app.mirrors) ? app.mirrors : []
  const requiresShizuku = app.requiresShizuku === true
  const website = app.website || ''
  const sourceCode = app.sourceCode || ''

  const primaryUrl = app.file || (mirrors.length ? mirrors[0].url : '')
  const primaryLabel = app.file ? 'Baixar APK' : (mirrors.length ? 'Baixar (' + mirrors[0].label + ')' : '')

  const mirrorsToShow = app.file ? mirrors : mirrors.slice(1)

  return (
    <div className="detail-content">
      <div className="detail-hero">
        <img className="detail-hero-icon" src={escapeHtml(iconUrl)} alt="" loading="lazy" onError={e => { e.target.style.opacity = '0.2' }} />
        <div className="detail-hero-info">
          <h2 className="detail-hero-title">{escapeHtml(app.name || indexEntry.name || '')}</h2>
          {app.author ? <div className="detail-hero-author">por {escapeHtml(app.author)}</div> : null}
          <div className="detail-hero-badges">
            {app.version ? <span className="meta-badge primary">v{escapeHtml(app.version)}</span> : null}
            {app.size ? <span className="meta-badge">{escapeHtml(app.size)}</span> : null}
            {app.category ? <span className="meta-badge">{escapeHtml(app.category)}</span> : null}
            {app.updated ? <span className="meta-badge">{escapeHtml(formatDate(app.updated))}</span> : null}
          </div>
        </div>
      </div>

      {requiresShizuku ? (
        <div className="requirement-banner" role="note">
          <span className="material-symbols-outlined">verified_user</span>
          <div className="requirement-banner-text">
            <strong>Requer Shizuku.</strong> Este app precisa do Shizuku ativo no dispositivo para realizar operações avançadas sem root. Instale e ative o Shizuku antes de usar.
          </div>
        </div>
      ) : null}

      <div className="detail-actions">
        {primaryUrl ? (
          <a className="btn btn-filled btn-primary" href={escapeHtml(primaryUrl)} target="_blank" rel="noopener noreferrer">
            <span className="material-symbols-outlined">download</span>
            {escapeHtml(primaryLabel)}
          </a>
        ) : (
          <span className="btn btn-tonal btn-primary" style={{ opacity: 0.6, cursor: 'not-allowed' }}>
            <span className="material-symbols-outlined">link_off</span>
            Indisponível
          </span>
        )}
        {website ? (
          <a className="btn btn-outline btn-secondary" href={escapeHtml(website)} target="_blank" rel="noopener noreferrer">
            <span className="material-symbols-outlined">language</span>
            Site
          </a>
        ) : null}
        {sourceCode ? (
          <a className="btn btn-outline btn-secondary" href={escapeHtml(sourceCode)} target="_blank" rel="noopener noreferrer">
            <span className="material-symbols-outlined">code</span>
            Código
          </a>
        ) : null}
      </div>

      {mirrorsToShow.length > 0 ? (
        <div className="mirrors-section">
          <div className="mirrors-label">Espelhos de download</div>
          <div className="mirrors-list">
            {mirrorsToShow.map(m => (
              <a key={m.url} className="mirror-btn" href={escapeHtml(m.url)} target="_blank" rel="noopener noreferrer">
                <span className="material-symbols-outlined">cloud_download</span>
                {escapeHtml(m.label || m.id || 'Mirror')}
              </a>
            ))}
          </div>
        </div>
      ) : null}

      {description ? (
        <div className="detail-section">
          <h3 className="detail-section-title">
            <span className="material-symbols-outlined">description</span>
            Sobre
          </h3>
          <div className="detail-section-body">{escapeHtml(description)}</div>
        </div>
      ) : null}

      {screenshots.length > 0 ? (
        <div className="detail-section">
          <h3 className="detail-section-title">
            <span className="material-symbols-outlined">photo_library</span>
            Screenshots
          </h3>
          <div className="screenshots">
            {screenshots.map((src, i) => (
              <img key={i} className="screenshot" src={escapeHtml(src)} alt={`Screenshot de ${escapeHtml(app.name || '')}`} loading="lazy" />
            ))}
          </div>
        </div>
      ) : null}

      <div className="detail-section">
        <h3 className="detail-section-title">
          <span className="material-symbols-outlined">info</span>
          Informações
        </h3>
        <div className="info-grid">
          {app.version ? <InfoCard label="Versão" value={app.version} /> : null}
          {app.size ? <InfoCard label="Tamanho" value={app.size} /> : null}
          {app.updated ? <InfoCard label="Atualizado" value={formatDate(app.updated)} /> : null}
          {app.minAndroid ? <InfoCard label="Requer" value={app.minAndroid} /> : null}
          {app.language ? <InfoCard label="Idioma" value={app.language} /> : null}
          {app.author ? <InfoCard label="Autor" value={app.author} /> : null}
          {app.category ? <InfoCard label="Categoria" value={app.category} /> : null}
          {typeof app.downloads === 'number' ? <InfoCard label="Downloads" value={app.downloads.toLocaleString('pt-BR')} /> : null}
        </div>
      </div>

      {permissions.length > 0 ? (
        <div className="detail-section">
          <h3 className="detail-section-title">
            <span className="material-symbols-outlined">lock</span>
            Permissões
          </h3>
          <ul className="permissions-list">
            {permissions.map((p, i) => (
              <li key={i} className="permission-pill">
                <span className="material-symbols-outlined">check</span>
                {escapeHtml(p)}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {changelog.length > 0 ? (
        <div className="detail-section">
          <h3 className="detail-section-title">
            <span className="material-symbols-outlined">history</span>
            Novidades
          </h3>
          {changelog.map((entry, i) => (
            <div key={i} className="changelog-entry">
              <div className="changelog-version">v{escapeHtml(entry.version)}</div>
              <div className="changelog-date">{escapeHtml(formatDate(entry.date))}</div>
              <ul className="changelog-changes">
                {(entry.changes || []).map((c, j) => (
                  <li key={j}>{escapeHtml(c)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : null}

      {tags.length > 0 ? (
        <div className="detail-section">
          <h3 className="detail-section-title">
            <span className="material-symbols-outlined">label</span>
            Tags
          </h3>
          <div className="tags-list">
            {tags.map((t, i) => (
              <span key={i} className="tag">{escapeHtml(t)}</span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function InfoCard({ label, value }) {
  return (
    <div className="info-card">
      <div className="info-card-label">{label}</div>
      <div className="info-card-value">{value}</div>
    </div>
  )
}
