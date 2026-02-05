"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Pause, Music, Play } from "lucide-react";

export function BackgroundMusicPlayer() {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        // Recover state from localStorage
        const savedMuted = localStorage.getItem("itinara_music_muted");
        if (savedMuted === "true") {
            setIsMuted(true);
        }

        // AGGRESSIVE AUTOPLAY STRATEGY
        const attemptPlay = async () => {
            if (!audioRef.current) return;
            try {
                audioRef.current.volume = 0.4; // 40% volume is less intrusive
                await audioRef.current.play();
                setIsPlaying(true);
            } catch (error) {
                console.log("Autoplay blocked, waiting for interaction.");
                // Fallback: One-time click listener on the document to start music
                const enableAudio = () => {
                    if (audioRef.current && !isPlaying) {
                        audioRef.current.play().then(() => {
                            setIsPlaying(true);
                        }).catch(e => console.error(e));
                    }
                    document.removeEventListener('click', enableAudio);
                };
                document.addEventListener('click', enableAudio);
            }
        };

        // Small delay to ensure hydration
        const timer = setTimeout(attemptPlay, 1000);
        return () => clearTimeout(timer);
    }, []);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    const toggleMute = () => {
        if (!audioRef.current) return;
        const newMutedState = !isMuted;
        audioRef.current.muted = newMutedState;
        setIsMuted(newMutedState);
        localStorage.setItem("itinara_music_muted", newMutedState.toString());
    };

    if (isError) return null;

    return (
        <div
            className="fixed bottom-6 left-6 z-[100] group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <audio
                ref={audioRef}
                src="https://res.cloudinary.com/djw3rusaw/video/upload/v1768315579/java_gamelan_custom_fro3ls.mp3"
                loop
                {...(isMuted ? { muted: true } : {})}
            />

            {/* Music Wave Animation (Visual Indicator that music is on) */}
            {isPlaying && !isMuted && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-0.5 h-6 items-end">
                    <span className="w-1 bg-terracotta/60 rounded-full animate-[music-wave_1s_ease-in-out_infinite]"></span>
                    <span className="w-1 bg-terracotta/60 rounded-full animate-[music-wave_1.2s_ease-in-out_infinite_0.1s]"></span>
                    <span className="w-1 bg-terracotta/60 rounded-full animate-[music-wave_0.8s_ease-in-out_infinite_0.2s]"></span>
                    <span className="w-1 bg-terracotta/60 rounded-full animate-[music-wave_1.1s_ease-in-out_infinite_0.3s]"></span>
                </div>
            )}

            <div className={`
                flex items-center backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden transition-all duration-500 ease-out
                ${isHovered ? "bg-white/95 rounded-2xl p-2 pr-4 gap-3 max-w-[240px]" : "bg-white/80 rounded-full w-12 h-12 justify-center hover:scale-110 active:scale-95"}
            `}>

                {/* Main Play/Pause Button */}
                <button
                    onClick={togglePlay}
                    className={`
                        flex items-center justify-center shrink-0 rounded-full transition-all duration-300 relative
                        ${isHovered ? "w-10 h-10 bg-deep-teak text-white shadow-md" : "w-12 h-12 text-terracotta"}
                    `}
                >
                    {/* Spinner if playing */}
                    {isPlaying && !isHovered && !isMuted && (
                        <div className="absolute inset-0 border-2 border-terracotta/30 border-t-terracotta rounded-full animate-spin"></div>
                    )}

                    {isPlaying ? <Pause className={isHovered ? "w-4 h-4" : "w-5 h-5"} /> : <Play className={`${isHovered ? "w-4 h-4 ml-0.5" : "w-5 h-5 ml-1"}`} />}
                </button>

                {/* Expanded Controls (Only on Hover) */}
                <div className={`flex flex-col overflow-hidden transition-all duration-300 ${isHovered ? "opacity-100 w-auto" : "opacity-0 w-0"}`}>
                    <div className="flex items-center justify-between gap-4 mb-0.5">
                        <span className="text-[10px] uppercase font-bold text-terracotta tracking-wider">Now Playing</span>
                        <div className="flex gap-0.5">
                            {[1, 2, 3].map(i => <div key={i} className={`w-0.5 h-2 bg-terracotta/40 rounded-full ${isPlaying ? 'animate-pulse' : ''}`} style={{ animationDelay: `${i * 0.1}s` }}></div>)}
                        </div>
                    </div>
                    <div className="whitespace-nowrap font-bold text-sm text-deep-teak leading-tight">Javanese Gamelan</div>

                    <button
                        onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                        className="flex items-center gap-1.5 text-[10px] text-stone-gray hover:text-deep-teak transition-colors mt-0.5 w-fit"
                    >
                        {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                        <span>{isMuted ? "Unmute" : "Mute Sound"}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
