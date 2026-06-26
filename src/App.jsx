import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { useTheme } from './hooks/useTheme'
import { useApps } from './hooks/useApps'
import { loadAppDetail, reloadAppDetail } from './utils/api'
import TopAppBar from './components/TopAppBar'
import StatsBar from './components/StatsBar'
import Hero from './components/Hero'
import FilterChips from './components/FilterChips'
import AppGrid from './components/AppGrid'
import Footer from './components/Footer'
import DetailPage from './components/DetailPage'

export default function App() {
  const { theme, toggleTheme } = useTheme()
  const {
    allApps, filteredApps, loading, error, stats, categories,
    currentCategory, currentSearch, renderedCount,
    handleCategoryChange, handleSearchChange, loadMore, refresh
  } = useApps()

  const [searchInput, setSearchInput] = useState('')
  const [selectedAppId, setSelectedAppId] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)
  const [fabVisible, setFabVisible] = useState(false)
  const toastTimerRef = useRef(null)
  const mainRef = useRef(null)

  const showToast = useCallback((msg) => {
    setToastMessage(msg)
    clearTimeout(toastTimerRef.current)
    toastTimerRef.current = setTimeout(() => setToastMessage(null), 3000)
  }, [])

  const debounceRef = useRef(null)
  const handleSearchInput = useCallback((value) => {
    setSearchInput(value)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      handleSearchChange(value.trim())
    }, 200)
  }, [handleSearchChange])

  const handleOpenDetail = useCallback((id) => {
    setSelectedAppId(id)
  }, [])

  const handleCloseDetail = useCallback(() => {
    setSelectedAppId(null)
  }, [])

  const handleRefresh = useCallback(async () => {
    try {
      await refresh()
      showToast('Lista atualizada!')
    } catch {
      showToast('Erro ao atualizar. Tente novamente.')
    }
  }, [refresh, showToast])

  const handleReloadDetail = useCallback(async (id) => {
    return reloadAppDetail(id)
  }, [])

  const handleScrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const onScroll = () => {
      setFabVisible(window.scrollY > 400)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const memoCategories = useMemo(() => categories, [categories])
  const toastIcon = toastMessage?.includes('atualizada') || toastMessage?.includes('atualizados')
    ? 'check_circle' : toastMessage?.includes('Erro') ? 'error' : 'info'

  return (
    <>
      <a className="skip-link" href="#main-content">Pular para o conteúdo</a>

      <TopAppBar
        theme={theme}
        onToggleTheme={toggleTheme}
        onRefresh={handleRefresh}
      />

      <StatsBar
        total={stats.total}
        lastUpdateDate={stats.updated}
        apps={allApps}
      />

      <main id="main-content" ref={mainRef}>
        <Hero
          searchValue={searchInput}
          onSearchChange={handleSearchInput}
          onClearSearch={() => {
            setSearchInput('')
            handleSearchChange('')
          }}
        />

        <FilterChips
          categories={memoCategories}
          currentCategory={currentCategory}
          onCategoryChange={handleCategoryChange}
          total={stats.total}
        />

        <AppGrid
          apps={filteredApps}
          loading={loading}
          error={error}
          renderedCount={renderedCount}
          onLoadMore={loadMore}
          onOpenDetail={handleOpenDetail}
        />
      </main>

      <Footer />

      <DetailPage
        appId={selectedAppId}
        allApps={allApps}
        onClose={handleCloseDetail}
        onReload={handleReloadDetail}
        showToast={showToast}
      />

      <button
        className={`fab${fabVisible ? ' visible' : ''}`}
        onClick={handleScrollToTop}
        aria-label="Voltar ao topo"
        title="Voltar ao topo"
      >
        <span className="material-symbols-outlined">arrow_upward</span>
      </button>

      <div className={`toast${toastMessage ? ' show' : ''}`} role="alert" aria-live="assertive" aria-atomic="true">
        {toastMessage && <span className="material-symbols-outlined">{toastIcon}</span>}
        {toastMessage}
      </div>
    </>
  )
}
