"use client";

import { MapPin, Star, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { getImageUrl } from "@/lib/utils";
import { AddToTripWrapper } from "@/components/places/AddToTripWrapper";

interface Place {
    id: string;
    name: string;
    description?: string;
    location?: string;
    image_url?: string;
    type?: string;
    rating?: number;
    coordinates?: { lat: number, lng: number };
    photos?: string[];
    reviews?: unknown[];
}

interface Trip {
    id: string;
    title: string;
    start_date: string;
    end_date: string;
}

interface PlacesListProps {
    places: Place[];
    userTrips: Trip[];
    destinationName: string;
    destinationId: string;
    readOnly?: boolean;
}

export function PlacesList({ places, userTrips, destinationName, destinationId, readOnly = false }: PlacesListProps) {
    if (!places || places.length === 0) {
        return (
            <div className="text-center py-12 bg-stone-gray/5 rounded-3xl">
                <p className="text-stone-gray">No specific activities listed yet for {destinationName}.</p>
            </div>
        );
    }

    return (
        <section className="">
            <div className="flex items-center gap-2 mb-6">
                <h2 className="text-xl font-heading font-bold text-deep-teak">Activities to Experience</h2>
                <span className="px-2 py-0.5 rounded-full bg-stone-gray/10 text-xs font-medium text-stone-gray">{places.length}</span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {places.map((place) => (
                    <div key={place.id} className="bg-white rounded-2xl overflow-hidden border border-stone-gray/10 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group">
                        <Link href={`/dashboard/explore/${destinationId}/place/${place.id}`} className="block relative h-48 bg-stone-gray/10 overflow-hidden">
                            {place.image_url ? (
                                <Image
                                    src={getImageUrl(place.image_url)}
                                    alt={place.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <MapPin className="w-10 h-10 text-stone-gray/20" />
                                </div>
                            )}
                            {place.rating && (
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold text-deep-teak shadow-sm">
                                    <Star className="w-3 h-3 text-orange-400 fill-orange-400" />
                                    {place.rating}
                                </div>
                            )}
                        </Link>

                        <div className="p-5 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-2">
                                <Link href={`/dashboard/explore/${destinationId}/place/${place.id}`} className="font-bold text-lg text-deep-teak line-clamp-1 hover:text-terracotta transition-colors" title={place.name}>
                                    {place.name}
                                </Link>
                                {place.type && (
                                    <span className="text-[10px] uppercase font-bold tracking-wider text-stone-gray bg-stone-gray/5 px-2 py-1 rounded">
                                        {place.type}
                                    </span>
                                )}
                            </div>

                            {place.location && (
                                <div className="flex items-center gap-1 text-stone-gray text-xs mb-3">
                                    <MapPin className="w-3 h-3 text-terracotta" />
                                    <span className="truncate">{place.location}</span>
                                </div>
                            )}

                            <p className="text-stone-gray/80 text-sm line-clamp-2 mb-4 flex-1">
                                {place.description || `Experience the beauty of ${place.name}.`}
                            </p>

                            <Link
                                href={`/dashboard/explore/${destinationId}/place/${place.id}`}
                                className="w-full py-2.5 rounded-xl border border-stone-gray/20 font-bold text-deep-teak hover:bg-deep-teak hover:text-white transition-colors flex items-center justify-center gap-2 mb-2"
                            >
                                View Details
                            </Link>

                            {!readOnly && (
                                <AddToTripWrapper
                                    placeId={place.id}
                                    placeName={place.name}
                                    placeLocation={place.location || destinationName}
                                    placeType={place.type || 'Activity'}
                                    userTrips={userTrips}
                                    placeCoordinates={place.coordinates}
                                />
                            )}                        </div>
                    </div>
                ))}
            </div>
        </section >
    );
}
