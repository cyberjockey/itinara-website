'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Check, X, Sparkles } from 'lucide-react';

// Database columns available for mapping
const DB_COLUMNS = [
    { key: 'name', label: 'Name', required: true },
    { key: 'destination_name', label: 'Destination (City/Region)', required: true },
    { key: 'type', label: 'Category/Type', required: false },
    { key: 'description', label: 'Description/About', required: false },
    { key: 'location', label: 'Address/Location', required: false },
    { key: 'phone', label: 'Phone/Whatsapp', required: false },
    { key: 'website', label: 'Website', required: false },
    { key: 'social_media', label: 'Social Media', required: false },
    { key: 'price_level', label: 'Price Range', required: false },
    { key: 'rating', label: 'Rating', required: false },
    { key: 'what_to_expect', label: 'What to Expect', required: false },
    { key: 'highlight_and_tips', label: 'Highlight and Tips', required: false },
    { key: 'latitude', label: 'Latitude', required: false },
    { key: 'longitude', label: 'Longitude', required: false },
    { key: 'google_place_name', label: 'Place Name on Google', required: false },
    { key: 'full_address', label: 'Full Address', required: false },
    { key: 'reviewer_count', label: 'Reviewer Count', required: false },
    { key: 'google_maps_url', label: 'Google Maps URL', required: false },
    { key: 'google_place_id', label: 'Google Place ID', required: false },
];

// Auto-mapping suggestions based on common header variations
const AUTO_MAP_HINTS: Record<string, string[]> = {
    'name': ['name', 'place name', 'activity name', 'title'],
    'destination_name': ['destination', 'city', 'region', 'city / region', 'city/region', 'destination_name'],
    'type': ['type', 'category', 'kind'],
    'description': ['description', 'about', 'details', 'info'],
    'location': ['location', 'address', 'place'],
    'phone': ['phone', 'whatsapp', 'phone / whatsapp', 'phone/whatsapp', 'contact'],
    'website': ['website', 'url', 'link', 'web'],
    'social_media': ['social media', 'social_media', 'instagram', 'facebook', 'socials'],
    'price_level': ['price', 'price range', 'price_level', 'cost', 'pricing'],
    'rating': ['rating', 'score', 'stars', 'rate'],
    'what_to_expect': ['what to expect', 'what_to_expect', 'expectations', 'expect'],
    'highlight_and_tips': ['highlight', 'tips', 'highlight and tips', 'highlight_and_tips', 'highlights'],
    'latitude': ['latitude', 'lat'],
    'longitude': ['longitude', 'lng', 'lon', 'long'],
    'google_place_name': ['place name on google', 'google_place_name', 'google name'],
    'full_address': ['full address', 'full_address', 'complete address'],
    'reviewer_count': ['reviewer count', 'reviewer_count', 'reviews', 'review count'],
    'google_maps_url': ['google maps url', 'google_maps_url', 'maps url', 'gmaps'],
    'google_place_id': ['place id', 'google_place_id', 'google place id', 'placeid'],
};

export type ColumnMapping = Record<string, string>; // csvHeader -> dbColumn

interface ColumnMapperProps {
    csvHeaders: string[];
    onMappingComplete: (mapping: ColumnMapping) => void;
    onCancel: () => void;
}

export function ColumnMapper({ csvHeaders, onMappingComplete, onCancel }: ColumnMapperProps) {
    const [mapping, setMapping] = useState<ColumnMapping>({});
    const [errors, setErrors] = useState<string[]>([]);

    // Auto-detect mappings on mount
    useEffect(() => {
        const autoMapping: ColumnMapping = {};

        csvHeaders.forEach(header => {
            const normalizedHeader = header.toLowerCase().trim();

            for (const [dbCol, hints] of Object.entries(AUTO_MAP_HINTS)) {
                if (hints.some(hint => normalizedHeader === hint || normalizedHeader.includes(hint))) {
                    // Only map if not already mapped
                    if (!Object.values(autoMapping).includes(dbCol)) {
                        autoMapping[header] = dbCol;
                        break;
                    }
                }
            }
        });

        setMapping(autoMapping);
    }, [csvHeaders]);

    const handleMappingChange = (csvHeader: string, dbColumn: string) => {
        setMapping(prev => {
            const newMapping = { ...prev };
            if (dbColumn === '') {
                delete newMapping[csvHeader];
            } else {
                // Remove any existing mapping to this dbColumn
                for (const key of Object.keys(newMapping)) {
                    if (newMapping[key] === dbColumn) {
                        delete newMapping[key];
                    }
                }
                newMapping[csvHeader] = dbColumn;
            }
            return newMapping;
        });
    };

    const validateMapping = () => {
        const errs: string[] = [];
        const requiredCols = DB_COLUMNS.filter(c => c.required).map(c => c.key);

        for (const required of requiredCols) {
            if (!Object.values(mapping).includes(required)) {
                const col = DB_COLUMNS.find(c => c.key === required);
                errs.push(`Required: "${col?.label}" must be mapped`);
            }
        }

        setErrors(errs);
        return errs.length === 0;
    };

    const handleConfirm = () => {
        if (validateMapping()) {
            onMappingComplete(mapping);
        }
    };

    const getMappedDbColumn = (csvHeader: string) => mapping[csvHeader] || '';

    const isDbColumnUsed = (dbColumn: string) => Object.values(mapping).includes(dbColumn);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 text-blue-700 bg-blue-50 px-4 py-3 rounded-lg">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm">We auto-detected some column mappings. Review and adjust as needed.</span>
            </div>

            {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <ul className="text-sm text-red-700 space-y-1">
                        {errors.map((err, i) => (
                            <li key={i} className="flex items-center gap-2">
                                <X className="w-4 h-4" />
                                {err}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 grid grid-cols-[1fr,40px,1fr] gap-4 text-sm font-medium text-gray-600">
                    <span>CSV Column</span>
                    <span></span>
                    <span>Database Field</span>
                </div>

                <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                    {csvHeaders.map((header) => (
                        <div key={header} className="px-4 py-3 grid grid-cols-[1fr,40px,1fr] gap-4 items-center hover:bg-gray-50">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-900 truncate">{header}</span>
                            </div>

                            <div className="flex justify-center">
                                <ArrowRight className={`w-4 h-4 ${getMappedDbColumn(header) ? 'text-green-500' : 'text-gray-300'}`} />
                            </div>

                            <div className="relative">
                                <select
                                    value={getMappedDbColumn(header)}
                                    onChange={(e) => handleMappingChange(header, e.target.value)}
                                    className={`w-full px-3 py-2 text-sm border rounded-lg appearance-none cursor-pointer
                                        ${getMappedDbColumn(header)
                                            ? 'border-green-300 bg-green-50 text-green-800'
                                            : 'border-gray-200 bg-white text-gray-700'
                                        }
                                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                >
                                    <option value="">— Skip this column —</option>
                                    {DB_COLUMNS.map((col) => (
                                        <option
                                            key={col.key}
                                            value={col.key}
                                            disabled={isDbColumnUsed(col.key) && getMappedDbColumn(header) !== col.key}
                                        >
                                            {col.label} {col.required ? '*' : ''}
                                        </option>
                                    ))}
                                </select>
                                {getMappedDbColumn(header) && (
                                    <Check className="w-4 h-4 text-green-500 absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                    <span className="text-red-500">*</span> Required fields
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Back
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Confirm Mapping
                    </button>
                </div>
            </div>
        </div>
    );
}
