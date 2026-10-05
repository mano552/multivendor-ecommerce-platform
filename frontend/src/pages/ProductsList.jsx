import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";

const ProductsList = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const bestSeller = searchParams.get("bestSeller");
  const featured = searchParams.get("featured");

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (search) params.set("search", search);
    if (bestSeller) params.set("bestSeller", bestSeller);
    if (featured) params.set("featured", featured);

    api.get(`/products?${params.toString()}`).then(({ data }) => {
      setProducts(data);
      setLoading(false);
    });
  }, [category, search, bestSeller, featured]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">
        {search ? `Search results for "${search}"` : category ? category.replace(/-/g, " ") : "All Products"}
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} onViewDetails={(prod) => setSelectedProductId(prod.id)} />
          ))}
        </div>
      )}

      {selectedProductId && (
        <ProductModal
          productId={selectedProductId}
          onClose={() => setSelectedProductId(null)}
          onSelectProduct={(id) => setSelectedProductId(id)}
        />
      )}
    </div>
  );
};

export default ProductsList;
