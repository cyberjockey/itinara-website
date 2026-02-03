'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Place } from '@/app/dashboard/places/actions';
import { Loader2, MapPin, CheckSquare, Square, Check, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { toast } from 'sonner';
import { ColumnConfig } from './ColumnSettings';

interface SpreadsheetTableProps {
    places: Place[];
    columns: ColumnConfig[];
    selectedIds: Set<string>;
    onSelectionChange: (ids: Set<string>) => void;
    onUpdateField: (placeId: string, field: string, value: string) => Promise<boolean>;
    pagination?: React.ReactNode;
    onSort?: (column: string) => void;
    currentSort?: string;
    currentOrder?: 'asc' | 'desc';
}

interface EditingCell {
    placeId: string;
    field: string;
    value: string;
}

export function SpreadsheetTable({
    places,
    columns,
    selectedIds,
    onSelectionChange,
    onUpdateField,
    pagination,
    onSort,
    currentSort,
    currentOrder,
}: SpreadsheetTableProps) {
    const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
    const [savingCell, setSavingCell] = useState<string | null>(null);
    const [savedCell, setSavedCell] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    const visibleColumns = columns.filter(c => c.visible);

    const toggleSelectAll = () => {
        if (selectedIds.size === places.length) {
            onSelectionChange(new Set());
        } else {
            onSelectionChange(new Set(places.map(p => p.id)));
        }
    };

    const toggleSelect = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        onSelectionChange(newSelected);
    };

    const getCellValue = (place: Place, field: string): string => {
        if (field === 'coordinates') {
            if (place.coordinates) {
                return `${place.coordinates.lat.toFixed(4)}, ${place.coordinates.lng.toFixed(4)}`;
            }
            return '';
        }
        if (field === 'social_media') {
            const sm = place.social_media;
            if (sm && typeof sm === 'object') {
                return (sm as Record<string, string>).url || JSON.stringify(sm);
            }
            return '';
        }
        if (field === 'created_at' || field === 'updated_at') {
            const dateStr = (place as any)[field];
            if (dateStr) {
                return new Date(dateStr).toLocaleDateString() + ' ' + new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }
            return '';
        }

        const value = (place as Record<string, unknown>)[field];
        return value != null ? String(value) : '';
    };

    const startEditing = (placeId: string, field: string) => {
        // Don't allow editing certain fields
        if (['coordinates', 'created_at', 'updated_at'].includes(field)) return;

        const place = places.find(p => p.id === placeId);
        if (!place) return;

        setEditingCell({
            placeId,
            field,
            value: getCellValue(place, field),
        });
    };

    const cancelEditing = () => {
        setEditingCell(null);
    };

    const saveEdit = useCallback(async () => {
        if (!editingCell) return;

        const { placeId, field, value } = editingCell;
        const place = places.find(p => p.id === placeId);
        const originalValue = place ? getCellValue(place, field) : '';

        // Skip if no change
        if (value === originalValue) {
            setEditingCell(null);
            return;
        }

        const cellKey = `${placeId}-${field}`;
        setSavingCell(cellKey);
        setEditingCell(null);

        try {
            const success = await onUpdateField(placeId, field, value);
            if (success) {
                setSavedCell(cellKey);
                setTimeout(() => setSavedCell(null), 1500);
            } else {
                toast.error('Failed to save changes');
            }
        } catch (error) {
            console.error('Save failed:', error);
            toast.error('Failed to save changes');
        } finally {
            setSavingCell(null);
        }
    }, [editingCell, places, onUpdateField]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            cancelEditing();
        } else if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            saveEdit();
        } else if (e.key === 'Tab') {
            e.preventDefault();
            saveEdit();
            // Could implement tab navigation to next cell here
        }
    };

    useEffect(() => {
        if (editingCell && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [editingCell]);

    const renderCellContent = (place: Place, column: ColumnConfig) => {
        const cellKey = `${place.id}-${column.key}`;
        const isEditing = editingCell?.placeId === place.id && editingCell?.field === column.key;
        const isSaving = savingCell === cellKey;
        const isSaved = savedCell === cellKey;

        if (isEditing) {
            const isLongText = ['description', 'what_to_expect', 'highlight_and_tips'].includes(column.key);

            if (isLongText) {
                return (
                    <textarea
                        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                        value={editingCell.value}
                        onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
                        onBlur={saveEdit}
                        onKeyDown={handleKeyDown}
                        className="w-full min-h-[60px] px-2 py-1 text-sm border border-blue-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows={3}
                    />
                );
            }

            return (
                <input
                    ref={inputRef as React.RefObject<HTMLInputElement>}
                    type="text"
                    value={editingCell.value}
                    onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
                    onBlur={saveEdit}
                    onKeyDown={handleKeyDown}
                    className="w-full px-2 py-1 text-sm border border-blue-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            );
        }

        const value = getCellValue(place, column.key);

        // Special rendering for coordinates
        if (column.key === 'coordinates') {
            if (place.coordinates) {
                return (
                    <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-mono w-fit">
                        <MapPin className="w-3 h-3" />
                        {value}
                    </div>
                );
            }
            return <span className="text-gray-400 italic text-xs">Missing</span>;
        }

        // Special rendering for type/category
        if (column.key === 'type') {
            return (
                <span
                    onClick={() => startEditing(place.id, column.key)}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200 cursor-pointer hover:bg-gray-200"
                >
                    {value || 'Uncategorized'}
                </span>
            );
        }

        // Special rendering for rating
        if (column.key === 'rating' && value) {
            return (
                <span
                    onClick={() => startEditing(place.id, column.key)}
                    className="inline-flex items-center gap-1 text-amber-600 cursor-pointer hover:bg-amber-50 px-1 rounded"
                >
                    ⭐ {value}
                </span>
            );
        }

        return (
            <div
                onClick={() => startEditing(place.id, column.key)}
                className={`
                    min-h-[24px] px-1 py-0.5 rounded cursor-pointer transition-all
                    hover:bg-blue-50 hover:ring-1 hover:ring-blue-200 w-full
                    ${isSaving ? 'opacity-50' : ''}
                    ${isSaved ? 'bg-green-50 ring-1 ring-green-300' : ''}
                    ${!value ? 'text-gray-400 italic' : 'text-gray-900'}
                `}
                title={value} // Show full text on hover
            >
                {isSaving && <Loader2 className="w-3 h-3 animate-spin inline mr-1" />}
                {isSaved && <Check className="w-3 h-3 text-green-500 inline mr-1" />}
                <span className="block truncate">{value || '—'}</span>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200 sticky top-0">
                        <tr>
                            <th className="px-4 py-3 w-10">
                                <button onClick={toggleSelectAll} className="flex items-center">
                                    {places.length > 0 && selectedIds.size === places.length ? (
                                        <CheckSquare className="w-4 h-4 text-blue-600" />
                                    ) : (
                                        <Square className="w-4 h-4 text-gray-400" />
                                    )}
                                </button>
                            </th>
                            {visibleColumns.map((col) => {
                                const isSorted = currentSort === col.key;
                                return (
                                    <th
                                        key={col.key}
                                        className="px-4 py-3 whitespace-nowrap cursor-pointer hover:bg-gray-100 transition-colors"
                                        onClick={() => onSort && onSort(col.key)}
                                    >
                                        <div className="flex items-center gap-1.5">
                                            {col.label}
                                            {isSorted ? (
                                                currentOrder === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-blue-600" /> : <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                                            ) : (
                                                <ArrowUpDown className="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100" />
                                            )}
                                        </div>
                                    </th>
                                );
                            })}
                            <th className="px-4 py-3 text-right w-20">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {places.map((place) => (
                            <tr
                                key={place.id}
                                className={`hover:bg-gray-50/50 transition-colors group ${selectedIds.has(place.id) ? 'bg-blue-50/30' : ''
                                    }`}
                            >
                                <td className="px-4 py-3">
                                    <button onClick={() => toggleSelect(place.id)} className="flex items-center">
                                        {selectedIds.has(place.id) ? (
                                            <CheckSquare className="w-4 h-4 text-blue-600" />
                                        ) : (
                                            <Square className="w-4 h-4 text-gray-400" />
                                        )}
                                    </button>
                                </td>
                                {visibleColumns.map((col) => (
                                    <td key={col.key} className="px-4 py-3 max-w-[200px] overflow-hidden">
                                        {renderCellContent(place, col)}
                                    </td>
                                ))}
                                <td className="px-4 py-3 text-right">
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
