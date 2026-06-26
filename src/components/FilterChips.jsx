const CHIPS = [
  { category: 'all', icon: 'folder', label: 'Todos', countId: 'all' },
  { category: 'apps', icon: 'apps', label: 'Apps', countId: 'apps' },
  { category: 'music', icon: 'music_note', label: 'Música', countId: 'music' },
  { category: 'gallery', icon: 'photo_library', label: 'Galeria', countId: 'gallery' },
]

export default function FilterChips({ categories, currentCategory, onCategoryChange, total }) {
  const getCount = (cat) => {
    if (cat === 'all') return total
    return categories[cat] || 0
  }

  return (
    <div className="chips" role="tablist" aria-label="Categorias">
      {CHIPS.map(chip => (
        <button
          key={chip.category}
          className={`chip${currentCategory === chip.category ? ' active' : ''}`}
          data-category={chip.category}
          role="tab"
          aria-selected={currentCategory === chip.category}
          onClick={() => onCategoryChange(chip.category)}
        >
          <span className="material-symbols-outlined">{chip.icon}</span>
          {chip.label}
          <span className="chip-count">{getCount(chip.category)}</span>
        </button>
      ))}
    </div>
  )
}
