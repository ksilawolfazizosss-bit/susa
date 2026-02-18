"use client";

import { useState } from 'react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { deleteProduct } from '@/app/actions/product';

export function ProductList() {
  const initialProducts = PlaceHolderImages.filter((p) => p.type === 'product');
  const [products, setProducts] = useState(initialProducts);
  const { toast } = useToast();

  const handleDelete = async (productId: string) => {
    const result = await deleteProduct(productId);
    if (result.success) {
      // Optimistically update the UI.
      setProducts((currentProducts) =>
        currentProducts.filter((p) => p.id !== productId)
      );
      toast({
        title: 'Product Deleted (Simulation)',
        description: `The product has been removed. This will reset on page refresh.`,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.message || 'Could not delete the product.',
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-headline mb-1">Manage Products</h2>
      <p className="text-muted-foreground mb-6">View and remove existing products from your store.</p>
      {products.length === 0 ? (
         <Card className="flex items-center justify-center h-40 border-dashed">
            <p className="text-muted-foreground">No products to display.</p>
         </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id}>
              <CardHeader className="flex flex-row items-start gap-4 p-4">
                 <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden border">
                    <Image src={product.imageUrl} alt={product.name!} fill className="object-cover" />
                 </div>
                 <div className="flex-grow">
                    <CardTitle className="text-lg font-headline leading-tight">{product.name}</CardTitle>
                    <p className="text-md font-bold text-primary">{formatPrice(product.price)}</p>
                 </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. The product will reappear if you refresh the page.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(product.id)}>
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}