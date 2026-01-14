"use client";

import { Share2, Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner"; // Assuming sonner is set up as per previous context

interface ShareButtonProps {
    tripId: string;
}

export function ShareButton({ tripId }: ShareButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        // Construct public URL
        const url = `${window.location.origin}/trips/${tripId}`;

        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            toast.success("Link copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
            toast.error("Failed to copy link");
        }
    };

    return (
        <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 border border-stone-gray/20 rounded-full text-stone-gray hover:bg-stone-gray/5 transition-colors font-medium text-sm"
        >
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4" />}
            {copied ? "Copied!" : "Share"}
        </button>
    );
}
