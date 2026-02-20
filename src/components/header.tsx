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
import { Gem } from 'lucide-react';

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
            <div className="flex items-center gap-2 text-foreground hover:text-primary transition-colors duration-300 cursor-pointer">
              <Gem className="h-8 w-8" />
              <h1 className="font-headline text-4xl">
                Susan Fashion
              </h1>
            </div>
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
