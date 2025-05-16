
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { CartItem } from './CartItem';

interface CartItemType {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartProps {
  items: CartItemType[];
  onClearCart: () => void;
  onRemoveItem: (id: string) => void;
  onAddItem: (id: string) => void;
  onCheckout: () => void;
}

export const Cart: React.FC<CartProps> = ({
  items,
  onClearCart,
  onRemoveItem,
  onAddItem,
  onCheckout
}) => {
  // Calculate total
  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <ShoppingCart className="mr-2 h-5 w-5" />
          Current Order
        </h3>
        {items.length > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClearCart}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>
      
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 text-gray-500">
          <ShoppingCart className="h-12 w-12 mb-2" />
          <p>Your cart is empty</p>
          <p className="text-sm">Add items from the menu</p>
        </div>
      ) : (
        <div className="flex flex-col flex-1">
          <ScrollArea className="flex-1">
            <div className="space-y-2">
              {items.map(item => (
                <CartItem 
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  price={item.price}
                  quantity={item.quantity}
                  onRemove={onRemoveItem}
                  onAdd={onAddItem}
                />
              ))}
            </div>
          </ScrollArea>
          
          <div className="border-t pt-4 mt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
            
            <Button 
              className="w-full mt-4" 
              size="lg"
              onClick={onCheckout}
            >
              Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
