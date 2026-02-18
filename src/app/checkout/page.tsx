'use client';
import { useSearchParams } from 'next/navigation';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useFormState, useFormStatus } from 'react-dom';
import { createOrder } from '@/app/actions/order';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const initialState = {
  message: '',
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" size="lg" disabled={pending}>
      {pending ? 'Placing Order...' : 'Confirm Order'}
    </Button>
  );
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');
  const product = PlaceHolderImages.find((p) => p.id === productId);

  const [state, formAction] = useFormState(createOrder, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message && !state.success) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      });
    }
  }, [state, toast]);

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center text-center">
            <div>
                <h1 className="text-2xl font-headline mb-4">Product not found</h1>
                <p className="text-muted-foreground mb-4">The product you are trying to purchase is not available.</p>
                <Button asChild>
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Homepage
                    </Link>
                </Button>
            </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <Header />
      <main className="flex-1 container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
            <h1 className="text-center font-headline text-4xl mb-8">Confirm Your Order</h1>
            <div className="grid md:grid-cols-2 gap-8 items-start">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Shipping Information</CardTitle>
                    </CardHeader>
                    <form action={formAction}>
                        <CardContent className="space-y-4">
                             {state.message && !state.success && (
                                <Alert variant="destructive">
                                    <AlertDescription>{state.message}</AlertDescription>
                                </Alert>
                            )}
                            <input type="hidden" name="productId" value={product.id} />
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input id="firstName" name="firstName" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input id="lastName" name="lastName" required />
                                </div>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" name="phone" type="tel" required />
                            </div>
                             <p className="text-sm text-muted-foreground pt-4">Payment will be collected upon delivery (Cash on Delivery).</p>
                        </CardContent>
                        <CardFooter>
                           <SubmitButton />
                        </CardFooter>
                    </form>
                </Card>
                <Card className="bg-background">
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                         <div className="relative h-24 w-24 rounded-md overflow-hidden border">
                             <Image src={product.imageUrl} alt={product.name!} fill className="object-cover" />
                         </div>
                         <div>
                            <CardTitle className="text-lg font-headline">{product.name}</CardTitle>
                             <p className="text-muted-foreground">Total</p>
                            <p className="text-xl font-bold text-primary">{formatPrice(product.price)}</p>
                         </div>
                    </CardHeader>
                </Card>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
