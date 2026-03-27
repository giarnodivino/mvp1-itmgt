import { useState } from "react";
import { useNavigate } from "react-router";
import { createOrder } from "../services/api";

export default function CheckoutPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    address: "",
    payment_method: "Mock Credit Card",
    delivery_method: "Standard Delivery",
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const order = await createOrder(formData);
    navigate(`/orders/${order.id}`);
  }

  return (
    <div>
      <h1>Checkout</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="full_name"
          placeholder="Full Name"
          value={formData.full_name}
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          name="address"
          placeholder="Delivery Address"
          value={formData.address}
          onChange={handleChange}
        />

        <select
          name="delivery_method"
          value={formData.delivery_method}
          onChange={handleChange}
        >
          <option>Standard Delivery</option>
          <option>White-Glove Delivery</option>
        </select>

        <select
          name="payment_method"
          value={formData.payment_method}
          onChange={handleChange}
        >
          <option>Mock Credit Card</option>
          <option>Mock Bank Transfer</option>
        </select>

        <button type="submit">Confirm Order</button>
      </form>
    </div>
  );
}