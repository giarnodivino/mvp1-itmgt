import heroWatch from "../assets/images/hero-watch.jpg";

export default function HomePage() {
  return (
    <div className="homepage">
      <section className="hero-section">
        <div className="hero-sidebar">
          <div className="location-mark">⟟</div>

          <div className="cta-group">
            <button className="outline-btn">Buy a Patek</button>
            <button className="outline-btn">Sell a Patek</button>
          </div>
        </div>

        <div
          className="hero-main"
          style={{ backgroundImage: `url(${heroWatch})` }}
        >
          <header className="topbar">
            <div className="brand">KRONOS</div>

            <div className="topbar-right">
              <div className="search-box">
                <span className="search-icon">⌕</span>
                <input type="text" placeholder="Search" />
              </div>

              <button className="icon-btn">🛒</button>
              <button className="icon-btn">☰</button>
            </div>
          </header>

          <div className="hero-copy">
            <h1>
              Curating legacies.
              <br />
              Restoring time.
            </h1>
          </div>
        </div>
      </section>

      <section className="shop-banner">
        <h2>Shop Now</h2>
      </section>
    </div>
  );
}