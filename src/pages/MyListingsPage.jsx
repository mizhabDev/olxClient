import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
    Package,
    ArrowLeft,
    Edit3,
    Trash2,
    MapPin,
    Eye,
    Plus,
    CheckCircle,
    XCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Layout from "../components/home/Layout";

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;

const MyListingsPage = () => {
    const navigate = useNavigate();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ open: false, product: null });

    useEffect(() => {
        const fetchListings = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await axios.get(
                    `${BACKEND_URL}/api/my-listings`,
                    { withCredentials: true }
                );

                if (res.data.listings) {
                    setListings(res.data.listings || []);
                }
            } catch (err) {
                console.error("Failed to fetch listings:", err);
                setError("Failed to load your listings. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, []);

    const openDeleteModal = (product) => {
        setDeleteModal({ open: true, product });
    };

    const closeDeleteModal = () => {
        setDeleteModal({ open: false, product: null });
    };

    const handleDelete = async () => {
        if (!deleteModal.product) return;
        const productId = deleteModal.product._id;

        try {
            setDeletingId(productId);
            await axios.delete(
                `${BACKEND_URL}/api/product/${productId}`,
                { withCredentials: true }
            );
            setListings(prev => prev.filter(item => item._id !== productId));
            closeDeleteModal();
        } catch (err) {
            console.error("Failed to delete listing:", err);
            alert("Failed to delete listing. Please try again.");
        } finally {
            setDeletingId(null);
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
                            <p className="text-xl text-gray-300">Loading your listings…</p>
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

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                                    <Package className="w-8 h-8 text-purple-400" />
                                </div>
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-white">
                                        My Listings
                                    </h1>
                                    <p className="text-gray-400">
                                        {listings.length} {listings.length === 1 ? 'product' : 'products'} listed
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate('/sell')}
                                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium flex items-center gap-2 transition-all"
                            >
                                <Plus className="w-5 h-5" />
                                <span className="hidden sm:inline">Add Listing</span>
                            </button>
                        </div>
                    </motion.div>

                    {/* Listings */}
                    {listings.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-16"
                        >
                            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 flex items-center justify-center">
                                <Package className="w-12 h-12 text-purple-400/50" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">No listings yet</h3>
                            <p className="text-gray-400 mb-6 max-w-md mx-auto">
                                Start selling by creating your first listing!
                            </p>
                            <button
                                onClick={() => navigate('/sell')}
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold flex items-center gap-2 mx-auto transition-all"
                            >
                                <Plus className="w-5 h-5" />
                                Create Listing
                            </button>
                        </motion.div>
                    ) : (
                        <div className="grid gap-4">
                            <AnimatePresence>
                                {listings.map((product, index) => (
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
                                                className="sm:w-48 h-48 sm:h-auto cursor-pointer overflow-hidden relative"
                                            >
                                                <img
                                                    src={getImageSrc(product)}
                                                    alt={product.productName}
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                />
                                                {/* Sold Badge */}
                                                {product.isSold && (
                                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                        <span className="px-4 py-2 bg-green-500 text-white font-bold rounded-lg">
                                                            SOLD
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 p-5 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex items-start justify-between gap-4 mb-2">
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <span className="inline-block px-2 py-1 bg-purple-500/20 text-purple-400 text-xs font-medium rounded-md">
                                                                    {product.productCatogery}
                                                                </span>
                                                                {product.isSold ? (
                                                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-md">
                                                                        <CheckCircle className="w-3 h-3" />
                                                                        Sold
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-md">
                                                                        <XCircle className="w-3 h-3" />
                                                                        Active
                                                                    </span>
                                                                )}
                                                            </div>
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
                                                        className="flex-1 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium flex items-center justify-center gap-2 transition-all"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        View
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/edit-product/${product._id}`)}
                                                        className="flex-1 py-2.5 px-4 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30 font-medium flex items-center justify-center gap-2 transition-all"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(product)}
                                                        disabled={deletingId === product._id}
                                                        className="p-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 transition-all disabled:opacity-50"
                                                    >
                                                        {deletingId === product._id ? (
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

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteModal.open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                        onClick={closeDeleteModal}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl"
                        >
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                                    <Trash2 className="w-8 h-8 text-red-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Delete Listing</h3>
                                <p className="text-gray-400 mb-6">
                                    Are you sure you want to delete{' '}
                                    <span className="text-white font-medium">"{deleteModal.product?.productName}"</span>?
                                    This action cannot be undone.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={closeDeleteModal}
                                        className="flex-1 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        disabled={deletingId}
                                        className="flex-1 py-3 px-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                                    >
                                        {deletingId ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Trash2 className="w-4 h-4" />
                                                Delete
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default MyListingsPage;
