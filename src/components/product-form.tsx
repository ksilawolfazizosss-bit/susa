"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Loader2, UploadCloud } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters."),
  price: z.coerce.number().positive("Price must be a positive number."),
  colors: z.string().min(3, "Please list at least one color."),
  sizes: z.string().min(1, "Please list at least one size."),
});

export type ProductFormValues = z.infer<typeof formSchema>;

export function ProductForm({ onProductAdd, isPublishing }: { onProductAdd: (data: ProductFormValues, imageFile: File) => Promise<void>, isPublishing: boolean }) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
      colors: "",
      sizes: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          variant: "destructive",
          title: "Image too large",
          description: "Please upload an image smaller than 10MB.",
        });
        e.target.value = ""; 
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: ProductFormValues) {
    if (!imageFile) {
        toast({
            variant: "destructive",
            title: "Image required",
            description: "Please upload a product image.",
        });
        return;
    }

    try {
      await onProductAdd(values, imageFile);
      form.reset();
      setImagePreview(null);
      setImageFile(null);
    } catch (error) {
        // Errors are handled and toasted by the parent `onProductAdd` function.
        console.error("Failed to add product:", error);
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl><Input placeholder="e.g., Midnight Velvet Gown" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 750" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                     <FormField control={form.control} name="colors" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Colors</FormLabel>
                            <FormControl><Input placeholder="Black, Burgundy, Navy" {...field} /></FormControl>
                             <FormDescription>Comma-separated list (e.g., Red, Blue, Green).</FormDescription>
                             <FormMessage />
                        </FormItem>
                    )} />
                     <FormField control={form.control} name="sizes" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Sizes</FormLabel>
                            <FormControl><Input placeholder="S, M, L, XL" {...field} /></FormControl>
                            <FormDescription>Comma-separated list (e.g., S, M, L, XL).</FormDescription>
                             <FormMessage />
                        </FormItem>
                    )} />
                </div>

                <div className="space-y-2">
                    <FormLabel>Product Image</FormLabel>
                     <div className="aspect-square w-full rounded-md border-2 border-dashed border-muted-foreground/40 flex items-center justify-center relative overflow-hidden">
                        {imagePreview ? (
                            <Image src={imagePreview} alt="Product preview" fill className="object-contain" />
                        ) : (
                            <div className="text-center text-muted-foreground">
                                <UploadCloud className="mx-auto h-12 w-12" />
                                <p className="mt-2">Click to upload or drag & drop</p>
                                <p className="text-xs">PNG, JPG, WEBP up to 10MB</p>
                            </div>
                        )}
                         <FormControl>
                            <Input 
                                type="file" 
                                accept="image/png, image/jpeg, image/webp"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleImageChange}
                                disabled={isPublishing}
                            />
                        </FormControl>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" size="lg" disabled={isPublishing}>
                {isPublishing ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Publishing...
                    </>
                ) : (
                    'Publish Product'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
