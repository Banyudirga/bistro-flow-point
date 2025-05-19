
import React from 'react';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  description?: string | null;
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
          loading="lazy"
        />
      </div>
      <div className="font-medium">{item.name}</div>
      <div className="text-green-600">Rp{item.price.toLocaleString('id-ID')}</div>
      {item.description && (
        <div className="text-xs text-gray-600 mt-1 line-clamp-2">{item.description}</div>
      )}
    </div>
  );
};
