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

    location: string;
    place_id?: string;
    place_data?: Place; // Optional: store full place data for UI display if needed
}

interface Day {
    day: number;
    title: string;
    activities: Activity[];
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
    const [newActivity, setNewActivity] = useState<Partial<Activity>>({
        start_time: "09:00",
        title: "",
        description: "",
        location: ""
    });

    const handleOpenAddModal = (dayIndex: number) => {
        setActiveDayIndex(dayIndex);
        setNewActivity({ start_time: "09:00", title: "", description: "", location: "" });
        setIsModalOpen(true);
    };

    const handleAddActivity = () => {
        if (activeDayIndex === null || !newActivity.title) return;

        const activity: Activity = {
            id: crypto.randomUUID(),
            title: newActivity.title || "New Activity",
            description: newActivity.description || "",
            start_time: newActivity.start_time || "09:00",
            location: newActivity.location || "",
        };

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
                    onClick={handleSave}
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
                            {days.map((day, index) => (
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

                                            {day.activities.map((activity) => (
                                                <div key={activity.id} className="relative flex group">
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
                                                                <h4 className="text-sm font-bold text-gray-900">{activity.title}</h4>
                                                                {activity.location && (
                                                                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                                                                        <MapPin className="w-3 h-3" />
                                                                        {activity.location}
                                                                    </div>
                                                                )}
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
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-gray-900">Add New Activity</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-1">
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Time</label>
                                    <input
                                        type="time"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={newActivity.start_time}
                                        onChange={e => setNewActivity({ ...newActivity, start_time: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-2">
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
                                    {/* Fallback manual location if needed, or keeping it hidden if place selected? 
                                        For now, keeping the manual input hidden or readonly if place selected could be good.
                                        But PlacePicker handles the selection. 
                                        Let's just show the selected location in a readonly field IF we want to allow manual override?
                                        Actually PlacePicker is the input.
                                    */}
                                </div>
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
