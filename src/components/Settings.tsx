import React, { useState } from "react";
import { usePersistence } from "../hooks/usePersistence";
import { fetch } from "@tauri-apps/plugin-http";

interface ApiSettings {
    geminiKey: string;
    groqKey: string;
    openaiKey: string;
    preferredProvider: "gemini" | "groq" | "openai";
}

const Settings: React.FC = () => {
    const [settings, setSettings, loading] = usePersistence<ApiSettings>("api_settings", {
        geminiKey: "",
        groqKey: "",
        openaiKey: "",
        preferredProvider: "gemini",
    });

    const [verifyStatus, setVerifyStatus] = useState<string>("");
    const [isVerifying, setIsVerifying] = useState(false);

    const handleSave = (field: keyof ApiSettings, value: string) => {
        setSettings({ ...settings, [field]: value });
    };

    const testConnection = async () => {
        setIsVerifying(true);
        setVerifyStatus("Verifying...");

        try {
            if (settings.preferredProvider === "gemini") {
                if (!settings.geminiKey) throw new Error("Google Gemini Key is missing");
                const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${settings.geminiKey}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ contents: [{ parts: [{ text: "hi" }] }] })
                });
                if (res.ok) setVerifyStatus("✅ Gemini: Connection Successful!");
                else throw new Error(`Status ${res.status}: Invalid Key or API error.`);
            } else if (settings.preferredProvider === "groq") {
                if (!settings.groqKey) throw new Error("Groq API Key is missing");
                const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                    method: "POST",
                    headers: { "Authorization": `Bearer ${settings.groqKey}`, "Content-Type": "application/json" },
                    body: JSON.stringify({ model: "mixtral-8x7b-32768", messages: [{ role: "user", content: "hi" }] })
                });
                if (res.ok) setVerifyStatus("✅ Groq: Connection Successful!");
                else throw new Error(`Status ${res.status}: Invalid Key or API error.`);
            } else {
                setVerifyStatus("ℹ️ Selected provider doesn't support verification yet.");
            }
        } catch (err) {
            setVerifyStatus(`❌ Verification Failed: ${err instanceof Error ? err.message : "Network Error"}`);
        } finally {
            setIsVerifying(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-primary-500 font-bold">Synchronizing Preferences...</div>;

    return (
        <div className="h-full max-w-4xl mx-auto p-4 md:p-10 overflow-y-auto scrollbar-thin">
            <div className="mb-10">
                <h1 className="text-4xl font-black mb-2 text-gray-800 dark:text-gray-100">Settings</h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium">Power up your study workflow with AI and Local Persistence.</p>
            </div>

            <div className="grid gap-8">
                {/* AI Configuration Area */}
                <section className="glass-effect rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-2xl text-primary-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2 / 5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">AI Assistant Integration</h2>
                            <p className="text-xs text-gray-400">Connect to your favorite AI models for analysis.</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* Gemini */}
                        <div className="group">
                            <div className="flex justify-between items-center mb-3">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Google Gemini API</label>
                                <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-[10px] font-black uppercase text-primary-500 hover:text-primary-600 transition-colors bg-primary-50 dark:bg-primary-900/20 px-2 py-1 rounded">Get Free Key ↗</a>
                            </div>
                            <input
                                type="password"
                                value={settings.geminiKey}
                                onChange={(e) => handleSave("geminiKey", e.target.value)}
                                className="w-full p-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-mono text-sm"
                                placeholder="Paste Gemini API key..."
                            />
                        </div>

                        {/* Groq */}
                        <div className="group">
                            <div className="flex justify-between items-center mb-3">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Groq Intelligence (Ultra Fast)</label>
                                <a href="https://console.groq.com/keys" target="_blank" className="text-[10px] font-black uppercase text-primary-500 hover:text-primary-600 transition-colors bg-primary-50 dark:bg-primary-900/20 px-2 py-1 rounded">Get Free Key ↗</a>
                            </div>
                            <input
                                type="password"
                                value={settings.groqKey}
                                onChange={(e) => handleSave("groqKey", e.target.value)}
                                className="w-full p-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-mono text-sm"
                                placeholder="Paste Groq API key..."
                            />
                        </div>

                        <div className="pt-8 border-t dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl">
                                <span className="text-[10px] uppercase font-bold text-gray-400 ml-3">Model Pool:</span>
                                <select
                                    value={settings.preferredProvider}
                                    onChange={(e) => setSettings({ ...settings, preferredProvider: e.target.value as any })}
                                    className="p-2 py-1.5 bg-white dark:bg-gray-700 rounded-xl text-xs font-bold border-none outline-none shadow-sm cursor-pointer"
                                >
                                    <option value="gemini">Google Gemini 1.5 Flash</option>
                                    <option value="groq">Groq Mixtral-8x7b</option>
                                    <option value="openai">OpenAI GPT-4o</option>
                                </select>
                            </div>
                            <button
                                onClick={testConnection}
                                disabled={isVerifying}
                                className="btn-primary flex items-center gap-3 px-8 shadow-xl hover:shadow-primary-500/20 active:scale-95 transition-all"
                            >
                                {isVerifying ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                )}
                                Verify Connection
                            </button>
                        </div>

                        {verifyStatus && (
                            <div className={`p-4 rounded-xl text-sm font-bold flex items-center gap-3 animate-slide-in ${verifyStatus.includes('✅')
                                    ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-900/30'
                                    : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30'
                                }`}>
                                {verifyStatus}
                            </div>
                        )}
                    </div>
                </section>

                {/* Local Storage Info */}
                <section className="bg-gray-100/50 dark:bg-gray-800/30 rounded-3xl p-6 border border-dashed border-gray-200 dark:border-gray-700 text-center">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Data Privacy Shield</h2>
                    <p className="text-sm text-gray-500 max-w-lg mx-auto leading-relaxed">Your data is stored strictly on your machine in <code className="bg-white dark:bg-gray-800 px-2 py-0.5 rounded-lg border dark:border-gray-700 font-mono text-[10px]">settings.json</code>. No personal information or schedules are uploaded outside of AI processing requests.</p>
                </section>
            </div>
        </div>
    );
};

export default Settings;
