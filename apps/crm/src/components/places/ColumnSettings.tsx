'use client';

import { useState, useEffect } from 'react';
import { Settings, GripVertical, Eye, EyeOff, X, RotateCcw } from 'lucide-react';

export interface ColumnConfig {
    key: string;
    label: string;
    visible: boolean;
    width?: number;
}

// Default columns configuration
export const DEFAULT_COLUMNS: ColumnConfig[] = [
    { key: 'name', label: 'Name', visible: true },
    { key: 'type', label: 'Category', visible: true },
    { key: 'location', label: 'Location', visible: true },
    { key: 'rating', label: 'Rating', visible: true },
    { key: 'phone', label: 'Phone', visible: true },
    { key: 'website', label: 'Website', visible: false },
    { key: 'description', label: 'Description', visible: false },
    { key: 'price_level', label: 'Price Range', visible: true },
    { key: 'coordinates', label: 'Coordinates', visible: true },
    { key: 'what_to_expect', label: 'What to Expect', visible: false },
    { key: 'highlight_and_tips', label: 'Highlight & Tips', visible: false },
    { key: 'social_media', label: 'Social Media', visible: false },
    { key: 'google_place_name', label: 'Google Name', visible: false },
    { key: 'full_address', label: 'Full Address', visible: false },
    { key: 'reviewer_count', label: 'Reviews', visible: false },
    { key: 'google_maps_url', label: 'Maps URL', visible: false },
    { key: 'google_place_id', label: 'Place ID', visible: false },
    { key: 'created_at', label: 'Created At', visible: false },
    { key: 'updated_at', label: 'Last Modified', visible: false },
];

const STORAGE_KEY = 'crm_places_columns';

interface ColumnSettingsProps {
    columns: ColumnConfig[];
    onChange: (columns: ColumnConfig[]) => void;
}

export function ColumnSettings({ columns, onChange }: ColumnSettingsProps) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleVisibility = (key: string) => {
        onChange(columns.map(col =>
            col.key === key ? { ...col, visible: !col.visible } : col
        ));
    };

    const resetToDefault = () => {
        onChange(DEFAULT_COLUMNS);
        saveToStorage(DEFAULT_COLUMNS);
    };

    const visibleCount = columns.filter(c => c.visible).length;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
                <Settings className="w-4 h-4" />
                Columns
                <span className="text-xs text-gray-400">({visibleCount})</span>
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">Show/Hide Columns</span>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-gray-200 rounded transition-colors"
                            >
                                <X className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>

                        <div className="max-h-80 overflow-y-auto p-2">
                            {columns.map((col) => (
                                <div
                                    key={col.key}
                                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg group"
                                >
                                    <GripVertical className="w-4 h-4 text-gray-300 cursor-grab" />

                                    <button
                                        onClick={() => toggleVisibility(col.key)}
                                        className={`flex items-center gap-2 flex-1 text-left text-sm ${col.visible ? 'text-gray-900' : 'text-gray-400'
                                            }`}
                                    >
                                        {col.visible ? (
                                            <Eye className="w-4 h-4 text-blue-500" />
                                        ) : (
                                            <EyeOff className="w-4 h-4" />
                                        )}
                                        <span>{col.label}</span>
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                            <button
                                onClick={resetToDefault}
                                className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                                Reset to Default
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

// Utility functions for localStorage
export function loadColumnsFromStorage(): ColumnConfig[] {
    if (typeof window === 'undefined') return DEFAULT_COLUMNS;

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored) as ColumnConfig[];
            // Merge with defaults to ensure new columns appear
            const storedKeys = new Set(parsed.map(c => c.key));
            const newColumns = DEFAULT_COLUMNS.filter(c => !storedKeys.has(c.key));
            return [...parsed, ...newColumns];
        }
    } catch (e) {
        console.error('Failed to load column settings:', e);
    }
    return DEFAULT_COLUMNS;
}

export function saveToStorage(columns: ColumnConfig[]) {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(columns));
    } catch (e) {
        console.error('Failed to save column settings:', e);
    }
}

// Hook for managing columns
export function useColumnSettings() {
    const [columns, setColumns] = useState<ColumnConfig[]>(DEFAULT_COLUMNS);

    useEffect(() => {
        // Hydrate from storage (delayed to avoid sync issues)
        const t = setTimeout(() => {
            setColumns(loadColumnsFromStorage());
        }, 0);
        return () => clearTimeout(t);
    }, []);

    const updateColumns = (newColumns: ColumnConfig[]) => {
        setColumns(newColumns);
        saveToStorage(newColumns);
    };

    return { columns, setColumns: updateColumns };
}
