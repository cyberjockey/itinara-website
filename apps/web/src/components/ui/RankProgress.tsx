"use client";

import { RankBadge } from "./RankBadge";

const RANK_TIERS = [
    { name: 'Newcomer', icon: '🌱', min: 0, max: 99, color: 'bg-stone-gray/20 text-stone-gray' },
    { name: 'Explorer', icon: '🗺️', min: 100, max: 299, color: 'bg-blue-500/20 text-blue-700' },
    { name: 'Adventurer', icon: '⭐', min: 300, max: 599, color: 'bg-yellow-500/20 text-yellow-700' },
    { name: 'Expert', icon: '🏆', min: 600, max: 999, color: 'bg-orange-500/20 text-orange-700' },
    { name: 'Legend', icon: '👑', min: 1000, max: 9999, color: 'bg-purple-500/20 text-purple-700' },
];

interface RankProgressProps {
    currentTier: string;
    currentPoints: number;
}

export function RankProgress({ currentTier, currentPoints }: RankProgressProps) {
    // Handle legacy values
    const tierMap: Record<string, string> = {
        'Pendatang': 'Newcomer',
        'Penjelajah': 'Explorer',
        'Petualang': 'Adventurer',
        'Ahli Perjalanan': 'Expert',
        'Legenda': 'Legend'
    };
    const normalizedTier = tierMap[currentTier] || currentTier;

    const currentTierIndex = RANK_TIERS.findIndex(t => t.name === normalizedTier);
    const nextTier = RANK_TIERS[currentTierIndex + 1];

    return (
        <div className="space-y-4">
            {/* Current Badge */}
            <div className="flex items-center justify-between">
                <RankBadge tier={currentTier} points={currentPoints} />
                <div className="text-right">
                    <p className="text-xs text-stone-gray/70">Create trips to level up!</p>
                    <p className="text-xs text-stone-gray/60 mt-0.5">Premium: 10 pts • VIP: 30 pts</p>
                </div>
            </div>

            {/* Timeline */}
            <div className="space-y-2.5">
                {RANK_TIERS.map((tier) => {
                    const isCurrent = currentTier === tier.name;
                    const isCompleted = currentPoints > tier.max;
                    const progress = isCurrent
                        ? Math.min(((currentPoints - tier.min) / (tier.max - tier.min)) * 100, 100)
                        : isCompleted ? 100 : 0;

                    return (
                        <div key={tier.name} className={`flex items-center gap-3 transition-opacity ${isCurrent ? 'opacity-100' : 'opacity-50'}`}>
                            <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm border-2 ${isCurrent || isCompleted ? tier.color : 'bg-stone-gray/5 text-stone-gray/50 border-stone-gray/20'
                                } ${isCompleted ? 'border-current' : 'border-transparent'}`}>
                                {tier.icon}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <span className={`text-xs font-semibold ${isCurrent ? 'text-deep-teak' : 'text-stone-gray/60'}`}>
                                        {tier.name}
                                    </span>
                                    <span className="text-[10px] text-stone-gray/50">
                                        {tier.min}{tier.max === 9999 ? '+' : `−${tier.max}`} pts
                                    </span>
                                </div>
                                <div className="h-1.5 bg-stone-gray/10 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-500 ${isCurrent || isCompleted ? tier.color.replace('/20', '') : 'bg-stone-gray/20'
                                            }`}
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Next Milestone */}
            {nextTier && (
                <div className="mt-3 p-3 bg-white/70 rounded-lg border border-stone-gray/10">
                    <p className="text-xs">
                        <span className="font-semibold text-terracotta">
                            {nextTier.min - currentPoints} points to {nextTier.name}
                        </span>
                        {' • '}
                        <span className="text-stone-gray/70">
                            ~{Math.ceil((nextTier.min - currentPoints) / 30)} VIP trips
                        </span>
                    </p>
                </div>
            )}
        </div>
    );
}
