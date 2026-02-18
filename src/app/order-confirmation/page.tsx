import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function OrderConfirmationPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
            <Card className="w-full max-w-lg text-center shadow-2xl">
                <CardHeader className="items-center">
                    <CheckCircle className="h-16 w-16 text-success mb-4" />
                    <CardTitle className="font-headline text-3xl">Thank You!</CardTitle>
                    <CardDescription className="text-lg">Your order has been placed successfully.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        We have received your order and will contact you shortly to confirm the details. Payment will be collected upon delivery.
                    </p>
                    <Button asChild className="mt-8" size="lg">
                        <Link href="/">Continue Shopping</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
