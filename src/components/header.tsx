'use client';

import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from './ui/input';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const Logo = ({ className }: { className?: string }) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12 1.66699L5.33333 6.00033L12 10.3337L18.6667 6.00033L12 1.66699Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.33333 18.0003L12 22.3337L18.6667 18.0003"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.33333 12.0003L12 16.3337L18.6667 12.0003"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

export function Header() {
  const [password, setPassword] = useState('');
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handlePasswordCheck = () => {
    if (password === '2009') {
      router.push('/admin');
      setOpen(false);
      setPassword('');
    } else {
      toast({
        variant: 'destructive',
        title: 'Incorrect Password',
        description: 'The password you entered is incorrect.',
      });
      setPassword('');
    }
  };

  const onDialogClose = (isOpen: boolean) => {
    if (!isOpen) {
      setPassword('');
    }
    setOpen(isOpen);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-20 items-center justify-center px-4">
        <Dialog open={open} onOpenChange={onDialogClose}>
          <DialogTrigger asChild>
            <Link href="/" className="flex items-center gap-3 text-foreground hover:text-primary transition-colors duration-300 cursor-pointer">
              <Logo className="h-7 w-7 text-primary" />
              <h1 className="font-headline text-4xl">
                Susan Fashion
              </h1>
            </Link>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Admin Access</DialogTitle>
              <DialogDescription>
                Please enter the password to access the admin panel.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handlePasswordCheck();
                  }
                }}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="button" onClick={handlePasswordCheck}>
                Enter
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}
