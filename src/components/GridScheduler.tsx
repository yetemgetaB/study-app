import React, { useState, useEffect } from "react";
import { usePersistence } from "../hooks/usePersistence";

// Types for our schedule
interface ClassSession {
    id: string;
    subject: string;
    code?: string;
    teacher?: string;
    room?: string;
    color: string;
    day: string; // Monday, Tuesday, etc.
    periodStart: number; // 1-8
    periodDuration: number; // 1-4
    creditHours?: number;
    contactHours?: number;
}

const GridScheduler: React.FC = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Week days
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    // Period definitions based on Unity University Schedule
    const periods = [
        { number: 1, time: "8:30 AM - 9:20 AM", type: "Morning" },
        { number: 2, time: "9:30 AM - 10:20 AM", type: "Morning" },
        { number: 3, time: "10:30 AM - 11:20 AM", type: "Morning" },
        { number: 4, time: "11:30 AM - 12:20 PM", type: "Morning" },
        { number: 5, time: "1:30 PM - 2:20 PM", type: "Afternoon" },
        { number: 6, time: "2:30 PM - 3:20 PM", type: "Afternoon" },
        { number: 7, time: "3:30 PM - 4:20 PM", type: "Afternoon" },
        { number: 8, time: "4:30 PM - 5:20 PM", type: "Afternoon" },
    ];

    // Initial data
    const initialClasses: ClassSession[] = [
        {
            id: "1",
            subject: "Computer Programming I",
            code: "CoSc1011",
            teacher: "Mr. Abebe",
            room: "B-201",
            color: "bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-100",
            day: "Monday",
            periodStart: 1,
            periodDuration: 2,
            creditHours: 3,
            contactHours: 4,
        }
    ];

    const [classes, setClasses, loading] = usePersistence<ClassSession[]>("schedule_classes", initialClasses);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const isClassStart = (day: string, periodNumber: number) => {
        return classes.find((c) => c.day === day && c.periodStart === periodNumber);
    };

    const isClassContinuation = (day: string, periodNumber: number) => {
        return classes.find(
            (c) => c.day === day &&
                periodNumber > c.periodStart &&
                periodNumber < c.periodStart + c.periodDuration
        );
    };

    const getNextClass = () => {
        const currentDay = days[currentTime.getDay() === 0 ? 6 : currentTime.getDay() - 1];
        const currentHour = currentTime.getHours();
        const currentMinute = currentTime.getMinutes();
        const totalMinutes = currentHour * 60 + currentMinute;

        const dayClasses = classes.filter(c => c.day === currentDay).sort((a, b) => a.periodStart - b.periodStart);

        for (const c of dayClasses) {
            const period = periods.find(p => p.number === c.periodStart);
            if (period) {
                const [timeStr] = period.time.split(' - ');
                const [h, m_ap] = timeStr.split(':');
                const [m, ap] = m_ap.split(' ');
                let hour = parseInt(h);
                if (ap === "PM" && hour !== 12) hour += 12;
                if (ap === "AM" && hour === 12) hour = 0;

                const classMinutes = hour * 60 + parseInt(m);
                if (classMinutes > totalMinutes) return c;
            }
        }
        return null;
    };

    const addClass = (newClass: ClassSession) => {
        setClasses([...classes, newClass]);
        setIsAddModalOpen(false);
    };

    const deleteClass = (id: string) => {
        setClasses(classes.filter(c => c.id !== id));
    };

    if (loading) return <div className="h-full flex items-center justify-center">Loading Schedule...</div>;

    const nextClass = getNextClass();

    return (
        <div className="h-full flex flex-col gap-4 p-2 overflow-hidden">
            {/* Header / Next Class Reminder */}
            <div className="flex justify-between items-center glass-effect p-4 rounded-xl shadow-sm">
                <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                        My Schedule
                    </h2>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="btn-primary text-sm flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Add Class
                    </button>
                    {nextClass && (
                        <div className="flex items-center gap-3 bg-white/50 dark:bg-black/20 px-4 py-2 rounded-lg border dark:border-gray-800">
                            <div className="text-right">
                                <p className="text-gray-500 uppercase font-bold text-[8px] tracking-widest leading-none mb-1">Next Class</p>
                                <p className="font-bold text-primary-600 text-sm leading-none">{nextClass.subject}</p>
                            </div>
                            <div className="h-6 w-px bg-gray-300 dark:bg-gray-700"></div>
                            <div className="text-left">
                                <p className="text-gray-500 uppercase font-bold text-[8px] tracking-widest leading-none mb-1">Time / Room</p>
                                <p className="font-semibold text-gray-700 dark:text-gray-300 text-sm leading-none">{periods.find(p => p.number === nextClass.periodStart)?.time.split(' - ')[0]} | {nextClass.room}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Grid Container */}
            <div className="flex-1 overflow-auto glass-effect rounded-2xl border dark:border-gray-800">
                <div className="min-w-[1000px] h-full flex flex-col">
                    {/* Time Header */}
                    <div className="flex border-b dark:border-gray-800 sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-10 w-full">
                        <div className="w-32 border-r dark:border-gray-800 flex items-center justify-center p-3 flex-shrink-0">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Periods</span>
                        </div>
                        {days.map(day => (
                            <div key={day} className="flex-1 p-3 text-center border-r dark:border-gray-800 last:border-r-0">
                                <span className={`text-sm font-bold ${currentTime.getDay() === (days.indexOf(day) + 1) % 7 ? 'text-primary-600' : 'text-gray-500'}`}>
                                    {day}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Periods Grid */}
                    <div className="flex-1">
                        <table className="w-full h-full border-collapse table-fixed">
                            <tbody>
                                {periods.map((period) => (
                                    <tr key={period.number} className="border-b last:border-b-0 dark:border-gray-800 h-28">
                                        <td className="w-32 border-r dark:border-gray-800 p-3 text-center bg-gray-50/50 dark:bg-black/5 flex-shrink-0">
                                            <div className="text-xs font-bold text-primary-600">P-{period.number}</div>
                                            <div className="text-[10px] text-gray-400 mt-1">{period.time}</div>
                                        </td>
                                        {days.map(day => {
                                            const classSession = isClassStart(day, period.number);
                                            const isOccupied = isClassContinuation(day, period.number);

                                            if (isOccupied) return null;

                                            return (
                                                <td
                                                    key={`${day}-${period.number}`}
                                                    rowSpan={classSession?.periodDuration || 1}
                                                    className={`border-r dark:border-gray-800 last:border-r-0 p-1.5 transition-all w-1/7 ${!classSession ? 'hover:bg-primary-50/30 dark:hover:bg-primary-900/5' : ''
                                                        }`}
                                                >
                                                    {classSession ? (
                                                        <div className={`h-full w-full rounded-xl border p-3 flex flex-col justify-between shadow-sm relative group overflow-hidden ${classSession.color}`}>
                                                            {/* Delete Button */}
                                                            <button
                                                                onClick={() => deleteClass(classSession.id || "")}
                                                                className="absolute top-2 right-2 p-1 rounded-md bg-white/20 hover:bg-red-500/20 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all z-20"
                                                            >
                                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                            </button>

                                                            <div className="z-10 relative">
                                                                <div className="flex justify-between items-start">
                                                                    <h4 className="font-bold text-sm leading-tight">{classSession.subject}</h4>
                                                                    {classSession.code && <span className="text-[10px] bg-white/50 dark:bg-black/20 px-1.5 py-0.5 rounded font-mono font-medium">{classSession.code}</span>}
                                                                </div>
                                                                <div className="mt-2 space-y-0.5">
                                                                    <p className="text-xs flex items-center gap-1.5 opacity-80">
                                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                                                        {classSession.teacher}
                                                                    </p>
                                                                    <p className="text-xs flex items-center gap-1.5 opacity-80">
                                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                                                        {classSession.room}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="flex gap-2 mt-2 pt-2 border-t border-black/5 dark:border-white/5 opacity-80 z-10 relative">
                                                                <span className="text-[10px] font-medium">CH: {classSession.creditHours}</span>
                                                                <span className="text-[10px] font-medium">CtHr: {classSession.contactHours}</span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => {
                                                                    setIsAddModalOpen(true);
                                                                }}
                                                                className="bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300 rounded-full p-2 hover:scale-110 transition-transform"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add Class Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-effect rounded-2xl w-full max-w-md p-6 shadow-2xl border dark:border-gray-800 animate-slide-in">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Add New Class</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-100">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            addClass({
                                id: Date.now().toString(),
                                subject: formData.get('subject') as string,
                                teacher: formData.get('teacher') as string,
                                room: formData.get('room') as string,
                                day: formData.get('day') as string,
                                periodStart: parseInt(formData.get('start') as string),
                                periodDuration: parseInt(formData.get('duration') as string),
                                color: "bg-primary-100 dark:bg-primary-900/50 border-primary-300 dark:border-primary-700 text-primary-800 dark:text-primary-100",
                                creditHours: 3
                            });
                        }} className="space-y-4">
                            <input name="subject" placeholder="Subject Name" className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg outline-none border border-transparent focus:border-primary-500" required />
                            <div className="grid grid-cols-2 gap-3">
                                <input name="teacher" placeholder="Teacher" className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg outline-none border border-transparent focus:border-primary-500" />
                                <input name="room" placeholder="Room (e.g. B-101)" className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg outline-none border border-transparent focus:border-primary-500" />
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <select name="day" className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg outline-none border border-transparent focus:border-primary-500 col-span-1">
                                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                                <select name="start" className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg outline-none border border-transparent focus:border-primary-500">
                                    {periods.map(p => <option key={p.number} value={p.number}>P-{p.number}</option>)}
                                </select>
                                <select name="duration" className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg outline-none border border-transparent focus:border-primary-500">
                                    <option value="1">1 Per.</option>
                                    <option value="2">2 Per.</option>
                                    <option value="3">3 Per.</option>
                                </select>
                            </div>
                            <button type="submit" className="btn-primary w-full py-3 mt-4">Save Class</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GridScheduler;
