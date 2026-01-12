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
                        <div className="grid gap-4">
                            <AnimatePresence>
                                {wishlist.map((product, index) => (
                                    <motion.div
                                        key={product._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-colors"
                                    >
                                        <div className="flex flex-col sm:flex-row">
                                            {/* Image */}
                                            <div
                                                onClick={() => handleViewProduct(product._id)}
                                                className="sm:w-48 h-48 sm:h-auto cursor-pointer overflow-hidden"
                                            >
                                                <img
                                                    src={getImageSrc(product)}
                                                    alt={product.productName}
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 p-5 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex items-start justify-between gap-4 mb-2">
                                                        <div>
                                                            <span className="inline-block px-2 py-1 bg-purple-500/20 text-purple-400 text-xs font-medium rounded-md mb-2">
                                                                {product.productCatogery}
                                                            </span>
                                                            <h3
                                                                onClick={() => handleViewProduct(product._id)}
                                                                className="text-xl font-bold text-white hover:text-purple-400 cursor-pointer transition-colors"
                                                            >
                                                                {product.productName}
                                                            </h3>
                                                        </div>
                                                        <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent whitespace-nowrap">
                                                            ₹{product.productPrice?.toLocaleString()}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                                                        <MapPin className="w-4 h-4" />
                                                        <span>{product.productLocation}</span>
                                                    </div>

                                                    {product.productDescription && (
                                                        <p className="text-gray-400 text-sm line-clamp-2">
                                                            {product.productDescription}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-3 mt-4">
                                                    <button
                                                        onClick={() => handleViewProduct(product._id)}
                                                        className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium flex items-center justify-center gap-2 transition-all"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                        View Details
                                                    </button>
                                                    <button
                                                        onClick={() => handleRemoveFromWishlist(product._id)}
                                                        disabled={removingId === product._id}
                                                        className="p-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 transition-all disabled:opacity-50"
                                                    >
                                                        {removingId === product._id ? (
                                                            <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                                                        ) : (
                                                            <Trash2 className="w-5 h-5" />
                                                        )}
                                                    </button>
                                                </div>
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
