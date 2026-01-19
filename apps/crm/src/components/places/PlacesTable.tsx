"use client";

import { useState } from "react";
import Link from "next/link";
import { Place } from "@/app/dashboard/places/actions";
import { Loader2, Wand2, MapPin, CheckSquare, Square } from "lucide-react";
import { bulkGenerateCoordinates, bulkGenerateDescriptions } from "@/app/dashboard/places/actions";
import { toast } from "sonner";

interface PlacesTableProps {
    places: Place[];
    pagination?: React.ReactNode;
}

export function PlacesTable({ places, pagination }: PlacesTableProps) {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingAction, setProcessingAction] = useState<string | null>(null);

    const toggleSelectAll = () => {
        if (selectedIds.size === places.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(places.map(p => p.id)));
        }
    };

    const toggleSelect = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const handleBulkAction = async (action: 'coordinates' | 'description') => {
        if (selectedIds.size === 0) return;

        setIsProcessing(true);
        setProcessingAction(action);

        try {
            const ids = Array.from(selectedIds);
            let result;

            if (action === 'coordinates') {
                result = await bulkGenerateCoordinates(ids);
            } else {
                result = await bulkGenerateDescriptions(ids);
            }

            if (result.success) {
                toast.success(result.message);
                setSelectedIds(new Set()); // Clear selection on success
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error("Bulk action failed", error);
            toast.error("An unexpected error occurred");
        } finally {
            setIsProcessing(false);
            setProcessingAction(null);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Bulk Actions Toolbar */}
            {selectedIds.size > 0 && (
                <div className="bg-blue-50 p-4 border-b border-blue-100 flex items-center justify-between animate-in slide-in-from-top-2">
                    <div className="flex items-center gap-2 text-blue-700 font-medium text-sm">
                        <CheckSquare className="w-4 h-4" />
                        <span>{selectedIds.size} selected</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => handleBulkAction('coordinates')}
                            disabled={isProcessing}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-blue-200 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 disabled:opacity-50 transition-colors"
                        >
                            {isProcessing && processingAction === 'coordinates' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MapPin className="w-3.5 h-3.5" />}
                            Generate Coordinates
                        </button>
                        <button
                            onClick={() => handleBulkAction('description')}
                            disabled={isProcessing}
                            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
                        >
                            {isProcessing && processingAction === 'description' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                            Generate AI Descriptions
                        </button>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-3 w-10">
                                <button onClick={toggleSelectAll} className="flex items-center">
                                    {places.length > 0 && selectedIds.size === places.length ? (
                                        <CheckSquare className="w-4 h-4 text-blue-600" />
                                    ) : (
                                        <Square className="w-4 h-4 text-gray-400" />
                                    )}
                                </button>
                            </th>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Type</th>
                            <th className="px-6 py-3">Location</th>
                            <th className="px-6 py-3">Coordinates</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {places.map((place) => (
                            <tr key={place.id} className={`hover:bg-gray-50/50 transition-colors group ${selectedIds.has(place.id) ? 'bg-blue-50/30' : ''}`}>
                                <td className="px-6 py-4">
                                    <button onClick={() => toggleSelect(place.id)} className="flex items-center">
                                        {selectedIds.has(place.id) ? (
                                            <CheckSquare className="w-4 h-4 text-blue-600" />
                                        ) : (
                                            <Square className="w-4 h-4 text-gray-400" />
                                        )}
                                    </button>
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    <div className="flex flex-col">
                                        <span>{place.name}</span>
                                        {place.description && (
                                            <span className="text-[10px] text-gray-400 truncate max-w-[200px] mt-0.5">
                                                {place.description}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                        {place.type || 'Uncategorized'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500 truncate max-w-xs">{place.location || '-'}</td>
                                <td className="px-6 py-4 text-xs font-mono text-gray-500">
                                    {place.coordinates ? (
                                        <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded w-fit">
                                            <MapPin className="w-3 h-3" />
                                            {place.coordinates.lat.toFixed(4)}, {place.coordinates.lng.toFixed(4)}
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 italic">Missing</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link
                                        href={`/dashboard/places/${place.id}`}
                                        className="text-blue-600 hover:text-blue-700 font-medium text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        Edit
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {pagination}
        </div>
    );
}
