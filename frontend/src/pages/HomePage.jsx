
import { Link } from "react-router";
import KronosHeader from "../components/KronosHeader";
import ShopNow from "./ShopNow";
import AboutSection from "./About";
import "./HomePage.css";
import heroWatch from "../assets/images/hero-watch.jpg";
import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";



export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [stats, setStats] = useState({ total_watches: 0, total_sellers: 0 });

  useEffect(() => {
    apiRequest('landing/')
      .then(data => {
        setFeatured(data.featured_watches);
        setStats(data.stats);
      })
      .catch(err => console.error("Error fetching landing data:", err));
  }, []);

  return (
    <div className="home-page">
      <section className="home-hero">
        
        <div className="home-hero__overlay">
          <div className="home-hero__cta">
            <div className="stats-banner">
              Currently hosting {stats.total_watches} luxury timepieces.
            </div>

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