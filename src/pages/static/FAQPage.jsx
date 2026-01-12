import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, Search, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Layout from '../../components/home/Layout';

const FAQPage = () => {
    const [openIndex, setOpenIndex] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const faqs = [
        {
            category: "Getting Started",
            questions: [
                {
                    q: "How do I create an account on Sellzy?",
                    a: "Click the 'Sign Up' button on the homepage and fill in your details including name, email, and password. You can also sign up using your Google account for faster registration."
                },
                {
                    q: "Is Sellzy free to use?",
                    a: "Yes! Creating an account and listing items is completely free. We want to make it easy for everyone to buy and sell locally."
                },
                {
                    q: "How do I list an item for sale?",
                    a: "Once logged in, click 'Sell' in the navigation bar. Upload photos of your item, add a title, description, set your price, and choose a category. Your listing will be live immediately."
                }
            ]
        },
        {
            category: "Buying",
            questions: [
                {
                    q: "How do I contact a seller?",
                    a: "On any product page, click the 'Chat with Seller' button. This opens a direct chat where you can ask questions, negotiate prices, and arrange meetups."
                },
                {
                    q: "Is it safe to buy on Sellzy?",
                    a: "We take safety seriously. Always meet in public places, inspect items before paying, and use our in-app chat for communication. Never share personal financial information."
                },
                {
                    q: "Can I negotiate the price?",
                    a: "Absolutely! Use the chat feature to negotiate directly with sellers. Many sellers are open to reasonable offers."
                }
            ]
        },
        {
            category: "Selling",
            questions: [
                {
                    q: "How do I make my listing stand out?",
                    a: "Use high-quality photos with good lighting, write detailed descriptions, set competitive prices, and respond quickly to inquiries."
                },
                {
                    q: "How do I edit or delete my listing?",
                    a: "Go to your Profile page, find the listing you want to modify, and click the edit or delete button."
                },
                {
                    q: "What items can I sell?",
                    a: "You can sell most legal items including electronics, furniture, clothing, vehicles, and more. Prohibited items include illegal goods, weapons, and counterfeit products."
                }
            ]
        },
        {
            category: "Account & Safety",
            questions: [
                {
                    q: "How do I reset my password?",
                    a: "Click 'Forgot Password' on the login page, enter your email, and we'll send you a reset link."
                },
                {
                    q: "How do I report a suspicious listing or user?",
                    a: "Use the report button on the listing or contact our support team at support@sellzy.com. We take reports seriously and investigate all claims."
                },
                {
                    q: "How do I delete my account?",
                    a: "Contact our support team at support@sellzy.com with your request. Please note that this action is irreversible."
                }
            ]
        }
    ];

    const toggleFAQ = (categoryIndex, questionIndex) => {
        const key = `${categoryIndex}-${questionIndex}`;
        setOpenIndex(openIndex === key ? null : key);
    };

    const filteredFaqs = faqs.map(category => ({
        ...category,
        questions: category.questions.filter(
            faq =>
                faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faq.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(category => category.questions.length > 0);

    return (
        <>
            <Navbar />
            <Layout>
                <div className="min-h-[60vh] py-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6">
                            <HelpCircle className="w-4 h-4 text-purple-400" />
                            <span className="text-purple-400 text-sm font-medium">Help Center</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-xl text-gray-400 max-w-xl mx-auto mb-8">
                            Find quick answers to common questions about using Sellzy
                        </p>

                        {/* Search */}
                        <div className="max-w-md mx-auto relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search for answers..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                            />
                        </div>
                    </motion.div>

                    {/* FAQ Categories */}
                    <div className="space-y-8">
                        {filteredFaqs.map((category, categoryIndex) => (
                            <motion.div
                                key={categoryIndex}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: categoryIndex * 0.1 }}
                            >
                                <h2 className="text-xl font-bold text-white mb-4">{category.category}</h2>
                                <div className="space-y-3">
                                    {category.questions.map((faq, questionIndex) => {
                                        const key = `${categoryIndex}-${questionIndex}`;
                                        const isOpen = openIndex === key;

                                        return (
                                            <div
                                                key={questionIndex}
                                                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
                                            >
                                                <button
                                                    onClick={() => toggleFAQ(categoryIndex, questionIndex)}
                                                    className="w-full p-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                                                >
                                                    <span className="text-white font-medium pr-4">{faq.q}</span>
                                                    <ChevronDown
                                                        className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                                                    />
                                                </button>
                                                <AnimatePresence>
                                                    {isOpen && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="px-5 pb-5 text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                                                                {faq.a}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Still Need Help */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-12 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-8 text-center"
                    >
                        <MessageCircle className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-2">Still Have Questions?</h3>
                        <p className="text-gray-400 mb-6">
                            Can't find what you're looking for? We're here to help!
                        </p>
                        <Link
                            to="/contact"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all"
                        >
                            Contact Support
                        </Link>
                    </motion.div>
                </div>
            </Layout>
            <Footer />
        </>
    );
};

export default FAQPage;
