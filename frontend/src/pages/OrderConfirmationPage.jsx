import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getOrderById } from "../services/api";

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    async function loadOrder() {
      const data = await getOrderById(id);
      setOrder(data);
    }
    loadOrder();
  }, [id]);

  if (!order) return <p>Loading...</p>;

  return (
    <div>
      <h1>Order Confirmed</h1>
      <p>Order ID: {order.id}</p>
      <p>Name: {order.full_name}</p>
      <p>Delivery Method: {order.delivery_method}</p>
      <p>Payment Method: {order.payment_method}</p>
      <p>Total: ₱{order.total_amount}</p>
    </div>
  );
}