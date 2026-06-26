export default function Hero({ searchValue, onSearchChange, onClearSearch }) {
  return (
    <section className="hero">
      <h1>Seus arquivos, centralizados.</h1>
      <p>HailFiles organiza seus aplicativos, músicas, galerias e muito mais em um só lugar. Fácil de navegar, fácil de baixar.</p>
      <div className="search-container" role="search">
        <span className="material-symbols-outlined search-icon">search</span>
        <input
          type="search"
          placeholder="Buscar arquivos..."
          aria-label="Buscar arquivos"
          autoComplete="off"
          value={searchValue}
          onChange={e => onSearchChange(e.target.value)}
        />
        <button
          className={`search-clear${searchValue ? ' visible' : ''}`}
          onClick={onClearSearch}
          aria-label="Limpar busca"
          tabIndex={searchValue ? 0 : -1}
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
    </section>
  )
}
