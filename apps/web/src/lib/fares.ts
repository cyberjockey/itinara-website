
export interface Coordinates {
    lat: number;
    lng: number;
}

export interface FareEstimate {
    car: number;
    bike: number;
    distanceKm: number;
}

// Haversine formula to calculate distance in km
function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(coord2.lat - coord1.lat);
    const dLon = toRad(coord2.lng - coord1.lng);
    const lat1 = toRad(coord1.lat);
    const lat2 = toRad(coord2.lat);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function toRad(val: number): number {
    return val * Math.PI / 180;
}

export function calculateEstimatedFare(start: Coordinates, end: Coordinates): FareEstimate {
    const distanceKm = calculateDistance(start, end);

    // Approximate Pricing (IDR)
    // Car: Base ~15,000 + ~6,000/km
    // Bike: Base ~10,000 + ~3,000/km

    // Minimum distance factor (prevent 0 cost for same/very close location)
    const activeDist = Math.max(distanceKm, 1);

    const carFare = 15000 + (activeDist * 6000);
    const bikeFare = 10000 + (activeDist * 3000);

    return {
        car: Math.ceil(carFare / 1000) * 1000, // Round to nearest 1000
        bike: Math.ceil(bikeFare / 1000) * 1000,
        distanceKm: Number(distanceKm.toFixed(1))
    };
}

export function formatCurrency(amount: number): string {
    if (amount >= 1000) {
        return `${(amount / 1000).toFixed(0)}k`;
    }
    return amount.toString();
}
