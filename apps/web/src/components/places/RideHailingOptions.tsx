import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

interface RideHailingOptionsProps {
    coordinates?: {
        lat: number;
        lng: number;
    };
    destinationName?: string;
    destinationAddress?: string;
}

export function RideHailingOptions({ coordinates, destinationName, destinationAddress }: RideHailingOptionsProps) {
    if (!coordinates || !coordinates.lat || !coordinates.lng) {
        return null;
    }

    const { lat, lng } = coordinates;
    const encodedName = encodeURIComponent(destinationName || "");
    const encodedAddress = encodeURIComponent(destinationAddress || "");

    // Grab Deep Link (Unofficial but widely used)
    // grab://open?screen=book&dlat={lat}&dlong={lng}&daddr={address}&source=itinara
    const grabLink = `grab://open?screen=book&dlat=${lat}&dlong=${lng}&daddr=${encodedName || encodedAddress}&source=itinara`;

    // Gojek Deep Link (Generic open)
    // specific deep linking for destination is not publicly documented in a standard way
    const gojekLink = `gojek://`;

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-stone-gray uppercase tracking-wider">Ride There</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <a
                    href={grabLink}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-[#00B140] text-white rounded-xl font-bold hover:bg-[#009e39] transition-colors"
                >
                    {/* Placeholder for Grab Icon or just text */}
                    <span>Grab</span>
                    <ExternalLink className="w-4 h-4 opacity-70" />
                </a>
                <a
                    href={gojekLink}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-[#00AA13] text-white rounded-xl font-bold hover:bg-[#008f10] transition-colors"
                >
                    {/* Placeholder for Gojek Icon or just text */}
                    <span>Gojek</span>
                    <ExternalLink className="w-4 h-4 opacity-70" />
                </a>
            </div>
            <p className="text-[10px] text-stone-gray/60 text-center">
                *Requires app installed. Destination might need confirmation.
            </p>
        </div>
    );
}
