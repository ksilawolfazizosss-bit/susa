import Link from 'next/link';
import { Button } from './ui/button';
import { User } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <div className="w-24" />
        <Link href="/">
          <h1 className="font-headline text-4xl text-foreground hover:text-primary transition-colors duration-300">
            Susan Fashion
          </h1>
        </Link>
        <div className="w-24 flex justify-end">
          <Button asChild variant="ghost" size="icon">
            <Link href="/admin">
              <User />
              <span className="sr-only">Admin Panel</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
