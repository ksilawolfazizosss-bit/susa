'use client';

import { useMemo } from 'react';
import { useFirestore } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection } from 'firebase/firestore';
import type { Product } from '@/types';
import { ProductCard } from './product-card';
import { Skeleton } from './ui/skeleton';
import { Card } from './ui/card';
import Link from 'next/link';
import { Button } from './ui/button';

export function ProductGrid() {
    const firestore = useFirestore();
    const productCollection = useMemo(() => 
        firestore ? collection(firestore, 'products') : null,
        [firestore]
    );
    const { data: products, loading } = useCollection<Product>(productCollection);

    if (loading) {
        return <ProductGridSkeleton />;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {products && products.length > 0 ? (
              products.map((product) => (
                <Link href={`/products/${product.id}`} key={product.id} className="group">
                  <ProductCard product={product} />
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <h2 className="font-headline text-2xl mb-2">The Collection is Awaiting Your Masterpieces</h2>
                <p className="text-muted-foreground mb-4">Your store is ready. Go to the admin panel to add your first product.</p>
                <Button asChild variant="secondary">
                    <Link href="/admin">Go to Admin Panel</Link>
                </Button>
              </div>
            )}
        </div>
    );
}


function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="border-none shadow-lg">
          <Skeleton className="aspect-[3/4] w-full" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-5 w-1/4" />
          </div>
        </Card>
      ))}
    </div>
  );
}
