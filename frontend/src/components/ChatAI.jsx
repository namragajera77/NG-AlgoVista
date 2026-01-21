import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { Send, Bot, User, Loader2 } from 'lucide-react';

function ChatAi({problem, problemId}) {
    // Helper functions for localStorage
    const getStorageKey = (key) => `chat_${problemId}_${key}`;
    
    const saveToStorage = (key, value) => {
        try {
            localStorage.setItem(getStorageKey(key), JSON.stringify(value));
        } catch (error) {
            console.warn('Failed to save chat to localStorage:', error);
        }
    };
    
    const loadFromStorage = (key, defaultValue) => {
        try {
            const stored = localStorage.getItem(getStorageKey(key));
            return stored ? JSON.parse(stored) : defaultValue;
        } catch (error) {
            console.warn('Failed to load chat from localStorage:', error);
            return defaultValue;
        }
    };

    // Load persisted messages or use default
    const defaultMessages = [
        { 
            role: 'model', 
            parts:[{text: "Hello! I'm your AI coding assistant. I can help you with this problem and answer any questions you have about coding, algorithms, or debugging. How can I assist you today?"}]
        }
    ];

    const [messages, setMessages] = useState(() => {
        const storedMessages = loadFromStorage('messages', null);
        const finalMessages = storedMessages || defaultMessages;
        
        // Log for debugging
        if (storedMessages) {
            console.log(`Loaded ${storedMessages.length} messages from storage for problem ${problemId}`);
        } else {
            console.log(`Starting fresh chat for problem ${problemId}`);
        }
        
        return finalMessages;
    });

    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, reset, formState: {errors} } = useForm();
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Save messages to localStorage whenever they change
    useEffect(() => {
        saveToStorage('messages', messages);
    }, [messages, problemId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const onSubmit = async (data) => {
        if (!data.message.trim()) return;
        
        setIsLoading(true);
        const userMessage = { role: 'user', parts:[{text: data.message}] };
        setMessages(prev => [...prev, userMessage]);
        reset();

        try {
            const response = await axiosClient.post("/ai/chat", {
                messages: [...messages, userMessage], // Include the new user message
                title: problem.title,
                description: problem.description,
                testCases: problem.visibleTestCases,
                startCode: problem.startCode
            });

            setMessages(prev => [...prev, { 
                role: 'model', 
                parts:[{text: response.data.message}] 
            }]);
        } catch (error) {
            console.error("API Error:", error);
            setMessages(prev => [...prev, { 
                role: 'model', 
                parts:[{text: "I apologize, but I'm experiencing some technical difficulties right now. Please try again in a moment."}]
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(onSubmit)();
        }
    };

    // Clear chat function
    const clearChat = () => {
        setMessages(defaultMessages);
        // Also clear from localStorage
        localStorage.removeItem(getStorageKey('messages'));
    };

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-xl">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">AI Coding Assistant</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Powered by AI
                            {messages.length > 1 && (
                                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                    {messages.length - 1} messages
                                </span>
                            )}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={clearChat}
                        className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                        title="Clear chat"
                    >
                        Clear Chat
                    </button>
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Online</span>
                    </div>
                </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div className={`flex items-start space-x-3 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
                            {/* Avatar */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                msg.role === "user" 
                                    ? "bg-gradient-to-r from-blue-500 to-blue-600" 
                                    : "bg-gradient-to-r from-gray-600 to-gray-700"
                            }`}>
                                {msg.role === "user" ? (
                                    <User className="w-4 h-4 text-white" />
                                ) : (
                                    <Bot className="w-4 h-4 text-white" />
                                )}
                            </div>
                            
                            {/* Message Bubble */}
                            <div className={`px-4 py-3 rounded-2xl shadow-sm ${
                                msg.role === "user" 
                                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white" 
                                    : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
                            }`}>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                    {msg.parts[0].text}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
                
                {/* Loading Indicator */}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="flex items-start space-x-3 max-w-[80%]">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 flex items-center justify-center flex-shrink-0">
                                <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div className="px-4 py-3 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                                <div className="flex items-center space-x-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                                    <span className="text-sm text-gray-500 dark:text-gray-400">AI is thinking...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-xl">
                <form onSubmit={handleSubmit(onSubmit)} className="relative">
                    <div className="flex items-end space-x-3">
                        <div className="flex-1 relative">
                            <textarea
                                ref={inputRef}
                                placeholder="Ask me anything about this problem..."
                                className="w-full px-4 py-3 pr-12 text-sm border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                rows="1"
                                style={{ minHeight: '44px', maxHeight: '120px' }}
                                {...register("message", { 
                                    required: "Message is required", 
                                    minLength: { value: 2, message: "Message must be at least 2 characters" }
                                })}
                                onKeyPress={handleKeyPress}
                                onInput={(e) => {
                                    e.target.style.height = 'auto';
                                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                                }}
                                disabled={isLoading}
                            />
                            {errors.message && (
                                <p className="text-xs text-red-500 mt-1 ml-1">{errors.message.message}</p>
                            )}
                        </div>
                        <button 
                            type="submit" 
                            disabled={isLoading || errors.message}
                            className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </form>
                
                {/* Help Text */}
                <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
                    Press Enter to send, Shift+Enter for new line
                </div>
            </div>
        </div>
    );
}

export default ChatAi;

