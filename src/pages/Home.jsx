import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ProductCard from '../components/homepage/ProductCard';
import Layout from '../components/homepage/Layout';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroBanner from '../components/homepage/HeroBanner';
import LogoAnimation from '../loading/LoadingAnimation';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;




const CATEGORIES = ['All', 'Electronics', 'Vehicles', 'Furniture', 'Fashion', 'Properties'];

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchProducts = async (pageNumber = 1) => {
    try {
      setLoading(true);

      const res = await axios.get(

        `${API_BASE_URL}/api/page/homePage?page=${pageNumber}`,
        {
          withCredentials: true, // 🔑 SEND COOKIE
        }
      );

      if (res.data.success) {
        setProducts(prev =>
          pageNumber === 1
            ? res.data.products
            : [...prev, ...res.data.products]
        );

        setHasMore(res.data.pagination.hasMore);
      } else {
        setError(res.data.message || "Failed to fetch products");
      }

    } catch (err) {
      console.log("Error fetching products:", err);
      setError("Failed to fetch products.", err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };



  const handleShowMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage);
  };

  useEffect(() => {

    fetchProducts(1);



  }, []);




  // ✅ Category filter
  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory
      );

  // ✅ Navigate to product detail page
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };


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
              onClick={handleProductClick}
            />
          ))}
        </div>
        {/* Show More Button */}

        {hasMore && !loading && (
          <div className="flex justify-end mt-12 mb-4">
            <button
              onClick={handleShowMore}
              className="group relative px-10 py-4 bg-[#1e293b]/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/30"
            >
              <span className="relative z-10 text-lg font-semibold bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent group-hover:from-orange-300 group-hover:to-orange-400 transition-all">
                Show More
              </span>
              
            </button>
          </div>
        )}
      </Layout>
      <Footer />
    </>
  );
};

export default Home;
