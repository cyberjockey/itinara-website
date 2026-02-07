"use client";

import { useState } from "react";
import { Printer, Loader2 } from "lucide-react";

export function PrintPageButton() {
    const [isPrinting, setIsPrinting] = useState(false);

    const handlePrint = () => {
        setIsPrinting(true);
        // Add a small delay to ensure UI thread is ready on mobile
        setTimeout(() => {
            window.print();
            // Reset state after print dialog opens (approximate)
            setTimeout(() => setIsPrinting(false), 500);
        }, 100);
    };

    return (
        <button
            onClick={handlePrint}
            disabled={isPrinting}
            className="bg-deep-teak text-white px-8 py-3 sm:px-6 sm:py-2 rounded-full font-bold shadow-lg hover:bg-terracotta transition-all flex items-center gap-2 w-full sm:w-auto justify-center active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
        >
            {isPrinting ? (
                <>
                    <Loader2 className="w-5 h-5 sm:w-4 sm:h-4 animate-spin" />
                    Printing...
                </>
            ) : (
                <>
                    <Printer className="w-5 h-5 sm:w-4 sm:h-4" />
                    Print Itinerary
                </>
            )}
        </button>
    );
}
