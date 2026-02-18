import type { ImagePlaceholder } from './placeholder-images';

export type Order = {
    id: string;
    customerName: string;
    phone: string;
    product: Pick<ImagePlaceholder, 'name' | 'price' | 'imageUrl'>;
    date: string;
    status: 'Pending' | 'Completed';
};

export const PlaceholderOrders: Order[] = [];
