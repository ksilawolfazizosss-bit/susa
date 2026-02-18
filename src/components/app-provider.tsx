"use client";

import { useState, useEffect } from "react";
import { SplashScreen } from "./splash-screen";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem("splashShown")) {
      setLoading(false);
    }
  }, []);

  const handleSplashFinish = () => {
    sessionStorage.setItem("splashShown", "true");
    setLoading(false);
  };

  return (
    <>
      {loading ? (
        <SplashScreen onFinished={handleSplashFinish} />
      ) : (
        children
      )}
    </>
  );
}
