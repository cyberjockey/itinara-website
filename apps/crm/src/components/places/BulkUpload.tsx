'use client';

import { useState, useRef } from 'react';
import { Upload, X, FileSpreadsheet, AlertCircle, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import { bulkUploadPlaces, type ParsedPlaceRow, type BulkUploadResult } from '@/app/dashboard/places/actions';
import { ColumnMapper, type ColumnMapping } from './ColumnMapper';

type PreviewRow = Record<string, string> & { _rowNum: number };

interface BulkUploadProps {
    onClose: () => void;
    onImportComplete?: (result: BulkUploadResult) => void;
}

import Papa from 'papaparse';

// ... (other imports)

// ... (BulkUpload component start) ...

// Transform rows using column mapping
function transformRows(rows: PreviewRow[], mapping: ColumnMapping): ParsedPlaceRow[] {
    return rows.map(row => {
        const transformed: Record<string, string> = {};

        for (const [csvHeader, dbColumn] of Object.entries(mapping)) {
            if (dbColumn && row[csvHeader] !== undefined) {
                transformed[dbColumn] = row[csvHeader];
            }
        }

        return transformed as ParsedPlaceRow;
    });
}

export function BulkUpload({ onClose, onImportComplete }: BulkUploadProps) {
    const [step, setStep] = useState<'upload' | 'mapping' | 'preview' | 'result'>('upload');
    const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
    const [rawRows, setRawRows] = useState<PreviewRow[]>([]);
    const [mapping, setMapping] = useState<ColumnMapping>({});
    const [result, setResult] = useState<BulkUploadResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: 'greedy', // Handles empty lines robustly
            complete: (results) => {
                setCsvHeaders(results.meta.fields || []);
                // Add _rowNum manually
                const rowsWithNum = results.data.map((row: any, index: number) => ({
                    ...row,
                    _rowNum: index + 2 // +2 because 1-indexed and header row
                }));
                setRawRows(rowsWithNum);
                setStep('mapping');
            },
            error: (error) => {
                console.error("CSV Parse Error:", error);
                alert("Failed to parse CSV file: " + error.message);
            }
        });
    };

    const handleMappingComplete = (columnMapping: ColumnMapping) => {
        setMapping(columnMapping);
        setStep('preview');
    };

    const handleUpload = async () => {
        setLoading(true);
        try {
            const transformedRows = transformRows(rawRows, mapping);
            const uploadResult = await bulkUploadPlaces(transformedRows);
            setResult(uploadResult);
            setStep('result');
            onImportComplete?.(uploadResult);
        } catch (error) {
            console.error('Upload failed:', error);
            setResult({
                success: false,
                message: 'Upload failed unexpectedly',
                inserted: 0,
                failed: rawRows.length,
                errors: [{ row: 0, error: String(error) }]
            });
            setStep('result');
        } finally {
            setLoading(false);
        }
    };

    const downloadTemplate = () => {
        const headers = 'Place Name,Category,City / Region,Phone / Whatsapp,Social Media,Website,About,Address,Price Range,What to Expect,Highlight and Tips,Image URL,Latitude,Longitude,Place Name on Google,Full Address,Rating,Reviewer Count,Google Maps Url,Place Id';
        const example = 'Uluwatu Temple,Culture,Bali,+62812345678,https://instagram.com/uluwatu,,Ancient sea temple on a cliff.,Uluwatu Pecatu Bali,$$$,Stunning sunset views and Kecak dance,Arrive before sunset for the best experience,https://example.com/image.jpg,-8.8291,115.0849,Uluwatu Temple,"Pecatu, South Kuta, Badung Regency, Bali, Indonesia",4.8,12500,https://maps.google.com/?cid=123456,ChIJ123456789';
        const csv = `${headers}\n${example}`;

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'places_template.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    const getPreviewRows = () => {
        // Apply mapping for preview
        return rawRows.slice(0, 10).map(row => {
            const mapped: Record<string, string> = { _rowNum: String(row._rowNum) };
            for (const [csvHeader, dbColumn] of Object.entries(mapping)) {
                if (dbColumn) {
                    mapped[dbColumn] = row[csvHeader] || '';
                }
            }
            return mapped;
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <FileSpreadsheet className="w-6 h-6 text-blue-600" />
                        <h2 className="text-xl font-bold text-gray-900">Bulk Upload Activities</h2>
                        {step !== 'upload' && step !== 'result' && (
                            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                Step {step === 'mapping' ? '2' : '3'} of 3
                            </span>
                        )}
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-6">
                    {step === 'upload' && (
                        <div className="space-y-6">
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-colors"
                            >
                                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-lg font-medium text-gray-700 mb-2">Drop your CSV file here</p>
                                <p className="text-sm text-gray-500">or click to browse</p>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".csv"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </div>

                            <div className="bg-blue-50 rounded-xl p-4">
                                <h3 className="font-medium text-blue-900 mb-2">CSV Format</h3>
                                <p className="text-sm text-blue-700 mb-3">
                                    Upload any CSV file and map columns to database fields in the next step.
                                </p>
                                <button
                                    onClick={downloadTemplate}
                                    className="text-sm text-blue-600 font-medium hover:underline"
                                >
                                    Download template CSV
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'mapping' && (
                        <div>
                            <div className="mb-4">
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">{fileName}</span> — {rawRows.length} rows detected
                                </p>
                            </div>
                            <ColumnMapper
                                csvHeaders={csvHeaders}
                                onMappingComplete={handleMappingComplete}
                                onCancel={() => { setStep('upload'); setRawRows([]); setCsvHeaders([]); setFileName(''); }}
                            />
                        </div>
                    )}

                    {step === 'preview' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">{fileName}</span> — {rawRows.length} rows ready to import
                                </p>
                                <button
                                    onClick={() => setStep('mapping')}
                                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Adjust Mapping
                                </button>
                            </div>

                            <div className="border border-gray-200 rounded-xl overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">#</th>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Name</th>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Category</th>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Destination</th>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Coords</th>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Image</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {getPreviewRows().map((row, i) => (
                                                <tr key={i} className="border-t border-gray-100">
                                                    <td className="px-3 py-2 text-gray-400">{row._rowNum}</td>
                                                    <td className="px-3 py-2 text-gray-900 font-medium">{row.name || '—'}</td>
                                                    <td className="px-3 py-2 text-gray-600">{row.type || '—'}</td>
                                                    <td className="px-3 py-2 text-gray-600">{row.destination_name || '—'}</td>
                                                    <td className="px-3 py-2 text-gray-500 text-xs">
                                                        {row.latitude && row.longitude ? '✓' : '—'}
                                                    </td>
                                                    <td className="px-3 py-2 text-gray-600">
                                                        {row.image_url ? (
                                                            <div className="flex items-center gap-1 text-xs text-blue-600 truncate max-w-[150px]">
                                                                <span title={row.image_url}>Link provided</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400">—</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {rawRows.length > 10 && (
                                    <div className="bg-gray-50 px-3 py-2 text-center text-sm text-gray-500 border-t border-gray-200">
                                        + {rawRows.length - 10} more rows
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 'result' && result && (
                        <div className="space-y-4">
                            <div className={`p-4 rounded-xl ${result.success ? 'bg-green-50' : 'bg-yellow-50'}`}>
                                <div className="flex items-center gap-3">
                                    {result.success ? (
                                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                                    ) : (
                                        <AlertCircle className="w-6 h-6 text-yellow-600" />
                                    )}
                                    <div>
                                        <p className={`font-medium ${result.success ? 'text-green-900' : 'text-yellow-900'}`}>
                                            {result.message}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {result.inserted} inserted, {result.failed} failed
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {result.errors.length > 0 && (
                                <div className="border border-red-200 rounded-xl overflow-hidden">
                                    <div className="bg-red-50 px-4 py-2 border-b border-red-200">
                                        <span className="text-sm font-medium text-red-800">Import Errors</span>
                                    </div>
                                    <div className="max-h-48 overflow-y-auto">
                                        {result.errors.map((err, i) => (
                                            <div key={i} className="px-4 py-2 text-sm border-b border-red-100 last:border-0">
                                                <span className="text-red-600 font-medium">Row {err.row}:</span>{' '}
                                                <span className="text-gray-700">{err.error}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                    {step === 'preview' && (
                        <>
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={loading}
                                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                Import {rawRows.length} Activities
                            </button>
                        </>
                    )}
                    {step === 'result' && (
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Done
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
