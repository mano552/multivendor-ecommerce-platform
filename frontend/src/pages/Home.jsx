import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import { getCategoryEmoji } from "../utils/categoryIcons";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    api.get("/categories").then(({ data }) => setCategories(data));
    api.get("/products?bestSeller=true").then(({ data }) => setBestSellers(data.slice(0, 8)));
    api.get("/products?featured=true").then(({ data }) => setFeatured(data.slice(0, 8)));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 items-center gap-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Best Collection For <br /> Home Decoration
            </h1>
            <p className="text-gray-600 mt-4 max-w-md">
              Discover thousands of products from trusted vendors around the world, all in one marketplace.
            </p>
            <Link to="/products" className="inline-block mt-6 bg-gray-900 text-white px-6 py-3 rounded-md font-medium">
              Shop Now
            </Link>
          </div>
          <img
            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&q=80"
            alt="hero"
            className="rounded-lg w-full"
          />
        </div>
      </section>

      {/* Popular categories */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-6">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className="border rounded-lg p-4 text-center hover:shadow-md hover:border-primary transition"
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-xl mb-2">
                {getCategoryEmoji(cat.name)}
              </div>
              <p className="text-sm font-medium">{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Best sellers */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Best Sellers</h2>
          <Link to="/products?bestSeller=true" className="text-primary text-sm font-medium">View all</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {bestSellers.map((p) => (
            <ProductCard key={p.id} product={p} onViewDetails={(prod) => setSelectedProductId(prod.id)} />
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link to="/products?featured=true" className="text-primary text-sm font-medium">View all</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} onViewDetails={(prod) => setSelectedProductId(prod.id)} />
          ))}
        </div>
      </section>

      {/* Events banner */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-primary text-white rounded-lg p-10 text-center">
          <h2 className="text-2xl font-bold mb-2">Upcoming Events & Flash Sales</h2>
          <p className="mb-4">Don't miss out on limited-time offers from our top vendors.</p>
          <Link to="/events" className="bg-white text-primary px-6 py-2 rounded-md font-medium inline-block">
            View Events
          </Link>
        </div>
      </section>

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

export default Home;
