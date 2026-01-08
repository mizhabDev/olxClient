import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Send,
    ArrowLeft,
    Search,
    Smile,
    Check,
    CheckCheck,
    User
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;

const sampleMessages = [
    {
        id: 1,
        senderId: "other",
        text: "Hi! Is this product still available?",
        time: "2:25 PM",
        status: "read"
    },
    {
        id: 2,
        senderId: "me",
        text: "Yes, it's still available! Are you interested?",
        time: "2:26 PM",
        status: "read"
    },
    {
        id: 3,
        senderId: "other",
        text: "Yes! Can you tell me more about the condition?",
        time: "2:28 PM",
        status: "read"
    },
    {
        id: 4,
        senderId: "me",
        text: "It's in excellent condition, barely used for 3 months. No scratches or dents. Comes with original box and accessories.",
        time: "2:29 PM",
        status: "read"
    },
    {
        id: 5,
        senderId: "other",
        text: "Is this still available?",
        time: "2:30 PM",
        status: "delivered"
    }
];

const ChatPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const conversationIdFromUrl = searchParams.get("conversationId");

    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState(sampleMessages);
    const [newMessage, setNewMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [isMobileView, setIsMobileView] = useState(false);
    const messagesEndRef = useRef(null);

    // Fetch conversations from API
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${BACKEND_URL}/message/conversation`, {
                    withCredentials: true, // ⚠️ see Error 2
                });

                const data = response.data;

                if (data.success) {
                    // Transform API data to match component structure
                    const transformedConversations = data.data.map((conv) => ({
                        id: conv._id,
                        name: conv.sellerId?.name || conv.buyerId?.name || "Unknown",
                        lastMessage: "",
                        time: new Date(conv.updatedAt).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true
                        }),
                        unread: 0,
                        online: false,
                        avatar: null,
                        product: conv.productId?.productName || "Product",
                        sellerId: conv.sellerId,
                        buyerId: conv.buyerId,
                        productId: conv.productId
                    }));
                    setConversations(transformedConversations);
                } else {
                    setError("Failed to fetch conversations");
                }
            } catch (err) {
                setError("Error fetching conversations");
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();
    }, []);

    // Check for mobile view
    useEffect(() => {
        const checkMobile = () => {
            setIsMobileView(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Auto-select conversation from URL query parameter
    useEffect(() => {
        if (conversationIdFromUrl && conversations.length > 0 && !selectedChat) {
            const conversation = conversations.find(conv => conv.id === conversationIdFromUrl);
            if (conversation) {
                setSelectedChat(conversation);
            }
        }
    }, [conversationIdFromUrl, conversations, selectedChat]);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleBack = () => {
        if (selectedChat && isMobileView) {
            setSelectedChat(null);
        } else {
            navigate(-1);
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const message = {
            id: messages.length + 1,
            senderId: "me",
            text: newMessage,
            time: new Date().toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true
            }),
            status: "sent"
        };

        setMessages([...messages, message]);
        setNewMessage("");
    };

    const filteredConversations = conversations.filter(conv =>
        conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.product.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Conversation List Component
    const ConversationList = () => (
        <div className={`${isMobileView && selectedChat ? 'hidden' : 'flex'} flex-col h-full ${isMobileView ? 'w-full' : 'w-80 border-r border-white/10'}`}>
            {/* Header */}
            <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">Messages</h2>
                </div>
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center h-full p-4 text-center">
                        <p className="text-red-400">{error}</p>
                    </div>
                ) : filteredConversations.length === 0 ? (
                    <div className="flex items-center justify-center h-full p-4 text-center">
                        <p className="text-gray-400">No conversations yet</p>
                    </div>
                ) : (
                    filteredConversations.map((conv) => (
                        <motion.button
                            key={conv.id}
                            whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                            onClick={() => setSelectedChat(conv)}
                            className={`w-full p-4 flex items-center gap-3 border-b border-white/5 transition-colors ${selectedChat?.id === conv.id ? 'bg-white/10' : ''}`}
                        >
                            {/* Avatar */}
                            <div className="relative flex-shrink-0">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center overflow-hidden">
                                    {conv.avatar ? (
                                        <img src={conv.avatar} alt={conv.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-6 h-6 text-white" />
                                    )}
                                </div>
                                {conv.online && (
                                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#0f172a]"></div>
                                )}
                            </div>

                            {/* Chat Info */}
                            <div className="flex-1 min-w-0 text-left">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="font-semibold text-white truncate">{conv.name}</h3>
                                    <span className="text-xs text-gray-500">{conv.time}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-400 truncate">{conv.lastMessage}</p>
                                    {conv.unread > 0 && (
                                        <span className="flex-shrink-0 w-5 h-5 bg-purple-500 rounded-full text-xs text-white flex items-center justify-center">
                                            {conv.unread}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-purple-400 truncate mt-0.5">{conv.product}</p>
                            </div>
                        </motion.button>
                    ))
                )}
            </div>
        </div>
    );

    // Chat Window Component
    const ChatWindow = () => (
        <div className={`${isMobileView && !selectedChat ? 'hidden' : 'flex'} flex-col flex-1 h-full`}>
            {selectedChat ? (
                <>
                    {/* Chat Header */}
                    <div className="p-4 border-b border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {isMobileView && (
                                <button
                                    onClick={handleBack}
                                    className="p-2 rounded-full hover:bg-white/10 transition-colors mr-1"
                                >
                                    <ArrowLeft className="w-5 h-5 text-gray-400" />
                                </button>
                            )}
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center overflow-hidden">
                                    {selectedChat.avatar ? (
                                        <img src={selectedChat.avatar} alt={selectedChat.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-5 h-5 text-white" />
                                    )}
                                </div>
                                {selectedChat.online && (
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0f172a]"></div>
                                )}
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">{selectedChat.name}</h3>
                                <p className="text-xs text-gray-400">
                                    {selectedChat.online ? (
                                        <span className="text-green-400">Online</span>
                                    ) : (
                                        "Offline"
                                    )}
                                </p>
                            </div>
                        </div>

                    </div>

                    {/* Product Info Banner */}
                    <div className="px-4 py-2 bg-purple-500/10 border-b border-white/10">
                        <p className="text-sm text-purple-400">
                            Chatting about: <span className="font-semibold">{selectedChat.product}</span>
                        </p>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        <AnimatePresence>
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${message.senderId === "me" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[75%] px-4 py-3 rounded-2xl ${message.senderId === "me"
                                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-md"
                                            : "bg-white/10 text-white rounded-bl-md"
                                            }`}
                                    >
                                        <p className="text-sm leading-relaxed">{message.text}</p>
                                        <div className={`flex items-center gap-1 mt-1 ${message.senderId === "me" ? "justify-end" : ""}`}>
                                            <span className="text-xs opacity-70">{message.time}</span>
                                            {message.senderId === "me" && (
                                                message.status === "read" ? (
                                                    <CheckCheck className="w-3.5 h-3.5 text-blue-300" />
                                                ) : (
                                                    <Check className="w-3.5 h-3.5 opacity-70" />
                                                )
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    <div className="p-4 border-t border-white/10">
                        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                    <Smile className="w-5 h-5 text-gray-400 hover:text-gray-300 transition-colors" />
                                </button>
                            </div>
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-500/20 transition-all"
                            >
                                <Send className="w-5 h-5" />
                            </motion.button>
                        </form>
                    </div>
                </>
            ) : (
                /* Empty State */
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-4">
                        <Send className="w-10 h-10 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Your Messages</h3>
                    <p className="text-gray-400 max-w-sm">
                        Select a conversation to start chatting with buyers and sellers.
                    </p>
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen p-4 md:p-8">
            {/* Back Button - Only show on desktop or when no chat selected on mobile */}
            {(!isMobileView || !selectedChat) && (
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={handleBack}
                    className="mb-6 flex items-center gap-2 text-gray-300 hover:text-white transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Back</span>
                </motion.button>
            )}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto"
            >
                <div className="rounded-3xl overflow-hidden glass-panel border border-white/10 bg-[#0f172a]/40 backdrop-blur-xl shadow-2xl h-[calc(100vh-180px)] min-h-[500px] flex">
                    <ConversationList />
                    <ChatWindow />
                </div>
            </motion.div>
        </div>
    );
};

export default ChatPage;
