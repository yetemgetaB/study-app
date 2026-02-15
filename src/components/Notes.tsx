import React, { useState, useEffect } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { readDir, readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { usePersistence } from "../hooks/usePersistence";

interface FileNode {
    id: string;
    name: string;
    type: "file" | "folder";
    content?: string;
    children?: FileNode[];
    path: string;
}

const Notes: React.FC = () => {
    const [vaultPath, setVaultPath, loadingVault] = usePersistence<string | null>("obsidian_vault_path", null);
    const [vault, setVault] = useState<FileNode[]>([]);
    const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
    const [fileContent, setFileContent] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [isPreview, setIsPreview] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    // Initial load of vault if path exists
    useEffect(() => {
        if (vaultPath) {
            loadVault(vaultPath);
        }
    }, [vaultPath]);

    const selectVault = async () => {
        try {
            const selected = await open({
                directory: true,
                multiple: false,
                title: "Select Obsidian Vault Folder"
            });

            if (selected && typeof selected === 'string') {
                setVaultPath(selected);
            }
        } catch (err) {
            console.error("Failed to select vault:", err);
        }
    };

    const loadVault = async (path: string) => {
        try {
            const entries = await readDir(path);
            const nodes: FileNode[] = [];

            for (const entry of entries) {
                if (entry.name.startsWith('.')) continue; // Skip hidden files (.obsidian etc)

                const node: FileNode = {
                    id: Math.random().toString(),
                    name: entry.name,
                    type: entry.isDirectory ? "folder" : "file",
                    path: `${path}/${entry.name}`
                };

                if (entry.isDirectory) {
                    // Simple recursive load (first level for now to avoid performance issues if huge)
                    const children = await readDir(node.path);
                    node.children = children
                        .filter(c => !c.name.startsWith('.'))
                        .map(c => ({
                            id: Math.random().toString(),
                            name: c.name,
                            type: c.isDirectory ? "folder" : "file",
                            path: `${node.path}/${c.name}`
                        }));
                }

                if (node.type !== 'folder' && !node.name.endsWith('.md')) continue;
                nodes.push(node);
            }
            setVault(nodes.sort((a, b) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type === 'folder' ? -1 : 1)));
        } catch (err) {
            console.error("Failed to read vault:", err);
        }
    };

    const handleFileSelect = async (node: FileNode) => {
        if (node.type === 'file') {
            try {
                const content = await readTextFile(node.path);
                setSelectedFile(node);
                setFileContent(content);
                setIsPreview(true);
            } catch (err) {
                console.error("Failed to read file:", err);
            }
        }
    };

    const handleSave = async () => {
        if (selectedFile) {
            setIsSyncing(true);
            try {
                await writeTextFile(selectedFile.path, fileContent);
                setTimeout(() => setIsSyncing(false), 500);
            } catch (err) {
                console.error("Failed to save file:", err);
                setIsSyncing(false);
            }
        }
    };

    const renderFileTree = (nodes: FileNode[], depth = 0) => {
        return nodes.map(node => (
            <div key={node.id}>
                <div
                    className={`flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer transition-colors ${selectedFile?.path === node.path ? 'bg-primary-100/50 dark:bg-primary-900/30 font-bold' : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'
                        }`}
                    style={{ paddingLeft: `${depth * 12 + 8}px` }}
                    onClick={() => handleFileSelect(node)}
                >
                    {node.type === 'folder' ? (
                        <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" /></svg>
                    ) : (
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                    )}
                    <span className="text-xs truncate text-gray-700 dark:text-gray-300">
                        {node.name}
                    </span>
                </div>
                {node.children && renderFileTree(node.children, depth + 1)}
            </div>
        ));
    };

    if (loadingVault) return <div className="h-full flex items-center justify-center">Loading Vault...</div>;

    return (
        <div className="h-full flex gap-4 overflow-hidden p-2">
            {/* Sidebar: File Explorer */}
            <div className="w-64 glass-effect rounded-xl flex flex-col overflow-hidden border border-gray-100 dark:border-gray-800">
                <div className="p-4 border-b dark:border-gray-800">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xs uppercase font-bold tracking-widest text-gray-400">Vault</h3>
                        <button onClick={selectVault} className="text-[10px] text-primary-500 hover:underline">Change</button>
                    </div>
                    {vaultPath ? (
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full text-xs p-2.5 pl-8 bg-gray-100 dark:bg-gray-800 rounded-lg outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <svg className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                    ) : (
                        <button onClick={selectVault} className="w-full btn-primary text-xs py-2">Select Vault</button>
                    )}
                </div>
                <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
                    {vault.length > 0 ? renderFileTree(vault) : (
                        <div className="text-center py-8 px-4">
                            <p className="text-[10px] text-gray-500">No vault selected or vault is empty.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Area: Editor / Preview */}
            <div className="flex-1 glass-effect rounded-xl overflow-hidden flex flex-col border border-gray-100 dark:border-gray-800">
                {selectedFile ? (
                    <>
                        {/* Note Header */}
                        <div className="px-6 py-4 border-b dark:border-gray-800 flex items-center justify-between bg-white/30 dark:bg-black/10">
                            <div className="flex items-center gap-3">
                                <h2 className="font-bold text-gray-800 dark:text-gray-100 truncate max-w-xs">{selectedFile.name}</h2>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                                    <button
                                        onClick={() => setIsPreview(false)}
                                        className={`px-3 py-1 text-xs rounded-md transition-all ${!isPreview ? 'bg-white dark:bg-gray-700 shadow-sm font-bold' : 'text-gray-500'}`}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => setIsPreview(true)}
                                        className={`px-3 py-1 text-xs rounded-md transition-all ${isPreview ? 'bg-white dark:bg-gray-700 shadow-sm font-bold' : 'text-gray-500'}`}
                                    >
                                        View
                                    </button>
                                </div>
                                <button
                                    onClick={handleSave}
                                    disabled={isSyncing}
                                    className="btn-primary text-xs px-4 py-2 flex items-center gap-2"
                                >
                                    {isSyncing && <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>}
                                    {isSyncing ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 relative overflow-hidden flex">
                            {isPreview ? (
                                <div className="flex-1 overflow-y-auto p-8 md:p-12">
                                    <div className="max-w-3xl mx-auto prose dark:prose-invert">
                                        <div className="whitespace-pre-wrap font-sans text-lg text-gray-700 dark:text-gray-300 leading-relaxed bg-white/50 dark:bg-transparent p-6 rounded-2xl shadow-sm border dark:border-gray-800">
                                            {fileContent}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <textarea
                                    className="flex-1 p-8 bg-transparent text-gray-800 dark:text-gray-100 font-mono text-sm leading-loose outline-none resize-none"
                                    value={fileContent}
                                    onChange={(e) => setFileContent(e.target.value)}
                                />
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-gray-50/30 dark:bg-gray-900/10">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-4 opacity-50 shadow-inner">
                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </div>
                            <h3 className="text-gray-500 font-medium">Select a note to begin editing</h3>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notes;
