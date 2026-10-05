import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import { useState } from "react";
import ProductModal from "../components/ProductModal";

const Wishlist = () => {
  const { wishlistItems } = useCart();
  const [selectedProductId, setSelectedProductId] = useState(null);

  if (!wishlistItems.length) {
    return <div className="max-w-4xl mx-auto px-6 py-20 text-center text-gray-500">Your wishlist is empty.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Your Wishlist</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {wishlistItems.map((item) => (
          <ProductCard key={item.id} product={item.product} onViewDetails={(p) => setSelectedProductId(p.id)} />
        ))}
      </div>
      {selectedProductId && (
        <ProductModal productId={selectedProductId} onClose={() => setSelectedProductId(null)} onSelectProduct={setSelectedProductId} />
      )}
    </div>
  );
};

export default Wishlist;
