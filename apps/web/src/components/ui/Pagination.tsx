"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    totalItems: number;
    currentPage: number;
    pageSize: number;
    isDark?: boolean; // For web app support if needed
}

export function Pagination({ totalItems, currentPage, pageSize, isDark = false }: PaginationProps) {
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
        params.set('page', '1');
        router.push(`${pathname}?${params.toString()}`);
    };

    const bgClass = isDark ? 'bg-transparent text-white' : 'bg-white text-gray-700';
    const borderClass = isDark ? 'border-gray-700' : 'border-gray-300';

    if (totalItems === 0) return null;

    return (
        <div className={`flex items-center justify-between px-4 py-3 border-t ${isDark ? 'border-white/10' : 'border-gray-200'} sm:px-6`}>
            {/* Mobile View */}
            <div className="flex flex-1 justify-between sm:hidden">
                <button
                    onClick={() => router.push(createPageURL(currentPage - 1))}
                    disabled={currentPage <= 1}
                    className={`relative inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium ${bgClass} ${borderClass} disabled:opacity-50`}
                >
                    Previous
                </button>
                <button
                    onClick={() => router.push(createPageURL(currentPage + 1))}
                    disabled={currentPage >= totalPages}
                    className={`relative ml-3 inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium ${bgClass} ${borderClass} disabled:opacity-50`}
                >
                    Next
                </button>
            </div>

            {/* Desktop View */}
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <p className={`text-sm ${isDark ? 'text-stone-300' : 'text-gray-700'}`}>
                        Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to <span className="font-medium">{Math.min(currentPage * pageSize, totalItems)}</span> of <span className="font-medium">{totalItems}</span> results
                    </p>
                    <select
                        value={pageSize}
                        onChange={handlePageSizeChange}
                        className={`block w-full rounded-md border-0 py-1.5 pl-3 pr-10 ring-1 ring-inset focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 cursor-pointer ${isDark
                                ? 'bg-white/10 text-white ring-white/20'
                                : 'text-gray-900 ring-gray-300'
                            }`}
                    >
                        <option value="3" className="text-black">3 per page</option>
                        <option value="6" className="text-black">6 per page</option>
                        <option value="12" className="text-black">12 per page</option>
                    </select>
                </div>

                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        <button
                            onClick={() => router.push(createPageURL(currentPage - 1))}
                            disabled={currentPage <= 1}
                            className={`relative inline-flex items-center rounded-l-md px-2 py-2 ring-1 ring-inset focus:z-20 focus:outline-offset-0 disabled:opacity-50 ${isDark
                                    ? 'bg-transparent text-gray-400 ring-gray-700 hover:bg-white/5'
                                    : 'bg-white text-gray-400 ring-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            <span className="sr-only">Previous</span>
                            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                        </button>

                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let p = i + 1;
                            if (totalPages > 5 && currentPage > 3) {
                                p = currentPage - 2 + i;
                            }
                            if (p > totalPages) return null;

                            const isActive = p === currentPage;
                            return (
                                <button
                                    key={p}
                                    onClick={() => router.push(createPageURL(p))}
                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset focus:z-20 focus:outline-offset-0 ${isActive
                                            ? "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                            : isDark
                                                ? "text-stone-300 ring-gray-700 hover:bg-white/5"
                                                : "text-gray-900 ring-gray-300 hover:bg-gray-50 bg-white"
                                        }`}
                                >
                                    {p}
                                </button>
                            );
                        })}

                        <button
                            onClick={() => router.push(createPageURL(currentPage + 1))}
                            disabled={currentPage >= totalPages}
                            className={`relative inline-flex items-center rounded-r-md px-2 py-2 ring-1 ring-inset focus:z-20 focus:outline-offset-0 disabled:opacity-50 ${isDark
                                    ? 'bg-transparent text-gray-400 ring-gray-700 hover:bg-white/5'
                                    : 'bg-white text-gray-400 ring-gray-300 hover:bg-gray-50'
                                }`}
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
