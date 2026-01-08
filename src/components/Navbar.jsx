import React, { useState } from "react";
import { Menu, X, Home, ShoppingBag, MessageCircle, Info, LogIn } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../assets/images/logoImage.png";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    // Check if current path matches for active state
    const isActive = (path) => location.pathname === path;

    // Navigation items in specified order: home, sell, chat, about, login
    const navItems = [
        { path: "/", label: "Home", icon: Home },
        { path: "/sell", label: "Sell", icon: ShoppingBag },
        { path: "/chat", label: "Chat", icon: MessageCircle },
        { path: "/about", label: "About", icon: Info },
        { path: "/login", label: "Login", icon: LogIn },
    ];

    return (
        <div className="sticky top-0 z-50 w-full px-4 sm:px-6 lg:px-8 pt-4">
            <nav className="max-w-[93rem] mx-auto bg-[#0f172a]/50 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg shadow-orange-500/5">
                <div className="px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">

                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-8 h-8 rounded-lg overflow-hidden shadow-lg shadow-orange-500/20">
                                <img
                                    src={Logo}
                                    alt="Sellzy Logo"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                                sellzy
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-6">
                            {navItems.map((item) => {
                                const active = isActive(item.path);
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`
                                            flex items-center gap-2 text-sm font-medium transition-all duration-200
                                            ${active
                                                ? 'text-orange-400 font-semibold'
                                                : 'text-gray-400 hover:text-white'
                                            }
                                        `}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                        >
                            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`
                    md:hidden overflow-hidden transition-all duration-300 ease-in-out
                    ${isMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}
                `}>
                    <div className="border-t border-white/10 px-6 py-3">
                        <div className="flex flex-col gap-1">
                            {navItems.map((item) => {
                                const active = isActive(item.path);
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`
                                            flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                                            transition-all duration-200
                                            ${active
                                                ? 'text-orange-400 bg-orange-500/10 font-semibold'
                                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }
                                        `}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
