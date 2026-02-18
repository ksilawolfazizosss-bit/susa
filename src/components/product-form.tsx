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
import Image from "next/image";
import { ImagePlus, Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { optimizeProductImage } from "@/ai/flows/product-image-optimizer-flow";
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

type ProductFormValues = z.infer<typeof formSchema>;

export function ProductForm() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
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

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImageLoading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const dataUri = reader.result as string;
      try {
        const result = await optimizeProductImage({ photoDataUri: dataUri });
        form.setValue("image", result.optimizedPhotoDataUri, { shouldValidate: true });
        setImagePreview(result.optimizedPhotoDataUri);
        toast({ title: "Image Optimized", description: "AI has enhanced your product image." });
      } catch (error) {
        console.error("Image optimization error:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not optimize the image." });
      } finally {
        setIsImageLoading(false);
      }
    };
  };

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
    // In a real app, this would send data to a backend to save in a database.
    console.log("Product submitted (simulation):", values);
    toast({
      title: "Product Published!",
      description: "Your new product is now live in the store (simulation).",
    });
    form.reset();
    setImagePreview(null);
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-1 space-y-2">
                 <FormLabel>Product Image</FormLabel>
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div>
                          <label htmlFor="image-upload" className="cursor-pointer">
                            <Card
                              className={`aspect-square w-full flex items-center justify-center flex-col gap-2 ${
                                imagePreview ? '' : 'border-dashed'
                              }`}
                            >
                              {isImageLoading ? (
                                <Loader2 className="h-8 w-8 animate-spin" />
                              ) : imagePreview ? (
                                <Image src={imagePreview} alt="Product preview" width={300} height={300} className="object-cover h-full w-full rounded-md" />
                              ) : (
                                <>
                                  <ImagePlus className="h-8 w-8 text-muted-foreground" />
                                  <span className="text-muted-foreground text-sm">Upload Image</span>
                                </>
                              )}
                            </Card>
                          </label>
                          <Input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="md:col-span-2 space-y-4">
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
                            <FormDescription>Comma-separated values.</FormDescription>
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="colors" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Colors</FormLabel>
                            <FormControl><Input placeholder="Black, Burgundy" {...field} /></FormControl>
                             <FormDescription>Comma-separated values.</FormDescription>
                        </FormItem>
                    )} />
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="keyFeatures"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key Features</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Italian silk, hand-stitched embroidery, flowing silhouette" {...field} />
                  </FormControl>
                  <FormDescription>
                    Provide a comma-separated list of key features. This will be used by the AI to generate a description.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
