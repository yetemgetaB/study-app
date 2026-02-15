import React, { useState, useRef, useEffect } from "react";
import { usePersistence } from "../hooks/usePersistence";
import { fetch } from "@tauri-apps/plugin-http";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
}

const AIChat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "assistant",
            content: "Hello! I'm your study assistant. I can help you summarize PDFs, plan your schedule, or explain complex topics. How can I help you today?",
        },
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [settings] = usePersistence<any>("api_settings", {
        geminiKey: "",
        groqKey: "",
        openaiKey: "",
        preferredProvider: "gemini",
    });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsTyping(true);

        try {
            let responseContent = "";

            if (settings.preferredProvider === "gemini" && settings.geminiKey) {
                const response = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${settings.geminiKey}`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: input }] }]
                        }),
                    }
                );
                const data: any = await response.json();
                responseContent = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that.";
            } else if (settings.preferredProvider === "groq" && settings.groqKey) {
                const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${settings.groqKey}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        model: "mixtral-8x7b-32768",
                        messages: [{ role: "user", content: input }]
                    })
                });
                const data: any = await response.json();
                responseContent = data.choices?.[0]?.message?.content || "API error.";
            } else {
                responseContent = "Please configure your API keys in Settings to use the AI assistant.";
            }

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: responseContent,
            };

            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("AI Error:", error);
            setMessages((prev) => [
                ...prev,
                { id: "err", role: "assistant", content: "Oops! I encountered an error. Please check your internet or API keys." },
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900/50 p-2 md:p-4">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 px-2 mb-4 scrollbar-thin">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"
                            } animate-fade-in`}
                    >
                        <div
                            className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl shadow-sm ${message.role === "user"
                                    ? "bg-primary-600 text-white rounded-tr-none"
                                    : "glass-effect text-gray-800 dark:text-gray-100 rounded-tl-none border border-gray-100 dark:border-gray-800"
                                }`}
                        >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="glass-effect p-4 rounded-2xl shadow-sm rounded-tl-none flex gap-1">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-2">
                <div className="glass-effect flex gap-2 p-3 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 focus-within:ring-2 focus-within:ring-primary-500/50 transition-all">
                    <input
                        type="text"
                        className="flex-1 bg-transparent px-2 outline-none text-gray-800 dark:text-gray-100"
                        placeholder="Ask me anything about your studies..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    />
                    <button
                        onClick={handleSend}
                        className="p-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
                        disabled={!input.trim() || isTyping}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIChat;
