interface MapEmbedProps {
    src?: string;
    query?: string; // Keep query as fallback or for title
}

export function MapEmbed({ src, query }: MapEmbedProps) {
    if (!src) {
        return (
            <div className="w-full h-[300px] bg-stone-gray/10 rounded-3xl flex flex-col items-center justify-center text-stone-gray">
                <div className="text-center p-6">
                    <p className="font-bold mb-2">Map Unavailable</p>
                    <p className="text-xs">No map URL provided for this destination.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full relative w-full aspect-video md:aspect-[21/9] rounded-3xl overflow-hidden shadow-sm border border-stone-gray/10">
            <iframe
                title={`Map of ${query}`}
                width="100%"
                height="100%"
                className="absolute inset-0 w-full h-full"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={src}
            ></iframe>
        </div>
    );
}
