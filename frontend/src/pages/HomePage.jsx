import { useEffect, useState } from "react";
import { getHello } from "../services/api";

export default function HomePage() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    getHello()
      .then((data) => setMessage(data.message))
      .catch(() => setMessage("Failed to load"));
  }, []);

  return <h1>{message}</h1>;
}
