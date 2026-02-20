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
    <header className="sticky top-0 z-40 w-full border-b border-primary/20 bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-20 items-center justify-center px-4">
        <Dialog open={open} onOpenChange={onDialogClose}>
          <DialogTrigger asChild>
            <span className="group flex cursor-pointer items-center gap-6 text-foreground transition-colors duration-300 hover:text-primary">
              <div className="h-px w-24 bg-gradient-to-l from-primary/50 to-transparent transition-all duration-300 group-hover:w-32 group-hover:from-primary/80" />
              <h1 className="font-headline text-3xl uppercase tracking-widest md:text-4xl">
                Susan Fashion
              </h1>
              <div className="h-px w-24 bg-gradient-to-r from-primary/50 to-transparent transition-all duration-300 group-hover:w-32 group-hover:from-primary/80" />
            </span>
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
