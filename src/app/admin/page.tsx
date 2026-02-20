"use client";

import { useMemo, useState } from "react";
import { ProductForm, type ProductFormValues } from "@/components/product-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, ShoppingCart } from "lucide-react";
import { ProductList } from "@/components/product-list";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { OrderList } from "@/components/order-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCollection } from "@/firebase/firestore/use-collection";
import { collection, addDoc, deleteDoc, doc } from "firebase/firestore";
import { useFirestore } from "@/firebase";
import type { Product, Order } from "@/types";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { optimizeProductImage } from "@/ai/flows/product-image-optimizer-flow";

export default function AdminPage() {
  const firestore = useFirestore();

  const productsQuery = useMemo(
    () => (firestore ? collection(firestore, 'products') : null),
    [firestore]
  );
  const { data: products, loading: productsLoading } =
    useCollection<Product>(productsQuery);

  const ordersQuery = useMemo(
    () => (firestore ? collection(firestore, 'orders') : null),
    [firestore]
  );
  const { data: orders, loading: ordersLoading } =
    useCollection<Order>(ordersQuery);

  const { toast } = useToast();

  const handleAddProduct = async (newProductData: ProductFormValues, imageData: string) => {
    if (!firestore) {
      toast({
        variant: "destructive",
        title: "Database not connected",
        description: "Please try again later.",
      });
      throw new Error("Firestore not available");
    }

    let optimizedImageData = imageData;
    try {
        toast({ title: "Optimizing Image...", description: "Please wait while we enhance your product photo."});
        const optimizationResult = await optimizeProductImage({ photoDataUri: imageData });
        optimizedImageData = optimizationResult.optimizedPhotoDataUri;
        toast({
            title: "Image Optimized!",
            description: "Your product image has been prepared for the store.",
        });
    } catch (error) {
        console.error("Image optimization failed:", error);
        toast({
            variant: "destructive",
            title: "Image Optimization Failed",
            description: "Saving the original image instead. This might fail if the image is too large.",
        });
    }
    
    const productCollection = collection(firestore, "products");
    
    const productData = {
      name: newProductData.name,
      price: newProductData.price,
      imageUrl: optimizedImageData,
      sizes: newProductData.sizes.split(',').map(s => s.trim()).filter(Boolean),
      colors: newProductData.colors.split(',').map(c => c.trim()).filter(Boolean),
    };

    try {
        await addDoc(productCollection, productData);
        toast({
            title: "Product Published!",
            description: "Your new product is now live in the store.",
        });
    } catch (err) {
        console.error("Error adding document: ", err);
        const permissionError = new FirestorePermissionError({
            path: 'products',
            operation: 'create',
            requestResourceData: { ...productData, imageUrl: '...omitted for brevity...' },
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({
          variant: "destructive",
          title: "Failed to Save Product",
          description: "There was an error saving the product. This could be due to a large image or database permissions issue.",
        });
        throw err;
    }
  };

  const handleDeleteProduct = (productId: string) => {
    if (!firestore) return;

    deleteDoc(doc(firestore, "products", productId))
      .then(() => {
        toast({
          title: 'Product Deleted',
          description: `The product has been removed from the store.`,
        });
      })
      .catch((err) => {
        const permissionError = new FirestorePermissionError({
            path: `products/${productId}`,
            operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({
          variant: 'destructive',
          title: 'Error Deleting Product',
          description: 'Could not delete the product. Please check your Firestore rules.',
        });
      });
  };


  return (
    <div className="min-h-screen bg-muted/40">
      <main className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
            <h1 className="font-headline text-4xl">Admin Panel</h1>
            <Button asChild variant="outline">
                <Link href="/">
                    <ArrowLeft className="mr-2" />
                    Back to Store
                </Link>
            </Button>
        </div>
        
        <Tabs defaultValue="products" className="max-w-5xl mx-auto">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="products">
                    <Package className="mr-2" />
                    Products
                </TabsTrigger>
                <TabsTrigger value="orders">
                    <ShoppingCart className="mr-2" />
                    Orders
                </TabsTrigger>
            </TabsList>
            <TabsContent value="products" className="mt-6 space-y-12">
                 <div>
                    <h2 className="text-2xl font-headline mb-1">Add New Product</h2>
                    <p className="text-muted-foreground mb-6">Fill in the details below to add a new product to your store.</p>
                    <ProductForm onProductAdd={handleAddProduct} />
                </div>

                <Separator />

                <div>
                    <ProductList products={products || []} onProductDelete={handleDeleteProduct} loading={productsLoading} />
                </div>
            </TabsContent>
            <TabsContent value="orders" className="mt-6">
                <div>
                    <OrderList orders={orders || []} loading={ordersLoading} />
                </div>
            </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
