import { useEffect, useState } from "react";
import { Link } from "react-router";
import KronosHeader from "../components/KronosHeader";
import { getCart } from "../services/api";
import "./CartPage.css";

export default function CartPage() {
  const [cart, setCart] = useState(null);

  useEffect(() => {
    async function loadCart() {
      try {
        const data = await getCart();
        setCart(data);
      } catch (error) {
        console.error("Failed to load cart:", error);
      }
    }

    loadCart();
  }, []);

  if (!cart) {
    return (
      <div className="page-shell cart-page">
        <KronosHeader />

        <div className="cart-page__empty-state">
          <h1 className="cart-page__empty-title section-heading-serif">
            Cart is empty!
          </h1>

          <div className="cart-page__empty-actions">
            <Link to="/" className="cart-page__empty-button">
              Back to Home
            </Link>

            <Link to="/shopnow" className="cart-page__empty-button">
              Go to Shop Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const items = cart.items || [];
  const subtotal = cart.subtotal || cart.total_amount || "0.00";
  const shipping = cart.shipping || "100.00";
  const total = cart.total || cart.total_amount || "0.00";

  return (
    <div className="page-shell cart-page">
      <div className="cart-page__header">
        <KronosHeader />
      </div>

      <div className="cart-page__content">
        <div className="cart-page__left">
          <div className="cart-page__breadcrumb">
            <Link to="/">Home</Link>
            <span>›</span>
            <span>Shopping Cart</span>
          </div>

          <h1 className="cart-page__title section-heading-serif">Shopping Cart</h1>

          {items.length === 0 ? (
            <div className="cart-page__empty kronos-card">
              <p>Your cart is empty.</p>
              <Link to="/" className="cart-page__shop-link">
                Continue shopping
              </Link>
            </div>
          ) : (
            <div className="cart-list">
              {items.map((item) => (
                <div key={item.id} className="cart-item kronos-card">
                  <div className="cart-item__image-wrap">
                    {item.watch?.image_url ? (
                      <img
                        src={item.watch.image_url}
                        alt={`${item.watch.brand} ${item.watch.model}`}
                        className="cart-item__image"
                      />
                    ) : (
                      <div className="cart-item__image cart-item__image--placeholder">
                        ⌚
                      </div>
                    )}
                  </div>

                  <div className="cart-item__details">
                    <h2 className="cart-item__name">
                      {item.watch?.brand} {item.watch?.model}
                    </h2>

                    {item.watch?.reference_number && (
                      <p className="cart-item__ref">{item.watch.reference_number}</p>
                    )}

                    {item.watch?.sku && (
                      <p className="cart-item__sku">SKU: {item.watch.sku}</p>
                    )}

                    <p className="cart-item__price">₱{item.watch?.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="cart-page__right">
          <div className="cart-summary kronos-card">
            <h2 className="cart-summary__title">Order Summary</h2>

            <div className="cart-summary__line">
              <span>Subtotal</span>
              <span>₱ {subtotal}</span>
            </div>

            <div className="cart-summary__line">
              <span>Shipping</span>
              <span>₱ {shipping}</span>
            </div>

            <hr />

            <div className="cart-summary__line cart-summary__line--total">
              <span>Total</span>
              <span>₱ {total}</span>
            </div>

            <Link to="/checkout" className="cart-summary__checkout">
              Proceed to Checkout →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}