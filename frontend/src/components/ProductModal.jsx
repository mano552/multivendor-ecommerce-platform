import { useEffect, useState } from "react";
import { FiX, FiHeart, FiMinus, FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import ProductCard from "./ProductCard";
import ChatWindow from "./ChatWindow";

const Stars = ({ rating }) => (
  <div className="flex text-yellow-400">
    {[1, 2, 3, 4, 5].map((i) => (
      <span key={i}>{i <= Math.round(rating) ? "★" : "☆"}</span>
    ))}
  </div>
);

const ProductModal = ({ productId, onClose, onSelectProduct }) => {
  const [data, setData] = useState(null);
  const [qty, setQty] = useState(1);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const { user } = useAuth();
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!productId) return;
    setQty(1);
    api.get(`/products/${productId}`).then(({ data }) => setData(data));
  }, [productId]);

  if (!productId || !data) return null;
  const { product, related } = data;

  const requireLogin = (fn) => {
    if (!user) return navigate("/login");
    fn();
  };

  const handleImageError = (e) => {
    e.target.src = "https://placehold.co/500x500?text=Product";
  };

  const submitReview = async (e) => {
    e.preventDefault();
    requireLogin(async () => {
      await api.post(`/products/${product.id}/reviews`, { rating: reviewRating, comment: reviewText });
      setReviewText("");
      const { data: fresh } = await api.get(`/products/${productId}`);
      setData(fresh);
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center overflow-y-auto py-10">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 z-10">
          <FiX size={24} />
        </button>

        <div className="grid md:grid-cols-2 gap-6 p-6">
          <img
            src={product.images?.[0] || "https://placehold.co/500x500?text=Product"}
            alt={product.name}
            onError={handleImageError}
            className="w-full rounded-md object-cover"
          />

          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-primary">{product.seller?.shopName || "Seller"}</span>
              <Stars rating={product.ratingsAverage} />
              <span className="text-sm text-gray-500">({product.ratingsAverage?.toFixed?.(1) || 0})</span>
            </div>

            <button
              onClick={() => requireLogin(() => document.getElementById("msg-box")?.scrollIntoView({ behavior: "smooth" }))}
              className="mt-3 bg-gray-900 text-white px-4 py-2 rounded-md text-sm"
            >
              Send Message
            </button>

            {product.stock <= 0 ? (
              <p className="text-red-500 mt-2 font-medium">Sold out</p>
            ) : (
              <p className="text-green-600 mt-2 text-sm">{product.stock} in stock</p>
            )}

            <h1 className="text-xl font-bold mt-4">{product.name}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-2xl font-bold">${product.price}</span>
              {product.discountPrice && (
                <span className="text-gray-400 line-through">${product.discountPrice}</span>
              )}
            </div>

            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center border rounded-md">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2"><FiMinus /></button>
                <span className="px-4">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="px-3 py-2"><FiPlus /></button>
              </div>
              <button
                onClick={() => requireLogin(() => toggleWishlist(product.id))}
                className={isWishlisted(product.id) ? "text-red-500" : "text-gray-400"}
              >
                <FiHeart size={22} />
              </button>
            </div>

            <button
              disabled={product.stock <= 0}
              onClick={() => requireLogin(() => addToCart(product.id, qty))}
              className="mt-4 w-full bg-primary disabled:bg-gray-300 text-white py-3 rounded-md font-medium"
            >
              Add to cart
            </button>

            <p className="text-gray-600 text-sm mt-4 leading-relaxed">{product.description}</p>
          </div>
        </div>

        {/* Reviews */}
        <div className="px-6 pb-6 border-t pt-4">
          <h3 className="font-semibold mb-3">Product Reviews ({product.reviews?.length || 0})</h3>
          <div className="space-y-3 max-h-40 overflow-y-auto">
            {product.reviews?.map((r) => (
              <div key={r.id} className="border-b pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{r.user?.fullName}</span>
                  <Stars rating={r.rating} />
                </div>
                <p className="text-sm text-gray-600">{r.comment}</p>
              </div>
            ))}
          </div>
          <form onSubmit={submitReview} className="flex gap-2 mt-3">
            <select value={reviewRating} onChange={(e) => setReviewRating(e.target.value)} className="border rounded-md px-2">
              {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} ★</option>)}
            </select>
            <input
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write a review..."
              className="flex-1 border rounded-md px-3"
            />
            <button className="bg-primary text-white px-4 rounded-md">Post</button>
          </form>
        </div>

        {/* Seller info + real-time chat */}
        <div id="msg-box" className="px-6 pb-6 border-t pt-4">
          <h3 className="font-semibold mb-2">Seller Information</h3>
          <p className="text-sm text-gray-600 mb-3">{product.seller?.shopName} — {product.seller?.fullName}</p>
          {user ? (
            <ChatWindow
              otherUserId={product.sellerId}
              otherUserName={product.seller?.shopName || product.seller?.fullName}
              productId={product.id}
            />
          ) : (
            <button onClick={() => navigate("/login")} className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm">
              Login to message the seller
            </button>
          )}
        </div>

        {/* Related products */}
        {related?.length > 0 && (
          <div className="px-6 pb-6 border-t pt-4">
            <h3 className="font-semibold mb-3">Related Products</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} onViewDetails={() => onSelectProduct(p.id)} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductModal;
