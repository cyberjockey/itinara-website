"use client";

import { useState, useRef, useEffect } from "react";
import { Music, Volume2, VolumeX } from "lucide-react";

export function BackgroundMusic() {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);

    // Gamelan Track (Custom User Upload)
    const AUDIO_URL = "https://res.cloudinary.com/djw3rusaw/video/upload/v1768315579/java_gamelan_custom_fro3ls.mp3";

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch((err) => {
                    // Ignore AbortError which happens if user pauses while loading
                    if (err.name !== 'AbortError') {
                        console.error("Audio playback failed:", err);
                    }
                });
            }
        }
        setIsPlaying(!isPlaying);
        setHasInteracted(true);
    };

    useEffect(() => {
        // Optional: Attempt to autoplay if the user has interacted with the document before
        // But for a polite UI, we usually let the user initiate.
        if (audioRef.current) {
            audioRef.current.volume = 0.4; // Set a reasonable background volume
        }
    }, []);

    return (
        <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3">
            <audio ref={audioRef} src={AUDIO_URL} loop />

            <button
                onClick={togglePlay}
                className={`
                    relative group flex items-center justify-center w-12 h-12 rounded-full shadow-xl 
                    transition-all duration-300 ease-out hover:scale-110 active:scale-95
                    ${isPlaying ? "bg-terracotta text-white" : "bg-white text-deep-teak border border-stone-gray/20"}
                `}
                aria-label={isPlaying ? "Pause Background Music" : "Play Background Music"}
            >
                {/* Ping animation when playing */}
                {isPlaying && (
                    <span className="absolute inline-flex h-full w-full rounded-full bg-terracotta opacity-20 animate-ping"></span>
                )}

                {isPlaying ? (
                    <Volume2 className="w-5 h-5 relative z-10" />
                ) : (
                    <Music className="w-5 h-5 relative z-10" />
                )}
            </button>

            {/* Slide-out Label (Only shows initially or on hover) */}
            <div className={`
                absolute left-full ml-3 px-3 py-1.5 rounded-lg bg-deep-teak text-white text-xs font-medium whitespace-nowrap shadow-lg
                transition-all duration-500 origin-left
                ${hasInteracted ? "opacity-0 scale-x-0 -translate-x-4 pointer-events-none group-hover:opacity-100 group-hover:scale-x-100 group-hover:translate-x-0" : "opacity-100 scale-x-100 translate-x-0"}
            `}>
                Play Javanese Music
                {/* Decorative arrow */}
                <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-deep-teak"></div>
            </div>
        </div>
    );
}
