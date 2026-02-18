"use client";
import { useState } from "react";
import { AdminPasswordDialog } from "./admin-password-dialog";
import Link from 'next/link';

export function Header() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-20 items-center justify-center px-4">
          <button onClick={() => setIsDialogOpen(true)} className="focus:outline-none" title="Admin Access">
            <h1 className="font-headline text-4xl text-foreground hover:text-primary transition-colors duration-300">
              Susan Fashion
            </h1>
          </button>
        </div>
      </header>
      <AdminPasswordDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  );
}
