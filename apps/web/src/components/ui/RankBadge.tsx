"use client";

interface RankBadgeProps {
    tier: string;
    points: number;
    compact?: boolean;
    className?: string;
}

const RANK_CONFIG = {
    'Newcomer': { icon: '🌱', color: 'bg-stone-gray/10 text-stone-gray border-stone-gray/20' },
    'Explorer': { icon: '🗺️', color: 'bg-blue-500/10 text-blue-700 border-blue-500/20' },
    'Adventurer': { icon: '⭐', color: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20' },
    'Expert': { icon: '🏆', color: 'bg-orange-500/10 text-orange-700 border-orange-500/20' },
    'Legend': { icon: '👑', color: 'bg-purple-500/10 text-purple-700 border-purple-500/20' },
};

export function RankBadge({ tier, points, compact = false, className = "" }: RankBadgeProps) {
    // Handle both English and potential legacy Indonesian values
    const tierMap: Record<string, keyof typeof RANK_CONFIG> = {
        'Pendatang': 'Newcomer',
        'Penjelajah': 'Explorer',
        'Petualang': 'Adventurer',
        'Ahli Perjalanan': 'Expert',
        'Legenda': 'Legend'
    };

    const normalizedTier = (tierMap[tier] || tier) as keyof typeof RANK_CONFIG;
    const config = RANK_CONFIG[normalizedTier] || RANK_CONFIG['Newcomer'];

    if (compact) {
        return (
            <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-semibold ${config.color} ${className}`}
                title={`${points} points`}
            >
                <span>{config.icon}</span>
                <span>{tier}</span>
            </span>
        );
    }

    return (
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border ${config.color} ${className}`}>
            <span className="text-xl">{config.icon}</span>
            <div className="flex flex-col">
                <span className="text-xs font-bold leading-tight">{tier}</span>
                <span className="text-[10px] opacity-70">{points} pts</span>
            </div>
        </div>
    );
}
