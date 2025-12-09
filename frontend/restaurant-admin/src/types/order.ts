export type OrderStatus = 'new' | 'in-progress' | 'completed' | 'cancelled';

export interface OrderItem {
    name: string;
    quantity: number;
}

export interface Order {
    id: string;
    customer: string;
    customerName: string | null;
    phone: string;
    date: string;
    total: number;
    status: OrderStatus;
    items: OrderItem[];
    address: string;
    timeAgo?: string;
    timer?: string;
}

export interface Driver {
    id: number;
    name: string;
    distance: string;
    location: string;
}
