
// Define types for our local storage data
export interface LocalStorageUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'owner' | 'warehouse_admin' | 'cashier';
}

export interface LocalMenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image_url: string | null;
  description: string | null;
  is_available: boolean;
}

export interface LocalInventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  cost_price: number;
  threshold_quantity: number | null;
  created_at: string;
  updated_at: string;
}

export interface LocalOrder {
  id: string;
  orderNumber: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  date: string;
  paymentMethod: string;
  cashierId: string;
}

// Keys for storing data
const STORAGE_KEYS = {
  USER: 'pos_user',
  MENU_ITEMS: 'pos_menu_items',
  INVENTORY_ITEMS: 'pos_inventory_items',
  ORDERS: 'pos_orders',
};

// Default menu items if none exist
const DEFAULT_MENU_ITEMS: LocalMenuItem[] = [
  {
    id: '1',
    name: 'Burger Sapi',
    price: 35000,
    category: 'Makanan Utama',
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Burger sapi dengan keju',
    is_available: true
  },
  {
    id: '2',
    name: 'Kentang Goreng',
    price: 20000,
    category: 'Makanan Pendamping',
    image_url: 'https://images.unsplash.com/photo-1576777647209-e8733d7b851d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Kentang goreng renyah',
    is_available: true
  },
  {
    id: '3',
    name: 'Es Teh',
    price: 10000,
    category: 'Minuman',
    image_url: 'https://images.unsplash.com/photo-1588310566453-8eb669be9132?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Minuman teh dingin menyegarkan',
    is_available: true
  },
  {
    id: '4',
    name: 'Pizza',
    price: 75000,
    category: 'Makanan Utama',
    image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Pizza keju dengan saus tomat',
    is_available: true
  },
  {
    id: '5',
    name: 'Es Krim',
    price: 18000,
    category: 'Makanan Penutup',
    image_url: 'https://images.unsplash.com/photo-1566454419290-57a0cb3c3429?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Es krim vanilla',
    is_available: true
  },
];

// Default inventory items if none exist
const DEFAULT_INVENTORY_ITEMS: LocalInventoryItem[] = [
  {
    id: 'inv-1',
    name: 'Daging Sapi',
    quantity: 10,
    unit: 'kg',
    cost_price: 120000,
    threshold_quantity: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'inv-2',
    name: 'Kentang',
    quantity: 20,
    unit: 'kg',
    cost_price: 15000,
    threshold_quantity: 8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'inv-3',
    name: 'Daun Teh',
    quantity: 5,
    unit: 'kg',
    cost_price: 30000,
    threshold_quantity: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Helper functions for working with localStorage
export const localStorageHelper = {
  // User related functions
  getUser: (): LocalStorageUser | null => {
    const userJson = localStorage.getItem(STORAGE_KEYS.USER);
    return userJson ? JSON.parse(userJson) : null;
  },
  
  setUser: (user: LocalStorageUser): void => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },
  
  removeUser: (): void => {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },
  
  // Menu items related functions
  getMenuItems: (): LocalMenuItem[] => {
    const itemsJson = localStorage.getItem(STORAGE_KEYS.MENU_ITEMS);
    if (!itemsJson) {
      // Initialize with default items if none exist
      localStorageHelper.setMenuItems(DEFAULT_MENU_ITEMS);
      return DEFAULT_MENU_ITEMS;
    }
    return JSON.parse(itemsJson);
  },
  
  setMenuItems: (items: LocalMenuItem[]): void => {
    localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(items));
  },
  
  addMenuItem: (item: LocalMenuItem): void => {
    const items = localStorageHelper.getMenuItems();
    items.push(item);
    localStorageHelper.setMenuItems(items);
  },
  
  updateMenuItem: (updatedItem: LocalMenuItem): void => {
    const items = localStorageHelper.getMenuItems();
    const index = items.findIndex(item => item.id === updatedItem.id);
    if (index !== -1) {
      items[index] = updatedItem;
      localStorageHelper.setMenuItems(items);
    }
  },
  
  deleteMenuItem: (id: string): void => {
    const items = localStorageHelper.getMenuItems();
    localStorageHelper.setMenuItems(items.filter(item => item.id !== id));
  },
  
  // Inventory items related functions
  getInventoryItems: (): LocalInventoryItem[] => {
    const itemsJson = localStorage.getItem(STORAGE_KEYS.INVENTORY_ITEMS);
    if (!itemsJson) {
      // Initialize with default items if none exist
      localStorageHelper.setInventoryItems(DEFAULT_INVENTORY_ITEMS);
      return DEFAULT_INVENTORY_ITEMS;
    }
    return JSON.parse(itemsJson);
  },
  
  setInventoryItems: (items: LocalInventoryItem[]): void => {
    localStorage.setItem(STORAGE_KEYS.INVENTORY_ITEMS, JSON.stringify(items));
  },
  
  addInventoryItem: (item: LocalInventoryItem): void => {
    const items = localStorageHelper.getInventoryItems();
    items.push(item);
    localStorageHelper.setInventoryItems(items);
  },
  
  updateInventoryItem: (updatedItem: LocalInventoryItem): void => {
    const items = localStorageHelper.getInventoryItems();
    const index = items.findIndex(item => item.id === updatedItem.id);
    if (index !== -1) {
      items[index] = updatedItem;
      localStorageHelper.setInventoryItems(items);
    }
  },
  
  deleteInventoryItem: (id: string): void => {
    const items = localStorageHelper.getInventoryItems();
    localStorageHelper.setInventoryItems(items.filter(item => item.id !== id));
  },
  
  // Orders related functions
  getOrders: (): LocalOrder[] => {
    const ordersJson = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return ordersJson ? JSON.parse(ordersJson) : [];
  },
  
  setOrders: (orders: LocalOrder[]): void => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  },
  
  addOrder: (order: LocalOrder): void => {
    const orders = localStorageHelper.getOrders();
    orders.push(order);
    localStorageHelper.setOrders(orders);
  },
  
  getOrderById: (id: string): LocalOrder | undefined => {
    const orders = localStorageHelper.getOrders();
    return orders.find(order => order.id === id);
  }
};
