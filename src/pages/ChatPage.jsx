import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { ConversationList, ChatWindow } from "../components/chat";

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;

const ChatPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const conversationIdFromUrl = searchParams.get("conversationId");

    // State
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [isMobileView, setIsMobileView] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    const messagesEndRef = useRef(null);

    // Fetch conversations from API
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                setLoading(true);

                // Fetch current user info first
                const userResponse = await axios.get(`${BACKEND_URL}/api/user/userdetails`, {
                    withCredentials: true,
                });
                if (userResponse.data.success) {
                    setCurrentUserId(userResponse.data.data._id);
                }

                const response = await axios.get(`${BACKEND_URL}/api/message/conversation`, {
                    withCredentials: true,
                });

                const data = response.data;
                const userId = userResponse.data.data?._id;

                if (data.success) {
                    const transformedConversations = data.data.map((conv) => {
                        const isBuyer = conv.buyerId?._id === userId;
                        const otherUser = isBuyer ? conv.sellerId : conv.buyerId;

                        return {
                            id: conv._id,
                            name: otherUser?.name || "Unknown",
                            lastMessage: conv.lastMessage || "",
                            time: new Date(conv.lastMessageAt || conv.updatedAt).toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true
                            }),
                            unread: 0,
                            online: false,
                            avatar: otherUser?.photo || null,
                            product: conv.productId?.productName || "Product",
                            sellerId: conv.sellerId,
                            buyerId: conv.buyerId,
                            productId: conv.productId
                        };
                    });
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

    // Fetch messages when a conversation is selected
    useEffect(() => {
        if (!selectedChat) {
            setMessages([]);
            return;
        }

        const fetchMessages = async () => {
            try {
                setMessagesLoading(true);
                const response = await axios.get(
                    `${BACKEND_URL}/api/message/messages/${selectedChat.id}`,
                    { withCredentials: true }
                );

                if (response.data.success) {
                    const transformedMessages = response.data.data.map((msg) => ({
                        id: msg._id,
                        senderId: msg.senderId?._id === currentUserId ? "me" : "other",
                        text: msg.message,
                        time: new Date(msg.createdAt).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true
                        }),
                        status: msg.status || "sent"
                    }));
                    setMessages(transformedMessages);
                }
            } catch (err) {
                console.error("Error fetching messages:", err);
            } finally {
                setMessagesLoading(false);
            }
        };

        fetchMessages();
    }, [selectedChat, currentUserId]);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Handlers
    const handleBack = useCallback(() => {
        if (selectedChat && isMobileView) {
            setSelectedChat(null);
        } else {
            navigate(-1);
        }
    }, [selectedChat, isMobileView, navigate]);

    const handleSendMessage = useCallback(async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedChat) return;

        const messageText = newMessage.trim();
        setNewMessage("");

        const optimisticMessage = {
            id: `temp-${Date.now()}`,
            senderId: "me",
            text: messageText,
            time: new Date().toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true
            }),
            status: "sending"
        };
        setMessages(prev => [...prev, optimisticMessage]);

        try {
            const response = await axios.post(
                `${BACKEND_URL}/api/message/send`,
                {
                    conversationId: selectedChat.id,
                    message: messageText
                },
                { withCredentials: true }
            );

            if (response.data.success) {
                const realMessage = {
                    id: response.data.data._id,
                    senderId: "me",
                    text: response.data.data.message,
                    time: new Date(response.data.data.createdAt).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true
                    }),
                    status: "sent"
                };
                setMessages(prev =>
                    prev.map(msg => msg.id === optimisticMessage.id ? realMessage : msg)
                );
            }
        } catch (err) {
            console.error("Error sending message:", err);
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === optimisticMessage.id
                        ? { ...msg, status: "failed" }
                        : msg
                )
            );
        }
    }, [newMessage, selectedChat]);

    return (
        <div className="min-h-screen p-4 md:p-8">
            {/* Back Button */}
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
                    <ConversationList
                        conversations={conversations}
                        loading={loading}
                        error={error}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        selectedChat={selectedChat}
                        setSelectedChat={setSelectedChat}
                        isMobileView={isMobileView}
                    />
                    <ChatWindow
                        selectedChat={selectedChat}
                        messages={messages}
                        messagesLoading={messagesLoading}
                        newMessage={newMessage}
                        setNewMessage={setNewMessage}
                        handleSendMessage={handleSendMessage}
                        handleBack={handleBack}
                        messagesEndRef={messagesEndRef}
                        isMobileView={isMobileView}
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default ChatPage;
