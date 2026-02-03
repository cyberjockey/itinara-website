"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Filter } from "lucide-react";

export function PlaceFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentType = searchParams.get("filterType") || "all";
    const currentStatus = searchParams.get("filterStatus") || "all";

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value === "all") {
                params.delete(name);
            } else {
                params.set(name, value);
            }
            // Reset page when filtering
            params.set("page", "1");
            return params.toString();
        },
        [searchParams]
    );

    const handleTypeChange = (value: string) => {
        router.push(`?${createQueryString("filterType", value)}`);
    };

    const handleStatusChange = (value: string) => {
        router.push(`?${createQueryString("filterStatus", value)}`);
    };

    // Common categories (could be dynamic, but hardcoded for MVP)
    const categories = [
        "all",
        "Accomodation",
        "Beauty & Spa",
        "Culture",
        "Activity",
        "Food & Dining",
        "Nature",
        "Relax",
        "Shopping"
    ];

    return (
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <Filter className="w-4 h-4" />
                <span className="font-medium">Filter:</span>
            </div>

            <select
                value={currentType}
                onChange={(e) => handleTypeChange(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                    <option key={cat} value={cat}>
                        {cat === "all" ? "All" : cat}
                    </option>
                ))}
            </select>

            <select
                value={currentStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="all">All Status</option>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
                <option value="Permanently Closed">Permanently Closed</option>
            </select>
        </div>
    );
}
