import React, { useState } from "react";

interface ScheduleEvent {
    id: number;
    title: string;
    time: string;
    duration: string;
    category: "study" | "break" | "assignment" | "exam";
    color: string;
}

const Scheduler: React.FC = () => {
    const [selectedDay, setSelectedDay] = useState("Monday");
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const weeklySchedule: { [key: string]: ScheduleEvent[] } = {
        Monday: [
            {
                id: 1,
                title: "Mathematics Study",
                time: "09:00",
                duration: "2h",
                category: "study",
                color: "blue",
            },
            {
                id: 2,
                title: "Physics Lab Report",
                time: "14:00",
                duration: "1.5h",
                category: "assignment",
                color: "purple",
            },
        ],
        Tuesday: [
            {
                id: 3,
                title: "Chemistry Review",
                time: "10:00",
                duration: "1h",
                category: "study",
                color: "blue",
            },
        ],
    };

    const currentSchedule = weeklySchedule[selectedDay] || [];

    const categoryColors: { [key: string]: string } = {
        study: "from-blue-500 to-blue-600",
        break: "from-green-500 to-green-600",
        assignment: "from-purple-500 to-purple-600",
        exam: "from-red-500 to-red-600",
    };

    return (
        <div className="h-full flex gap-4">
            {/* Calendar View */}
            <div className="flex-1 glass-effect rounded-xl p-6 overflow-y-auto">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-2">Weekly Schedule</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Plan your study sessions and track your progress
                    </p>
                </div>

                {/* Day Selector */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {days.map((day) => (
                        <button
                            key={day}
                            onClick={() => setSelectedDay(day)}
                            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-200 ${selectedDay === day
                                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md"
                                    : "glass-effect hover:bg-gray-100 dark:hover:bg-gray-800"
                                }`}
                        >
                            {day}
                        </button>
                    ))}
                </div>

                {/* Timeline */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg">{selectedDay}</h3>
                        <button className="btn-primary text-sm flex items-center gap-2">
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
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                            Add Event
                        </button>
                    </div>

                    {currentSchedule.length > 0 ? (
                        <div className="space-y-3">
                            {currentSchedule.map((event) => (
                                <div
                                    key={event.id}
                                    className="group p-4 glass-effect rounded-xl hover:shadow-md transition-all duration-200 cursor-pointer border-l-4 border-transparent hover:border-primary-500"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span
                                                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${categoryColors[event.category]
                                                        }`}
                                                >
                                                    {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                                                </span>
                                                <span className="text-sm text-gray-500">{event.time}</span>
                                                <span className="text-sm text-gray-400">•</span>
                                                <span className="text-sm text-gray-500">{event.duration}</span>
                                            </div>
                                            <h4 className="font-semibold text-lg">{event.title}</h4>
                                        </div>
                                        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
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
                                                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center">
                                <svg
                                    className="w-10 h-10 text-gray-400"
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
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No events scheduled</h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                Add your first study session to get started
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Sidebar */}
            <div className="w-80 space-y-4">
                <div className="glass-effect rounded-xl p-4">
                    <h3 className="font-semibold mb-4">This Week</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Study Hours</span>
                            <span className="font-bold text-lg">12.5h</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full"
                                style={{ width: "62%" }}
                            ></div>
                        </div>
                        <p className="text-xs text-gray-500">62% of weekly goal (20h)</p>
                    </div>
                </div>

                <div className="glass-effect rounded-xl p-4">
                    <h3 className="font-semibold mb-4">Upcoming</h3>
                    <div className="space-y-3">
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                            <div className="flex items-center gap-2 mb-1">
                                <svg
                                    className="w-4 h-4 text-red-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <span className="text-xs font-semibold text-red-900 dark:text-red-100">
                                    EXAM
                                </span>
                            </div>
                            <p className="text-sm font-medium text-red-800 dark:text-red-200">
                                Physics Midterm
                            </p>
                            <p className="text-xs text-red-600 dark:text-red-400 mt-1">In 3 days</p>
                        </div>

                        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-semibold text-purple-900 dark:text-purple-100">
                                    ASSIGNMENT
                                </span>
                            </div>
                            <p className="text-sm font-medium text-purple-800 dark:text-purple-200">
                                Chemistry Lab Report
                            </p>
                            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Due Friday</p>
                        </div>
                    </div>
                </div>

                <div className="glass-effect rounded-xl p-4">
                    <h3 className="font-semibold mb-3">Study Streak 🔥</h3>
                    <div className="text-center">
                        <div className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                            7
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">days in a row</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Scheduler;
