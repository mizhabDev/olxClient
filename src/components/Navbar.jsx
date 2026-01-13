import React, { useState, useEffect, useRef } from "react";
import { Menu, X, Home, ShoppingBag, MessageCircle, Info, LogIn, User, LogOut, Settings, ChevronDown, Heart } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../assets/images/logoImage.png";

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const userMenuRef = useRef(null);

    // Fetch user data
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/api/user/userdetails`, {
                    withCredentials: true,
                });
                if (response.data.success) {
                    setUser(response.data.data);
                }
            } catch (err) {
                // User not logged in
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [location.pathname]); // Refetch on route change

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Check if current path matches for active state
    const isActive = (path) => location.pathname === path;

    // Handle logout
    const handleLogout = async () => {
        try {
            await axios.post(`${BACKEND_URL}/api/auth/logout`, {}, { withCredentials: true });
            setUser(null);
            setIsUserMenuOpen(false);
            navigate("/");
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    // Navigation items (excluding login - handled separately)
    const navItems = [
        { path: "/", label: "Home", icon: Home },
        { path: "/sell", label: "Sell", icon: ShoppingBag },
        { path: "/chat", label: "Chat", icon: MessageCircle },
        { path: "/about", label: "About", icon: Info },
    ];

    // User dropdown items
    const userMenuItems = [
        { path: "/profile", label: "Profile", icon: User },
        { path: "/wishlist", label: "My Wishlist", icon: Heart },
        { path: "/my-listings", label: "My Listings", icon: ShoppingBag },
    ];

    return (
        <div className="sticky top-0 z-50 w-full px-4 sm:px-6 lg:px-8 pt-4">
            <nav className="max-w-[93rem] mx-auto bg-[#0f172a]/50 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg shadow-purple-500/5">
                <div className="px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">

                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-8 h-8 rounded-lg overflow-hidden shadow-lg shadow-purple-500/20">
                                <img
                                    src={Logo}
                                    alt="Sellzy Logo"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
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
                                                ? 'text-purple-400 font-semibold'
                                                : 'text-gray-400 hover:text-white'
                                            }
                                        `}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {item.label}
                                    </Link>
                                );
                            })}

                            {/* Auth Section */}
                            {loading ? (
                                <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
                            ) : user ? (
                                /* User Avatar & Dropdown */
                                <div className="relative" ref={userMenuRef}>
                                    <button
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className="flex items-center gap-2 p-1 rounded-full hover:bg-white/10 transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center overflow-hidden border-2 border-transparent hover:border-purple-400 transition-colors">
                                            {user.photo ? (
                                                <img
                                                    src={user.photo.startsWith('http') ? user.photo : `${BACKEND_URL}${user.photo}`}
                                                    alt={user.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <User className="w-4 h-4 text-white" />
                                            )}
                                        </div>
                                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isUserMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl overflow-hidden">
                                            {/* User Info */}
                                            <div className="px-4 py-3 border-b border-white/10">
                                                <p className="text-white font-medium truncate">{user.name}</p>
                                                <p className="text-gray-400 text-sm truncate">{user.email}</p>
                                            </div>

                                            {/* Menu Items */}
                                            <div className="py-2">
                                                {userMenuItems.map((item) => {
                                                    const Icon = item.icon;
                                                    return (
                                                        <Link
                                                            key={item.path}
                                                            to={item.path}
                                                            onClick={() => setIsUserMenuOpen(false)}
                                                            className="flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                                                        >
                                                            <Icon className="w-4 h-4" />
                                                            {item.label}
                                                        </Link>
                                                    );
                                                })}
                                            </div>

                                            {/* Logout */}
                                            <div className="border-t border-white/10 py-2">
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center gap-3 px-4 py-2.5 w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* Login Button */
                                <Link
                                    to="/login"
                                    className={`
                                        flex items-center gap-2 text-sm font-medium transition-all duration-200
                                        ${isActive('/login')
                                            ? 'text-purple-400 font-semibold'
                                            : 'text-gray-400 hover:text-white'
                                        }
                                    `}
                                >
                                    <LogIn className="w-4 h-4" />
                                    Login
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center gap-3">
                            {/* Mobile User Avatar */}
                            {!loading && user && (
                                <Link to="/profile" className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center overflow-hidden">
                                    {user.photo ? (
                                        <img
                                            src={user.photo.startsWith('http') ? user.photo : `${BACKEND_URL}${user.photo}`}
                                            alt={user.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <User className="w-4 h-4 text-white" />
                                    )}
                                </Link>
                            )}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                            >
                                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`
                    md:hidden overflow-hidden transition-all duration-300 ease-in-out
                    ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
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
                                                ? 'text-purple-400 bg-purple-500/10 font-semibold'
                                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }
                                        `}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {item.label}
                                    </Link>
                                );
                            })}

                            {/* Mobile Auth */}
                            {user ? (
                                <>
                                    <Link
                                        to="/profile"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                                    >
                                        <User className="w-5 h-5" />
                                        Profile
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMenuOpen(false);
                                        }}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                                        transition-all duration-200
                                        ${isActive('/login')
                                            ? 'text-purple-400 bg-purple-500/10 font-semibold'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }
                                    `}
                                >
                                    <LogIn className="w-5 h-5" />
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
