'use client';

import { useState } from 'react';
import { Download, ChevronDown, FileSpreadsheet, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ExportButtonProps {
    selectedIds?: string[];
    totalCount: number;
}

// All available columns for export
const EXPORT_COLUMNS = [
    { key: 'name', label: 'Name', default: true },
    { key: 'type', label: 'Category', default: true },
    { key: 'location', label: 'Location', default: true },
    { key: 'description', label: 'Description', default: false },
    { key: 'phone', label: 'Phone', default: true },
    { key: 'website', label: 'Website', default: false },
    { key: 'social_media', label: 'Social Media', default: false },
    { key: 'price_level', label: 'Price Range', default: true },
    { key: 'rating', label: 'Rating', default: true },
    { key: 'what_to_expect', label: 'What to Expect', default: false },
    { key: 'highlight_and_tips', label: 'Highlight and Tips', default: false },
    { key: 'coordinates', label: 'Coordinates', default: true },
    { key: 'google_place_name', label: 'Google Place Name', default: false },
    { key: 'full_address', label: 'Full Address', default: false },
    { key: 'reviewer_count', label: 'Reviewer Count', default: false },
    { key: 'google_maps_url', label: 'Google Maps URL', default: false },
    { key: 'google_place_id', label: 'Google Place ID', default: false },
];

export function ExportButton({ selectedIds = [], totalCount }: ExportButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [showColumnPicker, setShowColumnPicker] = useState(false);
    const [selectedColumns, setSelectedColumns] = useState<Set<string>>(
        new Set(EXPORT_COLUMNS.filter(c => c.default).map(c => c.key))
    );
    const [isExporting, setIsExporting] = useState(false);

    const toggleColumn = (key: string) => {
        setSelectedColumns(prev => {
            const newSet = new Set(prev);
            if (newSet.has(key)) {
                newSet.delete(key);
            } else {
                newSet.add(key);
            }
            return newSet;
        });
    };

    const handleExport = async (exportSelected: boolean) => {
        setIsExporting(true);
        try {
            const columns = Array.from(selectedColumns);
            const ids = exportSelected ? selectedIds : undefined;

            const response = await fetch('/api/places/export', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ columns, ids }),
            });

            if (!response.ok) throw new Error('Export failed');

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `activities_export_${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            URL.revokeObjectURL(url);

            toast.success(`Exported ${exportSelected ? selectedIds.length : totalCount} activities`);
            setIsOpen(false);
            setShowColumnPicker(false);
        } catch (error) {
            console.error('Export failed:', error);
            toast.error('Failed to export activities');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
                <Download className="w-4 h-4" />
                Export
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => { setIsOpen(false); setShowColumnPicker(false); }}
                    />

                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
                        {!showColumnPicker ? (
                            <div className="p-2">
                                <button
                                    onClick={() => setShowColumnPicker(true)}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                                >
                                    <FileSpreadsheet className="w-4 h-4 text-gray-400" />
                                    <span>Choose Columns...</span>
                                </button>
                                <hr className="my-2 border-gray-100" />
                                <button
                                    onClick={() => handleExport(false)}
                                    disabled={isExporting}
                                    className="w-full flex items-center justify-between px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg disabled:opacity-50"
                                >
                                    <span>Export All ({totalCount})</span>
                                    {isExporting && <Loader2 className="w-4 h-4 animate-spin" />}
                                </button>
                                {selectedIds.length > 0 && (
                                    <button
                                        onClick={() => handleExport(true)}
                                        disabled={isExporting}
                                        className="w-full flex items-center justify-between px-3 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-50"
                                    >
                                        <span>Export Selected ({selectedIds.length})</span>
                                        {isExporting && <Loader2 className="w-4 h-4 animate-spin" />}
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div>
                                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-900">Select Columns</span>
                                    <button
                                        onClick={() => setShowColumnPicker(false)}
                                        className="text-xs text-blue-600 hover:underline"
                                    >
                                        Done
                                    </button>
                                </div>
                                <div className="max-h-64 overflow-y-auto p-2">
                                    {EXPORT_COLUMNS.map((col) => (
                                        <label
                                            key={col.key}
                                            className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedColumns.has(col.key)}
                                                onChange={() => toggleColumn(col.key)}
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <span>{col.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
