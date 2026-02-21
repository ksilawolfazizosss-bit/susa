"use client";

import { useState, useEffect } from "react";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [hasEntered, setHasEntered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleEnter = () => {
    setHasEntered(true);
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
    </>
  );
}
