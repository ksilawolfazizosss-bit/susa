'use client';
import { Header } from '@/components/header';
import Link from 'next/link';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Footer } from '@/components/footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/product-grid';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section className="relative flex items-center justify-center text-center bg-hero-pattern bg-cover bg-center py-24 md:py-32">
            <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
            <div className="relative z-10 p-4">
                <h1 className="font-headline text-5xl md:text-7xl tracking-tight drop-shadow-md text-primary">
                    Elegance Redefined
                </h1>
                <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto drop-shadow-sm text-foreground/80">
                    Discover pieces of unparalleled craftsmanship and timeless style.
                </p>
            </div>
        </section>

        <section className="bg-secondary/30 py-12 md:py-20">
          <div className="container mx-auto text-center max-w-3xl">
            <h3 className="font-headline text-3xl text-primary">Our Philosophy</h3>
            <p className="mt-4 text-lg text-foreground/80">
              At Susan Fashion, we believe in the power of timeless elegance. Each piece in our collection is a testament to meticulous craftsmanship, premium materials, and a design philosophy that transcends fleeting trends. We are dedicated to providing you with fashion that is not just worn, but experienced.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12 md:py-20">
            <div className="text-center mb-10 md:mb-16">
              <h2 className="font-headline text-4xl md:text-5xl tracking-tight">
                Our Collection
              </h2>
              <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
                Each piece is curated to bring you the best in modern luxury.
              </p>
            </div>
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductGrid />
            </Suspense>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
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
