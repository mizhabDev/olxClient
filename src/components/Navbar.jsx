import React, { useState } from "react";
import { Search, Bell, MessageCircle, Plus, Menu, X, User } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <nav className="sticky top-0 z-50 w-full bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                            <span className="text-white font-bold text-lg">OlX</span>
                        </div>
                        <span className="text-xl font-bold text-white hidden sm:block"></span>
                    </Link>

                    {/* Search Bar - Desktop */}
                    <div className="hidden md:flex flex-1 max-w-xl mx-8">
                        <div className="relative w-full group">
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

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-2">
                        {/* Sell Button */}
                        <Link
                            to="/sell"
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/20 transition-all duration-200 hover:-translate-y-0.5"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Sell</span>
                        </Link>

                        {/* Notifications */}
                        <button className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
                        </button>

                        {/* Messages */}
                        <button className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                            <MessageCircle className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
                        </button>

                        {/* Profile */}
                        <Link
                            to="/login"
                            className="flex items-center gap-2 p-1.5 pr-4 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                        >
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm font-medium">Login</span>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-[#0f172a]/95 backdrop-blur-xl border-t border-white/10">
                    <div className="px-4 py-4 space-y-4">
                        {/* Mobile Search */}
                        <div className="relative w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search for anything..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50 transition-all"
                            />
                        </div>

                        {/* Mobile Links */}
                        <div className="flex flex-col gap-2">
                            <Link
                                to="/sell"
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl"
                            >
                                <Plus className="w-5 h-5" />
                                <span>Sell Something</span>
                            </Link>

                            <div className="flex gap-2">
                                <button className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 text-gray-300">
                                    <Bell className="w-5 h-5" />
                                    <span>Notifications</span>
                                </button>
                                <button className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 text-gray-300">
                                    <MessageCircle className="w-5 h-5" />
                                    <span>Messages</span>
                                </button>
                            </div>

                            <Link
                                to="/login"
                                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 text-gray-300"
                            >
                                <User className="w-5 h-5" />
                                <span>Login / Sign Up</span>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
