'use client';

import { Trash2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { deleteStaticPage } from '@/app/dashboard/pages/actions';
import { DeleteModal } from '../ui/DeleteModal';

export function DeletePageButton({ pageId }: { pageId: string }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteStaticPage(pageId);
        } catch (error) {
            console.error('Failed to delete page:', error);
            alert('Failed to delete page.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                disabled={isDeleting}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                title="Delete"
            >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </button>

            <DeleteModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onConfirm={handleDelete}
                isPending={isDeleting}
                title="Delete Page?"
                description="Are you sure you want to delete this static page? This action cannot be undone."
            />
        </>
    );
}
