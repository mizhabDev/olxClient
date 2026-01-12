import React, { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, User, Send, Smile, Check, CheckCheck } from "lucide-react";

const ChatWindow = memo(({
    selectedChat,
    messages,
    messagesLoading,
    newMessage,
    setNewMessage,
    handleSendMessage,
    handleBack,
    messagesEndRef,
    isMobileView
}) => {
    return (
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
                        {messagesLoading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-gray-400">No messages yet. Start the conversation!</p>
                            </div>
                        ) : (
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
                                                    ) : message.status === "sending" ? (
                                                        <div className="w-3 h-3 border border-white/50 border-t-transparent rounded-full animate-spin" />
                                                    ) : (
                                                        <Check className="w-3.5 h-3.5 opacity-70" />
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    <MessageInput
                        newMessage={newMessage}
                        setNewMessage={setNewMessage}
                        handleSendMessage={handleSendMessage}
                    />
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
});

// Separate MessageInput component to isolate re-renders
const MessageInput = memo(({ newMessage, setNewMessage, handleSendMessage }) => {
    return (
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
    );
});

ChatWindow.displayName = "ChatWindow";
MessageInput.displayName = "MessageInput";

export default ChatWindow;
