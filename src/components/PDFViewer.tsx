import React, { useState } from "react";
import { open } from "@tauri-apps/plugin-dialog";

const PDFViewer: React.FC = () => {
    const [pdfPath, setPdfPath] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleOpenFile = async () => {
        try {
            const selected = await open({
                multiple: false,
                filters: [{ name: "PDF Files", extensions: ["pdf"] }]
            });

            if (selected && typeof selected === 'string') {
                setIsLoading(true);
                setError(null);
                setPdfPath(selected);
                // In a real app, we would load the PDF into a viewer
                // For this desktop app, we can either use an iframe if tauri-plugin-asset is configured
                // or use a PDF.js based viewer. 
                // For now, we'll simulate the load.
                setTimeout(() => setIsLoading(false), 800);
            }
        } catch (err) {
            setError("Failed to open PDF file.");
            console.error(err);
        }
    };

    return (
        <div className="h-full flex flex-col p-4 md:p-6 bg-gray-50 dark:bg-gray-900/50">
            {/* Toolbar */}
            <div className="glass-effect p-3 rounded-xl mb-4 flex justify-between items-center shadow-sm border dark:border-gray-800">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleOpenFile}
                        className="btn-primary text-sm flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Open PDF
                    </button>
                    {pdfPath && (
                        <span className="text-xs text-gray-500 font-mono truncate max-w-md">
                            {pdfPath.split(/[\\/]/).pop()}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg text-gray-500 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                    </button>
                    <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg text-gray-500 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </button>
                    <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2"></div>
                    <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg text-gray-500 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    </button>
                </div>
            </div>

            {/* Viewer Area */}
            <div className="flex-1 glass-effect rounded-2xl border dark:border-gray-800 relative overflow-hidden flex items-center justify-center">
                {isLoading ? (
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
                        <p className="text-gray-500 animate-pulse font-medium">Loading Document...</p>
                    </div>
                ) : pdfPath ? (
                    <div className="w-full h-full flex items-center justify-center p-8">
                        {/* We'd normally use a real PDF library here. 
                             For a sleek demo, we'll show a "Ready" state with file info. */}
                        <div className="text-center max-w-sm">
                            <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </div>
                            <h2 className="text-2xl font-bold mb-2">{pdfPath.split(/[\\/]/).pop()}</h2>
                            <p className="text-gray-500 mb-6 font-medium">Document ready for analysis.</p>
                            <div className="flex gap-3 justify-center">
                                <button className="btn-primary">Start Reading</button>
                                <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg font-medium hover:bg-gray-200 transition-colors">Summary</button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center group cursor-pointer" onClick={handleOpenFile}>
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl mx-auto mb-6 flex items-center justify-center text-gray-400 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 group-hover:text-primary-500 transition-all">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-600 dark:text-gray-300">No PDF Loaded</h3>
                        <p className="text-gray-400 mt-2">Open a PDF file from your computer to begin.</p>
                    </div>
                )}
            </div>

            {error && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg border border-red-100 dark:border-red-900 text-sm">
                    {error}
                </div>
            )}
        </div>
    );
};

export default PDFViewer;
