import { PlaceHolderImages } from '@/lib/placeholder-images';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = PlaceHolderImages.find((p) => p.id === params.id && p.type === 'product');

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
              data-ai-hint={product.imageHint}
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
                <div className="flex items-center gap-4">
                  {product.colors.map(color => (
                    <div key={color.name} className="flex items-center gap-2" title={color.name}>
                      <span className="h-8 w-8 rounded-full border-2" style={{ backgroundColor: color.hex, borderColor: color.hex === '#FFFFFF' ? '#000000' : 'transparent' }} />
                    </div>
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
                <Link href={`/checkout?productId=${product.id}`}>Buy Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export async function generateStaticParams() {
    const products = PlaceHolderImages.filter(p => p.type === 'product');
    return products.map(product => ({
        id: product.id,
    }));
}
