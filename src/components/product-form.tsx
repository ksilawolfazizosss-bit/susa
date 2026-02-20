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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { generateProductDescription } from "@/ai/flows/product-description-generator-flow";

const formSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters."),
  price: z.coerce.number().positive("Price must be a positive number."),
  category: z.string().min(2, "Category is required."),
  sizes: z.string().optional(),
  colors: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters."),
  keyFeatures: z.string().min(3, "Please list at least one key feature."),
  image: z.string().url("A valid image URL is required."),
});

export type ProductFormValues = z.infer<typeof formSchema>;

export function ProductForm({ onProductAdd }: { onProductAdd: (data: ProductFormValues) => void }) {
  const [isDescriptionLoading, setIsDescriptionLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
      category: "",
      sizes: "",
      colors: "",
      description: "",
      keyFeatures: "",
      image: "",
    },
  });

  const handleGenerateDescription = async () => {
    const { name, category, keyFeatures } = form.getValues();
    if (!name || !category || !keyFeatures) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide a Product Name, Category, and Key Features to generate a description.",
      });
      return;
    }

    setIsDescriptionLoading(true);
    try {
      const result = await generateProductDescription({
        productName: name,
        category,
        keyFeatures: keyFeatures.split(",").map(s => s.trim()),
      });
      form.setValue("description", result.description, { shouldValidate: true });
      toast({ title: "Description Generated", description: "AI has crafted a new product description." });
    } catch (error) {
      console.error("Description generation error:", error);
      toast({ variant: "destructive", title: "Error", description: "Could not generate a description." });
    } finally {
      setIsDescriptionLoading(false);
    }
  };

  function onSubmit(values: ProductFormValues) {
    onProductAdd(values);
    form.reset();
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
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
                <div className="grid grid-cols-2 gap-4">
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
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl><Input placeholder="e.g., Evening Gown" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="sizes" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Sizes</FormLabel>
                            <FormControl><Input placeholder="S, M, L, XL" {...field} /></FormControl>
                            <FormDescription>Comma-separated.</FormDescription>
                             <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="colors" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Colors</FormLabel>
                            <FormControl><Input placeholder="Black, Burgundy" {...field} /></FormControl>
                             <FormDescription>Comma-separated.</FormDescription>
                             <FormMessage />
                        </FormItem>
                    )} />
                </div>
              </div>
              <div className="space-y-6">
                 <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.png" {...field} />
                      </FormControl>
                      <FormDescription>
                        Paste a public URL for the product image. Use <a href="https://picsum.photos/" target="_blank" rel="noopener noreferrer" className="underline text-primary">picsum.photos</a> for placeholders.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="keyFeatures"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key Features</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Italian silk, hand-stitched embroidery, flowing silhouette" {...field} rows={5} />
                      </FormControl>
                      <FormDescription>
                        Comma-separated list for the AI generator.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Product Description</FormLabel>
                    <Button type="button" variant="ghost" size="sm" onClick={handleGenerateDescription} disabled={isDescriptionLoading}>
                      {isDescriptionLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="mr-2 h-4 w-4" />
                      )}
                      Generate with AI
                    </Button>
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder="A luxurious description of the product..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" size="lg">Publish Product</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
