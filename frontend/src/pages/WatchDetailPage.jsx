import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { getWatchById, addToCart } from "../services/api";
import KronosHeader from "../components/KronosHeader";
import VerificationBadges from "../components/VerificationBadges";
import "./WatchDetailPage.css";

export default function WatchDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [watch, setWatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadWatch() {
      setLoading(true);
      try {
        const data = await getWatchById(id);
        setWatch(data);
      } catch (err) {
        setError("Unable to load watch details.");
      } finally {
        setLoading(false);
      }
    }
    loadWatch();
  }, [id]);

  async function handleAddToCart() {
    await addToCart(watch.id);
    navigate("/cart");
  }

  if (loading) {
    return (
      <div className="page-shell watch-detail-page">
        <p>Loading watch details…</p>
      </div>
    );
  }

  if (error || !watch) {
    return (
      <div className="page-shell watch-detail-page">
        <p>{error || "Watch not found."}</p>
        <Link to="/shopnow" className="kronos-pill-outline">
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="page-shell watch-detail-page">
      <KronosHeader />

      <div className="watch-detail__breadcrumb">
        <Link to="/">Home</Link>
        <span>›</span>
        <Link to="/shopnow">Shop Now</Link>
        <span>›</span>
        <span>{watch.model}</span>
      </div>

      <div className="watch-detail__container">
        <aside className="watch-detail__media kronos-card">
          <div className="watch-detail__image-wrapper">
            <img src={watch.image_url} alt={`${watch.brand} ${watch.model}`} />
          </div>

          <div className="watch-detail__meta-box">
            <div className="watch-detail__meta-card">
              <span>Seller</span>
              <strong>{watch.seller_name}</strong>
            </div>
            <div className="watch-detail__meta-card">
              <span>Condition</span>
              <strong>{watch.condition}</strong>
            </div>
          </div>
        </aside>

        <section className="watch-detail__content kronos-card">
          <div className="watch-detail__heading">
            <div>
              <h1 className="watch-detail__title">
                {watch.brand} {watch.model}
              </h1>
              <p className="watch-detail__subtitle">Reference No. {watch.reference_number}</p>
            </div>
            <div>
              <div className="watch-detail__price">₱{watch.price}</div>
              <div className="watch-detail__status">Available</div>
            </div>
          </div>

          <VerificationBadges verification={watch.verification} />

          <div>
            <h2 className="watch-detail__section-heading">Description</h2>
            <p className="watch-detail__description">{watch.description}</p>
          </div>

          <div className="watch-detail__specs">
            <div className="watch-detail__spec">
              <span>Brand</span>
              <strong>{watch.brand}</strong>
            </div>
            <div className="watch-detail__spec">
              <span>Model</span>
              <strong>{watch.model}</strong>
            </div>
            <div className="watch-detail__spec">
              <span>Reference</span>
              <strong>{watch.reference_number}</strong>
            </div>
            <div className="watch-detail__spec">
              <span>Seller</span>
              <strong>{watch.seller_name}</strong>
            </div>
          </div>

          <div className="watch-detail__actions">
            <button type="button" className="kronos-pill" onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button type="button" className="kronos-pill-outline" onClick={() => navigate("/shopnow")}>
              Continue Browsing
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
