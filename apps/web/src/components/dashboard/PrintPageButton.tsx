"use client";

import { Printer } from "lucide-react";

export function PrintPageButton() {
    return (
        <button
            onClick={() => window.print()}
            className="bg-deep-teak text-white px-6 py-2 rounded-full font-bold shadow-md hover:bg-terracotta transition-colors flex items-center gap-2 mx-auto"
        >
            <Printer className="w-4 h-4" />
            Print Itinerary
        </button>
    );
}
