import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface LocationActivity {
    location?: string | null;
    title?: string | null;
    place_name?: string | null;
    [key: string]: unknown;
}

function getLocationQuery(activity: LocationActivity): string | null {
    if (activity.location && activity.location.trim()) return activity.location;
    if (activity.place_name && activity.place_name.trim()) return activity.place_name;
    if (activity.title && activity.title.trim()) return activity.title;
    return null;
}

/**
 * Generate Google Maps route URL with multiple waypoints
 */
export function generateDayRouteUrl(activities: LocationActivity[]): string {
    const locationsWithActivities = activities
        .map(a => ({ query: getLocationQuery(a), ...a }))
        .filter(a => a.query);

    if (locationsWithActivities.length === 0) return '#';
    if (locationsWithActivities.length === 1) {
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationsWithActivities[0].query!)}`;
    }

    // For multiple locations, create a route
    const origin = encodeURIComponent(locationsWithActivities[0].query!);
    const destination = encodeURIComponent(locationsWithActivities[locationsWithActivities.length - 1].query!);

    // Middle locations as waypoints
    const waypoints = locationsWithActivities
        .slice(1, -1)
        .map(a => encodeURIComponent(a.query!))
        .join('|');

    if (waypoints) {
        return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypoints}&travelmode=driving`;
    } else {
        return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
    }
}

/**
 * Generate Google Maps search URL for a single location
 */
export function generateGoogleMapsUrl(location: string): string {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
}
