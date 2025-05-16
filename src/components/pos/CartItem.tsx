
import React from 'react';
import { Button } from '@/components/ui/button';

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
  onRemove: (id: string) => void;
  onAdd: (id: string) => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  id,
  name,
  price,
  quantity,
  onRemove,
  onAdd
}) => {
  return (
    <div className="flex justify-between items-center p-2 border-b">
      <div className="flex-1">
        <div className="font-medium">{name}</div>
        <div className="text-sm text-gray-500">
          ${price.toFixed(2)} x {quantity}
        </div>
      </div>
      <div className="font-semibold">
        ${(price * quantity).toFixed(2)}
      </div>
      <div className="flex items-center ml-4">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-7 w-7"
          onClick={() => onRemove(id)}
        >
          -
        </Button>
        <span className="mx-2">{quantity}</span>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-7 w-7"
          onClick={() => onAdd(id)}
        >
          +
        </Button>
      </div>
    </div>
  );
};
