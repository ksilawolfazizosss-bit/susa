"use client";

import { useState } from "react";
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

export default function AdminPage() {
  const firestore = useFirestore();
  const { data: products, loading: productsLoading } = useCollection<Product>(
    firestore ? collection(firestore, "products") : null
  );
  const { data: orders, loading: ordersLoading } = useCollection<Order>(
    firestore ? collection(firestore, "orders") : null
  );

  const { toast } = useToast();

  const handleAddProduct = (newProductData: ProductFormValues) => {
    if (!firestore) return;

    const productCollection = collection(firestore, "products");
    const productData = {
      name: newProductData.name,
      price: newProductData.price,
      category: newProductData.category,
      description: newProductData.description,
      imageUrl: newProductData.image,
      sizes: newProductData.sizes?.split(',').map(s => s.trim()).filter(Boolean) || [],
      colors: newProductData.colors?.split(',').map(c => c.trim()).filter(Boolean) || [],
      keyFeatures: newProductData.keyFeatures?.split(',').map(s => s.trim()).filter(Boolean) || [],
    };

    addDoc(productCollection, productData)
      .then(() => {
        toast({
          title: "Product Published!",
          description: "Your new product is now live in the store.",
        });
      })
      .catch((err) => {
        console.error("Firebase Add Product Error:", err);
        const permissionError = new FirestorePermissionError({
            path: 'products',
            operation: 'create',
            requestResourceData: productData,
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({
          variant: "destructive",
          title: "Failed to Save Product",
          description: "There was an error saving the product. Please check your Firestore rules and database setup.",
        });
      });
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
        console.error("Firebase Delete Product Error:", err);
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
