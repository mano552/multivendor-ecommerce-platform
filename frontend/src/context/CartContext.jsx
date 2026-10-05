import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  const refreshCart = async () => {
    if (!user) return setCartItems([]);
    const { data } = await api.get("/cart");
    setCartItems(data);
  };

  const refreshWishlist = async () => {
    if (!user) return setWishlistItems([]);
    const { data } = await api.get("/wishlist");
    setWishlistItems(data);
  };

  useEffect(() => {
    refreshCart();
    refreshWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    await api.post("/cart", { productId, quantity });
    await refreshCart();
  };

  const toggleWishlist = async (productId) => {
    await api.post("/wishlist/toggle", { productId });
    await refreshWishlist();
  };

  const isWishlisted = (productId) =>
    wishlistItems.some((w) => w.productId === productId);

  return (
    <CartContext.Provider
      value={{ cartItems, wishlistItems, addToCart, toggleWishlist, isWishlisted, refreshCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
