import React, { useState } from "react";

interface Note {
    id: number;
    title: string;
    content: string;
    category: string;
    lastEdited: string;
}

const Notes: React.FC = () => {
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [noteContent, setNoteContent] = useState("");

    const notes: Note[] = [
        {
            id: 1,
            title: "Mathematics - Calculus Notes",
            content: "# Derivatives\n\nThe derivative of a function...",
            category: "Mathematics",
            lastEdited: "2 hours ago",
        },
        {
            id: 2,
            title: "Physics - Newton's Laws",
            content: "# Newton's Three Laws of Motion\n\n1. First Law...",
            category: "Physics",
            lastEdited: "Yesterday",
        },
        {
            id: 3,
            title: "Chemistry - Periodic Table",
            content: "# Periodic Table Overview\n\nElements are organized...",
            category: "Chemistry",
            lastEdited: "3 days ago",
        },
    ];

    const categories = ["All", "Mathematics", "Physics", "Chemistry", "Biology"];

    return (
        <div className="h-full flex gap-4">
            {/* Notes List */}
            <div className="w-80 glass-effect rounded-xl p-4 overflow-y-auto">
                <div className="mb-4">
                    <h2 className="text-lg font-bold mb-3">My Notes</h2>
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
                        <span>New Note</span>
                    </button>
                </div>

                {/* Category Filter */}
                <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-full transition-colors"
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Notes List */}
                <div className="space-y-2">
                    {notes.map((note) => (
                        <button
                            key={note.id}
                            onClick={() => {
                                setSelectedNote(note);
                                setNoteContent(note.content);
                            }}
                            className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${selectedNote?.id === note.id
                                    ? "bg-primary-50 dark:bg-primary-900/20 border border-primary-500"
                                    : "glass-effect border border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                                }`}
                        >
                            <h3 className="font-semibold text-sm mb-1 truncate">{note.title}</h3>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">{note.category}</span>
                                <span className="text-xs text-gray-400">{note.lastEdited}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Note Editor */}
            <div className="flex-1 glass-effect rounded-xl flex flex-col overflow-hidden">
                {selectedNote ? (
                    <>
                        {/* Editor Toolbar */}
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <input
                                type="text"
                                value={selectedNote.title}
                                className="text-lg font-semibold bg-transparent border-none outline-none flex-1"
                                placeholder="Note title..."
                            />
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
                                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                                        />
                                    </svg>
                                </button>
                                <button className="btn-primary text-sm">Save</button>
                            </div>
                        </div>

                        {/* Toolbar */}
                        <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
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
                                        d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"
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
                                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                                    />
                                </svg>
                            </button>
                            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2"></div>
                            <button className="px-3 py-1.5 text-sm bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-lg transition-colors flex items-center gap-2">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 10V3L4 14h7v7l9-11h-7z"
                                    />
                                </svg>
                                AI Enhance
                            </button>
                        </div>

                        {/* Editor Area */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <textarea
                                value={noteContent}
                                onChange={(e) => setNoteContent(e.target.value)}
                                className="w-full h-full bg-transparent border-none outline-none resize-none font-mono text-sm leading-relaxed"
                                placeholder="Start writing your notes..."
                            />
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
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No Note Selected</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">
                                Select a note from the list or create a new one
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notes;
