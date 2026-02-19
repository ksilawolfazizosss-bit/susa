"use client";

// The splash screen logic has been removed to make the application load instantly.
export function AppProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
