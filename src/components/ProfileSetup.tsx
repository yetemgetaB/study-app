import React, { useState } from "react";

export interface Course {
    id: string;
    name: string;
    creditHours: number;
    grade: string; // A, B+, etc.
    category: "Math" | "Computer Science" | "Physics" | "General" | "Other";
}

export interface Semester {
    id: string;
    name: string; // "Year 1 - Sem 1"
    courses: Course[];
}

interface ProfileSetupProps {
    onComplete: (data: Semester[]) => void;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [currentYear, setCurrentYear] = useState("1");
    const [semesters, setSemesters] = useState<Semester[]>([]);

    // Temporary state for adding a semester
    const [tempCourses, setTempCourses] = useState<Course[]>([]);
    const [currentSemName, setCurrentSemName] = useState("");

    const gradePoints: { [key: string]: number } = {
        "A+": 4.0, "A": 4.0, "A-": 3.75,
        "B+": 3.5, "B": 3.0, "B-": 2.75,
        "C+": 2.5, "C": 2.0, "C-": 1.75,
        "D": 1.0, "F": 0.0
    };

    const handleAddCourse = () => {
        setTempCourses([
            ...tempCourses,
            {
                id: Date.now().toString(),
                name: "",
                creditHours: 3,
                grade: "A",
                category: "Other"
            }
        ]);
    };

    const updateCourse = (index: number, field: keyof Course, value: any) => {
        const newCourses = [...tempCourses];
        newCourses[index] = { ...newCourses[index], [field]: value };
        setTempCourses(newCourses);
    };

    const saveSemester = () => {
        if (tempCourses.length === 0 || !currentSemName) return;
        setSemesters([...semesters, { id: Date.now().toString(), name: currentSemName, courses: tempCourses }]);
        setTempCourses([]);
        setCurrentSemName("");
    };

    return (
        <div className="max-w-3xl mx-auto p-6 glass-effect rounded-xl">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Student Profile Setup
            </h2>

            {step === 1 && (
                <div className="space-y-6 animate-fade-in">
                    <div>
                        <label className="block text-sm font-medium mb-2">Current Year</label>
                        <select
                            value={currentYear}
                            onChange={(e) => setCurrentYear(e.target.value)}
                            className="w-full p-3 rounded-lg border bg-white/50 dark:bg-black/20"
                        >
                            <option value="1">1st Year (Freshman)</option>
                            <option value="2">2nd Year (Sophomore)</option>
                            <option value="3">3rd Year (Junior)</option>
                            <option value="4">4th Year (Senior)</option>
                            <option value="5">5th Year</option>
                        </select>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                        <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Why do we need this?</h3>
                        <p className="text-sm text-blue-600 dark:text-blue-300">
                            To calculate your cumulative GPA and identify weak subjects, we need your history from previous semesters.
                        </p>
                    </div>

                    <button
                        onClick={() => setStep(2)}
                        className="btn-primary w-full"
                    >
                        Next: Enter Past Grades
                    </button>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-6 animate-fade-in">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Past Semesters History</h3>
                        <div className="text-sm text-gray-500">Added: {semesters.length} semesters</div>
                    </div>

                    {/* List of added semesters */}
                    <div className="space-y-3">
                        {semesters.map(sem => (
                            <div key={sem.id} className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border flex justify-between items-center">
                                <span className="font-medium">{sem.name}</span>
                                <span className="text-sm text-gray-500">{sem.courses.length} courses</span>
                            </div>
                        ))}
                    </div>

                    {/* Add New Semester Form */}
                    <div className="border-t pt-4 mt-4">
                        <h4 className="text-sm font-medium mb-3 uppercase tracking-wider text-gray-500">Add Semester</h4>
                        <div className="flex gap-2 mb-4">
                            <input
                                placeholder="e.g. Year 1 - Semester 1"
                                value={currentSemName}
                                onChange={(e) => setCurrentSemName(e.target.value)}
                                className="flex-1 p-2 border rounded-lg"
                            />
                            <button onClick={saveSemester} className="btn-secondary text-sm">Save Semester</button>
                        </div>

                        {currentSemName && (
                            <div className="space-y-2 bg-gray-50 dark:bg-gray-900/30 p-4 rounded-xl">
                                {tempCourses.map((course, idx) => (
                                    <div key={course.id} className="flex gap-2 items-center">
                                        <input
                                            placeholder="Subject Name"
                                            value={course.name}
                                            onChange={(e) => updateCourse(idx, 'name', e.target.value)}
                                            className="flex-[2] p-2 border rounded text-sm"
                                        />
                                        <select
                                            value={course.category}
                                            onChange={(e) => updateCourse(idx, 'category', e.target.value)}
                                            className="flex-1 p-2 border rounded text-sm"
                                        >
                                            <option>Math</option>
                                            <option>Computer Science</option>
                                            <option>Physics</option>
                                            <option>General</option>
                                            <option>Other</option>
                                        </select>
                                        <input
                                            type="number"
                                            placeholder="Cr.Hr"
                                            value={course.creditHours}
                                            onChange={(e) => updateCourse(idx, 'creditHours', parseInt(e.target.value))}
                                            className="w-16 p-2 border rounded text-sm"
                                        />
                                        <select
                                            value={course.grade}
                                            onChange={(e) => updateCourse(idx, 'grade', e.target.value)}
                                            className="w-20 p-2 border rounded text-sm font-bold"
                                        >
                                            {Object.keys(gradePoints).map(g => <option key={g} value={g}>{g}</option>)}
                                        </select>
                                    </div>
                                ))}
                                <button onClick={handleAddCourse} className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                                    + Add Course
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button onClick={() => setStep(1)} className="px-4 py-2 text-gray-600">Back</button>
                        <button
                            onClick={() => onComplete(semesters)}
                            className="btn-primary flex-1"
                        >
                            Finish Setup
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileSetup;
