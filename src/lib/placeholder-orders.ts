import type { ImagePlaceholder } from './placeholder-images';

export type Order = {
    id: string;
    customerName: string;
    phone: string;
    product: Pick<ImagePlaceholder, 'name' | 'price' | 'imageUrl'>;
    date: string;
    status: 'Pending' | 'Completed';
};

export const PlaceholderOrders: Order[] = [
    {
        id: 'ord-001',
        customerName: 'John Doe',
        phone: '123-456-7890',
        product: {
            name: 'Midnight Velvet Gown',
            price: 750,
            imageUrl: 'https://images.unsplash.com/photo-1761574028720-8872dc5fe412?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxldmVuaW5nJTIwZ293biUyMGJsYWNrfGVufDB8fHx8MTc3MTQzOTQ0NHww&ixlib=rb-4.1.0&q=80&w=1080',
        },
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Pending',
    },
    {
        id: 'ord-002',
        customerName: 'Jane Smith',
        phone: '098-765-4321',
        product: {
            name: 'Elegance Leather Tote',
            price: 420,
            imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwaGFuZGJhZ3xlbnwwfHx8fDE3NzE0MTU5OTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
        },
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Completed',
    }
];
