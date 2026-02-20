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
        <section className="relative flex items-center justify-center text-center bg-hero-pattern bg-cover bg-center min-h-[50vh]">
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
          {/* The main logo is now part of the entry experience in AppProvider to enable music. */}
        </section>

        <section className="container mx-auto px-4 py-12 md:py-20 -mt-32 relative z-10">
          <div className="text-center mb-10 md:mb-16 bg-card/80 backdrop-blur-lg p-8 rounded-lg max-w-4xl mx-auto shadow-2xl">
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
