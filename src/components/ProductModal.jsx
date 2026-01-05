import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Clock, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProductModal = ({ productId, isOpen, onClose }) => {
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 Fetch product when modal opens
  useEffect(() => {
    if (!isOpen || !productId) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(
          `${API_BASE_URL}/api/product/${productId}`,
          { withCredentials: true }
        );
        console.log(res.data.data)

        setProduct(res.data.data);
      } catch (err) {
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [isOpen, productId]);

  // 🔹 Reset state on close
  const handleClose = () => {
    setProduct(null);
    setError(null);
    setLoading(false);
    onClose();
  };

  const handleChat = () => {
    handleClose();
    navigate("/chat");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0f172a]/90 border border-white/10 shadow-2xl"
        >
          {/* Close */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/30 text-white hover:bg-white/20"
          >
            <X />
          </button>

          {/* Loading */}
          {loading && (
            <div className="p-12 text-center text-white text-lg">
              Loading product…
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="p-12 text-center text-red-500">
              {error}
            </div>
          )}

          {/* Content */}
          {!loading && product && (
            <div className="flex flex-col md:flex-row">
              {/* Image */}
              <div className="w-full md:w-1/2 bg-black/20">
                <img
                  src={product.productPhotoSrc?.[0] || "/placeholder.png"}
                  alt={product.productName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details */}
              <div className="w-full md:w-1/2 p-6 space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-white">
                    {product.productName}
                  </h2>
                  <p className="text-2xl font-semibold text-purple-400">
                    ₹{product.productPrice?.toLocaleString()}
                  </p>
                </div>

                <div className="space-y-2 text-gray-300">
                  <div className="flex items-center">
                    <MapPin className="mr-2" />
                    {product.productLocation}
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2" />
                    {new Date(product.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <p className="text-gray-200">
                    {product.productDescription}
                  </p>
                </div>

                <button
                  onClick={handleChat}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold flex items-center justify-center gap-2"
                >
                  <MessageCircle />
                  Chat with Seller
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProductModal;
