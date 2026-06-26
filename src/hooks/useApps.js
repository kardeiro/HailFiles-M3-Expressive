import { useState, useEffect, useRef, useCallback } from 'react'
import { loadIndex, loadAppDetail, reloadAppDetail } from '../utils/api'

const PAGE_SIZE = 12

export function useApps() {
  const [allApps, setAllApps] = useState([])
  const [filteredApps, setFilteredApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({ total: 0, updated: '' })
  const [categories, setCategories] = useState({})

  const [currentCategory, setCurrentCategory] = useState('all')
  const [currentSearch, setCurrentSearch] = useState('')

  const [renderedCount, setRenderedCount] = useState(PAGE_SIZE)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const filteredRef = useRef([])

  useEffect(() => {
    filteredRef.current = filteredApps
  }, [filteredApps])

  const getCategories = useCallback((apps) => {
    const cats = {}
    apps.forEach(a => { const c = a.category || 'other'; cats[c] = (cats[c] || 0) + 1 })
    return cats
  }, [])

  const applyFilter = useCallback((apps, category, search) => {
    let filtered = apps
    if (category !== 'all') {
      filtered = filtered.filter(a => a.category === category)
    }
    if (search) {
      const q = search.toLowerCase()
      filtered = filtered.filter(a =>
        (a.name || '').toLowerCase().includes(q) ||
        (a.category || '').toLowerCase().includes(q)
      )
    }
    return filtered
  }, [])

  const fetchApps = useCallback(async (force = false) => {
    setLoading(true)
    setError(null)
    try {
      const data = await loadIndex(force)
      const apps = Array.isArray(data.apps) ? data.apps : []
      setAllApps(apps)
      setStats({ total: apps.length, updated: data.updated || '' })
      setCategories(getCategories(apps))

      const filtered = applyFilter(apps, currentCategory, currentSearch)
      setFilteredApps(filtered)
      setRenderedCount(filtered.length <= PAGE_SIZE ? filtered.length : PAGE_SIZE)

      return apps
    } catch (err) {
      setError(err.message)
      setFilteredApps([])
      return []
    } finally {
      setLoading(false)
    }
  }, [getCategories, applyFilter, currentCategory, currentSearch])

  useEffect(() => {
    fetchApps()
  }, [fetchApps])

  const filterApps = useCallback((category, search) => {
    const cat = category ?? currentCategory
    const searchText = search ?? currentSearch
    const filtered = applyFilter(allApps, cat, searchText)
    setFilteredApps(filtered)
    setRenderedCount(filtered.length <= PAGE_SIZE ? filtered.length : PAGE_SIZE)
  }, [allApps, currentCategory, currentSearch, applyFilter])

  useEffect(() => {
    filterApps()
  }, [allApps, currentCategory, currentSearch, filterApps])

  const handleCategoryChange = useCallback((category) => {
    setCurrentCategory(category)
  }, [])

  const handleSearchChange = useCallback((search) => {
    setCurrentSearch(search)
  }, [])

  const loadMore = useCallback(() => {
    if (renderedCount >= filteredRef.current.length) return
    setIsLoadingMore(true)
    setRenderedCount(prev => {
      const next = Math.min(prev + PAGE_SIZE, filteredRef.current.length)
      return next
    })
    requestAnimationFrame(() => setIsLoadingMore(false))
  }, [renderedCount])

  const refresh = useCallback(async () => {
    await fetchApps(true)
  }, [fetchApps])

  return {
    allApps,
    filteredApps,
    loading,
    error,
    stats,
    categories,
    currentCategory,
    currentSearch,
    renderedCount,
    isLoadingMore,
    handleCategoryChange,
    handleSearchChange,
    loadMore,
    refresh,
    loadAppDetail,
    reloadAppDetail
  }
}
