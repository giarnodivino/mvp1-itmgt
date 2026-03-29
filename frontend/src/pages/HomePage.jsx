import { Link } from "react-router";
import KronosHeader from "../components/KronosHeader";
import ShopNow from "./ShopNow";
import AboutSection from "./About";
import "./HomePage.css";
import heroWatch from "../assets/images/hero-watch.jpg";

export default function HomePage() {
  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero__overlay">
          <div className="home-hero__cta">
            <Link to="/shopnow" className="kronos-pill-outline home-hero__cta-link">
              Buy a Patek
            </Link>

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
      <AboutSection /> {/* About section is underneath but ui looks ass right now */}
    </div>
  );
}