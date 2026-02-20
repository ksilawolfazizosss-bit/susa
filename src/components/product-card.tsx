import type { Product } from '@/types';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="w-full h-full overflow-hidden transition-all duration-300 border group-hover:shadow-2xl group-hover:border-primary/50">
      <div className="aspect-[3/4] relative">
        <Image
          src={product.imageUrl}
          alt={product.name || 'Product image'}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <CardContent className="p-4 bg-card">
        <h3 className="font-headline text-lg truncate">{product.name}</h3>
        <p className="font-semibold text-primary">
          {formatPrice(product.price)}
        </p>
      </CardContent>
    </Card>
  );
}
