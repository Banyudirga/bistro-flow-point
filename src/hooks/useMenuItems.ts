
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';

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
  const [categories, setCategories] = useState<string[]>([]);

  const { data: menuItems, isLoading, error } = useQuery({
    queryKey: ['menuItems'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('name');
        
      if (error) throw error;
      
      return data as MenuItem[];
    }
  });

  // Process categories whenever menu items change
  useEffect(() => {
    if (menuItems && menuItems.length > 0) {
      const uniqueCategories = Array.from(new Set(menuItems.map(item => item.category)));
      setCategories(uniqueCategories);
    }
  }, [menuItems]);

  return {
    menuItems: menuItems || [],
    categories,
    isLoading,
    error
  };
};
