/**
 * Emergency phone numbers by ISO 3166-1 alpha-2 country code
 * Source: Various official government sources
 */

export interface EmergencyNumbers {
    police: string;
    ambulance: string;
    fire: string;
    general?: string; // Universal emergency number if available
}

export const EMERGENCY_NUMBERS: Record<string, EmergencyNumbers> = {
    // Southeast Asia
    ID: { police: "110", ambulance: "118 / 119", fire: "113", general: "112" },
    MY: { police: "999", ambulance: "999", fire: "994", general: "999" },
    SG: { police: "999", ambulance: "995", fire: "995" },
    TH: { police: "191", ambulance: "1669", fire: "199", general: "1155" },
    VN: { police: "113", ambulance: "115", fire: "114" },
    PH: { police: "117", ambulance: "117", fire: "117" },

    // East Asia
    JP: { police: "110", ambulance: "119", fire: "119" },
    KR: { police: "112", ambulance: "119", fire: "119" },
    CN: { police: "110", ambulance: "120", fire: "119" },
    TW: { police: "110", ambulance: "119", fire: "119" },
    HK: { police: "999", ambulance: "999", fire: "999" },

    // South Asia
    IN: { police: "100", ambulance: "102", fire: "101", general: "112" },
    LK: { police: "119", ambulance: "110", fire: "111" },
    NP: { police: "100", ambulance: "102", fire: "101" },

    // Middle East
    AE: { police: "999", ambulance: "998", fire: "997" },
    SA: { police: "999", ambulance: "997", fire: "998" },
    TR: { police: "155", ambulance: "112", fire: "110", general: "112" },

    // Europe
    GB: { police: "999", ambulance: "999", fire: "999", general: "112" },
    FR: { police: "17", ambulance: "15", fire: "18", general: "112" },
    DE: { police: "110", ambulance: "112", fire: "112", general: "112" },
    IT: { police: "113", ambulance: "118", fire: "115", general: "112" },
    ES: { police: "091", ambulance: "061", fire: "080", general: "112" },
    NL: { police: "112", ambulance: "112", fire: "112", general: "112" },
    PT: { police: "112", ambulance: "112", fire: "112", general: "112" },
    GR: { police: "100", ambulance: "166", fire: "199", general: "112" },

    // Americas
    US: { police: "911", ambulance: "911", fire: "911", general: "911" },
    CA: { police: "911", ambulance: "911", fire: "911", general: "911" },
    MX: { police: "911", ambulance: "911", fire: "911", general: "911" },
    BR: { police: "190", ambulance: "192", fire: "193" },
    AR: { police: "101", ambulance: "107", fire: "100" },

    // Oceania
    AU: { police: "000", ambulance: "000", fire: "000", general: "000" },
    NZ: { police: "111", ambulance: "111", fire: "111", general: "111" },

    // Africa
    ZA: { police: "10111", ambulance: "10177", fire: "10111" },
    EG: { police: "122", ambulance: "123", fire: "180" },
    KE: { police: "999", ambulance: "999", fire: "999" },
};

/**
 * Get emergency numbers for a country
 * @param countryCode ISO 3166-1 alpha-2 country code
 * @returns Emergency numbers or default international numbers
 */
export function getEmergencyNumbers(countryCode: string): EmergencyNumbers {
    const code = countryCode.toUpperCase();
    return EMERGENCY_NUMBERS[code] || {
        police: "112",
        ambulance: "112",
        fire: "112",
        general: "112" // International emergency number (works in many countries)
    };
}

/**
 * Map common destination names to country codes
 */
export const DESTINATION_TO_COUNTRY: Record<string, string> = {
    // Indonesia
    "bali": "ID",
    "jakarta": "ID",
    "yogyakarta": "ID",
    "bandung": "ID",
    "surabaya": "ID",
    "lombok": "ID",
    "east java": "ID",
    "west java": "ID",
    "central java": "ID",

    // Other Southeast Asia
    "singapore": "SG",
    "kuala lumpur": "MY",
    "penang": "MY",
    "bangkok": "TH",
    "phuket": "TH",
    "chiang mai": "TH",
    "ho chi minh city": "VN",
    "hanoi": "VN",
    "manila": "PH",
    "cebu": "PH",

    // East Asia
    "tokyo": "JP",
    "osaka": "JP",
    "kyoto": "JP",
    "seoul": "KR",
    "busan": "KR",
    "beijing": "CN",
    "shanghai": "CN",
    "hong kong": "HK",
    "taipei": "TW",

    // Europe
    "london": "GB",
    "paris": "FR",
    "rome": "IT",
    "barcelona": "ES",
    "madrid": "ES",
    "amsterdam": "NL",
    "berlin": "DE",
    "munich": "DE",
    "lisbon": "PT",
    "athens": "GR",
    "istanbul": "TR",

    // Americas
    "new york": "US",
    "los angeles": "US",
    "san francisco": "US",
    "miami": "US",
    "toronto": "CA",
    "vancouver": "CA",
    "cancun": "MX",
    "mexico city": "MX",

    // Oceania
    "sydney": "AU",
    "melbourne": "AU",
    "auckland": "NZ",
    "queenstown": "NZ",
};

/**
 * Get country code from destination name
 */
export function getCountryFromDestination(destination: string): string | null {
    const normalized = destination.toLowerCase().trim();
    return DESTINATION_TO_COUNTRY[normalized] || null;
}

/**
 * Destination coordinates for emergency service lookup
 * Used as fallback when places don't have lat/lng
 */
export const DESTINATION_COORDINATES: Record<string, { lat: number; lon: number }> = {
    // Indonesia
    "bali": { lat: -8.4095, lon: 115.1889 },
    "jakarta": { lat: -6.2088, lon: 106.8456 },
    "yogyakarta": { lat: -7.7956, lon: 110.3695 },
    "bandung": { lat: -6.9175, lon: 107.6191 },
    "surabaya": { lat: -7.2575, lon: 112.7521 },
    "lombok": { lat: -8.6500, lon: 116.3250 },
    "east java": { lat: -7.5361, lon: 112.2384 },
    "west java": { lat: -6.9175, lon: 107.6191 },
    "central java": { lat: -7.1500, lon: 110.4167 },

    // Southeast Asia
    "singapore": { lat: 1.3521, lon: 103.8198 },
    "kuala lumpur": { lat: 3.1390, lon: 101.6869 },
    "penang": { lat: 5.4164, lon: 100.3327 },
    "bangkok": { lat: 13.7563, lon: 100.5018 },
    "phuket": { lat: 7.8804, lon: 98.3923 },
    "chiang mai": { lat: 18.7883, lon: 98.9853 },
    "ho chi minh city": { lat: 10.8231, lon: 106.6297 },
    "hanoi": { lat: 21.0278, lon: 105.8342 },
    "manila": { lat: 14.5995, lon: 120.9842 },
    "cebu": { lat: 10.3157, lon: 123.8854 },

    // East Asia
    "tokyo": { lat: 35.6762, lon: 139.6503 },
    "osaka": { lat: 34.6937, lon: 135.5023 },
    "kyoto": { lat: 35.0116, lon: 135.7681 },
    "seoul": { lat: 37.5665, lon: 126.9780 },
    "busan": { lat: 35.1796, lon: 129.0756 },
    "beijing": { lat: 39.9042, lon: 116.4074 },
    "shanghai": { lat: 31.2304, lon: 121.4737 },
    "hong kong": { lat: 22.3193, lon: 114.1694 },
    "taipei": { lat: 25.0330, lon: 121.5654 },

    // Europe
    "london": { lat: 51.5074, lon: -0.1278 },
    "paris": { lat: 48.8566, lon: 2.3522 },
    "rome": { lat: 41.9028, lon: 12.4964 },
    "barcelona": { lat: 41.3851, lon: 2.1734 },
    "madrid": { lat: 40.4168, lon: -3.7038 },
    "amsterdam": { lat: 52.3676, lon: 4.9041 },
    "berlin": { lat: 52.5200, lon: 13.4050 },
    "munich": { lat: 48.1351, lon: 11.5820 },
    "lisbon": { lat: 38.7223, lon: -9.1393 },
    "athens": { lat: 37.9838, lon: 23.7275 },
    "istanbul": { lat: 41.0082, lon: 28.9784 },

    // Americas
    "new york": { lat: 40.7128, lon: -74.0060 },
    "los angeles": { lat: 34.0522, lon: -118.2437 },
    "san francisco": { lat: 37.7749, lon: -122.4194 },
    "miami": { lat: 25.7617, lon: -80.1918 },
    "toronto": { lat: 43.6532, lon: -79.3832 },
    "vancouver": { lat: 49.2827, lon: -123.1207 },
    "cancun": { lat: 21.1619, lon: -86.8515 },
    "mexico city": { lat: 19.4326, lon: -99.1332 },

    // Oceania
    "sydney": { lat: -33.8688, lon: 151.2093 },
    "melbourne": { lat: -37.8136, lon: 144.9631 },
    "auckland": { lat: -36.8485, lon: 174.7633 },
    "queenstown": { lat: -45.0312, lon: 168.6626 },
};

/**
 * Get coordinates for a destination
 */
export function getDestinationCoordinates(destination: string): { lat: number; lon: number } | null {
    const normalized = destination.toLowerCase().trim();
    return DESTINATION_COORDINATES[normalized] || null;
}
