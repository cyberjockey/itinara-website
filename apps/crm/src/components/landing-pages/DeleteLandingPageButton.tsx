'use client';

import { Trash2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { deleteLandingPage } from '@/app/dashboard/landing-pages/actions';

export function DeleteLandingPageButton({ pageId }: { pageId: string }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this landing page?')) return;

        setIsDeleting(true);
        try {
            await deleteLandingPage(pageId);
        } catch (error) {
            console.error('Failed to delete landing page:', error);
            alert('Failed to delete landing page.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            title="Delete"
        >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        </button>
    );
}
