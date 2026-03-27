import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getCart } from "../services/api";

export default function CartPage() {
  const [cart, setCart] = useState(null);

  useEffect(() => {
    async function loadCart() {
      const data = await getCart();
      setCart(data);
    }
    loadCart();
  }, []);

  if (!cart) return <p>Loading...</p>;

  return (
    <div>
      <h1>Your Cart</h1>

      {cart.items.map((item) => (
        <div key={item.id}>
          <h3>{item.watch.brand} {item.watch.model}</h3>
          <p>₱{item.watch.price}</p>
        </div>
      ))}

      <h2>Total: ₱{cart.total_amount}</h2>

      <Link to="/checkout">Proceed to Checkout</Link>
    </div>
  );
}