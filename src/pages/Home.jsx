import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ProductCard from '../components/homepage/ProductCard';
import Layout from '../components/homepage/Layout';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroBanner from '../components/homepage/HeroBanner';
import LogoAnimation from '../loading/LoadingAnimation';
import axios from 'axios';
import { Search } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);



  const fetchProducts = async (pageNumber = 1) => {
    try {
      setLoading(true);
      setError(null);


      const params = new URLSearchParams();
      params.append("page", pageNumber);


      if (debouncedSearch.trim()) {
        params.append("search", debouncedSearch.trim());
      }

      if (activeCategory !== "All") {
        params.append("category", activeCategory);
      }

      const res = await axios.get(
        `${API_BASE_URL}/api/page/homePage?${params.toString()}`,
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
      setError("Failed to fetch products.");
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
    setPage(1);
    fetchProducts(1);
  }, [debouncedSearch, activeCategory]);




  // ✅ Navigate to product detail page
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };


  // ✅ Loader handling 

  if (loading) {
    return <LogoAnimation />;
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
          {/* Header Row - Title Left, Search Right */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            {/* Title - Left Side */}
            <h2 className="text-2xl md:text-4xl font-bold text-white">Explore Categories</h2>

            {/* Search Bar - Right Side */}
            <div className="relative w-full md:w-80 lg:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-orange-500 transition-colors" />
              <input
                type="text"
                placeholder="Search for anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 focus:bg-white/10 transition-all"
              />
            </div>
          </div>


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
          {products.map((product) => (
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
              className="group flex items-center gap-2 px-6 py-2.5 bg-[#0f172a]/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg shadow-orange-500/5 transition-all duration-200 hover:border-white/20 hover:-translate-y-0.5"
            >
              <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-all">
                Show More
              </span>
              <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </Layout>
      <Footer />
    </>
  );
};

export default Home;
