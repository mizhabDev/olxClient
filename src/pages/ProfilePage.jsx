import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
    User,
    Mail,
    Calendar,
    Heart,
    Package,
    MessageCircle,
    Settings,
    LogOut,
    ArrowLeft,
    Edit3
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;

const ProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await axios.get(
                    `${BACKEND_URL}/api/user/userDetails`,
                    { withCredentials: true }
                );

                setUser(res.data.data);

                // Fetch user's listings count
                try {
                    const listingsRes = await axios.get(
                        `${BACKEND_URL}/api/my-listings`,
                        { withCredentials: true }
                    );
                    if (listingsRes.data.listings) {
                        setListings(listingsRes.data.listings || []);
                    }
                } catch (listingsErr) {
                    // Listings fetch failed, not critical
                    console.error("Failed to fetch listings:", listingsErr);
                }
            } catch (err) {
                console.error("Failed to fetch user details:", err);
                setError("Failed to load profile. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, []);

    const handleBack = () => {
        navigate(-1);
    };

    const handleLogout = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await axios.post(
                `${BACKEND_URL}/api/auth/logout`,
                {},
                { withCredentials: true }
            );

            setUser(res.data.data);

            navigate("/login");
        } catch (err) {
            console.error("Logout failed:", err);
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
                    <p className="text-xl text-gray-300">Loading profile…</p>
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

    const memberSince = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric"
        })
        : "N/A";

    return (
        <div className="min-h-screen p-4 md:p-8">
            {/* Back Button */}
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={handleBack}
                className="mb-6 flex items-center gap-2 text-gray-300 hover:text-white transition-colors group"
            >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back</span>
            </motion.button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto space-y-6"
            >
                {/* Profile Header Card */}
                <div className="rounded-3xl overflow-hidden glass-panel border border-white/10 bg-[#0f172a]/40 backdrop-blur-xl shadow-2xl p-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        {/* Avatar Section */}
                        <div className="relative">
                            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center overflow-hidden shadow-xl shadow-purple-500/20">
                                {user?.photo ? (
                                    <img
                                        src={user.photo.startsWith('http') ? user.photo : `${BACKEND_URL}${user.photo}`}
                                        alt={user?.name || "User"}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="w-14 h-14 text-white" />
                                )}
                            </div>
                            {/* Edit Avatar Button */}
                            <button className="absolute top-0 right-0 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                                <Edit3 className="w-4 h-4 text-white" />
                            </button>
                        </div>

                        {/* User Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-bold text-white mb-2">
                                {user?.name || "User"}
                            </h1>

                            <div className="space-y-2 mt-4">
                                <div className="flex items-center justify-center md:justify-start gap-3 text-gray-300">
                                    <div className="p-2 rounded-lg bg-white/5">
                                        <Mail className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <span>{user?.email || "No email"}</span>
                                </div>
                                <div className="flex items-center justify-center md:justify-start gap-3 text-gray-300">
                                    <div className="p-2 rounded-lg bg-white/5">
                                        <Calendar className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <span>Member since {memberSince}</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold flex items-center gap-2 shadow-lg shadow-purple-500/20 transition-all"
                            >
                                <Edit3 className="w-4 h-4" />
                                Edit Profile
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleLogout}
                                className="px-6 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold flex items-center gap-2 border border-red-500/30 transition-all"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Wishlist Card */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        onClick={() => navigate('/wishlist')}
                        className="rounded-2xl glass-panel border border-white/10 bg-[#0f172a]/40 backdrop-blur-xl p-6 cursor-pointer transition-all hover:border-purple-500/30"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500/20 to-red-500/20">
                                <Heart className="w-6 h-6 text-pink-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{user?.wishlist?.length || 0}</p>
                                <p className="text-gray-400 text-sm">Wishlist Items</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* My Listings Card */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        onClick={() => navigate('/my-listings')}
                        className="rounded-2xl glass-panel border border-white/10 bg-[#0f172a]/40 backdrop-blur-xl p-6 cursor-pointer transition-all hover:border-purple-500/30"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                                <Package className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{listings.length}</p>
                                <p className="text-gray-400 text-sm">My Listings</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* My Chats Card */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        onClick={() => navigate('/chat')}
                        className="rounded-2xl glass-panel border border-white/10 bg-[#0f172a]/40 backdrop-blur-xl p-6 cursor-pointer transition-all hover:border-purple-500/30"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                                <MessageCircle className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">Chats</p>
                                <p className="text-gray-400 text-sm">View Messages</p>
                            </div>
                        </div>
                    </motion.div>

                </div>

                {/* Settings Section */}
                <div className="rounded-2xl glass-panel border border-white/10 bg-[#0f172a]/40 backdrop-blur-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-gray-400" />
                        Account Settings
                    </h3>
                    <div className="space-y-3">
                        <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group">
                            <span className="text-gray-300">Change Password</span>
                            <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group">
                            <span className="text-gray-300">Privacy Settings</span>
                            <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group">
                            <span className="text-gray-300">Notification Preferences</span>
                            <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ProfilePage;
