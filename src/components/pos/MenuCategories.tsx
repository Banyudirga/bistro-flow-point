
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { MenuItemCard } from './MenuItemCard';
import { AddMenuItemDialog } from './AddMenuItemDialog';
import { useAuth } from '@/contexts/auth';

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
  onMenuItemsChange?: () => void;
}

export const MenuCategories: React.FC<MenuCategoriesProps> = ({
  categories,
  menuItems,
  onSelectItem,
  onMenuItemsChange
}) => {
  const { user } = useAuth();
  const [isAddMenuDialogOpen, setIsAddMenuDialogOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>(categories[0] || "");
  
  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <p>Kategori menu tidak ditemukan.</p>
      </div>
    );
  }

  // Translate categories to Indonesian if they match default English values
  const translateCategory = (category: string): string => {
    const translations: Record<string, string> = {
      'Main Course': 'Makanan Utama',
      'Side Dish': 'Makanan Pendamping',
      'Beverages': 'Minuman',
      'Dessert': 'Makanan Penutup'
    };
    
    return translations[category] || category;
  };

  const displayCategories = categories.map(cat => ({
    original: cat,
    display: translateCategory(cat)
  }));

  return (
    <>
      <Tabs 
        defaultValue={categories[0] || "foods"} 
        className="h-full flex flex-col"
        value={activeCategory}
        onValueChange={setActiveCategory}
      >
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            {displayCategories.map(category => (
              <TabsTrigger 
                key={category.original} 
                value={category.original}
              >
                {category.display}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {/* Only show add menu button for owner */}
          {user?.role === 'owner' && (
            <Button 
              size="sm" 
              onClick={() => setIsAddMenuDialogOpen(true)}
              className="ml-2"
            >
              <Plus className="h-4 w-4 mr-1" />
              Tambah Menu
            </Button>
          )}
        </div>
        
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
      
      <AddMenuItemDialog 
        open={isAddMenuDialogOpen}
        onOpenChange={setIsAddMenuDialogOpen}
        onMenuItemAdded={() => {
          if (onMenuItemsChange) {
            onMenuItemsChange();
          }
        }}
      />
    </>
  );
};
