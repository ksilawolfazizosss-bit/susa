import { Header } from '@/components/header';
import { ProductCard } from '@/components/product-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Footer } from '@/components/footer';
import { Card } from '@/components/ui/card';

const products = PlaceHolderImages.filter((p) => p.type === 'product');

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-10 md:mb-16">
          <h1 className="font-headline text-4xl md:text-5xl tracking-tight">
            Our Collection
          </h1>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover pieces of unparalleled craftsmanship and timeless elegance.
          </p>
        </div>
        <Suspense fallback={<ProductGridSkeleton />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {products.map((product) => (
              <Link href={`/products/${product.id}`} key={product.id} className="group">
                <ProductCard product={product} />
              </Link>
            ))}
          </div>
        </Suspense>
      </main>
      <Footer />
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
