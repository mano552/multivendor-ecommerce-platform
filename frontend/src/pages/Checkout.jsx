import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const steps = ["Shipping Address", "Payment"];

const Checkout = () => {
  const { user } = useAuth();
  const { cartItems, refreshCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [shipping, setShipping] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    address1: user?.address1 || "",
    address2: user?.address2 || "",
    zip: user?.zipCode || "",
    city: "",
  });

  const total = cartItems.reduce(
    (sum, item) => sum + item.quantity * (item.product.discountPrice || item.product.price),
    0
  );

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setStep(1);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError("");
    try {
      if (paymentMethod === "cod") {
        await api.post("/orders/cod", { shipping });
        await refreshCart();
        navigate("/checkout/success");
      } else {
        const { data } = await api.post("/orders/create-checkout-session", { shipping });
        window.location.href = data.url; // redirect to Stripe Checkout
      }
    } catch (err) {
      setError(err.response?.data?.message || "Could not place order");
    } finally {
      setLoading(false);
    }
  };

  if (!cartItems.length) {
    return <div className="max-w-2xl mx-auto px-6 py-20 text-center">Your cart is empty.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex items-center gap-4 mb-8">
        {steps.map((s, i) => (
          <div key={s} className={`flex items-center gap-2 ${i <= step ? "text-primary" : "text-gray-400"}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm ${i <= step ? "bg-primary text-white" : "bg-gray-200"}`}>
              {i + 1}
            </div>
            <span className="font-medium">{s}</span>
            {i < steps.length - 1 && <span className="w-8 h-px bg-gray-300 mx-2" />}
          </div>
        ))}
      </div>

      {error && <p className="bg-red-50 text-red-600 text-sm p-2 rounded mb-4">{error}</p>}

      {step === 0 && (
        <form onSubmit={handleShippingSubmit} className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <input required value={shipping.fullName} onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })} className="w-full border rounded-md px-3 py-2 mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">Phone Number</label>
            <input required value={shipping.phone} onChange={(e) => setShipping({ ...shipping, phone: e.target.value })} className="w-full border rounded-md px-3 py-2 mt-1" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium">Address Line 1</label>
            <input required value={shipping.address1} onChange={(e) => setShipping({ ...shipping, address1: e.target.value })} className="w-full border rounded-md px-3 py-2 mt-1" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium">Address Line 2</label>
            <input value={shipping.address2} onChange={(e) => setShipping({ ...shipping, address2: e.target.value })} className="w-full border rounded-md px-3 py-2 mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">City</label>
            <input required value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} className="w-full border rounded-md px-3 py-2 mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">Zip Code</label>
            <input required value={shipping.zip} onChange={(e) => setShipping({ ...shipping, zip: e.target.value })} className="w-full border rounded-md px-3 py-2 mt-1" />
          </div>
          <div className="md:col-span-2">
            <button className="bg-primary text-white px-8 py-3 rounded-md font-medium">Continue to Payment</button>
          </div>
        </form>
      )}

      {step === 1 && (
        <div>
          <div className="space-y-3">
            <label className={`flex items-center gap-3 border rounded-md p-4 cursor-pointer ${paymentMethod === "card" ? "border-primary bg-primary/5" : ""}`}>
              <input type="radio" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} />
              <div>
                <p className="font-medium">Pay with Card (Stripe)</p>
                <p className="text-sm text-gray-500">Secure checkout — Visa, Mastercard, and more.</p>
              </div>
            </label>
            <label className={`flex items-center gap-3 border rounded-md p-4 cursor-pointer ${paymentMethod === "cod" ? "border-primary bg-primary/5" : ""}`}>
              <input type="radio" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} />
              <div>
                <p className="font-medium">Cash on Delivery</p>
                <p className="text-sm text-gray-500">Pay when your order arrives.</p>
              </div>
            </label>
          </div>

          <div className="mt-6 flex justify-between items-center border-t pt-6">
            <span className="text-xl font-bold">Total: ${total.toFixed(2)}</span>
            <div className="flex gap-3">
              <button onClick={() => setStep(0)} className="px-6 py-3 rounded-md border font-medium">Back</button>
              <button disabled={loading} onClick={handlePlaceOrder} className="bg-primary disabled:opacity-60 text-white px-8 py-3 rounded-md font-medium">
                {loading ? "Processing..." : paymentMethod === "card" ? "Pay Now" : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
