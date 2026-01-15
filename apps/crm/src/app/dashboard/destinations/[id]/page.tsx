import { notFound } from 'next/navigation';
import { getDestination } from '../actions';
import DestinationForm from '@/components/destinations/DestinationForm';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditDestinationPage({ params }: PageProps) {
    const { id } = await params;
    const destination = await getDestination(id);

    if (!destination) {
        notFound();
    }

    return <DestinationForm destination={destination} isEditing />;
}
