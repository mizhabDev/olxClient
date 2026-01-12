import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
    MapPin,
    Clock,
    MessageCircle,
    ArrowLeft,
    Heart,
    Share2,
    ChevronLeft,
    ChevronRight,
    User,
    ZoomIn,
    Shield,
    X,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;

const ProductDetailPage = () => {
    const navigate = useNavigate();
    const { productId } = useParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const [showLightbox, setShowLightbox] = useState(false);

    // Fetch product on mount
    useEffect(() => {
        if (!productId) return;

        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await axios.get(
                    `${BACKEND_URL}/api/product/${productId}`,
                    { withCredentials: true }
                );
                console.log(res.data.data);

                setProduct(res.data.data);
            } catch (err) {
                setError("Failed to load product details.");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    // Check if product is in wishlist
    useEffect(() => {
        const checkWishlist = async () => {
            try {
                const res = await axios.get(
                    `${BACKEND_URL}/api/wishlist`,
                    { withCredentials: true }
                );
                if (res.data.wishlist) {
                    const isInWishlist = res.data.wishlist.some(item => item._id === productId);
                    setIsLiked(isInWishlist);
                }
            } catch (err) {
                // User not logged in or wishlist not available
            }
        };
        if (productId) {
            checkWishlist();
        }
    }, [productId]);

    // Toggle wishlist
    const toggleWishlist = async () => {
        try {
            setWishlistLoading(true);
            if (isLiked) {
                // Remove from wishlist
                await axios.delete(
                    `${BACKEND_URL}/api/wishlist/remove/${productId}`,
                    { withCredentials: true }
                );
                setIsLiked(false);
            } else {
                // Add to wishlist
                await axios.post(
                    `${BACKEND_URL}/api/wishlist/add/${productId}`,
                    {},
                    { withCredentials: true }
                );
                setIsLiked(true);
            }
        } catch (err) {
            console.error("Wishlist error:", err);
        } finally {
            setWishlistLoading(false);
        }
    };

    // Keyboard navigation for lightbox
    const handleKeyDown = useCallback((e) => {
        if (!showLightbox) return;

        if (e.key === "ArrowRight") nextImage();
        if (e.key === "ArrowLeft") prevImage();
        if (e.key === "Escape") setShowLightbox(false);
    }, [showLightbox, product?.productPhotoSrc?.length]); // Added product?.productPhotoSrc?.length to dependencies

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    const handleChat = async () => {
        try {
            const response = await axios.post(
                `${BACKEND_URL}/api/message/conversation`,
                { productId },
                { withCredentials: true }
            );

            if (response.data.success) {
                const conversationId = response.data.data._id;
                navigate(`/chat?conversationId=${conversationId}`);
            }
        } catch (err) {
            console.error("Failed to create/get conversation:", err);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    const nextImage = () => {
        if (product?.productPhotoSrc?.length > 1) {
            setCurrentImageIndex((prev) =>
                prev === product.productPhotoSrc.length - 1 ? 0 : prev + 1
            );
        }
    };

    const prevImage = () => {
        if (product?.productPhotoSrc?.length > 1) {
            setCurrentImageIndex((prev) =>
                prev === 0 ? product.productPhotoSrc.length - 1 : prev - 1
            );
        }
    };

    const handleShare = async () => {
        try {
            await navigator.share({
                title: product?.productName,
                text: `Check out this ${product?.productName} for ₹${product?.productPrice}`,
                url: window.location.href,
            });
        } catch (err) {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
        }
    };

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center"
                >
                    <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-xl text-gray-300">Loading product…</p>
                </motion.div>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
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
        );
    }

    const images = product?.productPhotoSrc || [];
    const seller = product?.seller || product?.user || null;

    return (
        <div className="min-h-screen p-4 md:p-8">
            {/* Lightbox Modal */}
            <AnimatePresence>
                {showLightbox && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
                        onClick={() => setShowLightbox(false)}
                    >
                        <button
                            onClick={() => setShowLightbox(false)}
                            className="absolute top-4 right-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                    className="absolute left-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                                >
                                    <ChevronLeft className="w-8 h-8" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                    className="absolute right-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                                >
                                    <ChevronRight className="w-8 h-8" />
                                </button>
                            </>
                        )}

                        <motion.img
                            key={currentImageIndex}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            src={`${BACKEND_URL}${images[currentImageIndex]}`}
                            alt={product?.productName}
                            className="max-w-[90vw] max-h-[90vh] object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />

                        {/* Image Counter */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 rounded-full text-white text-sm">
                            {currentImageIndex + 1} / {images.length}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Back Button */}
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={handleBack}
                className="mb-6 flex items-center gap-2 text-gray-300 hover:text-white transition-colors group"
            >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Products</span>
            </motion.button>

            {/* Main Content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto space-y-6"
            >
                {/* Main Product Box - Two Columns */}
                <div className="rounded-3xl overflow-hidden glass-panel border border-white/10 bg-[#0f172a]/40 backdrop-blur-xl shadow-2xl">
                    <div className="flex flex-col lg:flex-row">
                        {/* Column 1: Main Image */}
                        <div className="lg:w-1/2 relative bg-black/30">
                            <div className="relative aspect-square lg:aspect-auto lg:h-[450px] overflow-hidden group">
                                <motion.img
                                    key={currentImageIndex}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                    src={
                                        images.length > 0
                                            ? `${BACKEND_URL}${images[currentImageIndex]}`
                                            : "/placeholder.png"
                                    }
                                    alt={product?.productName}
                                    className="w-full h-full object-cover cursor-pointer"
                                    onClick={() => images.length > 0 && setShowLightbox(true)}
                                />

                                {/* Zoom overlay */}
                                {images.length > 0 && (
                                    <div
                                        onClick={() => setShowLightbox(true)}
                                        className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center cursor-pointer"
                                    >
                                        <ZoomIn className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                )}

                                {/* Image Navigation */}
                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                                        >
                                            <ChevronLeft className="w-6 h-6" />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                                        >
                                            <ChevronRight className="w-6 h-6" />
                                        </button>

                                        {/* Image Indicators */}
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                            {images.map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setCurrentImageIndex(index)}
                                                    className={`w-2.5 h-2.5 rounded-full transition-all ${index === currentImageIndex
                                                        ? "bg-white w-6"
                                                        : "bg-white/40 hover:bg-white/60"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Column 2: Product Details & Seller Info */}
                        <div className="lg:w-1/2 p-6 md:p-8 flex flex-col">
                            {/* Product Name & Price */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                        {product?.productName}
                                    </h1>
                                    <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                                        ₹{product?.productPrice?.toLocaleString()}
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={toggleWishlist}
                                        disabled={wishlistLoading}
                                        className={`p-3 rounded-full border border-white/10 transition-all disabled:opacity-50 ${isLiked
                                            ? "bg-red-500/20 text-red-400"
                                            : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                                            }`}
                                    >
                                        {wishlistLoading ? (
                                            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                                        )}
                                    </button>
                                    <button
                                        onClick={handleShare}
                                        className="p-3 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                                    >
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Location & Date */}
                            <div className="space-y-3 mb-4">
                                <div className="flex items-center gap-3 text-gray-300">
                                    <div className="p-2 rounded-lg bg-white/5">
                                        <MapPin className="w-4 h-4 text-purple-400" />
                                    </div>
                                    <span className="text-sm">{product?.productLocation}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-300">
                                    <div className="p-2 rounded-lg bg-white/5">
                                        <Clock className="w-4 h-4 text-blue-400" />
                                    </div>
                                    <span className="text-sm">Posted on {new Date(product?.createdAt).toLocaleDateString("en-IN", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric"
                                    })}</span>
                                </div>
                            </div>

                            {/* Spacer to push seller info to bottom */}
                            <div className="flex-1"></div>

                            {/* Seller Details Card */}
                            <div className="mb-4">
                                <h3 className="text-md font-semibold text-white mb-3">Seller Information</h3>
                                <div className="bg-gradient-to-br from-white/5 to-white/[0.02] p-4 rounded-2xl border border-white/10">
                                    <div className="flex items-center gap-4">
                                        {/* Seller Avatar */}
                                        <div className="relative">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center overflow-hidden">
                                                {seller?.profilePic ? (
                                                    <img
                                                        src={`${BACKEND_URL}${seller.profilePic}`}
                                                        alt={seller?.name || "Seller"}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <User className="w-6 h-6 text-white" />
                                                )}
                                            </div>
                                            {seller?.isVerified && (
                                                <div className="absolute -bottom-1 -right-1 p-0.5 bg-green-500 rounded-full">
                                                    <Shield className="w-2.5 h-2.5 text-white" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Seller Info */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-white font-semibold">
                                                    {seller?.name || product?.sellerName || "Seller"}
                                                </h4>
                                                {seller?.isVerified && (
                                                    <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                                                        Verified
                                                    </span>
                                                )}
                                            </div>
                                            {seller?.createdAt && (
                                                <p className="text-gray-400 text-sm mt-1">
                                                    Member since {new Date(seller.createdAt).toLocaleDateString("en-IN", {
                                                        month: "long",
                                                        year: "numeric"
                                                    })}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Chat Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleChat}
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold flex items-center justify-center gap-3 shadow-lg shadow-purple-500/20 transition-all"
                            >
                                <MessageCircle className="w-5 h-5" />
                                Chat with Seller
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Thumbnail Strip - Below Main Box */}
                {images.length > 1 && (
                    <div className="rounded-2xl glass-panel border border-white/10 bg-[#0f172a]/40 backdrop-blur-xl p-4">
                        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
                            {images.map((src, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${index === currentImageIndex
                                        ? "border-purple-500 ring-2 ring-purple-500/30"
                                        : "border-transparent hover:border-white/30"
                                        }`}
                                >
                                    <img
                                        src={`${BACKEND_URL}${src}`}
                                        alt={`Thumbnail ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Description Box - Below Thumbnails */}
                <div className="rounded-2xl glass-panel border border-white/10 bg-[#0f172a]/40 backdrop-blur-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
                    <p className="text-gray-300 leading-relaxed">
                        {product?.productDescription}
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default ProductDetailPage;
