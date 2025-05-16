
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MenuItemCard } from './MenuItemCard';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image_url: string | null;
  description: string | null;
  is_available: boolean | null;
}

interface MenuCategoriesProps {
  categories: string[];
  menuItems: MenuItem[];
  onSelectItem: (item: MenuItem) => void;
}

export const MenuCategories: React.FC<MenuCategoriesProps> = ({
  categories,
  menuItems,
  onSelectItem
}) => {
  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <p>No menu categories found.</p>
      </div>
    );
  }

  return (
    <Tabs defaultValue={categories[0] || "foods"} className="h-full flex flex-col">
      <TabsList className="mb-4">
        {categories.map(category => (
          <TabsTrigger key={category} value={category}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {categories.map(category => (
        <TabsContent 
          key={category} 
          value={category} 
          className="flex-1 mt-0"
        >
          <ScrollArea className="h-[calc(100vh-220px)]">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-2">
              {menuItems
                .filter(item => item.category === category && item.is_available !== false)
                .map(item => (
                  <MenuItemCard 
                    key={item.id} 
                    item={item} 
                    onSelect={onSelectItem} 
                  />
                ))}
            </div>
          </ScrollArea>
        </TabsContent>
      ))}
    </Tabs>
  );
};
