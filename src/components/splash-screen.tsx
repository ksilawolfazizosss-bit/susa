"use client";

import { useState, useEffect } from "react";

export function SplashScreen({ onFinished }: { onFinished: () => void }) {
  const [isMounted, setIsMounted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 500); // Reduced for faster load

    const finishTimer = setTimeout(() => {
      onFinished();
    }, 1000); // Reduced for faster load

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinished]);

  const handleClick = () => {
    setIsExiting(true);
    setTimeout(onFinished, 500);
  };

  return (
    <div
      onClick={handleClick}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-500 cursor-pointer ${isExiting ? 'opacity-0' : 'opacity-100'}`}
      aria-hidden="true"
    >
      <h1
        className={`relative font-headline text-5xl md:text-7xl text-foreground transition-all duration-1000 ease-in-out ${isMounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
      >
        <span
          className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/80 to-transparent"
          style={{
            animation: 'shine 2s ease-in-out .5s',
          }}
        />
        <span className="relative">Susan Fashion</span>
      </h1>
    </div>
  );
}
