import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { createOrder } from "../services/api";
import KronosHeader from "../components/KronosHeader";
import "./CheckoutPage.css";

const MOCK_CART = {
  items: [
    {
      id: 1,
      watch: {
        brand: "Tudor",
        model: "Pelagos 39mm",
        reference_number: "m25407n-0001",
        sku: "185422",
        price: "237,772.00",
        image_url: null,
      },
    },
  ],
  subtotal: "237,772.00",
  shipping: "100.00",
  total: "237,872.00",
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const cart = MOCK_CART;

  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    address_line1: "",
    address_line2: "",
    city: "",
    region: "",
    zip_code: "",
    payment_method: "Mock Credit Card",
    delivery_method: "Standard Delivery",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit() {
    const payload = {
      full_name: `${formData.first_name} ${formData.last_name}`.trim(),
      email: formData.email,
      address: `${formData.address_line1}, ${formData.address_line2}, ${formData.city}, ${formData.region} ${formData.zip_code}`,
      payment_method: formData.payment_method,
      delivery_method: formData.delivery_method,
    };

    try {
      const order = await createOrder(payload);
      navigate(`/orders/${order.id}`);
    } catch (err) {
      console.error("Order failed", err);
    }
  }

  return (
    <div className="page-shell checkout-page">
      <div className="checkout-page__header">
        <KronosHeader />

        <div className="checkout-page__breadcrumb">
          <Link to="/cart">Shopping Cart</Link>
          <span>‹</span>
          <span>Check-Out</span>
        </div>
      </div>

      <div className="checkout-page__content">
        <div className="checkout-page__left">
          <h1 className="checkout-page__title">Check Out</h1>

          <div className="checkout-form">
            <div className="checkout-form__section">
              <h2>Contact</h2>
              <div className="checkout-form__row">
                <input
                  className="kronos-input"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="checkout-form__section">
              <h2>Delivery</h2>

              <div className="checkout-form__row checkout-form__row--two">
                <input
                  className="kronos-input"
                  name="first_name"
                  placeholder="First Name"
                  value={formData.first_name}
                  onChange={handleChange}
                />
                <input
                  className="kronos-input"
                  name="last_name"
                  placeholder="Last Name"
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </div>

              <div className="checkout-form__row">
                <input
                  className="kronos-input"
                  name="address_line1"
                  placeholder="Address Line 1"
                  value={formData.address_line1}
                  onChange={handleChange}
                />
              </div>

              <div className="checkout-form__row">
                <input
                  className="kronos-input"
                  name="address_line2"
                  placeholder="Address Line 2"
                  value={formData.address_line2}
                  onChange={handleChange}
                />
              </div>

              <div className="checkout-form__row checkout-form__row--three">
                <input
                  className="kronos-input"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                />
                <input
                  className="kronos-input"
                  name="region"
                  placeholder="Region"
                  value={formData.region}
                  onChange={handleChange}
                />
                <input
                  className="kronos-input"
                  name="zip_code"
                  placeholder="ZIP Code"
                  value={formData.zip_code}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="checkout-page__right">
          <div className="checkout-summary kronos-card">
            {cart.items.map((item) => (
              <div key={item.id} className="checkout-summary__item">
                {item.watch.image_url ? (
                  <img
                    className="checkout-summary__image"
                    src={item.watch.image_url}
                    alt={item.watch.model}
                  />
                ) : (
                  <div className="checkout-summary__image checkout-summary__image--placeholder">
                    ⌚
                  </div>
                )}

                <div className="checkout-summary__info">
                  <h3>
                    {item.watch.brand} {item.watch.model}
                  </h3>
                  <p className="checkout-summary__ref">{item.watch.reference_number}</p>
                  {item.watch.sku && (
                    <p className="checkout-summary__sku">SKU: {item.watch.sku}</p>
                  )}
                  <p className="checkout-summary__price">₱{item.watch.price}</p>
                  <button className="checkout-summary__remove">Remove</button>
                </div>
              </div>
            ))}

            <div className="checkout-summary__totals">
              <div className="checkout-summary__line">
                <span>Subtotal</span>
                <span>₱ {cart.subtotal}</span>
              </div>
              <div className="checkout-summary__line">
                <span>Shipping</span>
                <span>₱ {cart.shipping}</span>
              </div>

              <hr />

              <div className="checkout-summary__line checkout-summary__line--total">
                <span>Total</span>
                <span>₱ {cart.total}</span>
              </div>
            </div>
          </div>

          <div className="checkout-page__next">
            <button type="button" onClick={handleSubmit}>
              Next <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}