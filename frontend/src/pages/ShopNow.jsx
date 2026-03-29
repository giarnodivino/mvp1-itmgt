import { useEffect, useState } from "react";
import { Link } from "react-router";
import { addToCart, getWatches } from "../services/api";
import "./ShopNow.css";

export default function ShopNowSection() {
  const [watches, setWatches] = useState([]);
  const [addingId, setAddingId] = useState(null);
  const [addedId, setAddedId] = useState(null);

  useEffect(() => {
    async function loadWatches() {
      try {
        const data = await getWatches();
        const watchList = Array.isArray(data) ? data : data.results || [];
        setWatches(watchList.slice(0, 4));
      } catch (error) {
        console.error("Failed to load watches:", error);
      }
    }

    loadWatches();
  }, []);

  async function handleAddToCart(watchId) {
    try {
      setAddingId(watchId);
      await addToCart(watchId);
      setAddedId(watchId);

      setTimeout(() => {
        setAddedId(null);
      }, 1800);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setAddingId(null);
    }
  }

  return (
    <section className="shop-now">
      <h2 className="shop-now__title section-heading-serif">Shop Now</h2>

      <div className="shop-now__grid">
        {watches.map((watch) => (
          <div key={watch.id} className="shop-now__card">
            <Link
              to={`/watches/${watch.id}`}
              className="shop-now__image-link"
            >
              <img
                className="shop-now__image"
                src={watch.image_url}
                alt={`${watch.brand} ${watch.model}`}
              />
            </Link>

            <div className="shop-now__meta">
              <h3 className="shop-now__name">{watch.model}</h3>
              <p className="shop-now__brand">{watch.brand}</p>
              <p className="shop-now__listings">1 Listing</p>
            </div>

            <button
              type="button"
              className="shop-now__button"
              onClick={() => handleAddToCart(watch.id)}
              disabled={addingId === watch.id}
            >
              {addingId === watch.id
                ? "Adding..."
                : addedId === watch.id
                ? "Added to cart"
                : "Add to cart"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}