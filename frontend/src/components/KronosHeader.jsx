export default function KronosHeader({ overlay = false }) {
  return (
    <header className={`kronos-header ${overlay ? "kronos-header--overlay" : ""}`}>
      <div className="kronos-header__location">⚲</div>

      <div className="kronos-header__brand" >KRONOS</div>

      <div className="kronos-header__actions">
        <div className="kronos-search">
          <span className="kronos-search__icon">⌕</span>
          <input type="text" placeholder="Search" />
        </div>

        <button type="button" href="/cart" className="kronos-icon-btn" aria-label="Cart">
          🛒
        </button>
        <button type="button" className="kronos-icon-btn" aria-label="Menu">
          ☰
        </button>
      </div>
    </header>
  );
}