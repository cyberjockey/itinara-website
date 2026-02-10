"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Clock, MapPin, Save, Loader2, X } from "lucide-react";
import { updateTemplate } from "@/app/dashboard/templates/actions";
import { PlacePicker } from "@/components/places/PlacePicker";
import { useDebounce } from "@/hooks/use-debounce";
import type { Place } from "@/app/dashboard/places/actions";
import { useRouter } from "next/navigation";

interface Activity {
    id: string;
    title: string;
    description: string;
    start_time: string;
    duration_hours: number; // NEW: estimated hours
    end_time?: string; // NEW: auto-calculated
    location: string;
    place_id?: string;
    place_data?: Place;

    // NEW: Transition activity support
    is_transition?: boolean;
    transition_type?: 'driving' | 'walking' | 'ferry' | 'train' | 'other';
}

interface Day {
    day: number;
    title: string;
    activities: Activity[];
}

// Helper: Calculate end time from start time and duration
function calculateEndTime(startTime: string, durationHours: number): string {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + durationHours * 60;
    const endHours = Math.floor(totalMinutes / 60) % 24;
    const endMinutes = Math.floor(totalMinutes % 60);
    return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
}

// Helper: Parse time string to minutes for comparison
function parseTimeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

// Helper: Check if new activity overlaps with existing activities
function hasTimeOverlap(activities: Activity[], newActivity: Activity): boolean {
    if (!newActivity.end_time) return false;

    const newStart = parseTimeToMinutes(newActivity.start_time);
    const newEnd = parseTimeToMinutes(newActivity.end_time);

    return activities.some(activity => {
        if (!activity.end_time) return false;
        const actStart = parseTimeToMinutes(activity.start_time);
        const actEnd = parseTimeToMinutes(activity.end_time);

        // Check overlap: new starts before existing ends AND new ends after existing starts
        return newStart < actEnd && newEnd > actStart;
    });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ItineraryBuilder({ template }: { template: any }) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    // Initialize state from template JSON or default structure
    const [days, setDays] = useState<Day[]>(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (template.itinerary as any)?.days ||
        Array.from({ length: template.duration_days }, (_, i) => ({
            day: i + 1,
            title: `Day ${i + 1}`,
            activities: []
        }))
    );

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeDayIndex, setActiveDayIndex] = useState<number | null>(null);
    const [isTransitionMode, setIsTransitionMode] = useState(false); // NEW: for transition activities
    const [newActivity, setNewActivity] = useState<Partial<Activity>>({
        start_time: "09:00",
        duration_hours: 1,
        title: "",
        description: "",
        location: ""
    });

    const handleOpenAddModal = (dayIndex: number, isTransition = false) => {
        setActiveDayIndex(dayIndex);
        setIsTransitionMode(isTransition);
        setNewActivity({
            start_time: "09:00",
            duration_hours: isTransition ? 0.5 : 1, // Transitions default to 30 min
            title: isTransition ? "" : "",
            description: "",
            location: "",
            is_transition: isTransition,
            transition_type: isTransition ? 'driving' : undefined
        });
        setIsModalOpen(true);
    };

    const handleAddActivity = () => {
        if (activeDayIndex === null || !newActivity.title) return;

        const durationHours = newActivity.duration_hours || 1;
        const startTime = newActivity.start_time || "09:00";
        const endTime = calculateEndTime(startTime, durationHours);

        const activity: Activity = {
            id: crypto.randomUUID(),
            title: newActivity.title || "New Activity",
            description: newActivity.description || "",
            start_time: startTime,
            duration_hours: durationHours,
            end_time: endTime,
            location: newActivity.location || "",
            place_id: newActivity.place_id,
            is_transition: newActivity.is_transition,
            transition_type: newActivity.transition_type,
        };

        // Validate no time overlap
        const dayActivities = days[activeDayIndex].activities;
        if (hasTimeOverlap(dayActivities, activity)) {
            alert("⚠️ Time Overlap Detected!\n\nThis activity conflicts with an existing activity. Please choose a different time.");
            return;
        }

        const newDays = [...days];
        newDays[activeDayIndex].activities.push(activity);

        // Sort by time
        newDays[activeDayIndex].activities.sort((a, b) => a.start_time.localeCompare(b.start_time));

        setDays(newDays);
        setIsModalOpen(false);
    };

    const handleDeleteActivity = (dayIndex: number, activityId: string) => {
        const newDays = [...days];
        newDays[dayIndex].activities = newDays[dayIndex].activities.filter(a => a.id !== activityId);
        setDays(newDays);
    };

    const handleSave = async (dataToSave = days) => {
        setIsSaving(true);
        try {
            const itinerary = { days: dataToSave };
            const formData = new FormData();
            formData.append("itinerary_json", JSON.stringify(itinerary));
            // Ensure we handle the response/error properly in a real app
            await updateTemplate(template.id, formData);
            router.refresh(); // Refresh server text
        } catch (error) {
            console.error("Failed to save", error);
        } finally {
            setIsSaving(false);
        }
    };

    // Auto-save logic
    const debouncedDays = useDebounce(days, 2000);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        handleSave(debouncedDays);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedDays]);

    return (
        <div className="h-full flex flex-col">

            {/* Toolbar */}
            <div className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center shadow-sm z-20">
                <div className="text-sm text-gray-500">
                    <span className="font-medium text-gray-900">{days.length} Days</span> • {days.reduce((acc, d) => acc + d.activities.length, 0)} Activities
                </div>
                <button
                    onClick={() => handleSave()}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Itinerary
                </button>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Days Sidebar / Navigation */}
                <div className="w-64 border-r border-gray-100 overflow-y-auto bg-gray-50/50 hidden md:block">
                    <div className="p-4">
                        <div className="space-y-2">
                            {days.map((day) => (
                                <a
                                    key={day.day}
                                    href={`#day-${day.day}`}
                                    className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-white hover:shadow-sm transition-all flex items-center justify-between group text-gray-600"
                                >
                                    <span>{day.title}</span>
                                    <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full group-hover:bg-gray-200">
                                        {day.activities.length}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Day Editor Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50 scroll-smooth">
                    <div className="max-w-3xl mx-auto space-y-8 pb-20">
                        {days.map((day, dayIndex) => (
                            <div id={`day-${day.day}`} key={day.day} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden scroll-mt-24">
                                <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-10">
                                    <h3 className="font-bold text-gray-900 text-lg">{day.title}</h3>
                                    <button
                                        onClick={() => handleOpenAddModal(dayIndex)}
                                        className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors"
                                    >
                                        <Plus className="w-3 h-3" />
                                        Add Activity
                                    </button>
                                </div>

                                <div className="p-6 min-h-[100px]">
                                    {day.activities.length === 0 ? (
                                        <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-lg hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer" onClick={() => handleOpenAddModal(dayIndex)}>
                                            <p className="text-sm text-gray-400">No activities scheduled.</p>
                                            <p className="text-xs text-blue-500 font-medium mt-1">Click to add items</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4 relative">
                                            {/* Timeline line */}
                                            <div className="absolute left-[85px] top-2 bottom-2 w-0.5 bg-gray-100"></div>

                                            {day.activities.map((activity, index) => (
                                                <div key={activity.id}>
                                                    <div className="relative flex group">
                                                        {/* Time */}
                                                        <div className="w-[70px] pt-1 text-right pr-4 text-xs font-medium text-gray-500 font-mono">
                                                            {activity.start_time}
                                                        </div>

                                                        {/* Dot */}
                                                        <div className="absolute left-[81px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-400 border-2 border-white shadow-sm z-10"></div>

                                                        {/* Content */}
                                                        <div className="flex-1 bg-gray-50/50 hover:bg-white p-4 rounded-lg border border-transparent hover:border-gray-200 transition-all ml-4 mb-2 shadow-sm">
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                                                        {activity.is_transition && (
                                                                            <span className="text-lg">
                                                                                {activity.transition_type === 'driving' && '🚗'}
                                                                                {activity.transition_type === 'walking' && '🚶'}
                                                                                {activity.transition_type === 'ferry' && '⛴️'}
                                                                                {activity.transition_type === 'train' && '🚆'}
                                                                                {activity.transition_type === 'other' && '🚌'}
                                                                            </span>
                                                                        )}
                                                                        {activity.title}
                                                                    </h4>
                                                                    <div className="flex items-center gap-3 mt-1">
                                                                        {activity.location && (
                                                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                                                <MapPin className="w-3 h-3" />
                                                                                {activity.location}
                                                                            </div>
                                                                        )}
                                                                        {activity.duration_hours && (
                                                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                                                <Clock className="w-3 h-3" />
                                                                                {activity.duration_hours}h
                                                                                {activity.end_time && (
                                                                                    <span className="text-gray-400">→ {activity.end_time}</span>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    {activity.description && (
                                                                        <p className="text-sm text-gray-600 mt-2">{activity.description}</p>
                                                                    )}
                                                                </div>
                                                                <button
                                                                    onClick={() => handleDeleteActivity(dayIndex, activity.id)}
                                                                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Add Transition Button between activities */}
                                                    {index < day.activities.length - 1 && (
                                                        <div key={`transition-${activity.id}`} className="relative flex items-center justify-center my-2">
                                                            <div className="absolute left-[85px] w-0.5 h-4 bg-gray-100"></div>
                                                            <button
                                                                onClick={() => handleOpenAddModal(dayIndex, true)}
                                                                className="ml-[85px] px-3 py-1.5 text-xs text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md border border-dashed border-gray-200 hover:border-blue-300 transition-all flex items-center gap-1.5"
                                                            >
                                                                <Plus className="w-3 h-3" />
                                                                Add Transition
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Simple Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-xl z-10 shrink-0">
                            <h3 className="font-bold text-gray-900">
                                {isTransitionMode ? 'Add Transition Activity' : 'Add New Activity'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4 overflow-y-auto shrink hover:scrollbar-thumb-gray-200 scrollbar-thin">
                            {/* Transition Type Selector (only for transitions) */}
                            {isTransitionMode && (
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-2">Transition Type</label>
                                    <div className="grid grid-cols-5 gap-2 overflow-x-auto pb-2">
                                        {[
                                            { type: 'driving', icon: '🚗', label: 'Driving' },
                                            { type: 'walking', icon: '🚶', label: 'Walking' },
                                            { type: 'ferry', icon: '⛴️', label: 'Ferry' },
                                            { type: 'train', icon: '🚆', label: 'Train' },
                                            { type: 'other', icon: '🚌', label: 'Other' }
                                        ].map(({ type, icon, label }) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => {
                                                    setNewActivity({ ...newActivity, transition_type: type as Activity['transition_type'], title: label });
                                                }}
                                                className={`p-3 rounded-lg border-2 transition-all text-center ${newActivity.transition_type === type
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className="text-2xl mb-1">{icon}</div>
                                                <div className="text-xs font-medium text-gray-700">{label}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-1">
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Time</label>
                                    <input
                                        type="time"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={newActivity.start_time}
                                        onChange={e => {
                                            const startTime = e.target.value;
                                            const endTime = calculateEndTime(startTime, newActivity.duration_hours || 1);
                                            setNewActivity({ ...newActivity, start_time: startTime, end_time: endTime });
                                        }}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Duration (hrs)</label>
                                    <input
                                        type="number"
                                        step="0.5"
                                        min="0.5"
                                        max="12"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={newActivity.duration_hours || 1}
                                        onChange={e => {
                                            const duration = parseFloat(e.target.value) || 1;
                                            const endTime = calculateEndTime(newActivity.start_time || "09:00", duration);
                                            setNewActivity({ ...newActivity, duration_hours: duration, end_time: endTime });
                                        }}
                                    />
                                    {newActivity.end_time && (
                                        <p className="text-xs text-gray-400 mt-1">
                                            Ends: {newActivity.end_time}
                                        </p>
                                    )}
                                </div>
                                {!isTransitionMode && (
                                    <div className="col-span-1">
                                        <label className="block text-xs font-semibold text-gray-500 mb-1">Location / Place</label>
                                        <div className="border border-gray-200 rounded-lg p-1">
                                            <PlacePicker
                                                destinationId={template.destination_id}
                                                value={newActivity.place_id}
                                                onChange={(place) => {
                                                    setNewActivity({
                                                        ...newActivity,
                                                        place_id: place.id,
                                                        place_data: place,
                                                        location: place.location || '',
                                                        title: newActivity.title || place.name, // Auto-fill title if empty
                                                        description: newActivity.description || place.description || '' // Auto-fill desc if empty
                                                    });
                                                }}
                                                onCancel={() => { }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1">Title</label>
                                <input
                                    type="text"
                                    placeholder="What's happening?"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={newActivity.title}
                                    onChange={e => setNewActivity({ ...newActivity, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
                                <textarea
                                    rows={3}
                                    placeholder="Add details, tips, or notes..."
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={newActivity.description}
                                    onChange={e => setNewActivity({ ...newActivity, description: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddActivity}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm"
                            >
                                Add Activity
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
