import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
    Heart,
    ArrowLeft,
    Trash2,
    MapPin,
    ShoppingBag,
    MessageCircle,
    ExternalLink
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Layout from "../components/home/Layout";

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;

const WishlistPage = () => {
    const navigate = useNavigate();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [removingId, setRemovingId] = useState(null);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await axios.get(
                    `${BACKEND_URL}/api/wishlist`,
                    { withCredentials: true }
                );

                if (res.data.wishlist) {
                    setWishlist(res.data.wishlist || []);
                }
            } catch (err) {
                console.error("Failed to fetch wishlist:", err);
                setError("Failed to load wishlist. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchWishlist();
    }, []);

    const handleRemoveFromWishlist = async (productId) => {
        try {
            setRemovingId(productId);
            await axios.delete(
                `${BACKEND_URL}/api/wishlist/remove/${productId}`,
                { withCredentials: true }
            );
            setWishlist(prev => prev.filter(item => item._id !== productId));
        } catch (err) {
            console.error("Failed to remove from wishlist:", err);
        } finally {
            setRemovingId(null);
        }
    };

    const handleViewProduct = (productId) => {
        navigate(`/product/${productId}`);
    };

    const handleBack = () => {
        navigate(-1);
    };

    const getImageSrc = (product) => {
        if (Array.isArray(product.productPhotoSrc) && product.productPhotoSrc.length > 0) {
            const rawSrc = product.productPhotoSrc[0];
            return rawSrc.startsWith("http") ? rawSrc : `${BACKEND_URL}${rawSrc}`;
        }
        return "/placeholder.png";
    };

    // Loading State
    if (loading) {
        return (
            <>
                <Navbar />
                <Layout>
                    <div className="min-h-[60vh] flex items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center"
                        >
                            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-xl text-gray-300">Loading wishlist…</p>
                        </motion.div>
                    </div>
                </Layout>
                <Footer />
            </>
        );
    }

    // Error State
    if (error) {
        return (
            <>
                <Navbar />
                <Layout>
                    <div className="min-h-[60vh] flex items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center glass-panel p-8 rounded-3xl border border-white/10"
                        >
                            <p className="text-xl text-red-400 mb-4">{error}</p>
                            <button
                                onClick={handleBack}
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold"
                            >
                                Go Back
                            </button>
                        </motion.div>
                    </div>
                </Layout>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <Layout>
                <div className="min-h-[60vh] py-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <button
                            onClick={handleBack}
                            className="mb-6 flex items-center gap-2 text-gray-300 hover:text-white transition-colors group"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span className="font-medium">Back</span>
                        </button>

                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500/20 to-red-500/20">
                                <Heart className="w-8 h-8 text-pink-400" />
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-white">
                                    My Wishlist
                                </h1>
                                <p className="text-gray-400">
                                    {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Wishlist Items */}
                    {wishlist.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-16"
                        >
                            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-pink-500/10 to-red-500/10 flex items-center justify-center">
                                <Heart className="w-12 h-12 text-pink-400/50" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Your wishlist is empty</h3>
                            <p className="text-gray-400 mb-6 max-w-md mx-auto">
                                Start exploring products and save your favorites here!
                            </p>
                            <button
                                onClick={() => navigate('/')}
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold flex items-center gap-2 mx-auto transition-all"
                            >
                                <ShoppingBag className="w-5 h-5" />
                                Browse Products
                            </button>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            <AnimatePresence>
                                {wishlist.map((product, index) => (
                                    <motion.div
                                        key={product._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="group relative bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 hover:-translate-y-1"
                                    >
                                        {/* Image Section */}
                                        <div
                                            onClick={() => handleViewProduct(product._id)}
                                            className="relative overflow-hidden cursor-pointer"
                                        >
                                            <img
                                                src={getImageSrc(product)}
                                                alt={product.productName}
                                                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                                                loading="lazy"
                                            />
                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/80 to-transparent opacity-60"></div>

                                            {/* Category Badge */}
                                            <div className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-semibold rounded-full shadow-lg shadow-purple-500/20">
                                                {product.productCatogery}
                                            </div>

                                            {/* Wishlist Heart Badge */}
                                            <div className="absolute top-3 right-3">
                                                <div className="p-2 bg-red-500/80 rounded-full">
                                                    <Heart className="w-4 h-4 text-white fill-white" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="p-5 bg-[#1e293b]/40">
                                            <h3
                                                onClick={() => handleViewProduct(product._id)}
                                                className="text-lg font-bold text-white mb-2 truncate group-hover:text-orange-400 transition-colors cursor-pointer"
                                            >
                                                {product.productName}
                                            </h3>

                                            <p className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent mb-4">
                                                ₹{product.productPrice?.toLocaleString()}
                                            </p>

                                            <div className="flex items-center justify-between text-sm text-gray-400 border-t border-slate-700/50 pt-4 mb-4">
                                                <span className="flex items-center gap-1.5">
                                                    <MapPin className="w-4 h-4 text-orange-500" />
                                                    <span className="truncate max-w-[100px]">{product.productLocation || 'N/A'}</span>
                                                </span>
                                                <span className="text-xs text-gray-500 bg-[#0f172a]/50 px-2 py-1 rounded-md">
                                                    {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}
                                                </span>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleViewProduct(product._id)}
                                                    className="flex-1 py-2 px-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white text-sm font-medium flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-orange-500/20"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => handleRemoveFromWishlist(product._id)}
                                                    disabled={removingId === product._id}
                                                    className="py-2 px-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 transition-all disabled:opacity-50"
                                                >
                                                    {removingId === product._id ? (
                                                        <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </Layout>
            <Footer />
        </>
    );
};

export default WishlistPage;
