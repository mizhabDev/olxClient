import React, { useState } from 'react';

import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import Layout from '../components/homepage/Layout';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroBanner from '../components/homepage/HeroBanner';



// Mock Data
const MOCK_PRODUCTS = [
  {
    id: '1',
    title: 'MacBook Pro M2 14"',
    price: 1850,
    category: 'Electronics',
    description: 'Brand new sealed MacBook Pro M2 with 16GB RAM and 512GB SSD. Space Gray color. Warranty valid until Dec 2025.',
    location: 'New York, NY',
    postedTime: '2 hours ago',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
    ],
    seller: {
      id: 'u1',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      phone: '+1 234 567 890',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      location: 'Brooklyn, NY',
      joinDate: 'Mar 2023'
    }
  },
  {
    id: '2',
    title: 'Tesla Model 3 Performance',
    price: 45000,
    category: 'Vehicles',
    description: '2022 Tesla Model 3 Performance. Red Multi-Coat. Full Self-Driving capability included. 15k miles.',
    location: 'Los Angeles, CA',
    postedTime: '5 hours ago',
    images: [
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1536700503339-1e4b06520771?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
    ],
    seller: {
      id: 'u2',
      name: 'Sarah Connor',
      email: 'sarah@example.com',
      phone: '+1 987 654 321',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      location: 'Los Angeles, CA',
      joinDate: 'Jan 2022'
    }
  },
  {
    id: '3',
    title: 'Modern Leather Sofa',
    price: 850,
    category: 'Furniture',
    description: 'Italian leather sofa in excellent condition. 3-seater. Cognac color. Moving sale.',
    location: 'Chicago, IL',
    postedTime: '1 day ago',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
    ],
    seller: {
      id: 'u3',
      name: 'Mike Ross',
      email: 'mike@example.com',
      phone: '+1 111 222 333',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      location: 'Chicago, IL',
      joinDate: 'Jun 2021'
    }
  },
  {
    id: '4',
    title: 'Sony A7IV Camera Body',
    price: 2200,
    category: 'Electronics',
    description: 'Like new Sony A7IV. Shutter count < 5000. Comes with original box and accessories.',
    location: 'San Francisco, CA',
    postedTime: '30 mins ago',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
    ],
    seller: {
      id: 'u4',
      name: 'Emily Blunt',
      email: 'emily@example.com',
      phone: '+1 555 666 777',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      location: 'San Francisco, CA',
      joinDate: 'Sep 2023'
    }
  },
];

const CATEGORIES = ['All', 'Electronics', 'Vehicles', 'Furniture', 'Fashion', 'Properties'];

const Home = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProducts = activeCategory === 'All'
    ? MOCK_PRODUCTS
    : MOCK_PRODUCTS.filter(p => p.category === activeCategory);

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
              key={product.id}
              product={product}
              onClick={setSelectedProduct}
            />
          ))}
        </div>

        {/* Product Modal */}
        <ProductModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      </Layout>
      <Footer />
    </>
  );
};

export default Home;
