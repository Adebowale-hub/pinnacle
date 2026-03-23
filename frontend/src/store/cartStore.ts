import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '../types';

interface CartState {
    items: CartItem[];
    addToCart: (product: Product, quantity?: number) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            addToCart: (product: Product, quantity = 1) => {
                const items = get().items;
                const existingItem = items.find(item => item.product._id === product._id);

                if (existingItem) {
                    set({
                        items: items.map(item =>
                            item.product._id === product._id
                                ? { ...item, quantity: item.quantity + quantity }
                                : item
                        )
                    });
                } else {
                    set({ items: [...items, { product, quantity }] });
                }
            },

            removeFromCart: (productId: string) => {
                set({ items: get().items.filter(item => item.product._id !== productId) });
            },

            updateQuantity: (productId: string, quantity: number) => {
                if (quantity <= 0) {
                    get().removeFromCart(productId);
                    return;
                }
                set({
                    items: get().items.map(item =>
                        item.product._id === productId ? { ...item, quantity } : item
                    )
                });
            },

            clearCart: () => {
                set({ items: [] });
            },

            getTotalItems: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            },

            getTotalPrice: () => {
                return get().items.reduce(
                    (total, item) => total + item.product.retailPrice * item.quantity,
                    0
                );
            }
        }),
        {
            name: 'cart-storage'
        }
    )
);
