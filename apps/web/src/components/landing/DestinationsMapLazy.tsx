"use client";

import dynamic from "next/dynamic";

const DestinationsMap = dynamic(() => import("./DestinationsMap").then(mod => mod.DestinationsMap), {
    loading: () => <div className="h-[600px] w-full bg-deep-teak/5 animate-pulse rounded-3xl" />,
    ssr: false
});

export function DestinationsMapLazy() {
    return <DestinationsMap />;
}
