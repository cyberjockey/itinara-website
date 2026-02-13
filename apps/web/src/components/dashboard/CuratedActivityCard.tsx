"use client";

import React, { useState } from 'react';
import {
    MapPin,
    Clock,
    Wallet,
    Info,
    ChevronDown,
    ChevronUp,
    UtensilsCrossed,
    ShoppingBag,
    Sparkles,
    Lightbulb,
    Camera
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ParsedContent {
    narrative: string;
    meta: {
        hours?: string;
        price?: string;
        duration?: string;
        location?: string;
        bestTime?: string | null;
        wear?: string | null;
    };
    highlights: {
        tips?: string[];
        unique?: string[];
        cuisine?: string[];
        shopping?: string[];
    };
}

interface CuratedActivityCardProps {
    activity: {
        id: string;
        title: string;
        start_time?: string;
        location?: string;
        description?: string;
    };
    isLast?: boolean;
}

// Helper to clean and parse the unstructured text
const parseActivityContent = (description: string = ""): ParsedContent => {
    // Replace double backslashes, literal \n, or single backslashes with newlines
    const rawText = description.replace(/(\\\\|\\n|\\)/g, '\n');
    const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);

    const parsed: ParsedContent = {
        narrative: '',
        meta: {},
        highlights: {
            tips: [],
            unique: [],
            cuisine: [],
            shopping: []
        }
    };

    const narrativeLines: string[] = [];

    const markers = {
        hours: ['🕒', 'Operating Hours:', 'Opening Hours:'],
        price: ['💵', 'Ticket Price:', 'Entry Fee:', 'Cost:', 'Price:'],
        duration: ['⏳', 'Duration:'],
        tips: ['💡', 'Visitor Tips:', 'Tips:', '**Visitor Tips:**', 'Pro Tip:'],
        unique: ['✨', 'Unique Feature:', 'Highlights:'],
        cuisine: ['🍲', 'Cuisine / Activity:', 'Food:'],
        shopping: ['🛍️', 'Souvenir / Extras:', 'Shopping:'],
        bestTime: ['🕐', 'Best time to visit:', '**Best time to visit**'],
        wear: ['👟', 'What to bring or wear:', '**What to bring or wear**']
    };

    lines.forEach(line => {
        let isMeta = false;

        // Check Hours
        if (markers.hours.some(m => line.includes(m))) {
            parsed.meta.hours = line.replace(/.*(Hours|:)\s*/, '').trim();
            isMeta = true;
        }
        // Check Price
        else if (markers.price.some(m => line.includes(m))) {
            parsed.meta.price = line.replace(/.*(Price|Fee|:|💵)\s*/, '').trim();
            isMeta = true;
        }
        // Check Duration
        else if (markers.duration.some(m => line.includes(m))) {
            parsed.meta.duration = line.replace(/.*(Duration|:|⏳)\s*/, '').trim();
            isMeta = true;
        }
        // Check Best Time
        else if (markers.bestTime.some(m => line.includes(m))) {
            parsed.meta.bestTime = line.replace(/.*(visit|:|🕐|\*{2})\s*/, '').trim();
            isMeta = true;
        }
        // Check What to Wear
        else if (markers.wear.some(m => line.includes(m))) {
            parsed.meta.wear = line.replace(/.*(wear|:|👟|\*{2})\s*/, '').trim();
            isMeta = true;
        }
        // Check Tips
        else if (markers.tips.some(m => line.includes(m))) {
            const content = line.replace(/.*(Tips|:|💡|\*{2})\s*/, '').trim();
            if (content) parsed.highlights.tips?.push(content);
            isMeta = true;
        }
        // Check Unique
        else if (markers.unique.some(m => line.includes(m))) {
            const content = line.replace(/.*(Feature|Highlights|:|✨)\s*/, '').trim();
            if (content) parsed.highlights.unique?.push(content);
            isMeta = true;
        }
        // Check Cuisine
        else if (markers.cuisine.some(m => line.includes(m))) {
            const content = line.replace(/.*(Activity|Food|:|🍲)\s*/, '').trim();
            if (content) parsed.highlights.cuisine?.push(content);
            isMeta = true;
        }
        // Check Shopping
        else if (markers.shopping.some(m => line.includes(m))) {
            const content = line.replace(/.*(Extras|Shopping|:|🛍️)\s*/, '').trim();
            if (content) parsed.highlights.shopping?.push(content);
            isMeta = true;
        }

        if (!isMeta) {
            narrativeLines.push(line);
        }
    });

    parsed.narrative = narrativeLines.join('\n\n');
    return parsed;
};

export const CuratedActivityCard: React.FC<CuratedActivityCardProps> = ({
    activity,
    isLast
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const content = parseActivityContent(activity.description);

    return (
        <div className="flex gap-4 group">
            {/* Time Column */}
            <div className="w-16 pt-1 text-right text-sm font-mono font-medium text-stone-gray shrink-0">
                {activity.start_time || "—"}
            </div>

            {/* Main Content Column */}
            <div className={cn(
                "flex-1 pb-8",
                !isLast && "border-b border-stone-gray/10"
            )}>
                {/* Header Section */}
                <div className="mb-3">
                    <h4 className="text-lg font-bold text-deep-teak group-hover:text-terracotta transition-colors mb-1">
                        {activity.title}
                    </h4>

                    {/* Top Metadata Row (Location & Basic Info) */}
                    <div className="flex flex-wrap items-center gap-3 text-sm text-stone-gray">
                        {activity.location && (
                            <div className="flex items-center gap-1.5 text-terracotta/80 font-medium">
                                <MapPin className="w-3.5 h-3.5" />
                                {activity.location}
                            </div>
                        )}

                        {content.meta.hours && (
                            <div className="flex items-center gap-1.5 bg-stone-100 px-2 py-0.5 rounded-full text-xs">
                                <Clock className="w-3 h-3 text-stone-500" />
                                {content.meta.hours}
                            </div>
                        )}

                        {content.meta.price && (
                            <div className="flex items-center gap-1.5 bg-green-50 px-2 py-0.5 rounded-full text-xs text-green-700 border border-green-100">
                                <Wallet className="w-3 h-3" />
                                {content.meta.price}
                            </div>
                        )}
                    </div>
                </div>

                {/* Highlighted Insights (Local Tips, Unique Features) */}
                {((content.highlights.unique?.length ?? 0) > 0 || (content.highlights.tips?.length ?? 0) > 0) && (
                    <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-4 mb-4 grid gap-3 sm:grid-cols-2">
                        {content.highlights.unique && content.highlights.unique.length > 0 && (
                            <div className="text-sm">
                                <div className="flex items-center gap-2 font-bold text-orange-800 mb-1.5 text-xs uppercase tracking-wide">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    Highlights
                                </div>
                                <ul className="list-disc list-inside space-y-1 text-stone-700 text-xs leading-relaxed marker:text-orange-300">
                                    {content.highlights.unique.map((item, idx) => (
                                        <li key={idx}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {content.highlights.tips && content.highlights.tips.length > 0 && (
                            <div className="text-sm">
                                <div className="flex items-center gap-2 font-bold text-blue-800 mb-1.5 text-xs uppercase tracking-wide">
                                    <Lightbulb className="w-3.5 h-3.5" />
                                    Pro Tips
                                </div>
                                <ul className="list-disc list-inside space-y-1 text-stone-700 text-xs leading-relaxed marker:text-blue-300">
                                    {content.highlights.tips.map((item, idx) => (
                                        <li key={idx}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {/* Narrative Description with Read More */}
                {content.narrative && (
                    <div className="bg-white rounded-lg">
                        <div className={cn(
                            "prose prose-sm prose-stone max-w-none text-stone-600 leading-relaxed",
                            !isOpen && "line-clamp-3" // Show first 3 lines by default
                        )}>
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm, remarkBreaks]}
                                components={{
                                    p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                    strong: ({ node, ...props }) => <span className="font-bold text-deep-teak" {...props} />
                                }}
                            >
                                {content.narrative}
                            </ReactMarkdown>
                        </div>

                        {content.narrative.length > 200 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsOpen(!isOpen)}
                                className="mt-2 h-auto p-0 text-terracotta hover:text-deep-teak hover:bg-transparent font-medium text-xs flex items-center gap-1"
                            >
                                {isOpen ? (
                                    <>Read Less <ChevronUp className="w-3 h-3" /></>
                                ) : (
                                    <>Read More <ChevronDown className="w-3 h-3" /></>
                                )}
                            </Button>
                        )}
                    </div>
                )}

                {/* Secondary Details (Cuisine, Shopping) - Inline Badges */}
                {((content.highlights.cuisine?.length ?? 0) > 0 || (content.highlights.shopping?.length ?? 0) > 0) && (
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-dashed border-stone-200">
                        {content.highlights.cuisine?.map((item, i) => (
                            <Badge key={`food-${i}`} variant="secondary" className="bg-stone-100 text-stone-600 hover:bg-stone-200 border-0 font-normal text-xs">
                                <UtensilsCrossed className="w-3 h-3 mr-1.5 text-stone-400" />
                                {item}
                            </Badge>
                        ))}
                        {content.highlights.shopping?.map((item, i) => (
                            <Badge key={`shop-${i}`} variant="secondary" className="bg-stone-100 text-stone-600 hover:bg-stone-200 border-0 font-normal text-xs">
                                <ShoppingBag className="w-3 h-3 mr-1.5 text-stone-400" />
                                {item}
                            </Badge>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CuratedActivityCard;
