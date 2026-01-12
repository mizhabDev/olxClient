import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, Lock, Database, Bell, Users, FileText } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Layout from '../../components/home/Layout';

const PrivacyPolicyPage = () => {
    const lastUpdated = "January 12, 2026";

    const sections = [
        {
            icon: <Database className="w-5 h-5" />,
            title: "Information We Collect",
            content: [
                "Personal information (name, email, phone number) when you create an account",
                "Product listing details including images, descriptions, and pricing",
                "Location data to show relevant local listings",
                "Device information and browsing patterns to improve our services",
                "Communication data from messages between buyers and sellers"
            ]
        },
        {
            icon: <Eye className="w-5 h-5" />,
            title: "How We Use Your Information",
            content: [
                "To provide and maintain our marketplace services",
                "To connect buyers with sellers in their local area",
                "To send important notifications about your account and transactions",
                "To improve our platform based on usage patterns",
                "To prevent fraud and ensure platform security"
            ]
        },
        {
            icon: <Users className="w-5 h-5" />,
            title: "Information Sharing",
            content: [
                "We share your public profile information with other users",
                "Seller contact information is shared with interested buyers",
                "We may share data with service providers who help operate our platform",
                "We will disclose information if required by law or to protect our rights",
                "We never sell your personal data to third-party advertisers"
            ]
        },
        {
            icon: <Lock className="w-5 h-5" />,
            title: "Data Security",
            content: [
                "We use industry-standard encryption to protect your data",
                "Access to personal information is restricted to authorized personnel only",
                "We regularly audit our systems for potential vulnerabilities",
                "All payment processing is handled by secure third-party providers",
                "We maintain strict data access logs and monitoring"
            ]
        },
        {
            icon: <Bell className="w-5 h-5" />,
            title: "Your Rights & Choices",
            content: [
                "You can access and update your personal information at any time",
                "You can request deletion of your account and associated data",
                "You can opt out of marketing communications",
                "You can disable location services in your device settings",
                "You can request a copy of your data in a portable format"
            ]
        },
        {
            icon: <FileText className="w-5 h-5" />,
            title: "Cookies & Tracking",
            content: [
                "We use essential cookies to maintain your session and preferences",
                "Analytics cookies help us understand how users interact with our platform",
                "You can manage cookie preferences through your browser settings",
                "Third-party services may set their own cookies for functionality"
            ]
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
                        className="mb-12"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6">
                            <Shield className="w-4 h-4 text-purple-400" />
                            <span className="text-purple-400 text-sm font-medium">Your Privacy Matters</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Privacy Policy
                        </h1>
                        <p className="text-gray-400">
                            Last updated: {lastUpdated}
                        </p>
                    </motion.div>

                    {/* Introduction */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 mb-8"
                    >
                        <p className="text-gray-300 leading-relaxed">
                            At Sellzy, we take your privacy seriously. This Privacy Policy explains how we collect,
                            use, disclose, and safeguard your information when you use our marketplace platform.
                            By using Sellzy, you agree to the collection and use of information in accordance with this policy.
                        </p>
                    </motion.div>

                    {/* Policy Sections */}
                    <div className="space-y-6">
                        {sections.map((section, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + index * 0.05 }}
                                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center text-purple-400">
                                        {section.icon}
                                    </div>
                                    <h2 className="text-xl font-bold text-white">{section.title}</h2>
                                </div>
                                <ul className="space-y-3">
                                    {section.content.map((item, itemIndex) => (
                                        <li key={itemIndex} className="flex items-start gap-3 text-gray-300">
                                            <span className="text-purple-400 mt-1.5">•</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>

                    {/* Contact */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-8 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-6 md:p-8"
                    >
                        <h3 className="text-xl font-bold text-white mb-3">Questions About Privacy?</h3>
                        <p className="text-gray-300 mb-4">
                            If you have any questions about this Privacy Policy or our data practices,
                            please contact us at:
                        </p>
                        <a
                            href="mailto:privacy@sellzy.com"
                            className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                        >
                            privacy@sellzy.com
                        </a>
                    </motion.div>
                </div>
            </Layout>
            <Footer />
        </>
    );
};

export default PrivacyPolicyPage;
