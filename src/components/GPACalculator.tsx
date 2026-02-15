import React from "react";
import ProfileSetup, { Semester, Course } from "./ProfileSetup";
import { usePersistence } from "../hooks/usePersistence";

const GPACalculator: React.FC = () => {
    const [history, setHistory, loading] = usePersistence<Semester[] | null>("gpa_history", null);

    const gradePoints: { [key: string]: number } = {
        "A+": 4.0, "A": 4.0, "A-": 3.75,
        "B+": 3.5, "B": 3.0, "B-": 2.75,
        "C+": 2.5, "C": 2.0, "C-": 1.75,
        "D": 1.0, "F": 0.0
    };

    const calculateGPA = (courses: Course[]) => {
        let totalPoints = 0;
        let totalCredits = 0;
        courses.forEach(c => {
            const points = gradePoints[c.grade] || 0;
            totalPoints += points * c.creditHours;
            totalCredits += c.creditHours;
        });
        return totalCredits === 0 ? 0 : (totalPoints / totalCredits).toFixed(2);
    };

    const getWeakSubjects = () => {
        if (!history) return [];

        // Flatten courses
        const allCourses = history.flatMap(s => s.courses);
        const categoryStats: { [key: string]: { points: number, credits: number, courses: string[] } } = {};

        allCourses.forEach(c => {
            if (!categoryStats[c.category]) categoryStats[c.category] = { points: 0, credits: 0, courses: [] };
            const points = gradePoints[c.grade] || 0;
            categoryStats[c.category].points += points * c.creditHours;
            categoryStats[c.category].credits += c.creditHours;
            if (points < 2.5) categoryStats[c.category].courses.push(`${c.name} (${c.grade})`);
        });

        return Object.entries(categoryStats)
            .map(([cat, stats]) => ({
                category: cat,
                gpa: stats.credits ? (stats.points / stats.credits) : 0,
                weakCourses: stats.courses
            }))
            .filter(stat => stat.gpa < 3.0) // Threshold for weakness
            .sort((a, b) => a.gpa - b.gpa);
    };

    if (loading) return <div className="h-full flex items-center justify-center font-bold text-primary-500">Loading Academic History...</div>;

    if (!history) {
        return (
            <div className="h-full overflow-y-auto p-4">
                <ProfileSetup onComplete={setHistory} />
            </div>
        );
    }

    const cumulativeGPA = () => {
        const allCourses = history.flatMap(s => s.courses);
        return calculateGPA(allCourses);
    };

    const weakAreas = getWeakSubjects();

    return (
        <div className="h-full flex gap-4 p-2 overflow-hidden">
            {/* Left Column: Stats & Weaknesses */}
            <div className="w-80 flex flex-col gap-4 overflow-y-auto pr-2">
                {/* Main Stat Card */}
                <div className="glass-effect p-6 rounded-2xl text-center relative overflow-hidden group border dark:border-gray-800 shadow-sm">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <h3 className="text-gray-500 uppercase tracking-widest text-[10px] font-bold mb-2">Overall GPA</h3>
                    <div className="text-6xl font-black bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                        {cumulativeGPA()}
                    </div>
                    <p className="text-xs text-gray-400 mt-2 font-medium">Synced from Local Store</p>
                </div>

                {/* Weakness Analysis */}
                <div className="glass-effect p-5 rounded-2xl flex-1 border dark:border-gray-800 shadow-sm">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <span className="text-xl">📊</span> Focus Areas
                    </h3>

                    {weakAreas.length > 0 ? (
                        <div className="space-y-4">
                            {weakAreas.map(area => (
                                <div key={area.category} className="bg-red-50 dark:bg-red-900/10 p-3 rounded-xl border border-red-100/50 dark:border-red-900/30">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-bold text-red-800 dark:text-red-300 text-sm">{area.category}</span>
                                        <span className="text-[10px] font-bold bg-white dark:bg-black/20 px-1.5 py-0.5 rounded text-red-600">GPA: {area.gpa.toFixed(2)}</span>
                                    </div>
                                    {area.weakCourses.length > 0 && (
                                        <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-2">
                                            <ul className="list-disc list-inside">
                                                {area.weakCourses.map(c => <li key={c}>{c}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-3xl mb-3">🎓</div>
                            <p className="text-green-600 dark:text-green-400 font-bold text-sm">Excellent standing!</p>
                            <p className="text-xs text-gray-400 mt-1">Consistency is key.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Column: Calculator & History */}
            <div className="flex-1 glass-effect rounded-2xl overflow-hidden flex flex-col border dark:border-gray-800 shadow-sm">
                <div className="p-5 border-b dark:border-gray-800 flex justify-between items-center bg-white/30 dark:bg-black/10">
                    <h2 className="font-bold text-xl">Academic Progress</h2>
                    <button onClick={() => setHistory(null)} className="text-xs text-primary-500 hover:underline">Reset Data</button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                    {history.map(sem => (
                        <div key={sem.id} className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm group hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">{sem.name}</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] uppercase font-bold text-gray-400 mr-2">Semester GPA</span>
                                    <span className="text-sm font-black bg-primary-600 text-white px-3 py-1 rounded-lg">
                                        {calculateGPA(sem.courses)}
                                    </span>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs text-left">
                                    <thead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b dark:border-gray-700">
                                        <tr>
                                            <th className="py-3 px-2">Course Name</th>
                                            <th className="py-3 px-2">Category</th>
                                            <th className="py-3 px-2 text-center">Cr.H</th>
                                            <th className="py-3 px-2 text-center">Grade</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                        {sem.courses.map(course => (
                                            <tr key={course.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                                                <td className="py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">{course.name}</td>
                                                <td className="py-3 px-2 text-gray-500 italic">{course.category}</td>
                                                <td className="py-3 px-2 text-center text-gray-500 font-mono">{course.creditHours}</td>
                                                <td className="py-3 px-2 text-center">
                                                    <span className={`font-bold px-2 py-0.5 rounded ${['A+', 'A', 'A-'].includes(course.grade) ? 'text-green-600 bg-green-50 dark:bg-green-900/20' :
                                                            ['B+', 'B', 'B-'].includes(course.grade) ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' :
                                                                'text-orange-600 bg-orange-50 dark:bg-orange-900/20'
                                                        }`}>
                                                        {course.grade}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GPACalculator;
