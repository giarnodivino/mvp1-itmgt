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
  
  // State for the success notification
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    async function loadWatch() {
      setLoading(true);
      try {
        const data = await getWatchById(id);
        setWatch(data);
      } catch (err) {
        console.error("Error loading watch details:", err);
        setError("Unable to load watch details.");
      } finally {
        setLoading(false);
      }
    }
    loadWatch();
  }, [id]);

  async function handleAddToCart() {
    if (!watch) return;
    try {
      await addToCart(watch.id);
      
      // TRIGGER SUCCESS MESSAGE
      setShowSuccess(true);
      
      // Hide message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  }

  if (loading) {
    return (
      <div className="page-shell watch-detail-page">
        <KronosHeader />
        <div className="watch-detail__loading">
          <p>Loading luxury timepieces...</p>
        </div>
      </div>
    );
  }

  if (error || !watch) {
    return (
      <div className="page-shell watch-detail-page">
        <KronosHeader />
        <div className="watch-detail__error">
          <p>{error || "Watch not found."}</p>
          <Link to="/shopnow" className="kronos-pill-outline">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell watch-detail-page">
      <KronosHeader />

      {/* POPUP NOTIFICATION */}
      {showSuccess && (
        <div className="cart-notification-popup">
          <p>✓ {watch.brand} {watch.model} added to cart!</p>
          <Link to="/cart">View Cart</Link>
        </div>
      )}

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
            {watch.image_url ? (
              <img src={watch.image_url} alt={`${watch.brand} ${watch.model}`} />
            ) : (
              <div className="image-placeholder">No Image Available</div>
            )}
          </div>

          <div className="watch-detail__meta-box">
            <div className="watch-detail__meta-card">
              <span>Seller</span>
              <strong>{watch.seller_name || "Official Dealer"}</strong>
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

          {watch.verification && (
            <VerificationBadges verification={watch.verification} />
          )}

          <div className="watch-detail__description-section">
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
              <span>SKU</span>
              <strong>{watch.sku}</strong>
            </div>
          </div>

          <div className="watch-detail__actions">
            <button type="button" className="kronos-pill" onClick={handleAddToCart}>
              {showSuccess ? "Added!" : "Add to Cart"}
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