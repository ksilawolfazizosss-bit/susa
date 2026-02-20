"use client";

import { useState, useRef, useEffect } from "react";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [hasEntered, setHasEntered] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleEnter = () => {
    setHasEntered(true);
    if (audioRef.current) {
      // Set volume to a pleasant level
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(error => {
        // Autoplay was prevented.
        console.error("Audio playback failed:", error);
      });
    }
  };

  return (
    <>
      {!hasEntered && isMounted && (
        <div
          onClick={handleEnter}
          className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-background transition-opacity duration-1000 animate-in fade-in"
          aria-hidden="true"
        >
          <div className="relative text-center">
            <h1 className="font-headline text-7xl md:text-9xl text-primary drop-shadow-lg animate-in fade-in zoom-in-95 duration-1000">
              Susan Fashion
            </h1>
            <p className="mt-4 text-lg text-muted-foreground animate-pulse-slow">
              Click to Enter
            </p>
          </div>
        </div>
      )}
      <div
        className={`transition-opacity duration-1000 ${hasEntered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        {children}
      </div>
      <audio
        ref={audioRef}
        src="https://cdn.pixabay.com/download/audio/2022/10/19/audio_b88b3941a2.mp3"
        loop
        className="sr-only"
      />
    </>
  );
}
