"use client";

import { useState, useEffect, useRef } from "react";
import { searchDestinations } from "./actions"; // Import server action
import { MapPin, Check, ChevronsUpDown, Search } from "lucide-react";
// We'll build a custom combobox using standard Tailwind/React to avoid heavy dependencies if possible,
// or we could use Headless UI if available. Let's keep it simple and dependency-free for now.

interface Destination {
    id: string;
    name: string;
}

interface DestinationComboboxProps {
    defaultValue?: string;
    name: string;
}

export function DestinationCombobox({ defaultValue = "", name }: DestinationComboboxProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState(defaultValue);
    const [value, setValue] = useState(defaultValue); // The actual selected value (string name)
    const [suggestions, setSuggestions] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length >= 2 && open) {
                setLoading(true);
                try {
                    const results = await searchDestinations(query);
                    setSuggestions(results);
                } catch (error) {
                    console.error("Search failed", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setSuggestions([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query, open]);

    const handleSelect = (destinationName: string) => {
        setValue(destinationName);
        setQuery(destinationName);
        setOpen(false);
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <input type="hidden" name={name} value={value} />
            <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-gray/50" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setValue(e.target.value); // Allow free text if they want, or strictly use selection?
                        // User requirement said "searchable based on destination availability"
                        // But also "what best approach if user don't know template?" => Suggesting strictly picking existing ones is safer for templates.
                        // However, allowing free text is better for "I'm going to X where you don't have support yet".
                        // Let's support free text but prioritized suggestions.
                        setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                    className="w-full pl-12 pr-10 py-3 rounded-xl border border-stone-gray/20 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all bg-warm-white/50"
                    placeholder="Search destination (e.g., Bali)"
                    autoComplete="off"
                />
                <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-gray/50 hover:text-stone-gray"
                >
                    <ChevronsUpDown className="w-4 h-4" />
                </button>
            </div>

            {open && (query.length > 0) && (
                <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-lg border border-stone-gray/10 max-h-60 overflow-auto animate-in fade-in zoom-in-95 duration-200">
                    {loading ? (
                        <div className="p-4 text-center text-stone-gray/60 text-sm">Searching...</div>
                    ) : suggestions.length > 0 ? (
                        <ul className="py-2">
                            {suggestions.map((dest) => (
                                <li
                                    key={dest.id}
                                    onClick={() => handleSelect(dest.name)}
                                    className="px-4 py-2.5 hover:bg-stone-gray/5 cursor-pointer flex items-center gap-3 transition-colors text-stone-gray hover:text-deep-teak"
                                >
                                    <MapPin className="w-4 h-4 text-terracotta/70" />
                                    <span className="font-medium">{dest.name}</span>
                                    {value === dest.name && <Check className="w-4 h-4 text-terracotta ml-auto" />}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-4 text-center text-stone-gray/60 text-sm">
                            {query.length < 2 ? "Type to search..." : "No destinations found. You can still create a trip here."}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
