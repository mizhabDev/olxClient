import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, CheckCircle } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Layout from '../../components/home/Layout';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, you'd send this to your backend
        console.log('Form submitted:', formData);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const contactInfo = [
        {
            icon: <Mail className="w-5 h-5" />,
            label: "Email Us",
            value: "support@sellzy.com",
            href: "mailto:support@sellzy.com"
        },
        {
            icon: <Phone className="w-5 h-5" />,
            label: "Call Us",
            value: "+91 1800-123-4567",
            href: "tel:+911800123567"
        },
        {
            icon: <MapPin className="w-5 h-5" />,
            label: "Visit Us",
            value: "Mumbai, Maharashtra, India",
            href: null
        },
        {
            icon: <Clock className="w-5 h-5" />,
            label: "Working Hours",
            value: "Mon - Sat: 9AM - 6PM",
            href: null
        }
    ];

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
                            <MessageCircle className="w-4 h-4 text-purple-400" />
                            <span className="text-purple-400 text-sm font-medium">Get In Touch</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Contact Us
                        </h1>
                        <p className="text-xl text-gray-400 max-w-xl mx-auto">
                            Have questions or need help? We're here for you. Reach out and we'll respond as soon as we can.
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Contact Info Cards */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="space-y-4"
                        >
                            {contactInfo.map((info, index) => (
                                <div
                                    key={index}
                                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
                                            {info.icon}
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm mb-1">{info.label}</p>
                                            {info.href ? (
                                                <a
                                                    href={info.href}
                                                    className="text-white font-medium hover:text-purple-400 transition-colors"
                                                >
                                                    {info.value}
                                                </a>
                                            ) : (
                                                <p className="text-white font-medium">{info.value}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>

                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="lg:col-span-2"
                        >
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8">
                                {submitted ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                                            <CheckCircle className="w-8 h-8 text-green-400" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                                        <p className="text-gray-400">We'll get back to you as soon as possible.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-gray-400 text-sm mb-2">Your Name</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    required
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-gray-400 text-sm mb-2">Email Address</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                                                    placeholder="you@example.com"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-gray-400 text-sm mb-2">Subject</label>
                                            <input
                                                type="text"
                                                name="subject"
                                                required
                                                value={formData.subject}
                                                onChange={handleChange}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                                                placeholder="How can we help?"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-400 text-sm mb-2">Message</label>
                                            <textarea
                                                name="message"
                                                required
                                                rows={5}
                                                value={formData.message}
                                                onChange={handleChange}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                                                placeholder="Tell us more about your inquiry..."
                                            />
                                        </div>
                                        <motion.button
                                            type="submit"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 transition-all"
                                        >
                                            <Send className="w-5 h-5" />
                                            Send Message
                                        </motion.button>
                                    </form>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </Layout>
            <Footer />
        </>
    );
};

export default ContactPage;
