import type { Product } from "@/types";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="w-full h-full overflow-hidden border-none shadow-lg transition-transform duration-300 group-hover:scale-105 group-hover:shadow-2xl bg-card">
      <div className="aspect-[3/4] relative">
        <Image
          src={product.imageUrl}
          alt={product.name || 'Product image'}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-headline text-lg truncate">{product.name}</h3>
        <p className="font-semibold text-primary">{formatPrice(product.price)}</p>
      </CardContent>
    </Card>
  );
}
