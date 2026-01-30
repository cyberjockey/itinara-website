'use client';

import { useState, useRef } from 'react';
import { Upload, X, FileSpreadsheet, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { bulkUploadPlaces, type ParsedPlaceRow, type BulkUploadResult } from '@/app/dashboard/places/actions';

type PreviewRow = ParsedPlaceRow & { _rowNum: number };

function parseCSV(text: string): PreviewRow[] {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, ''));
    const rows: PreviewRow[] = [];

    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        const row: Record<string, string> = { _rowNum: (i + 1).toString() };

        headers.forEach((header, index) => {
            row[header] = values[index]?.trim().replace(/^["']|["']$/g, '') || '';
        });

        rows.push(row as unknown as PreviewRow);
    }

    return rows;
}

function parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current);
    return result;
}

export function BulkUpload({ onClose }: { onClose: () => void }) {
    const [step, setStep] = useState<'upload' | 'preview' | 'result'>('upload');
    const [rows, setRows] = useState<PreviewRow[]>([]);
    const [result, setResult] = useState<BulkUploadResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            const parsed = parseCSV(text);
            setRows(parsed);
            setStep('preview');
        };
        reader.readAsText(file);
    };

    const handleUpload = async () => {
        setLoading(true);
        try {
            const uploadRows = rows.map(({ _rowNum, ...rest }) => rest);
            const result = await bulkUploadPlaces(uploadRows);
            setResult(result);
            setStep('result');
        } catch (error) {
            console.error('Upload failed:', error);
            setResult({
                success: false,
                message: 'Upload failed unexpectedly',
                inserted: 0,
                failed: rows.length,
                errors: [{ row: 0, error: String(error) }]
            });
            setStep('result');
        } finally {
            setLoading(false);
        }
    };

    const downloadTemplate = () => {
        const headers = 'destination_name,name,type,rating,status,location,description,image_url,phone,website,price_level,what_to_expect';
        const example = 'Bali,Uluwatu Temple,Culture,4.8,Open,"Uluwatu, Bali","Ancient sea temple on a cliff.",,,,$$$,';
        const csv = `${headers}\n${example}`;

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'places_template.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <FileSpreadsheet className="w-6 h-6 text-blue-600" />
                        <h2 className="text-xl font-bold text-gray-900">Bulk Upload Places</h2>
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
                                    Required columns: <code className="bg-blue-100 px-1 rounded">destination_name</code>, <code className="bg-blue-100 px-1 rounded">name</code>
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

                    {step === 'preview' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">{fileName}</span> — {rows.length} rows
                                </p>
                                <button
                                    onClick={() => { setStep('upload'); setRows([]); setFileName(''); }}
                                    className="text-sm text-gray-500 hover:text-gray-700"
                                >
                                    Choose different file
                                </button>
                            </div>

                            <div className="border border-gray-200 rounded-xl overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">#</th>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Destination</th>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Name</th>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Type</th>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Location</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rows.slice(0, 10).map((row, i) => (
                                                <tr key={i} className="border-t border-gray-100">
                                                    <td className="px-3 py-2 text-gray-400">{row._rowNum}</td>
                                                    <td className="px-3 py-2 text-gray-900">{row.destination_name}</td>
                                                    <td className="px-3 py-2 text-gray-900 font-medium">{row.name}</td>
                                                    <td className="px-3 py-2 text-gray-600">{row.type || '—'}</td>
                                                    <td className="px-3 py-2 text-gray-600">{row.location || '—'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {rows.length > 10 && (
                                    <div className="bg-gray-50 px-3 py-2 text-center text-sm text-gray-500 border-t border-gray-200">
                                        + {rows.length - 10} more rows
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
                                        <span className="text-sm font-medium text-red-800">Errors</span>
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
                                Import {rows.length} Places
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
