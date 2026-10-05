import { FiTrash2, FiMinus, FiPlus } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { cartItems, refreshCart } = useCart();
  const navigate = useNavigate();

  const updateQty = async (id, quantity) => {
    if (quantity < 1) return;
    await api.put(`/cart/${id}`, { quantity });
    refreshCart();
  };

  const removeItem = async (id) => {
    await api.delete(`/cart/${id}`);
    refreshCart();
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.quantity * (item.product.discountPrice || item.product.price),
    0
  );

  if (!cartItems.length) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
        <Link to="/products" className="text-primary font-medium">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center gap-4 border rounded-md p-4">
            <img
              src={item.product.images?.[0] || "https://placehold.co/100x100?text=Product"}
              alt={item.product.name}
              className="w-20 h-20 object-cover rounded-md"
            />
            <div className="flex-1">
              <p className="font-medium">{item.product.name}</p>
              <p className="text-sm text-gray-500">${item.product.discountPrice || item.product.price}</p>
            </div>
            <div className="flex items-center border rounded-md">
              <button onClick={() => updateQty(item.id, item.quantity - 1)} className="px-2 py-1"><FiMinus /></button>
              <span className="px-3">{item.quantity}</span>
              <button onClick={() => updateQty(item.id, item.quantity + 1)} className="px-2 py-1"><FiPlus /></button>
            </div>
            <button onClick={() => removeItem(item.id)} className="text-red-500"><FiTrash2 /></button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between items-center border-t pt-6">
        <span className="text-xl font-bold">Total: ${total.toFixed(2)}</span>
        <button onClick={() => navigate("/checkout")} className="bg-primary text-white px-8 py-3 rounded-md font-medium">
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
