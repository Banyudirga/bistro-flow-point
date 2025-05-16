
import React from 'react';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
}

interface MenuItemCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onSelect }) => {
  return (
    <div 
      className="border rounded-lg p-2 cursor-pointer hover:bg-gray-50 transition-colors text-center"
      onClick={() => onSelect(item)}
    >
      <div className="flex justify-center mb-2">
        <img 
          src={item.image_url || 'https://via.placeholder.com/80'} 
          alt={item.name} 
          className="w-20 h-20 object-cover rounded"
        />
      </div>
      <div className="font-medium">{item.name}</div>
      <div className="text-green-600">${item.price.toFixed(2)}</div>
    </div>
  );
};
