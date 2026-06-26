export default function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton-row">
        <div className="skeleton skeleton-icon"></div>
        <div style={{ flex: 1 }}>
          <div className="skeleton skeleton-line title"></div>
          <div className="skeleton skeleton-line short"></div>
        </div>
      </div>
      <div className="skeleton skeleton-line long"></div>
      <div className="skeleton skeleton-line long"></div>
      <div className="skeleton skeleton-btn"></div>
    </div>
  )
}
