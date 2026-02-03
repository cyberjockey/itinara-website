'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Place, updatePlaceField } from '@/app/dashboard/places/actions';
import { SpreadsheetTable } from './SpreadsheetTable';
import { ColumnSettings, useColumnSettings } from './ColumnSettings';
import { PlaceFilter } from './PlaceFilter';
import { ExportButton } from './ExportButton';
import { BulkUploadButton } from './BulkUploadButton';
import { ErrorLogPanel, ErrorLogEntry, generateErrorId } from './ErrorLogPanel';
import { Loader2, Wand2, MapPin, Trash2 } from 'lucide-react';
import { bulkGenerateCoordinates, bulkGenerateDescriptions, type BulkUploadResult } from '@/app/dashboard/places/actions';
import { toast } from 'sonner';

interface ActivitiesManagerProps {
    places: Place[];
    totalCount: number;
    pagination?: React.ReactNode;
}

export function ActivitiesManager({ places, totalCount, pagination }: ActivitiesManagerProps) {
    const { columns, setColumns } = useColumnSettings();
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [errorLog, setErrorLog] = useState<ErrorLogEntry[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingAction, setProcessingAction] = useState<string | null>(null);

    const handleUpdateField = useCallback(async (placeId: string, field: string, value: string): Promise<boolean> => {
        const result = await updatePlaceField(placeId, field, value);

        if (!result.success) {
            const place = places.find(p => p.id === placeId);
            setErrorLog(prev => [...prev, {
                id: generateErrorId(),
                timestamp: new Date(),
                type: 'update',
                field,
                message: result.error || 'Update failed',
                severity: 'error',
            }]);
        }

        return result.success;
    }, [places]);

    const handleImportComplete = useCallback((result: BulkUploadResult) => {
        // Add errors to log
        if (result.errors.length > 0) {
            const newErrors: ErrorLogEntry[] = result.errors.map(err => ({
                id: generateErrorId(),
                timestamp: new Date(),
                type: 'import',
                row: err.row,
                message: err.error,
                severity: 'error',
            }));
            setErrorLog(prev => [...prev, ...newErrors]);
        }

        // Add success entry
        if (result.inserted > 0) {
            setErrorLog(prev => [...prev, {
                id: generateErrorId(),
                timestamp: new Date(),
                type: 'import',
                message: `Successfully imported ${result.inserted} activities`,
                severity: 'success',
            }]);
        }
    }, []);

    const clearErrorLog = useCallback(() => {
        setErrorLog([]);
    }, []);

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
                setSelectedIds(new Set());
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

    const router = useRouter();
    const searchParams = useSearchParams();
    const currentSort = searchParams.get('sortBy') || 'created_at';
    const currentOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc';

    const handleSort = (column: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (currentSort === column) {
            params.set('sortOrder', currentOrder === 'asc' ? 'desc' : 'asc');
        } else {
            params.set('sortBy', column);
            params.set('sortOrder', 'asc');
        }
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2">
                    <ColumnSettings columns={columns} onChange={setColumns} />
                    <PlaceFilter />
                    <ExportButton selectedIds={Array.from(selectedIds)} totalCount={totalCount} />
                </div>
                <div className="flex items-center gap-3">
                    <BulkUploadButton onImportComplete={handleImportComplete} />
                </div>
            </div>

            {/* Bulk Actions Bar */}
            {selectedIds.size > 0 && (
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center justify-between animate-in slide-in-from-top-2">
                    <div className="flex items-center gap-2 text-blue-700 font-medium text-sm">
                        <span>{selectedIds.size} selected</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSelectedIds(new Set())}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-gray-600 text-sm font-medium hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            Clear
                        </button>
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

            {/* Spreadsheet Table */}
            <SpreadsheetTable
                places={places}
                columns={columns}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
                onUpdateField={handleUpdateField}
                pagination={pagination}
                onSort={handleSort}
                currentSort={currentSort}
                currentOrder={currentOrder}
            />

            {/* Error Log */}
            <ErrorLogPanel
                errors={errorLog}
                onClear={clearErrorLog}
            />
        </div>
    );
}
