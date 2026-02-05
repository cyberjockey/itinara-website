import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getImageUrl(idOrUrl?: string | null, fallback: string = "/images/hero-bg.png") {
    if (!idOrUrl) return fallback;
    if (idOrUrl.startsWith("http") || idOrUrl.startsWith("/")) return idOrUrl;
    // Assume it's a Telegram file ID if it doesn't look like a URL or path
    return `/api/proxy/images/telegram/${idOrUrl}`;
}
