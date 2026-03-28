import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import KronosHeader from "../components/KronosHeader";
import { getCart, createOrder } from "../services/api";
import "./CheckoutPage.css";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    region: "",
    zipCode: "",
    deliveryMethod: "Standard Delivery",
  });

  useEffect(() => {
    async function loadCart() {
      try {
        const data = await getCart();
        setCart(data);
      } catch (error) {
        console.error("Failed to load cart:", error);
      } finally {
        setLoading(false);
      }
    }

    loadCart();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  const items = cart?.items ?? [];

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const price = Number(item.watch?.price ?? item.price ?? 0);
      const quantity = Number(item.quantity ?? 1);
      return sum + price * quantity;
    }, 0);
  }, [items]);

  const shipping = formData.deliveryMethod === "White-Glove Delivery" ? 1500 : 100;
  const total = subtotal + shipping;

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const order = await createOrder({
        ...formData,
        subtotal,
        shipping,
        total,
      });

      if (order?.id) {
        navigate(`/orders/${order.id}`);
        return;
      }

      console.log("Order created:", order);
    } catch (error) {
      console.error("Failed to create order:", error);
    }
  }

  if (loading) {
    return (
      <div className="page-shell">
        <KronosHeader />
        <p>Loading checkout...</p>
      </div>
    );
  }

if (items.length === 0)
  return (
    <div className="page-shell">
      <KronosHeader />
      <div className="checkout-empty">
        <h1>Your cart is empty.</h1>
        <button
          type="button"
          className="kronos-pill"
          onClick={() => navigate("/cart")}
        >
          Back to Cart
        </button>
      </div>
    </div>
  );

  return (
    <div className="checkout-page">
      <div className="checkout-page__header">
        <KronosHeader />
      </div>

      <div className="checkout-page__content">
        <div className="checkout-page__left">
          <div className="checkout-page__breadcrumb">
            <span>‹ Shopping Cart</span>
            <span>‹ Check-Out</span>
          </div>

          <h1 className="checkout-page__title section-heading-serif">Check Out</h1>

          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="checkout-form__section">
              <h2>Contact</h2>
              <input
                className="kronos-input"
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="checkout-form__section">
              <h2>Delivery</h2>

              <div className="checkout-form__row checkout-form__row--two">
                <input
                  className="kronos-input"
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                <input
                  className="kronos-input"
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>

              <div className="checkout-form__row">
                <input
                  className="kronos-input"
                  type="text"
                  name="address1"
                  placeholder="Address Line 1"
                  value={formData.address1}
                  onChange={handleChange}
                />
              </div>

              <div className="checkout-form__row">
                <input
                  className="kronos-input"
                  type="text"
                  name="address2"
                  placeholder="Address Line 2"
                  value={formData.address2}
                  onChange={handleChange}
                />
              </div>

              <div className="checkout-form__row checkout-form__row--three">
                <input
                  className="kronos-input"
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                />
                <input
                  className="kronos-input"
                  type="text"
                  name="region"
                  placeholder="Region"
                  value={formData.region}
                  onChange={handleChange}
                />
                <input
                  className="kronos-input"
                  type="text"
                  name="zipCode"
                  placeholder="ZIP Code"
                  value={formData.zipCode}
                  onChange={handleChange}
                />
              </div>

              <div className="checkout-form__row">
                <select
                  className="kronos-select"
                  name="deliveryMethod"
                  value={formData.deliveryMethod}
                  onChange={handleChange}
                >
                  <option>Standard Delivery</option>
                  <option>White-Glove Delivery</option>
                </select>
              </div>
            </div>

            <div className="checkout-page__next checkout-page__next--mobile">
              <button type="submit">Next →</button>
            </div>
          </form>
        </div>

        <div className="checkout-page__right">
          <div className="checkout-summary kronos-card">
            {items.map((item) => {
              const watch = item.watch ?? {};
              const price = Number(watch.price ?? item.price ?? 0);
              const quantity = Number(item.quantity ?? 1);

              return (
                <div className="checkout-summary__item" key={item.id ?? `${watch.id}-${quantity}`}>
                  <img
                    className="checkout-summary__image"
                    src={watch.image_url || item.image_url}
                    alt={`${watch.brand ?? ""} ${watch.model ?? ""}`.trim()}
                  />

                  <div className="checkout-summary__info">
                    <h3>
                      {watch.brand} {watch.model}
                    </h3>

                    {watch.reference_number && (
                      <p className="checkout-summary__ref">{watch.reference_number}</p>
                    )}

                    {watch.sku && <p className="checkout-summary__sku">SKU: {watch.sku}</p>}

                    <p className="checkout-summary__price">
                      ₱
                      {price.toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                      })}
                    </p>

                    <p className="checkout-summary__qty">Qty: {quantity}</p>
                  </div>
                </div>
              );
            })}

            <div className="checkout-summary__totals">
              <div className="checkout-summary__line">
                <span>Subtotal</span>
                <span>
                  ₱
                  {subtotal.toLocaleString("en-PH", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>

              <div className="checkout-summary__line">
                <span>Shipping</span>
                <span>
                  ₱
                  {shipping.toLocaleString("en-PH", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>

              <hr />

              <div className="checkout-summary__line checkout-summary__line--total">
                <span>Total</span>
                <span>
                  ₱
                  {total.toLocaleString("en-PH", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="checkout-page__next checkout-page__next--desktop">
            <button type="button" onClick={handleSubmit}>
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}