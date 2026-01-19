"use client";

import { Search } from "lucide-react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";


// Simple custom debounce since we might not have use-debounce installed and don't want to install more deps if not needed
function useDebounce(callback: (...args: any[]) => void, delay: number) {
    // Basic implementation for binding
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            callback(...args);
        }, delay);
    };
}

export function SearchBar() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = useDebounce((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set("query", term);
        } else {
            params.delete("query");
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    return (
        <div className="relative max-w-xl mb-10">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-gray/50" />
            <input
                type="text"
                placeholder="Search for activities, islands, or experiences..."
                className="w-full pl-12 pr-4 py-4 rounded-full bg-white border border-stone-gray/10 shadow-sm focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta outline-none transition-all"
                onChange={(e) => handleSearch(e.target.value)}
                defaultValue={searchParams.get("query")?.toString()}
            />
        </div>
    );
}
