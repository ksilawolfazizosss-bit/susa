import { Timestamp } from "firebase/firestore";

export interface Product {
    id?: string;
    name: string;
    price: number;
    category: string;
    description: string;
    imageUrl: string;
    keyFeatures: string[];
    sizes: string[];
    colors: string[];
}

export interface Order {
    id?: string;
    customerName: string;
    phone: string;
    productId: string;
    productName: string;
    productPrice: number;
    productImageUrl: string;
    createdAt: Timestamp;
    status: 'Pending' | 'Completed';
}
