import React from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, XCircle, AlertTriangle, Gavel, CreditCard, MessageSquare, Shield } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Layout from '../../components/home/Layout';

const TermsPage = () => {
    const lastUpdated = "January 12, 2026";

    const sections = [
        {
            icon: <CheckCircle className="w-5 h-5" />,
            title: "Acceptance of Terms",
            content: `By accessing or using Sellzy, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this platform.`
        },
        {
            icon: <Shield className="w-5 h-5" />,
            title: "User Accounts",
            content: `You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate and complete information when creating an account. You are responsible for all activities that occur under your account. You must be at least 18 years old to create an account and use our services.`
        },
        {
            icon: <FileText className="w-5 h-5" />,
            title: "Listing & Content Guidelines",
            content: `All listings must be for legal items that you own or are authorized to sell. Product descriptions must be accurate and not misleading. Images must accurately represent the item(s) for sale. Prohibited items include illegal goods, stolen property, counterfeit items, weapons, and hazardous materials.`
        },
        {
            icon: <CreditCard className="w-5 h-5" />,
            title: "Transactions",
            content: `Sellzy facilitates connections between buyers and sellers but is not a party to transactions. All negotiations, payments, and delivery arrangements are made directly between users. We recommend meeting in safe, public locations for in-person transactions. We are not responsible for the quality, safety, or legality of items listed.`
        },
        {
            icon: <MessageSquare className="w-5 h-5" />,
            title: "Communication",
            content: `Our messaging system is provided to facilitate legitimate transactions. You agree not to use our platform for spam, harassment, or fraudulent communications. We reserve the right to monitor communications for safety and compliance purposes.`
        },
        {
            icon: <AlertTriangle className="w-5 h-5" />,
            title: "Prohibited Activities",
            content: `Users must not: manipulate prices or engage in shill bidding, create multiple accounts for fraudulent purposes, circumvent our fees or policies, scrape or harvest user data, interfere with platform operations, or impersonate others.`
        },
        {
            icon: <XCircle className="w-5 h-5" />,
            title: "Termination",
            content: `We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or harm our community. Upon termination, your right to use our services will immediately cease.`
        },
        {
            icon: <Gavel className="w-5 h-5" />,
            title: "Limitation of Liability",
            content: `Sellzy is provided "as is" without warranties of any kind. We are not liable for any direct, indirect, incidental, or consequential damages arising from your use of the platform. Our total liability shall not exceed the amount you paid to use our services in the past 12 months.`
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
                            <Gavel className="w-4 h-4 text-purple-400" />
                            <span className="text-purple-400 text-sm font-medium">Legal Agreement</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Terms of Service
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
                            Welcome to Sellzy! These Terms of Service govern your use of our marketplace platform
                            and constitute a legally binding agreement between you and Sellzy. Please read these
                            terms carefully before using our services.
                        </p>
                    </motion.div>

                    {/* Terms Sections */}
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
                                <p className="text-gray-300 leading-relaxed">{section.content}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Changes Notice */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="mt-8 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-6 md:p-8"
                    >
                        <h3 className="text-xl font-bold text-white mb-3">Changes to Terms</h3>
                        <p className="text-gray-300 mb-4">
                            We may update these Terms of Service from time to time. We will notify you of any
                            material changes by posting the new terms on this page and updating the "Last updated" date.
                            Continued use of the platform after changes constitutes acceptance of the new terms.
                        </p>
                        <p className="text-gray-400 text-sm">
                            For questions about these terms, contact us at{' '}
                            <a
                                href="mailto:legal@sellzy.com"
                                className="text-purple-400 hover:text-purple-300 transition-colors"
                            >
                                legal@sellzy.com
                            </a>
                        </p>
                    </motion.div>
                </div>
            </Layout>
            <Footer />
        </>
    );
};

export default TermsPage;
