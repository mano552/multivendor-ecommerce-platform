import { Link } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";

const CheckoutSuccess = () => {
  return (
    <div className="max-w-lg mx-auto px-6 py-24 text-center">
      <FiCheckCircle size={64} className="text-green-500 mx-auto mb-4" />
      <h1 className="text-2xl font-bold mb-2">Order placed successfully!</h1>
      <p className="text-gray-500 mb-6">You can track your order status from your profile.</p>
      <div className="flex justify-center gap-4">
        <Link to="/profile" className="bg-primary text-white px-6 py-3 rounded-md font-medium">View Orders</Link>
        <Link to="/products" className="border px-6 py-3 rounded-md font-medium">Continue Shopping</Link>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
