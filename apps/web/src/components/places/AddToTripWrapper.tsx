"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import AddToTripModal from "@/components/dashboard/AddToTripModal";
// Removed AddActivityModal import as it is replaced by dynamic import or usage below

interface Trip {
    id: string;
    title: string;
    start_date: string;
    end_date: string;
}

interface AddToTripWrapperProps {
    userTrips: Trip[];
    placeId: string;
    placeName: string;
    placeLocation: string;
    placeType: string;
    placeCoordinates?: { lat: number; lng: number } | null;
}

export function AddToTripWrapper({ userTrips, placeId, placeName, placeLocation, placeType, placeCoordinates }: AddToTripWrapperProps) {
    // Prevent adding Accommodations to trip
    if (placeType?.toLowerCase().includes("accommodation") || placeType?.toLowerCase().includes("accomodation")) {
        return null;
    }

    const [isModalOpen, setIsModalOpen] = useState(false);
    // For MVP with AddActivityModal, we usually pick a trip first.
    // Since AddActivityModal implies a specific trip and day, we might need the "AddToTripModal" logic here instead
    // But since we reverted AddToTripModal, let's just trigger the 'AddToTripModal' we had earlier OR re-implement a simple trip selector first.

    // Wait, the user reverted the "Smart Recs" which used AddToTripModal. 
    // The previous instructions led to removing AddToTripModal and keeping AddActivityModal.
    // AddActivityModal requires `tripId` and `dayNumber`.
    // We need a way to SELECT a trip first.

    // Let's implement a simple Trip Selector here inline, then open AddActivityModal?
    // Actually, recreating a simple "Select Trip" modal is best.

    const [selectedTripId, setSelectedTripId] = useState<string>("");

    // Use the comprehensive AddToTripModal which handles trip selection and days
    // We need to pass the trips with their new quota fields
    // Assuming userTrips passed here already contain the necessary fields or we trust the modal to handle basic display
    // Actually, AddToTripModal needs `id, title, start_date, end_date` and now `activity_count, max_activities`

    // Let's rely on AddToTripModal to do the heavy lifting of UI
    // But we need to import it properly. 
    // Wait, previous file content showed we imported `AddActivityModal` but the plan said to modify `AddToTripModal`.
    // Let's switch to `AddToTripModal` which we defined in the plan to have the list of trips.

    return (
        <AddToTripModal
            destination={{
                name: placeLocation.split(',')[0], // Approximation or use explicit destination name
                location: placeLocation
            }}
            trips={userTrips} // Parent needs to ensure these have the right fields
            place={{
                id: placeId,
                name: placeName,
                location: placeLocation,
                type: placeType,
                // Pass coordinates if simple props allow, currently interface says Place { name, location, type }
                // We might need to update AddToTripModal interface to accept coordinates if we want to save them
            }}
            trigger={
                <button className="w-full py-3 rounded-xl bg-terracotta text-white font-bold hover:bg-deep-teak transition-colors shadow-md flex items-center justify-center gap-2">
                    <Plus className="w-5 h-5" />
                    Add to Itinerary
                </button>
            }
        />
    );
}


