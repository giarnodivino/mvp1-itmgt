import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getCart, createOrder } from "../services/api";

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

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const subtotal =
    cart?.items?.reduce((sum, item) => {
      return sum + Number(item.watch.price) * Number(item.quantity || 1);
    }, 0) || 0;

  const shipping = formData.deliveryMethod === "White-Glove Delivery" ? 1500 : 100;
  const total = subtotal + shipping;

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const order = await createOrder({
        ...formData,
        subtotal,
        shipping,
        total,
      });

      navigate(`/orders/${order.id}`);
    } catch (error) {
      console.error("Failed to create order:", error);
    }
  }

  if (loading) return <p>Loading checkout...</p>;
  if (!cart || !cart.items || cart.items.length === 0) return <p>Your cart is empty.</p>;

  return (
    <div className="checkout-page">
      <header className="checkout-topbar">
        <div className="checkout-location">⌖</div>

        <div className="checkout-brand">KRONOS</div>

        <div className="checkout-topbar-right">
          <div className="checkout-search-box">
            <span className="checkout-search-icon">⌕</span>
            <input type="text" placeholder="Search" />
          </div>

          <button className="checkout-icon-btn">🛒</button>
          <button className="checkout-icon-btn">☰</button>
        </div>
      </header>

      <div className="checkout-content">
        <div className="checkout-left">
          <div className="checkout-breadcrumb">
            <span>‹ Shopping Cart</span>
            <span>‹ Check-Out</span>
          </div>

          <h1 className="checkout-title">Check Out</h1>

          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="checkout-section">
              <h2>Contact</h2>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="checkout-section">
              <h2>Delivery</h2>

              <div className="checkout-row two-cols">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>

              <div className="checkout-row">
                <input
                  type="text"
                  name="address1"
                  placeholder="Address Line 1"
                  value={formData.address1}
                  onChange={handleChange}
                />
              </div>

              <div className="checkout-row">
                <input
                  type="text"
                  name="address2"
                  placeholder="Address Line 2"
                  value={formData.address2}
                  onChange={handleChange}
                />
              </div>

              <div className="checkout-row three-cols">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="region"
                  placeholder="Region"
                  value={formData.region}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="zipCode"
                  placeholder="ZIP Code"
                  value={formData.zipCode}
                  onChange={handleChange}
                />
              </div>

              <div className="checkout-row">
                <select
                  name="deliveryMethod"
                  value={formData.deliveryMethod}
                  onChange={handleChange}
                  className="checkout-select"
                >
                  <option>Standard Delivery</option>
                  <option>White-Glove Delivery</option>
                </select>
              </div>
            </div>

            <div className="checkout-next-wrap mobile-only">
              <button type="submit" className="checkout-next-btn">
                Next →
              </button>
            </div>
          </form>
        </div>

        <div className="checkout-right">
          <div className="summary-card">
            {cart.items.map((item) => (
              <div className="summary-product" key={item.id}>
                <img
                  src={item.watch.image_url}
                  alt={`${item.watch.brand} ${item.watch.model}`}
                />

                <div className="summary-product-info">
                  <h3>
                    {item.watch.brand} {item.watch.model}
                  </h3>
                  {item.watch.reference_number && (
                    <p className="summary-ref">{item.watch.reference_number}</p>
                  )}
                  {item.watch.sku && (
                    <p className="summary-sku">SKU: {item.watch.sku}</p>
                  )}
                  <p className="summary-price">
                    ₱
                    {Number(item.watch.price).toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                  <p className="summary-qty">Qty: {item.quantity || 1}</p>
                </div>
              </div>
            ))}

            <div className="summary-breakdown">
              <div className="summary-line">
                <span>Subtotal</span>
                <span>
                  ₱
                  {subtotal.toLocaleString("en-PH", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>

              <div className="summary-line">
                <span>Shipping</span>
                <span>
                  ₱
                  {shipping.toLocaleString("en-PH", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>

              <hr />

              <div className="summary-line total">
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

          <div className="checkout-next-wrap desktop-only">
            <button type="button" className="checkout-next-btn" onClick={handleSubmit}>
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}