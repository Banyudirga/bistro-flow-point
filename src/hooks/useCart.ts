
import { useState } from 'react';
import { toast } from '@/components/ui/sonner';
import { MenuItem } from './useMenuItems';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Add item to cart
  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existingItem = prev.find(i => i.id === item.id);
      if (existingItem) {
        return prev.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prev, { 
          id: item.id, 
          name: item.name, 
          price: item.price, 
          quantity: 1 
        }];
      }
    });
    
    toast.success(`Added ${item.name} to cart`);
  };
  
  // Remove item from cart
  const removeFromCart = (id: string) => {
    setCart(prev => {
      const existingItem = prev.find(i => i.id === id);
      
      if (existingItem && existingItem.quantity > 1) {
        return prev.map(i => 
          i.id === id ? { ...i, quantity: i.quantity - 1 } : i
        );
      } else {
        return prev.filter(i => i.id !== id);
      }
    });
  };
  
  // Clear cart
  const clearCart = () => {
    setCart([]);
    toast.info("Cart cleared");
  };
  
  // Calculate total
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    calculateTotal
  };
};
