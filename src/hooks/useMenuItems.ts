
import { useState, useEffect } from 'react';
import { localStorageHelper, LocalMenuItem } from '@/utils/localStorage';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image_url: string | null;
  description: string | null;
  is_available: boolean | null;
}

export const useMenuItems = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load menu items from localStorage
  useEffect(() => {
    try {
      const localItems = localStorageHelper.getMenuItems();
      setMenuItems(localItems);
      
      // Extract categories
      if (localItems && localItems.length > 0) {
        const uniqueCategories = Array.from(new Set(localItems.map(item => item.category)));
        setCategories(uniqueCategories);
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error loading menu items:', err);
      setError(err as Error);
      setIsLoading(false);
    }
  }, []);

  return {
    menuItems,
    categories,
    isLoading,
    error
  };
};
