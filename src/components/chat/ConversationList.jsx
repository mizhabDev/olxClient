import React, { memo } from "react";
import { motion } from "framer-motion";
import { Search, User } from "lucide-react";

const ConversationList = memo(({
    conversations,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedChat,
    setSelectedChat,
    isMobileView
}) => {
    const filteredConversations = conversations.filter(conv =>
        conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.product.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
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
});

ConversationList.displayName = "ConversationList";

export default ConversationList;
