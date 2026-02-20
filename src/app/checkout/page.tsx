'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import type { Product } from '@/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = searchParams.get('productId');
  
  const firestore = useFirestore();
  const productRef = firestore && productId ? doc(firestore, 'products', productId) : null;
  const { data: product, loading: productLoading } = useDoc<Product>(productRef);

  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!firestore || !product || !productId) return;

    setLoading(true);
    setError('');

    const formData = new FormData(event.currentTarget);
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const phone = formData.get('phone') as string;

    if (!firstName || !lastName || !phone) {
        setError('Please fill out all fields.');
        setLoading(false);
        return;
    }
    
    const orderCollection = collection(firestore, 'orders');
    const orderData = {
        customerName: `${firstName} ${lastName}`,
        phone,
        productId,
        productName: product.name,
        productPrice: product.price,
        productImageUrl: product.imageUrl,
        status: 'Pending' as const,
        createdAt: serverTimestamp(),
    };

    addDoc(orderCollection, orderData)
        .then(() => {
            router.push('/order-confirmation');
        })
        .catch((err) => {
            console.error("Firebase Create Order Error:", err);
            const permissionError = new FirestorePermissionError({
                path: 'orders',
                operation: 'create',
                requestResourceData: orderData,
            });
            errorEmitter.emit('permission-error', permissionError);
            setError('Could not place order. Please try again.');
            toast({
                variant: 'destructive',
                title: 'Error Placing Order',
                description: 'Could not save your order. Please check permissions and try again.',
            });
            setLoading(false);
        });
  };

  if (productLoading) {
      return <CheckoutSkeleton />
  }

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
    <div className="flex flex-col min-h-screen bg-muted/40">
      <Header />
      <main className="flex-1 container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
            <h1 className="text-center font-headline text-4xl mb-8">Confirm Your Order</h1>
            <div className="grid md:grid-cols-2 gap-8 items-start">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Shipping Information</CardTitle>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
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
                           <Button type="submit" className="w-full" size="lg" disabled={loading}>
                                {loading ? <><Loader2 className="mr-2 animate-spin" />Placing Order...</> : 'Confirm Order'}
                            </Button>
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

function CheckoutSkeleton() {
    return (
        <div className="flex flex-col min-h-screen bg-muted/40">
            <Header />
            <main className="flex-1 container mx-auto py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <Skeleton className="h-10 w-1/2 mx-auto mb-8" />
                    <div className="grid md:grid-cols-2 gap-8 items-start">
                        <Card>
                            <CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2"><Skeleton className="h-6 w-1/4" /><Skeleton className="h-10 w-full" /></div>
                                    <div className="space-y-2"><Skeleton className="h-6 w-1/4" /><Skeleton className="h-10 w-full" /></div>
                                </div>
                                <div className="space-y-2"><Skeleton className="h-6 w-1/4" /><Skeleton className="h-10 w-full" /></div>
                            </CardContent>
                            <CardFooter><Skeleton className="h-12 w-full" /></CardFooter>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                                <Skeleton className="h-24 w-24 rounded-md" />
                                <div className="space-y-2">
                                    <Skeleton className="h-6 w-48" />
                                    <Skeleton className="h-5 w-16" />
                                    <Skeleton className="h-7 w-24" />
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
