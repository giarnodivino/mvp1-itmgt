import { Link } from "react-router";
import KronosHeader from "../components/KronosHeader";
import "./HomePage.css";
import heroWatch from "../assets/images/hero-watch.jpg";

export default function HomePage() {
  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero__overlay">
          <div className="home-hero__cta">
            <button type="button" className="kronos-pill-outline">
              Buy a Patek
            </button>
            <button type="button" className="kronos-pill-outline">
              Sell a Patek
            </button>
          </div>
        </div>

        <div
          className="home-hero__bg"
          style={{ backgroundImage: `url(${heroWatch})` }}
        >
          <div className="home-hero__header">
            <KronosHeader overlay />
          </div>

          <div className="home-hero__content">
            <h1 className="home-hero__copy section-heading-serif">
              Curating legacies.
              <br />
              Restoring time.
            </h1>
          </div>
        </div>
      </section>

      <section className="home-shop-banner">
        <h2 className="home-shop-banner__title">Shop Now</h2>
        <div style={{ marginTop: "20px" }}>
          <Link to="/checkout" style={{ color: "#fff", fontFamily: "Arial, Helvetica, sans-serif" }}>
            Go to checkout prototype
          </Link>
        </div>
      </section>
    </div>
  );
}