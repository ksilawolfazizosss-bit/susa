'use client';

import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { useFirestore } from '@/firebase';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc } from 'firebase/firestore';
import type { Product } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';


export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;
  const firestore = useFirestore();
  const productRef = firestore && id ? doc(firestore, 'products', id) : null;
  const { data: product, loading } = useDoc<Product>(productRef);

  if (loading) {
    return <ProductPageSkeleton />;
  }
  
  if (!product) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto py-8 md:py-16 px-4">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start">
          <div className="aspect-[3/4] relative rounded-lg overflow-hidden shadow-xl bg-card">
            <Image
              src={product.imageUrl}
              alt={product.name!}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col">
            <h1 className="font-headline text-4xl lg:text-5xl mb-2">{product.name}</h1>
            <p className="text-3xl text-primary font-bold mb-6">{formatPrice(product.price)}</p>
            
            <Separator className="my-6" />

            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Color</h3>
                <div className="flex items-center gap-2">
                  {product.colors.map(color => (
                     <Badge key={color} variant="outline" className="px-3 py-1 text-sm">{color}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => <Badge key={size} variant="outline" className="px-3 py-1 text-sm">{size}</Badge>)}
                </div>
              </div>
            )}
            
            <Separator className="my-6" />

            <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
              <h3 className="font-headline text-xl">Description</h3>
              <p>{product.description}</p>
            </div>
            
            <div className="mt-auto pt-6">
              <Button asChild size="lg" className="w-full text-lg py-7">
                <Link href={`/checkout?productId=${id}`}>Buy Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


function ProductPageSkeleton() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto py-8 md:py-16 px-4">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start">
          <Skeleton className="aspect-[3/4] w-full rounded-lg" />
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-10 w-1/4" />
            <Separator />
            <div className="space-y-4">
                <Skeleton className="h-6 w-1/5" />
                <div className="flex gap-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                </div>
            </div>
            <Separator />
            <div className="space-y-2">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-2/3" />
            </div>
            <div className="pt-6">
                <Skeleton className="h-14 w-full" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
