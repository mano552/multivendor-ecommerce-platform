import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiHeart, FiShoppingCart, FiUser, FiChevronDown, FiMessageCircle } from "react-icons/fi";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useChat } from "../context/ChatContext";
import { getCategoryEmoji } from "../utils/categoryIcons";

const Navbar = () => {
  const [categories, setCategories] = useState([]);
  const [showCategories, setShowCategories] = useState(false);
  const [search, setSearch] = useState("");
  const { user } = useAuth();
  const { cartItems, wishlistItems } = useCart();
  const { unreadCount } = useChat();
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/categories").then(({ data }) => setCategories(data));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?search=${encodeURIComponent(search)}`);
  };

  return (
    <header className="w-full shadow-sm sticky top-0 z-40 bg-white">
      {/* Top bar: logo, search, become seller */}
      <div className="flex items-center justify-between gap-4 px-6 py-3 max-w-7xl mx-auto">
        <Link to="/" className="text-2xl font-bold text-gray-800 flex items-center gap-1">
          Shop<span className="text-primary">O</span>
        </Link>
        <form onSubmit={handleSearch} className="flex-1 max-w-xl">
          <div className="flex items-center border rounded-md overflow-hidden">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search Product..."
              className="w-full px-4 py-2 outline-none"
            />
            <button type="submit" className="px-4 text-gray-500">
              <FiSearch size={20} />
            </button>
          </div>
        </form>
        <Link
          to={user?.role === "seller" ? "/seller/dashboard" : "/become-seller"}
          className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm whitespace-nowrap hover:bg-gray-800"
        >
          Become Seller &gt;
        </Link>
      </div>

      {/* Category bar */}
      <nav className="bg-primary text-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 relative">
          <div className="relative">
            <button
              onClick={() => setShowCategories((s) => !s)}
              className="flex items-center gap-2 bg-white text-gray-800 px-4 py-2 rounded-md font-medium"
            >
              All Categories <FiChevronDown />
            </button>
            {showCategories && (
              <div className="absolute top-full mt-1 left-0 bg-white text-gray-800 rounded-md shadow-lg w-64 py-2 z-50">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/products?category=${cat.slug}`}
                    onClick={() => setShowCategories(false)}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                  >
                    <span>{getCategoryEmoji(cat.name)}</span> {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="hidden md:flex items-center gap-8 font-medium">
            <Link to="/" className="hover:text-green-300">Home</Link>
            <Link to="/products?bestSeller=true" className="hover:text-green-300">Best Selling</Link>
            <Link to="/products" className="hover:text-green-300">Products</Link>
            <Link to="/events" className="hover:text-green-300">Events</Link>
            <Link to="/faq" className="hover:text-green-300">FAQ</Link>
            {user?.role === "seller" && (
              <Link to="/seller/dashboard" className="hover:text-green-300">Dashboard</Link>
            )}
            {user?.role === "admin" && (
              <Link to="/admin/dashboard" className="hover:text-green-300">Admin</Link>
            )}
          </div>

          <div className="flex items-center gap-5">
            {user && (
              <Link to="/messages" className="relative">
                <FiMessageCircle size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )}
            <Link to="/wishlist" className="relative">
              <FiHeart size={20} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            <Link to="/cart" className="relative">
              <FiShoppingCart size={20} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
            <Link to={user ? "/profile" : "/login"}>
              <FiUser size={22} />
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
