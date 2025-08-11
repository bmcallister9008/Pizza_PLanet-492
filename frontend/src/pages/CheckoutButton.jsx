// frontend/src/pages/CheckoutButton.jsx
import axios from "axios";

export default function CheckoutButton({ cart, email }) {
  const goCheckout = async () => {
    const resp = await axios.post("/api/pay/checkout", {
      items: cart, // [{name, price, qty}]
      customerEmail: email,
      successUrl: window.location.origin + "/success",
      cancelUrl: window.location.origin + "/cart",
    });
    window.location = resp.data.url;
  };

  return <button onClick={goCheckout}>Checkout</button>;
}
