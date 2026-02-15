import React from "react";

interface SidebarProps {
    activeView: string;
    setActiveView: (view: "pdf" | "chat" | "schedule" | "notes") => void;
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    activeView,
    setActiveView,
    collapsed,
    setCollapsed,
}) => {
    const menuItems = [
        {
            id: "pdf",
            label: "PDF Reader",
            icon: (
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
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                </svg>
            ),
        },
        {
            id: "chat",
            label: "AI Assistant",
            icon: (
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
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                </svg>
            ),
        },
        {
            id: "schedule",
            label: "Schedule",
            icon: (
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>
            ),
        },
        {
            id: "notes",
            label: "Notes",
            icon: (
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                </svg>
            ),
        },
    ];

    return (
        <aside
            className={`glass-effect shadow-xl transition-all duration-300 flex flex-col ${collapsed ? "w-20" : "w-64"
                }`}
        >
            {/* Collapse Button */}
            <div className="p-4 flex justify-end">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                    <svg
                        className={`w-5 h-5 transition-transform ${collapsed ? "rotate-180" : ""
                            }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                        />
                    </svg>
                </button>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 px-3 space-y-2">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() =>
                            setActiveView(item.id as "pdf" | "chat" | "schedule" | "notes")
                        }
                        className={`w-full sidebar-item ${activeView === item.id ? "sidebar-item-active" : ""
                            }`}
                    >
                        {item.icon}
                        {!collapsed && (
                            <span className="font-medium animate-slide-in">{item.label}</span>
                        )}
                    </button>
                ))}
            </nav>

            {/* Bottom Section */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                {!collapsed && (
                    <div className="glass-effect rounded-lg p-3 animate-fade-in">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs font-medium">AI Status</span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            All systems operational
                        </p>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
