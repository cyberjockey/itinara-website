"use client";

import { useState, useEffect } from "react";
import { PlaceForm } from "@/components/places/PlaceForm";
import { getDestinations } from "@/app/dashboard/destinations/actions";

export default function NewPlacePage() {
    const [destinations, setDestinations] = useState<{ id: string, name: string }[]>([]);

    useEffect(() => {
        getDestinations().then(data => setDestinations(data || []));
    }, []);

    return <PlaceForm destinations={destinations} mode="create" />;
}
