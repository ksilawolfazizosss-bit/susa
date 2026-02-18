"use client";

import { useState } from "react";
import { ProductForm, type ProductFormValues } from "@/components/product-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ProductList } from "@/components/product-list";
import { Separator } from "@/components/ui/separator";
import { PlaceHolderImages, type ImagePlaceholder } from "@/lib/placeholder-images";
import { useToast } from "@/hooks/use-toast";
import { deleteProduct as deleteProductAction } from "@/app/actions/product";
import { OrderList } from "@/components/order-list";
import { PlaceholderOrders } from "@/lib/placeholder-orders";

export default function AdminPage() {
  const [products, setProducts] = useState<ImagePlaceholder[]>(
    PlaceHolderImages.filter((p) => p.type === 'product')
  );
  // For now, orders are static. Later they will come from a database.
  const [orders] = useState(PlaceholderOrders);
  const { toast } = useToast();

  const handleAddProduct = (newProductData: ProductFormValues) => {
    // In a real app, this would be an API call to create the product.
    // For this simulation, we'll create a new product object and add it to our state.
    const newProduct: ImagePlaceholder = {
      id: `new-product-${Date.now()}`, // Simple unique ID for simulation
      type: 'product',
      name: newProductData.name,
      price: newProductData.price,
      description: newProductData.description,
      imageUrl: newProductData.image,
      imageHint: newProductData.category.toLowerCase(), // Use category as a hint
      sizes: newProductData.sizes?.split(',').map(s => s.trim()).filter(Boolean),
      // For colors, we're simplifying and won't parse hex codes here.
      // In a real app, this would need a more robust UI/system.
      colors: newProductData.colors?.split(',').map(c => ({ name: c.trim(), hex: '#000000' })).filter(c => c.name),
    };

    setProducts(prevProducts => [newProduct, ...prevProducts]);

    toast({
      title: "Product Published!",
      description: "Your new product is now live in the store (simulation). This will reset on page refresh.",
    });
  };

  const handleDeleteProduct = async (productId: string) => {
    // This uses the existing Server Action but updates the state on this page.
    const result = await deleteProductAction(productId);
    if (result.success) {
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
    <div className="min-h-screen bg-muted/20">
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between h-20 px-4">
            <Button asChild variant="outline" size="sm">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Store
                </Link>
            </Button>
            <h1 className="font-headline text-2xl md:text-3xl">Admin Panel</h1>
            <div className="w-24"></div>
        </div>
      </header>
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          <div>
            <h2 className="text-2xl font-headline mb-1">Add New Product</h2>
            <p className="text-muted-foreground mb-6">Fill in the details below to add a new product to your store.</p>
            <ProductForm onProductAdd={handleAddProduct} />
          </div>

          <Separator />

          <div>
            <ProductList products={products} onProductDelete={handleDeleteProduct} />
          </div>

          <Separator />
          
          <div>
            <OrderList orders={orders} />
          </div>
        </div>
      </main>
    </div>
  );
}
