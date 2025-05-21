import { MenuItem } from '@/hooks/useMenuItems';

class LocalStorageHelper {
  private localStorageKey = 'seblak-listyaning';

  // Helper function to set item in local storage
  private setItem<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(`${this.localStorageKey}-${key}`, serializedValue);
    } catch (error) {
      console.error(`Error setting item ${key} in localStorage:`, error);
    }
  }

  // Helper function to get item from local storage
  private getItem<T>(key: string): T | null {
    try {
      const serializedValue = localStorage.getItem(`${this.localStorageKey}-${key}`);
      if (serializedValue === null) {
        return null;
      }
      return JSON.parse(serializedValue) as T;
    } catch (error) {
      console.error(`Error getting item ${key} from localStorage:`, error);
      return null;
    }
  }

  // Helper function to remove item from local storage
  private removeItem(key: string): void {
    try {
      localStorage.removeItem(`${this.localStorageKey}-${key}`);
    } catch (error) {
      console.error(`Error removing item ${key} from localStorage:`, error);
    }
  }

  // Get menu items from local storage
  public getMenuItems(): MenuItem[] {
    try {
      const menuItems = this.getItem<MenuItem[]>('menuItems');
      if (!menuItems) {
        // Provide default menu items if none exist
        const defaultMenuItems = this.getDefaultMenuItems();
        this.setItem('menuItems', defaultMenuItems);
        return defaultMenuItems;
      }
      return menuItems;
    } catch (error) {
      console.error('Error getting menu items:', error);
      return [];
    }
  }

  // Get default menu items when none are available
  private getDefaultMenuItems(): MenuItem[] {
    return [
      // SEBLAK Category (Makanan Utama)
      {
        id: '1',
        name: 'Seblak Original',
        price: 15000,
        category: 'Makanan Utama',
        image_url: 'https://via.placeholder.com/100x100?text=Seblak+Original',
        description: 'Seblak dengan bumbu khas pedas, kerupuk, dan sayuran',
        is_available: true
      },
      {
        id: '2',
        name: 'Seblak Tulang',
        price: 20000,
        category: 'Makanan Utama',
        image_url: 'https://via.placeholder.com/100x100?text=Seblak+Tulang',
        description: 'Seblak dengan tambahan tulang ayam yang gurih',
        is_available: true
      },
      {
        id: '3',
        name: 'Seblak Ceker',
        price: 18000,
        category: 'Makanan Utama',
        image_url: 'https://via.placeholder.com/100x100?text=Seblak+Ceker',
        description: 'Seblak dengan tambahan ceker ayam',
        is_available: true
      },
      {
        id: '4',
        name: 'Seblak Seafood',
        price: 25000,
        category: 'Makanan Utama',
        image_url: 'https://via.placeholder.com/100x100?text=Seblak+Seafood',
        description: 'Seblak dengan tambahan udang, cumi, dan bakso ikan',
        is_available: true
      },
      {
        id: '5',
        name: 'Seblak Mie',
        price: 17000,
        category: 'Makanan Utama',
        image_url: 'https://via.placeholder.com/100x100?text=Seblak+Mie',
        description: 'Seblak dengan tambahan mie instan',
        is_available: true
      },
      
      // MAKANAN Category (Makanan Pendamping)
      {
        id: '6',
        name: 'Baso Aci',
        price: 15000,
        category: 'Makanan Pendamping',
        image_url: 'https://via.placeholder.com/100x100?text=Baso+Aci',
        description: 'Bakso dari tepung aci dengan kuah pedas',
        is_available: true
      },
      {
        id: '7',
        name: 'Cireng Rujak',
        price: 12000,
        category: 'Makanan Pendamping',
        image_url: 'https://via.placeholder.com/100x100?text=Cireng+Rujak',
        description: 'Cireng dengan saus rujak pedas manis',
        is_available: true
      },
      {
        id: '8',
        name: 'Cimol',
        price: 10000,
        category: 'Makanan Pendamping',
        image_url: 'https://via.placeholder.com/100x100?text=Cimol',
        description: 'Bola-bola tapioka yang garing di luar, lembut di dalam',
        is_available: true
      },
      {
        id: '9',
        name: 'Makaroni Goreng',
        price: 12000,
        category: 'Makanan Pendamping',
        image_url: 'https://via.placeholder.com/100x100?text=Makaroni+Goreng',
        description: 'Makaroni goreng dengan bumbu pedas',
        is_available: true
      },
      
      // MINUMAN Category (Minuman)
      {
        id: '10',
        name: 'Es Teh Manis',
        price: 5000,
        category: 'Minuman',
        image_url: 'https://via.placeholder.com/100x100?text=Es+Teh+Manis',
        description: 'Teh manis dengan es batu',
        is_available: true
      },
      {
        id: '11',
        name: 'Es Jeruk',
        price: 7000,
        category: 'Minuman',
        image_url: 'https://via.placeholder.com/100x100?text=Es+Jeruk',
        description: 'Air jeruk segar dengan es batu',
        is_available: true
      },
      {
        id: '12',
        name: 'Es Kelapa',
        price: 10000,
        category: 'Minuman',
        image_url: 'https://via.placeholder.com/100x100?text=Es+Kelapa',
        description: 'Air kelapa muda segar dengan es batu',
        is_available: true
      },
      {
        id: '13',
        name: 'Es Buah',
        price: 12000,
        category: 'Minuman',
        image_url: 'https://via.placeholder.com/100x100?text=Es+Buah',
        description: 'Campuran buah-buahan dengan sirup dan susu',
        is_available: true
      },
      {
        id: '14',
        name: 'Es Campur',
        price: 15000,
        category: 'Minuman',
        image_url: 'https://via.placeholder.com/100x100?text=Es+Campur',
        description: 'Campuran cincau, kolang-kaling, dan alpukat dengan susu',
        is_available: true
      },
      
      // CAMILAN Category (Makanan Penutup)
      {
        id: '15',
        name: 'Kripik Singkong',
        price: 8000,
        category: 'Makanan Penutup',
        image_url: 'https://via.placeholder.com/100x100?text=Kripik+Singkong',
        description: 'Keripik singkong renyah dengan berbagai rasa',
        is_available: true
      },
      {
        id: '16',
        name: 'Kripik Pisang',
        price: 8000,
        category: 'Makanan Penutup',
        image_url: 'https://via.placeholder.com/100x100?text=Kripik+Pisang',
        description: 'Keripik pisang renyah dengan rasa manis',
        is_available: true
      },
      {
        id: '17',
        name: 'Kue Cubit',
        price: 10000,
        category: 'Makanan Penutup',
        image_url: 'https://via.placeholder.com/100x100?text=Kue+Cubit',
        description: 'Kue tradisional dengan berbagai topping',
        is_available: true
      },
      {
        id: '18',
        name: 'Pisang Goreng',
        price: 10000,
        category: 'Makanan Penutup',
        image_url: 'https://via.placeholder.com/100x100?text=Pisang+Goreng',
        description: 'Pisang goreng crispy dengan toping keju atau coklat',
        is_available: true
      },
    ];
  }

  // Set menu items to local storage
  public setMenuItems(items: MenuItem[]): void {
    this.setItem('menuItems', items);
  }

  // Clear menu items from local storage
  public clearMenuItems(): void {
    this.removeItem('menuItems');
  }
}

export const localStorageHelper = new LocalStorageHelper();
