
import { Award, Zap, Heart, Map, Users, Star, ShieldCheck, Trophy, BadgeCheck, Medal, type LucideIcon } from "lucide-react";

export const IconMap: Record<string, LucideIcon> = {
    "Award": Award,
    "Zap": Zap,
    "Heart": Heart,
    "Map": Map,
    "Users": Users,
    "Star": Star,
    "ShieldCheck": ShieldCheck,
    "Trophy": Trophy,
    "BadgeCheck": BadgeCheck,
    "Medal": Medal
};

export function getIconComponent(name: string) {
    return IconMap[name] || Award; // Fallback to Award
}
