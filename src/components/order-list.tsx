'use client';

import type { Order } from '@/lib/placeholder-orders';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import { format } from 'date-fns';

export function OrderList({ orders }: { orders: Order[] }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-headline mb-1">Recent Orders</h2>
      <p className="text-muted-foreground mb-6">
        This is a preview of your orders dashboard. Real orders will appear here once a database is connected.
      </p>
      {orders.length === 0 ? (
        <Card className="flex items-center justify-center h-40 border-dashed">
          <p className="text-muted-foreground">No orders to display.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-4 grid grid-cols-1 md:grid-cols-5 items-center gap-4">
                <div className="md:col-span-2 flex items-center gap-4">
                  <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden border">
                    <Image src={order.product.imageUrl} alt={order.product.name!} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="font-bold">{order.product.name}</p>
                    <p className="text-sm text-primary">{formatPrice(order.product.price)}</p>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <p className="font-semibold">{order.customerName}</p>
                  <p className="text-sm text-muted-foreground">{order.phone}</p>
                   <p className="text-sm text-muted-foreground">{format(new Date(order.date), "PPP")}</p>
                </div>
                <div className="flex justify-end">
                    <Badge variant={order.status === 'Pending' ? 'secondary' : 'default'}>
                        {order.status}
                    </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
