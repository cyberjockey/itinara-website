import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getImageUrl(url?: string | null): string {
    if (!url) return "/logo.svg";
    if (url.startsWith('http') || url.startsWith('/')) return url;
    // Assume it's a Telegram file ID if not a URL - proxy through our API
    return `/api/proxy/images/telegram/${url}`;
}
