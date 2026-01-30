'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';
import { BulkUpload } from '@/components/places/BulkUpload';

export function BulkUploadButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
            >
                <Upload className="w-4 h-4" />
                Bulk Upload
            </button>

            {isOpen && <BulkUpload onClose={() => setIsOpen(false)} />}
        </>
    );
}
