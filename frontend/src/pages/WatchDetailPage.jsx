import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { getWatchById, addToCart } from "../services/api";
import VerificationBadges from "../components/VerificationBadges";

export default function WatchDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [watch, setWatch] = useState(null);

  useEffect(() => {
    async function loadWatch() {
      const data = await getWatchById(id);
      setWatch(data);
    }
    loadWatch();
  }, [id]);

  async function handleAddToCart() {
    await addToCart(watch.id);
    navigate("/cart");
  }

  if (!watch) return <p>Loading...</p>;

  return (
    <div>
      <img src={watch.image_url} alt={watch.model} />
      <h1>{watch.brand} {watch.model}</h1>
      <p>Reference No.: {watch.reference_number}</p>
      <p>Condition: {watch.condition}</p>
      <p>Price: ₱{watch.price}</p>
      <p>Seller: {watch.seller_name}</p>
      <VerificationBadges verification={watch.verification} />

      <h3>Description</h3>
      <p>{watch.description}</p>

      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
}