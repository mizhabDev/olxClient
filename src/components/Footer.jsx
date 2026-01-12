import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import Logo from "../assets/images/logoImage.png";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        company: [
            { label: "About Us", to: "/about" },
            { label: "Contact Us", to: "/contact" },
        ],
        support: [
            { label: "FAQ", to: "/faq" },
        ],
        legal: [
            { label: "Terms of Service", to: "/terms" },
            { label: "Privacy Policy", to: "/privacy" },
        ],
    };

    const socialLinks = [
        { icon: Facebook, href: "#", label: "Facebook" },
        { icon: Twitter, href: "#", label: "Twitter" },
        { icon: Instagram, href: "#", label: "Instagram" },
        { icon: Linkedin, href: "#", label: "LinkedIn" },
    ];

    return (
        <footer className="w-full bg-[#0f172a]/90 backdrop-blur-xl border-t border-white/10 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Footer Content */}
                <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <Link to="/" className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-purple-500/20">
                                <img
                                    src={Logo}
                                    alt="Sellzy Logo"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Sellzy</span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
                            Your trusted marketplace for buying and selling. Connect with buyers and sellers in your community.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 text-gray-400 text-sm">
                                <Mail className="w-4 h-4 text-purple-400" />
                                <span>support@sellzy.com</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-400 text-sm">
                                <Phone className="w-4 h-4 text-purple-400" />
                                <span>+91 1800-123-4567</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-400 text-sm">
                                <MapPin className="w-4 h-4 text-purple-400" />
                                <span>Mumbai, India</span>
                            </div>
                        </div>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Company</h3>
                        <ul className="space-y-2">
                            {footerLinks.company.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.to}
                                        className="text-gray-400 text-sm hover:text-purple-400 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Support</h3>
                        <ul className="space-y-2">
                            {footerLinks.support.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.to}
                                        className="text-gray-400 text-sm hover:text-purple-400 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2">
                            {footerLinks.legal.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.to}
                                        className="text-gray-400 text-sm hover:text-purple-400 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 text-sm">
                        © {currentYear} Sellzy. All rights reserved.
                    </p>

                    {/* Social Links */}
                    <div className="flex items-center gap-3">
                        {socialLinks.map((social) => (
                            <a
                                key={social.label}
                                href={social.href}
                                aria-label={social.label}
                                className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:border-purple-500/50 transition-all"
                            >
                                <social.icon className="w-4 h-4" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
