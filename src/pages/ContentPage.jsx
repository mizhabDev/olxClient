import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Layout from '../components/homepage/Layout';
import LogoAnimation from '../loading/LoadingAnimation';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ContentPage = () => {
    const { slug } = useParams();
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPageContent = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await axios.get(`${API_BASE_URL}/api/page/${slug}`, {
                    withCredentials: true,
                });

                if (res.data.success) {
                    setPageData(res.data.data);
                } else {
                    setError(res.data.message || 'Failed to fetch page content');
                }
            } catch (err) {
                console.error('Error fetching page content:', err);
                setError('Page not found or failed to load.');
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchPageContent();
        }
    }, [slug]);

    // Loading state
    if (loading) {
        return <LogoAnimation />;
    }

    // Error state
    if (error) {
        return (
            <>
                <Navbar />
                <Layout>
                    <div className="min-h-[60vh] flex flex-col items-center justify-center">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center max-w-md">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
                                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">Oops!</h2>
                            <p className="text-gray-400">{error}</p>
                        </div>
                    </div>
                </Layout>
                <Footer />
            </>
        );
    }

    // Format markdown content to HTML-like rendering
    const renderContent = (content) => {
        if (!content) return null;

        // Split content by lines and process
        const lines = content.split('\n');
        const elements = [];
        let currentList = [];
        let listType = null;

        const flushList = () => {
            if (currentList.length > 0) {
                elements.push(
                    <ul key={`list-${elements.length}`} className="space-y-2 my-4">
                        {currentList.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-gray-300">
                                <span className="text-orange-500 mt-1">•</span>
                                <span dangerouslySetInnerHTML={{ __html: formatInlineText(item) }} />
                            </li>
                        ))}
                    </ul>
                );
                currentList = [];
            }
        };

        const formatInlineText = (text) => {
            // Bold text
            text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
            // Links (basic)
            text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-orange-400 hover:text-orange-300 underline">$1</a>');
            return text;
        };

        lines.forEach((line, index) => {
            const trimmedLine = line.trim();

            // Empty line
            if (!trimmedLine) {
                flushList();
                elements.push(<div key={`space-${index}`} className="h-4" />);
                return;
            }

            // H3 Headers (###)
            if (trimmedLine.startsWith('### ')) {
                flushList();
                const headerText = trimmedLine.replace('### ', '');
                elements.push(
                    <h3 key={`h3-${index}`} className="text-xl font-bold text-white mt-8 mb-4 flex items-center gap-2">
                        <span dangerouslySetInnerHTML={{ __html: formatInlineText(headerText) }} />
                    </h3>
                );
                return;
            }

            // H2 Headers (##)
            if (trimmedLine.startsWith('## ')) {
                flushList();
                const headerText = trimmedLine.replace('## ', '');
                elements.push(
                    <h2 key={`h2-${index}`} className="text-2xl font-bold text-white mt-8 mb-4">
                        <span dangerouslySetInnerHTML={{ __html: formatInlineText(headerText) }} />
                    </h2>
                );
                return;
            }

            // List items (- )
            if (trimmedLine.startsWith('- ')) {
                const itemText = trimmedLine.replace('- ', '');
                currentList.push(itemText);
                return;
            }

            // Regular paragraph
            flushList();
            elements.push(
                <p key={`p-${index}`} className="text-gray-300 leading-relaxed">
                    <span dangerouslySetInnerHTML={{ __html: formatInlineText(trimmedLine) }} />
                </p>
            );
        });

        flushList();
        return elements;
    };

    return (
        <>
            <Navbar />
            <Layout>
                <div className="min-h-[60vh] py-8">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                            {pageData?.title}
                        </h1>
                        <div className="h-1 w-24 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full" />
                    </div>

                    {/* Content Card */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 lg:p-10 shadow-xl">
                        <div className="prose prose-invert max-w-none">
                            {renderContent(pageData?.content)}
                        </div>
                    </div>

                    {/* Meta Info */}
                    {pageData?.updatedAt && (
                        <div className="mt-6 text-sm text-gray-500 text-right">
                            Last updated: {new Date(pageData.updatedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </div>
                    )}
                </div>
            </Layout>
            <Footer />
        </>
    );
};

export default ContentPage;
