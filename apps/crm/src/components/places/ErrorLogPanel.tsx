'use client';

import { useState } from 'react';
import { AlertTriangle, CheckCircle, ChevronDown, ChevronUp, X, Trash2 } from 'lucide-react';

export interface ErrorLogEntry {
    id: string;
    timestamp: Date;
    type: 'import' | 'export' | 'update';
    row?: number;
    field?: string;
    message: string;
    severity: 'error' | 'warning' | 'success';
}

interface ErrorLogPanelProps {
    errors: ErrorLogEntry[];
    onClear: () => void;
    className?: string;
}

export function ErrorLogPanel({ errors, onClear, className = '' }: ErrorLogPanelProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    if (errors.length === 0) return null;

    const errorCount = errors.filter(e => e.severity === 'error').length;
    const warningCount = errors.filter(e => e.severity === 'warning').length;
    const successCount = errors.filter(e => e.severity === 'success').length;

    return (
        <div className={`bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden ${className}`}>
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    <span className="font-medium text-gray-900">Import/Export Log</span>
                    <div className="flex items-center gap-2 text-xs">
                        {errorCount > 0 && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full">
                                {errorCount} error{errorCount !== 1 ? 's' : ''}
                            </span>
                        )}
                        {warningCount > 0 && (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">
                                {warningCount} warning{warningCount !== 1 ? 's' : ''}
                            </span>
                        )}
                        {successCount > 0 && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                                {successCount} success
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                </div>
            </button>

            {/* Content */}
            {isExpanded && (
                <div className="border-t border-gray-200">
                    <div className="max-h-48 overflow-y-auto">
                        {errors.map((error) => (
                            <div
                                key={error.id}
                                className={`px-4 py-2 border-b border-gray-100 last:border-b-0 flex items-start gap-3 text-sm
                                    ${error.severity === 'error' ? 'bg-red-50/50' : ''}
                                    ${error.severity === 'warning' ? 'bg-amber-50/50' : ''}
                                    ${error.severity === 'success' ? 'bg-green-50/50' : ''}
                                `}
                            >
                                {error.severity === 'error' && <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />}
                                {error.severity === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />}
                                {error.severity === 'success' && <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />}

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className={`font-medium ${error.severity === 'error' ? 'text-red-700' :
                                                error.severity === 'warning' ? 'text-amber-700' : 'text-green-700'
                                            }`}>
                                            {error.type === 'import' ? 'Import' : error.type === 'export' ? 'Export' : 'Update'}
                                        </span>
                                        {error.row && (
                                            <span className="text-gray-500">Row {error.row}</span>
                                        )}
                                        {error.field && (
                                            <span className="text-gray-400">• {error.field}</span>
                                        )}
                                    </div>
                                    <p className="text-gray-700 mt-0.5">{error.message}</p>
                                </div>

                                <span className="text-xs text-gray-400 flex-shrink-0">
                                    {error.timestamp.toLocaleTimeString()}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 flex justify-end">
                        <button
                            onClick={onClear}
                            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            Clear Log
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// Utility to generate unique IDs
export function generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
