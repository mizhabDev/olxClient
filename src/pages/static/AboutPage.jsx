import React from 'react';
import { motion } from 'framer-motion';
import { Users, Target, Shield, Zap, Heart, Globe } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Layout from '../../components/home/Layout';

const AboutPage = () => {
    const features = [
        {
            icon: <Target className="w-6 h-6" />,
            title: "Our Mission",
            description: "To create the most trusted and convenient marketplace for buying and selling locally."
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Trust & Safety",
            description: "We prioritize user safety with verified profiles and secure messaging systems."
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Fast & Easy",
            description: "List your items in seconds and connect with buyers in your area instantly."
        },
        {
            icon: <Heart className="w-6 h-6" />,
            title: "Community First",
            description: "Building a community where everyone can find great deals and trusted sellers."
        }
    ];

    const stats = [
        { value: "10K+", label: "Active Users" },
        { value: "50K+", label: "Products Listed" },
        { value: "100+", label: "Cities Covered" },
        { value: "4.8★", label: "User Rating" }
    ];

    return (
        <>
            <Navbar />
            <Layout>
                <div className="min-h-[60vh] py-8">
                    {/* Hero Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6">
                            <Globe className="w-4 h-4 text-purple-400" />
                            <span className="text-purple-400 text-sm font-medium">About Sellzy</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                            Connecting Buyers &<br />
                            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                                Sellers Locally
                            </span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Sellzy is a modern marketplace platform that makes buying and selling
                            pre-owned items simple, safe, and sustainable.
                        </p>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
                    >
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center"
                            >
                                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-gray-400 text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>

                    {/* Features Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="grid md:grid-cols-2 gap-6 mb-16"
                    >
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
                            >
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center text-purple-400 mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                                <p className="text-gray-400">{feature.description}</p>
                            </div>
                        ))}
                    </motion.div>

                    {/* Story Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-10"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <Users className="w-6 h-6 text-purple-400" />
                            <h2 className="text-2xl font-bold text-white">Our Story</h2>
                        </div>
                        <div className="space-y-4 text-gray-300 leading-relaxed">
                            <p>
                                Sellzy was born from a simple idea: make local buying and selling as easy
                                as possible while building trust in online transactions. We noticed that
                                people had great items they no longer needed, while others were looking
                                for affordable alternatives to buying new.
                            </p>
                            <p>
                                Our platform bridges this gap with a modern, user-friendly interface that
                                prioritizes safety and convenience. Whether you're decluttering your home,
                                hunting for a bargain, or running a small business, Sellzy is designed to
                                meet your needs.
                            </p>
                            <p>
                                We believe in the power of local communities and sustainable consumption.
                                Every transaction on Sellzy helps reduce waste and keeps great products
                                in circulation.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </Layout>
            <Footer />
        </>
    );
};

export default AboutPage;
