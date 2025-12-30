import React from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Clock, MessageCircle, Share2, Flag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';



const ProductModal = ({ product, isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen || !product) return null;

  const handleChat = () => {
    onClose();
    navigate('/chat');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 shadow-2xl shadow-purple-500/20 flex flex-col md:flex-row"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 text-white hover:bg-white/20 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Left: Image Section */}
          <div className="w-full md:w-1/2 bg-black/20 relative min-h-[300px] md:min-h-full">
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 flex space-x-2">
              {product.images.map((img, idx) => (
                <div key={idx} className="w-16 h-16 rounded-lg overflow-hidden border-2 border-white/20 cursor-pointer hover:border-purple-500 transition-colors">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Details Section */}
          <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="px-3 py-1 text-sm font-medium bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">
                  {product.category}
                </span>
                <span className="text-gray-400 text-sm flex items-center">
                  <Clock className="h-4 w-4 mr-1" /> {product.postedTime}
                </span>
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-2">{product.title}</h2>
              <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                ${product.price.toLocaleString()}
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center text-gray-300">
                <MapPin className="h-5 w-5 mr-2 text-purple-400" />
                {product.location}
              </div>
              
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Description</h3>
                <p className="text-gray-200 leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Seller Info */}
            <div className="mt-auto">
              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-white/10 mb-6">
                <div className="flex items-center space-x-3">
                  <img
                    src={product.seller.avatar}
                    alt={product.seller.name}
                    className="w-12 h-12 rounded-full border-2 border-purple-500/30"
                  />
                  <div>
                    <p className="font-semibold text-white">{product.seller.name}</p>
                    <p className="text-xs text-gray-400">Member since {product.seller.joinDate}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                    <Share2 className="h-5 w-5" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-red-400 transition-colors">
                    <Flag className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <button
                onClick={handleChat}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-lg shadow-lg shadow-purple-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"
              >
                <MessageCircle className="h-6 w-6" />
                <span>Chat with Seller</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProductModal;
