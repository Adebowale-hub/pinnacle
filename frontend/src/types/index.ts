export interface User {
    _id: string;
    name: string;
    email: string;
    phone: string;
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
    };
}

export interface AuthResponse {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    address?: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
    };
    token: string;
}

export interface Product {
    _id: string;
    name: string;
    description: string;
    category: 'Cosmetics' | 'Foodstuff' | 'Beverages' | 'Household Items';
    retailPrice: number;
    wholesalePrice: number;
    stock: number;
    images: string[];
    isAvailable: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface OrderItem {
    product: string;
    name: string;
    price: number;
    quantity: number;
}

export interface Order {
    _id: string;
    user: string | User;
    items: OrderItem[];
    totalAmount: number;
    paymentStatus: 'pending' | 'paid' | 'failed';
    orderStatus: 'pending' | 'processing' | 'delivered' | 'cancelled';
    paystackReference: string;
    deliveryOption: 'delivery' | 'pickup';
    deliveryAddress?: {
        street: string;
        city: string;
        state: string;
        phone: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface Admin {
    _id: string;
    name: string;
    email: string;
    role: 'super_admin' | 'admin';
}


export interface DashboardStats {
    totalProducts: number;
    totalOrders: number;
    paidOrders: number;
    totalRevenue: number;
    lowStockProducts: Product[];
    recentOrders: Order[];
}
