
import { Award, Zap, Map, Users, Star, LucideIcon } from "lucide-react";

export type BadgeType = 'first_trip' | 'veteran' | 'top_rated' | 'fast_responder' | 'community_pillar';

export interface BadgeDef {
    id: BadgeType;
    label: string;
    description: string;
    icon: LucideIcon;
    color: string;
}

export const BADGE_DEFINITIONS: Record<BadgeType, BadgeDef> = {
    first_trip: {
        id: 'first_trip',
        label: 'First Step',
        description: 'Created their first trip.',
        icon: Map,
        color: 'text-blue-500 bg-blue-50 border-blue-200'
    },
    veteran: {
        id: 'veteran',
        label: 'Veteran Guide',
        description: 'Has been guiding for over a year.',
        icon: Award,
        color: 'text-purple-500 bg-purple-50 border-purple-200'
    },
    top_rated: {
        id: 'top_rated',
        label: 'Top Rated',
        description: 'Maintains a 5-star rating.',
        icon: Star,
        color: 'text-yellow-500 bg-yellow-50 border-yellow-200'
    },
    fast_responder: {
        id: 'fast_responder',
        label: 'Fast Responder',
        description: 'Replies to messages within an hour.',
        icon: Zap,
        color: 'text-orange-500 bg-orange-50 border-orange-200'
    },
    community_pillar: {
        id: 'community_pillar',
        label: 'Community Pillar',
        description: 'Active contributor to the community.',
        icon: Users,
        color: 'text-green-500 bg-green-50 border-green-200'
    }
};
