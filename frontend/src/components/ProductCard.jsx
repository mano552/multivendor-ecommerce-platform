import { FiHeart, FiShoppingCart, FiEye } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getPlaceholderImage } from "../utils/placeholder";

const Stars = ({ rating }) => (
  <div className="flex text-yellow-400 text-sm">
    {[1, 2, 3, 4, 5].map((i) => (
      <span key={i}>{i <= Math.round(rating) ? "★" : "☆"}</span>
    ))}
  </div>
);

const ProductCard = ({ product, onViewDetails }) => {
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const guard = (fn) => (e) => {
    e.stopPropagation();
    if (!user) return navigate("/login");
    fn();
  };

  const handleImageError = (e) => {
    e.target.src = getPlaceholderImage(product.name);
  };

  return (
    <div
      onClick={() => onViewDetails(product)}
      className="border rounded-lg p-3 bg-white hover:shadow-lg transition cursor-pointer relative group"
    >
      <div className="relative">
        <img
          src={product.images?.[0] || getPlaceholderImage(product.name)}
          alt={product.name}
          onError={handleImageError}
          className="w-full h-44 object-cover rounded-md"
        />
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={guard(() => toggleWishlist(product.id))}
            className={`p-2 rounded-full bg-white shadow ${isWishlisted(product.id) ? "text-red-500" : "text-gray-600"}`}
          >
            <FiHeart />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onViewDetails(product); }}
            className="p-2 rounded-full bg-white shadow text-gray-600"
          >
            <FiEye />
          </button>
        </div>
      </div>

      <p className="text-primary text-sm mt-2">{product.seller?.shopName || product.brand}</p>
      <h3 className="font-medium text-gray-800 line-clamp-2">{product.name}</h3>
      <div className="flex items-center gap-2 mt-1">
        <Stars rating={product.ratingsAverage} />
        <span className="text-xs text-gray-500">({product.ratingsCount})</span>
      </div>
      <div className="flex items-center justify-between mt-2">
        <div>
          <span className="text-lg font-semibold">${product.price}</span>
          {product.discountPrice && (
            <span className="text-sm text-gray-400 line-through ml-2">${product.discountPrice}</span>
          )}
        </div>
        <span className="text-xs text-green-600">{product.sold} sold</span>
      </div>

      <button
        onClick={guard(() => addToCart(product.id, 1))}
        className="mt-3 w-full bg-gray-900 text-white py-2 rounded-md flex items-center justify-center gap-2 hover:bg-primary"
      >
        <FiShoppingCart /> Add to cart
      </button>
    </div>
  );
};

export default ProductCard;
