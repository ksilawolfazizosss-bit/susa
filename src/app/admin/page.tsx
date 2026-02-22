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
  const [isOptimizing, setIsOptimizing] = useState(false);

  const productsQuery = useMemo(
    () => (firestore ? collection(firestore, 'products') : null),
    [firestore]
  );
  const { data: products, loading: productsLoading, forceRefetch: refetchProducts } =
    useCollection<Product>(productsQuery);

  const ordersQuery = useMemo(
    () => (firestore ? collection(firestore, 'orders') : null),
    [firestore]
  );
  const { data: orders, loading: ordersLoading } =
    useCollection<Order>(ordersQuery);

  const { toast } = useToast();

  const handleAddProduct = async (newProductData: ProductFormValues, imageFile: File) => {
    if (!firestore) {
      toast({
        variant: "destructive",
        title: "Database not connected",
        description: "Please try again later.",
      });
      throw new Error("Firestore not available");
    }
    
    setIsOptimizing(true);
    let optimizedImageUri = '';
    
    try {
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        const dataUri = await new Promise<string>((resolve, reject) => {
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
      
        const result = await optimizeProductImage({ imageDataUri: dataUri });
        optimizedImageUri = result.optimizedImageDataUri;

    } catch (e: any) {
        console.error("AI Optimization Error:", e);
        toast({
            variant: "destructive",
            title: "AI Image Optimization Failed",
            description: e.message || "The AI could not process your image. Please try a different one.",
        });
        setIsOptimizing(false);
        throw e;
    } finally {
        setIsOptimizing(false);
    }
    
    try {
        const productCollection = collection(firestore, "products");
        const productData = {
          name: newProductData.name,
          price: newProductData.price,
          imageUrl: optimizedImageUri, // Use the optimized data URI from the AI
          sizes: newProductData.sizes.split(',').map(s => s.trim()).filter(Boolean),
          colors: newProductData.colors.split(',').map(c => c.trim()).filter(Boolean),
        };
        await addDoc(productCollection, productData);
        
        toast({
            title: "Product Published!",
            description: "Your new product is now live in the store.",
        });
        refetchProducts();
    } catch (err: any) {
        console.error("Error saving product to Firestore: ", err);
        const permissionError = new FirestorePermissionError({
            path: 'products',
            operation: 'create',
            requestResourceData: { name: newProductData.name }, // Don't log the full base64 string
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({
          variant: "destructive",
          title: "Failed to Save Product Data",
          description: "Could not save product details to the database. This is likely a permission issue.",
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
                    <ProductForm onProductAdd={handleAddProduct} isSubmittingAI={isOptimizing} />
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
