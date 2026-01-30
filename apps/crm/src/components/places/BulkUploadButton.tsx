'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';
import { BulkUpload } from '@/components/places/BulkUpload';
import { type BulkUploadResult } from '@/app/dashboard/places/actions';

interface BulkUploadButtonProps {
    onImportComplete?: (result: BulkUploadResult) => void;
}

export function BulkUploadButton({ onImportComplete }: BulkUploadButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleClose = () => setIsOpen(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
            >
                <Upload className="w-4 h-4" />
                Import CSV
            </button>

            {isOpen && (
                <BulkUpload
                    onClose={handleClose}
                    onImportComplete={onImportComplete}
                />
            )}
        </>
    );
}
