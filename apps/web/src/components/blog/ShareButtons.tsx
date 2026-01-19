'use client';

import { Facebook, Linkedin, Link2, Twitter, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ShareButtonsProps {
    title: string;
    slug: string;
}

export function ShareButtons({ title, slug }: ShareButtonsProps) {
    // In production, use the actual domain. In dev, window.location.origin handles localhost.
    // We use a safe check for window existence for SSR safety (though 'use client' handles most of it).

    const getUrl = () => {
        if (typeof window !== 'undefined') {
            return `${window.location.origin}/blog/${slug}`;
        }
        return `https://itinaravacation.com/blog/${slug}`;
    };

    const handleShare = (platform: string) => {
        const url = getUrl();
        const text = `Check out this article: ${title}`;
        let shareUrl = '';

        switch (platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                break;
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
                break;
            case 'copy':
                navigator.clipboard.writeText(url);
                toast.success('Link copied to clipboard!');
                return;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 py-8">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Share this Article</p>
            <div className="flex items-center gap-3">
                <button
                    onClick={() => handleShare('twitter')}
                    className="p-3 rounded-full bg-gray-100 hover:bg-black hover:text-white transition-all text-gray-600"
                    aria-label="Share on Twitter"
                >
                    <Twitter className="w-5 h-5" />
                </button>
                <button
                    onClick={() => handleShare('facebook')}
                    className="p-3 rounded-full bg-gray-100 hover:bg-[#1877F2] hover:text-white transition-all text-gray-600"
                    aria-label="Share on Facebook"
                >
                    <Facebook className="w-5 h-5" />
                </button>
                <button
                    onClick={() => handleShare('linkedin')}
                    className="p-3 rounded-full bg-gray-100 hover:bg-[#0A66C2] hover:text-white transition-all text-gray-600"
                    aria-label="Share on LinkedIn"
                >
                    <Linkedin className="w-5 h-5" />
                </button>
                <button
                    onClick={() => handleShare('whatsapp')}
                    className="p-3 rounded-full bg-gray-100 hover:bg-[#25D366] hover:text-white transition-all text-gray-600"
                    aria-label="Share on WhatsApp"
                >
                    <MessageCircle className="w-5 h-5" />
                </button>
                <div className="w-px h-8 bg-gray-300 mx-2" />
                <button
                    onClick={() => handleShare('copy')}
                    className="p-3 rounded-full bg-gray-100 hover:bg-terracotta hover:text-white transition-all text-gray-600"
                    aria-label="Copy Link"
                >
                    <Link2 className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
