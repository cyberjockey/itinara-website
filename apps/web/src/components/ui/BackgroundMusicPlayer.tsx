"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Play, Pause, Music } from "lucide-react";

export function BackgroundMusicPlayer() {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);

    useEffect(() => {
        // Recover state from localStorage on mount
        const savedMuted = localStorage.getItem("itinara_music_muted");
        if (savedMuted === "true") {
            setIsMuted(true);
        }

        // Auto-play policy requires interaction, so we wait for user to click play basically
        // But if they navigated, we try to preserve state ideally.
        // For simplicity, we default to paused until user play, then try to persist.
    }, []);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        setIsPlaying(true);
                        setHasInteracted(true);
                    })
                    .catch((error) => {
                        console.log("Playback prevented:", error);
                    });
            }
        }
    };

    const toggleMute = () => {
        if (!audioRef.current) return;
        audioRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
        localStorage.setItem("itinara_music_muted", (!isMuted).toString());
    };

    return (
        <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2 group">
            {/* Audio element (hidden) */}
            <audio
                ref={audioRef}
                src="/audio/gamelan.mp3"
                loop
                {...(isMuted ? { muted: true } : {})}
            />

            {/* Main Control Pill */}
            <div className={`
                flex items-center gap-2 bg-white/90 backdrop-blur-md border border-stone-gray/20 
                rounded-full p-2 pr-4 shadow-lg transition-all duration-500 ease-out
                ${isPlaying ? "w-auto opacity-100" : "w-10 overflow-hidden opacity-70 hover:opacity-100 hover:w-auto"}
            `}>
                <button
                    onClick={togglePlay}
                    className={`
                        w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors
                        ${isPlaying ? "bg-deep-teak text-white" : "bg-stone-gray/10 text-deep-teak hover:bg-deep-teak hover:text-white"}
                    `}
                    aria-label={isPlaying ? "Pause Music" : "Play Music"}
                >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Music className="w-4 h-4" />}
                </button>

                {/* Expanded Controls */}
                <div className={`flex items-center gap-3 overflow-hidden whitespace-nowrap transition-all duration-300 ${isPlaying ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0 group-hover:opacity-100 group-hover:max-w-[200px]"}`}>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-deep-teak">Javanese Gamelan</span>
                        <span className="text-[10px] text-stone-gray">Ambient Mode</span>
                    </div>

                    <div className="h-4 w-px bg-stone-gray/20 mx-1"></div>

                    <button
                        onClick={toggleMute}
                        className="text-stone-gray hover:text-deep-teak transition-colors p-1"
                        aria-label={isMuted ? "Unmute" : "Mute"}
                    >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                </div>
            </div>
        </div>
    );
}
