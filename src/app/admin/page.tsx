import { ProductForm } from "@/components/product-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/auth-context";


export default function AdminPage() {
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
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-headline mb-1">Add New Product</h2>
            <p className="text-muted-foreground mb-6">Fill in the details below to add a new product to your store.</p>
            <ProductForm />
        </div>
      </main>
    </div>
  );
}
