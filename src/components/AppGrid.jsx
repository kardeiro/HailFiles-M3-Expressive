import { useEffect, useRef, useCallback } from 'react'
import AppCard from './AppCard'
import SkeletonCard from './SkeletonCard'

export default function AppGrid({ apps, loading, error, renderedCount, onLoadMore, onOpenDetail }) {
  const sentinelRef = useRef(null)

  const handleIntersect = useCallback((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        onLoadMore()
      }
    })
  }, [onLoadMore])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const io = new IntersectionObserver(handleIntersect, { rootMargin: '300px' })
    io.observe(el)
    return () => io.disconnect()
  }, [handleIntersect])

  if (loading && apps.length === 0) {
    return (
      <div className="content">
        <div className="app-grid" role="list">
          {Array.from({ length: 6 }, (_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    )
  }

  if (error && apps.length === 0) {
    return (
      <div className="content">
        <div className="app-grid" role="list">
          <div className="empty-state">
            <div className="empty-icon-wrap" aria-hidden="true">
              <span className="material-symbols-outlined">cloud_off</span>
            </div>
            <h3>Erro ao carregar</h3>
            <p>Não foi possível carregar a lista de arquivos. Verifique sua conexão e tente novamente.</p>
          </div>
        </div>
      </div>
    )
  }

  const visibleApps = apps.slice(0, renderedCount)

  return (
    <div className="content">
      <div className="app-grid" role="list">
        {visibleApps.length === 0 && !loading ? (
          <div className="empty-state">
            <div className="empty-icon-wrap" aria-hidden="true">
              <span className="material-symbols-outlined">search_off</span>
            </div>
            <h3>Nenhum resultado</h3>
            <p>Tente ajustar sua busca ou categoria.</p>
          </div>
        ) : (
          visibleApps.map((app, i) => (
            <AppCard key={app.id} app={app} index={i} onClick={onOpenDetail} />
          ))
        )}
      </div>
      <div className="load-more-sentinel" ref={sentinelRef}></div>
    </div>
  )
}
