import React, { useState } from "react";

const PDFViewer: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<string | null>(null);

    const recentPDFs = [
        { name: "Mathematics Chapter 5.pdf", pages: 45, lastRead: "2 hours ago" },
        { name: "Physics Notes.pdf", pages: 32, lastRead: "Yesterday" },
        { name: "Chemistry Formulas.pdf", pages: 12, lastRead: "2 days ago" },
    ];

    return (
        <div className="h-full flex gap-4">
            {/* PDF Library Sidebar */}
            <div className="w-80 glass-effect rounded-xl p-4 overflow-y-auto">
                <div className="mb-4">
                    <h2 className="text-lg font-bold mb-3">My Library</h2>
                    <button className="btn-primary w-full flex items-center justify-center gap-2">
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
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        <span>Upload PDF</span>
                    </button>
                </div>

                <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                        Recent Files
                    </h3>
                    {recentPDFs.map((pdf, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedFile(pdf.name)}
                            className={`w-full p-3 rounded-lg border transition-all duration-200 text-left ${selectedFile === pdf.name
                                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                                    : "border-gray-200 dark:border-gray-700 hover:border-primary-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded flex items-center justify-center flex-shrink-0 shadow-sm">
                                    <span className="text-white text-xs font-bold">PDF</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm truncate">{pdf.name}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-gray-500">{pdf.pages} pages</span>
                                        <span className="text-xs text-gray-400">•</span>
                                        <span className="text-xs text-gray-500">{pdf.lastRead}</span>
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* PDF Viewer Area */}
            <div className="flex-1 glass-effect rounded-xl overflow-hidden flex flex-col">
                {selectedFile ? (
                    <>
                        {/* PDF Toolbar */}
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <h3 className="font-semibold truncate">{selectedFile}</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
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
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        />
                                    </svg>
                                </button>
                                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
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
                                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* PDF Content */}
                        <div className="flex-1 p-8 overflow-y-auto bg-gray-100 dark:bg-gray-800/50">
                            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-2xl p-12 min-h-full">
                                <div className="prose dark:prose-invert max-w-none">
                                    <h1 className="text-3xl font-bold mb-4">Sample PDF Content</h1>
                                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                                        This is a mockup of the PDF viewer. In the actual implementation,
                                        this will display real PDF content using PDF.js or a similar library.
                                    </p>

                                    <h2 className="text-2xl font-semibold mt-8 mb-3">Features</h2>
                                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                                        <li>📄 View and navigate PDF documents</li>
                                        <li>🎨 Highlight and annotate text</li>
                                        <li>🔍 Search within documents</li>
                                        <li>💬 Ask AI about selected text</li>
                                        <li>📝 Create notes linked to specific pages</li>
                                        <li>🔖 Bookmark important pages</li>
                                    </ul>

                                    <div className="mt-8 p-4 bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded">
                                        <p className="text-sm font-medium text-primary-900 dark:text-primary-100">
                                            💡 Tip: Select any text to get AI explanations, summaries, or create
                                            flashcards automatically!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 rounded-full flex items-center justify-center">
                                <svg
                                    className="w-12 h-12 text-primary-500"
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
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No PDF Selected</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">
                                Select a PDF from the library or upload a new one to get started
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PDFViewer;
