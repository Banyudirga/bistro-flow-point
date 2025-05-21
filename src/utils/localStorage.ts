
import { MenuItem } from '@/hooks/useMenuItems';

// Define all required interfaces
export interface LocalMenuItem extends MenuItem {
  ingredients?: Array<{
    inventoryId: string;
    amount: number;
    unit: string;
  }>;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  cost_price: number;
  threshold_quantity: number | null;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  name: string;
  contact: string;
  lastVisitDate: string;
  lastTransactionAmount: number;
  visitCount: number;
  totalSpent: number;
  notes?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  total: number;
  date: string;
  paymentMethod: string;
  cashierId: string;
  customerName?: string;
  customerContact?: string;
}

export interface LocalStorageUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

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

  // Add a new menu item
  public addMenuItem(item: LocalMenuItem): void {
    const menuItems = this.getMenuItems();
    menuItems.push(item);
    this.setMenuItems(menuItems);
  }

  // Update a menu item
  public updateMenuItem(updatedItem: LocalMenuItem): void {
    const menuItems = this.getMenuItems();
    const index = menuItems.findIndex(item => item.id === updatedItem.id);
    if (index !== -1) {
      menuItems[index] = updatedItem;
      this.setMenuItems(menuItems);
    }
  }

  // Delete a menu item
  public deleteMenuItem(id: string): void {
    const menuItems = this.getMenuItems();
    const filteredItems = menuItems.filter(item => item.id !== id);
    this.setMenuItems(filteredItems);
  }

  // Clear menu items from local storage
  public clearMenuItems(): void {
    this.removeItem('menuItems');
  }

  // Inventory items methods
  public getInventoryItems(): InventoryItem[] {
    const items = this.getItem<InventoryItem[]>('inventoryItems');
    return items || [];
  }

  public addInventoryItem(item: InventoryItem): void {
    const items = this.getInventoryItems();
    items.push(item);
    this.setItem('inventoryItems', items);
  }

  public updateInventoryItem(updatedItem: InventoryItem): void {
    const items = this.getInventoryItems();
    const index = items.findIndex(item => item.id === updatedItem.id);
    if (index !== -1) {
      items[index] = updatedItem;
      this.setItem('inventoryItems', items);
    }
  }

  public deleteInventoryItem(id: string): void {
    const items = this.getInventoryItems();
    const filteredItems = items.filter(item => item.id !== id);
    this.setItem('inventoryItems', filteredItems);
  }

  // Customer methods
  public getCustomers(): Customer[] {
    const customers = this.getItem<Customer[]>('customers');
    return customers || [];
  }

  public updateCustomer(customerData: Omit<Customer, 'id'>): Customer {
    const customers = this.getCustomers();
    const existingCustomerIndex = customers.findIndex(c => c.contact === customerData.contact);
    
    if (existingCustomerIndex >= 0) {
      // Update existing customer
      const existingCustomer = customers[existingCustomerIndex];
      const updatedCustomer: Customer = {
        ...existingCustomer,
        name: customerData.name,
        contact: customerData.contact,
        lastVisitDate: customerData.lastVisitDate,
        lastTransactionAmount: customerData.lastTransactionAmount,
        visitCount: existingCustomer.visitCount + 1,
        totalSpent: existingCustomer.totalSpent + customerData.lastTransactionAmount,
        notes: customerData.notes || existingCustomer.notes
      };
      
      customers[existingCustomerIndex] = updatedCustomer;
      this.setItem('customers', customers);
      return updatedCustomer;
    } else {
      // Create new customer
      const newCustomer: Customer = {
        id: `customer-${Date.now()}`,
        ...customerData
      };
      
      customers.push(newCustomer);
      this.setItem('customers', customers);
      return newCustomer;
    }
  }

  public deleteCustomer(id: string): void {
    const customers = this.getCustomers();
    const filteredCustomers = customers.filter(customer => customer.id !== id);
    this.setItem('customers', filteredCustomers);
  }

  // Order methods
  public getOrders(): Order[] {
    const orders = this.getItem<Order[]>('orders');
    return orders || [];
  }

  public addOrder(order: Order): void {
    const orders = this.getOrders();
    orders.push(order);
    this.setItem('orders', orders);
  }

  // User methods
  public getUser(): LocalStorageUser | null {
    return this.getItem<LocalStorageUser>('user');
  }

  public setUser(user: LocalStorageUser): void {
    this.setItem('user', user);
  }

  public clearUser(): void {
    this.removeItem('user');
  }
}

export const localStorageHelper = new LocalStorageHelper();
