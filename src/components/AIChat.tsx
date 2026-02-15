import React, { useState } from "react";

interface Message {
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

const AIChat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content:
                "Hello! I'm your AI study assistant. I can help you understand concepts, answer questions, create summaries, generate quizzes, and more. How can I help you study today?",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState("");
    const [selectedModel, setSelectedModel] = useState("gpt-4");

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            role: "user",
            content: input,
            timestamp: new Date(),
        };

        setMessages([...messages, userMessage]);
        setInput("");

        // Simulate AI response
        setTimeout(() => {
            const aiMessage: Message = {
                role: "assistant",
                content: "This is a mockup response. In the actual app, this will connect to real AI APIs like OpenAI, Gemini, Claude, etc.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiMessage]);
        }, 1000);
    };

    const studyModes = [
        { id: "explain", label: "Explain", icon: "💡" },
        { id: "quiz", label: "Quiz Me", icon: "❓" },
        { id: "summarize", label: "Summarize", icon: "📝" },
        { id: "flashcards", label: "Flashcards", icon: "🎴" },
    ];

    return (
        <div className="h-full flex gap-4">
            {/* Chat Area */}
            <div className="flex-1 glass-effect rounded-xl flex flex-col overflow-hidden">
                {/* Chat Header */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold">AI Study Assistant</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-xs text-gray-500">Online</span>
                            </div>
                        </div>

                        <select
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="gpt-4">GPT-4</option>
                            <option value="gemini">Gemini Pro</option>
                            <option value="claude">Claude</option>
                            <option value="gpt-3.5">GPT-3.5</option>
                        </select>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"
                                } animate-fade-in`}
                        >
                            <div
                                className={`max-w-[70%] rounded-2xl px-4 py-3 ${message.role === "user"
                                        ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white"
                                        : "glass-effect"
                                    }`}
                            >
                                <p className="text-sm leading-relaxed">{message.content}</p>
                                <span className="text-xs opacity-70 mt-1 block">
                                    {message.timestamp.toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex gap-2 mb-3">
                        {studyModes.map((mode) => (
                            <button
                                key={mode.id}
                                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg text-xs font-medium transition-colors"
                            >
                                <span className="mr-1">{mode.icon}</span>
                                {mode.label}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Ask anything about your studies..."
                            className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <button
                            onClick={handleSend}
                            className="btn-primary px-6 flex items-center gap-2"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                />
                            </svg>
                            Send
                        </button>
                    </div>
                </div>
            </div>

            {/* Context Panel */}
            <div className="w-80 glass-effect rounded-xl p-4 overflow-y-auto">
                <h3 className="font-semibold mb-4">Current Context</h3>

                <div className="space-y-3">
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-2 mb-2">
                            <svg
                                className="w-4 h-4 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                Active Document
                            </span>
                        </div>
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                            Mathematics Chapter 5
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                            Quick Actions
                        </h4>
                        <button className="w-full p-2.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                            📊 Generate Quiz
                        </button>
                        <button className="w-full p-2.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                            📝 Create Summary
                        </button>
                        <button className="w-full p-2.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                            🎴 Make Flashcards
                        </button>
                        <button className="w-full p-2.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                            🔍 Deep Dive
                        </button>
                    </div>

                    <div className="mt-6 p-3 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg border border-purple-200 dark:border-purple-800">
                        <h4 className="text-xs font-semibold text-purple-900 dark:text-purple-100 mb-2">
                            💡 Study Tip
                        </h4>
                        <p className="text-xs text-purple-700 dark:text-purple-300">
                            Try asking the AI to explain concepts in different ways until you fully
                            understand them!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIChat;
