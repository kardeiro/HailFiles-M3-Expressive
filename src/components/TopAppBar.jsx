import { useRef } from 'react'

export default function TopAppBar({ theme, onToggleTheme, onRefresh }) {
  const refreshIconRef = useRef(null)

  const handleRefresh = async () => {
    if (refreshIconRef.current) refreshIconRef.current.classList.add('spin')
    try {
      await onRefresh()
    } finally {
      if (refreshIconRef.current) refreshIconRef.current.classList.remove('spin')
    }
  }

  return (
    <header className="top-app-bar" role="banner">
      <div className="top-app-bar-inner">
        <a href="/" className="top-app-bar-brand" aria-label="HailFiles - Página inicial">
          <span className="brand-icon" aria-hidden="true">
            <span className="material-symbols-outlined">folder_open</span>
          </span>
          HailFiles
        </a>
        <nav className="top-app-bar-nav" aria-label="Navegação">
          <button className="icon-button" onClick={handleRefresh} aria-label="Atualizar lista" title="Atualizar lista">
            <span className="material-symbols-outlined" ref={refreshIconRef}>refresh</span>
          </button>
          <button className="icon-button" onClick={onToggleTheme} aria-label="Alternar tema claro/escuro" title="Alternar tema">
            {theme === 'dark' ? (
              <span className="material-symbols-outlined">light_mode</span>
            ) : (
              <span className="material-symbols-outlined">dark_mode</span>
            )}
          </button>
        </nav>
      </div>
    </header>
  )
}
