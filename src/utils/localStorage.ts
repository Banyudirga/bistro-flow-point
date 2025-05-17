
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
  ORDERS: 'pos_orders',
};

// Default menu items if none exist
const DEFAULT_MENU_ITEMS: LocalMenuItem[] = [
  {
    id: '1',
    name: 'Burger',
    price: 9.99,
    category: 'Main Course',
    image_url: null,
    description: 'Delicious beef burger with cheese',
    is_available: true
  },
  {
    id: '2',
    name: 'Fries',
    price: 3.99,
    category: 'Side Dish',
    image_url: null,
    description: 'Crispy french fries',
    is_available: true
  },
  {
    id: '3',
    name: 'Cola',
    price: 1.99,
    category: 'Beverages',
    image_url: null,
    description: 'Refreshing cola drink',
    is_available: true
  },
  {
    id: '4',
    name: 'Pizza',
    price: 12.99,
    category: 'Main Course',
    image_url: null,
    description: 'Cheese pizza with tomato sauce',
    is_available: true
  },
  {
    id: '5',
    name: 'Ice Cream',
    price: 4.99,
    category: 'Dessert',
    image_url: null,
    description: 'Vanilla ice cream',
    is_available: true
  },
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
