import { getPlace } from "@/app/dashboard/places/actions";
import { getDestinations } from "@/app/dashboard/destinations/actions";
import { PlaceForm } from "@/components/places/PlaceForm";
import { redirect } from "next/navigation";

export default async function EditPlacePage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const { id } = params;

    const [place, destinations] = await Promise.all([
        getPlace(id),
        getDestinations()
    ]);

    if (!place) {
        redirect('/dashboard/places');
    }

    return <PlaceForm destinations={destinations || []} mode="edit" initialData={place} />;
}
