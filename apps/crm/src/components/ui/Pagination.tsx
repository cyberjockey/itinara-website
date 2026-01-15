"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    totalItems: number;
    currentPage: number;
    pageSize: number;
}

export function Pagination({ totalItems, currentPage, pageSize }: PaginationProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const totalPages = Math.ceil(totalItems / pageSize);

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams);
        params.set('limit', e.target.value);
        params.set('page', '1'); // Reset to page 1 on limit change
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
                <button
                    onClick={() => router.push(createPageURL(currentPage - 1))}
                    disabled={currentPage <= 1}
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                    Previous
                </button>
                <button
                    onClick={() => router.push(createPageURL(currentPage + 1))}
                    disabled={currentPage >= totalPages}
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                    Next
                </button>
            </div>

            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to <span className="font-medium">{Math.min(currentPage * pageSize, totalItems)}</span> of <span className="font-medium">{totalItems}</span> results
                    </p>
                    <select
                        value={pageSize}
                        onChange={handlePageSizeChange}
                        className="block w-full rounded-md border-gray-300 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 cursor-pointer"
                    >
                        <option value="3">3 per page</option>
                        <option value="5">5 per page</option>
                        <option value="10">10 per page</option>
                        <option value="20">20 per page</option>
                        <option value="50">50 per page</option>
                    </select>
                </div>

                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        <button
                            onClick={() => router.push(createPageURL(currentPage - 1))}
                            disabled={currentPage <= 1}
                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                        >
                            <span className="sr-only">Previous</span>
                            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                        </button>

                        {/* Simple Pagination Numbers: show current, and maybe neighbors? For now just simplified previous/next is often enough for small data, 
                            but let's do simple numbers if small totalPages, or just page X of Y. 
                            Let's just show arrows for simplicity if logic is complex, OR just 1, 2, 3... 
                            Let's sticking to Prev/Next buttons with "Page X of Y" usually cleaner for MVP. 
                            But user asked for "standard" looking pagination maybe? "max 3 data".
                            Let's keep the Next/Prev arrows and maybe the current page number in middle? 
                        */}
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            // Logic to show generic window of pages centered on current could be added here
                            // For now, let's just do simple 1..5
                            let p = i + 1;
                            if (totalPages > 5 && currentPage > 3) {
                                p = currentPage - 2 + i;
                            }
                            if (p > totalPages) return null;

                            return (
                                <button
                                    key={p}
                                    onClick={() => router.push(createPageURL(p))}
                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${p === currentPage
                                            ? "z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                            : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                        }`}
                                >
                                    {p}
                                </button>
                            );
                        })}

                        <button
                            onClick={() => router.push(createPageURL(currentPage + 1))}
                            disabled={currentPage >= totalPages}
                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                        >
                            <span className="sr-only">Next</span>
                            <ChevronRight className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
}
