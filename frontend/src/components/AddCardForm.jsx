import { useState } from "react";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useStripeConfig } from "../context/StripeContext";
import api from "../api/axios";

const cardElementOptions = {
  style: {
    base: {
      fontSize: "14px",
      color: "#1f2937",
      "::placeholder": { color: "#9ca3af" },
    },
  },
};

const InnerForm = ({ onSaved, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/payment-methods/setup-intent");
      const result = await stripe.confirmCardSetup(data.clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (result.error) {
        setError(result.error.message);
        return;
      }

      await api.post("/payment-methods", { paymentMethodId: result.setupIntent.payment_method });
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save card");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border rounded-md p-4 bg-gray-50">
      {error && <p className="bg-red-50 text-red-600 text-sm p-2 rounded mb-3">{error}</p>}
      <div className="bg-white border rounded-md px-3 py-3 mb-3">
        <CardElement options={cardElementOptions} />
      </div>
      <p className="text-xs text-gray-400 mb-3">
        Test card: 4242 4242 4242 4242 · any future date · any CVC
      </p>
      <div className="flex gap-2">
        <button disabled={!stripe || loading} className="bg-primary disabled:opacity-60 text-white px-4 py-2 rounded-md text-sm">
          {loading ? "Saving..." : "Save Card"}
        </button>
        <button type="button" onClick={onCancel} className="border px-4 py-2 rounded-md text-sm">Cancel</button>
      </div>
    </form>
  );
};

const AddCardForm = ({ onSaved, onCancel }) => {
  const { stripePromise, configured } = useStripeConfig();

  if (!configured) {
    return (
      <div className="border rounded-md p-4 bg-yellow-50 text-sm text-yellow-800">
        Stripe isn't configured yet — add <code>STRIPE_PUBLISHABLE_KEY</code> to the backend{" "}
        <code>.env</code> file (from your{" "}
        <a href="https://dashboard.stripe.com/test/apikeys" target="_blank" rel="noreferrer" className="underline">
          Stripe test API keys
        </a>
        ) and restart the server.
      </div>
    );
  }

  if (!stripePromise) return <p className="text-sm text-gray-400">Loading Stripe...</p>;

  return (
    <Elements stripe={stripePromise}>
      <InnerForm onSaved={onSaved} onCancel={onCancel} />
    </Elements>
  );
};

export default AddCardForm;
