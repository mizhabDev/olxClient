import React, { useEffect, useState } from 'react';

import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import Layout from '../components/homepage/Layout';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroBanner from '../components/homepage/HeroBanner';
import LogoAnimation from '../loading/LoadingAnimation';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;




const CATEGORIES = ['All', 'Electronics', 'Vehicles', 'Furniture', 'Fashion', 'Properties'];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await axios.get(

          `${API_BASE_URL}/api/page/homePage`,
          {
            withCredentials: true, // 🔑 SEND COOKIE
          }
        );

        console.log(res.data);
        setProducts(res.data);
        setLoading(false);

      } catch (err) {
        console.log("Error fetching products:", err);
        setError("Failed to fetch products.");
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);


  // ✅ Category filter
  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory
      );


  // ✅ Loader handling 

  if (loading) {
    return <LogoAnimation />
  }


  // ✅ Error handling
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }



  return (
    <>
      <Navbar />
      <HeroBanner />
      <Layout>

        {/* Hero / Categories */}
        <div id="categories-section" className="mb-12">
          <h2 className="text-4xl font-bold text-white mb-6">Explore Categories</h2>
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all whitespace-nowrap ${activeCategory === category
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onClick={(id) => setSelectedProductId(id)}
            />
          ))}
        </div>

        {/* Product Modal */}
        <ProductModal
          productId={selectedProductId}
          isOpen={!!selectedProductId}
          onClose={() => setSelectedProductId(null)}
        />
      </Layout>
      <Footer />
    </>
  );
};

export default Home;
