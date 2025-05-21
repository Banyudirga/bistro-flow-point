
// Define types for our local storage data
import { UserRole } from '@/contexts/auth/types';
export interface LocalStorageUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: UserRole;
}

export interface MenuIngredient {
  inventoryId: string;
  amount: number;
  unit?: string; // Added unit field for ingredients
}

export interface LocalMenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image_url: string | null;
  description: string | null;
  is_available: boolean;
  ingredients?: MenuIngredient[];
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
  customerName?: string;
  customerContact?: string;
}

// Add the unit conversion import
import { convertUnit, normalizeUnit } from './unitConversion';

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
    is_available: true,
    ingredients: [
      { inventoryId: 'inv-1', amount: 0.2 },
      { inventoryId: 'inv-4', amount: 2 }
    ]
  },
  {
    id: '2',
    name: 'Kentang Goreng',
    price: 20000,
    category: 'Makanan Pendamping',
    image_url: 'https://images.unsplash.com/photo-1576777647209-e8733d7b851d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Kentang goreng renyah',
    is_available: true,
    ingredients: [
      { inventoryId: 'inv-2', amount: 0.3 }
    ]
  },
  {
    id: '3',
    name: 'Es Teh',
    price: 10000,
    category: 'Minuman',
    image_url: 'https://images.unsplash.com/photo-1588310566453-8eb669be9132?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Minuman teh dingin menyegarkan',
    is_available: true,
    ingredients: [
      { inventoryId: 'inv-3', amount: 0.03 }
    ]
  },
  {
    id: '4',
    name: 'Pizza',
    price: 75000,
    category: 'Makanan Utama',
    image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Pizza keju dengan saus tomat',
    is_available: true,
    ingredients: [
      { inventoryId: 'inv-1', amount: 0.1 },
      { inventoryId: 'inv-4', amount: 3 }
    ]
  },
  {
    id: '5',
    name: 'Es Krim',
    price: 18000,
    category: 'Makanan Penutup',
    image_url: 'https://images.unsplash.com/photo-1566454419290-57a0cb3c3429?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Es krim vanilla',
    is_available: true,
    ingredients: [
      { inventoryId: 'inv-5', amount: 0.15 }
    ]
  },
  {
    id: '6',
    name: 'Nasi Goreng Spesial',
    price: 32000,
    category: 'Makanan Utama',
    image_url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Nasi goreng dengan telur dan ayam',
    is_available: true,
    ingredients: [
      { inventoryId: 'inv-6', amount: 0.25 },
      { inventoryId: 'inv-7', amount: 1 }
    ]
  },
  {
    id: '7',
    name: 'Mie Goreng',
    price: 28000,
    category: 'Makanan Utama',
    image_url: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Mie goreng dengan sayuran dan telur',
    is_available: true,
    ingredients: [
      { inventoryId: 'inv-8', amount: 0.2 },
      { inventoryId: 'inv-7', amount: 1 }
    ]
  },
  {
    id: '8',
    name: 'Sate Ayam',
    price: 30000,
    category: 'Makanan Utama',
    image_url: 'https://images.unsplash.com/photo-1529563021893-ea8facb87368?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Sate ayam dengan bumbu kacang',
    is_available: true,
    ingredients: [
      { inventoryId: 'inv-6', amount: 0.2 },
      { inventoryId: 'inv-9', amount: 0.1 }
    ]
  },
  {
    id: '9',
    name: 'Es Jeruk',
    price: 12000,
    category: 'Minuman',
    image_url: 'https://images.unsplash.com/photo-1570599299189-8baa2e8732a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Minuman jeruk segar',
    is_available: true,
    ingredients: [
      { inventoryId: 'inv-10', amount: 0.3 }
    ]
  },
  {
    id: '10',
    name: 'Kopi',
    price: 15000,
    category: 'Minuman',
    image_url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Kopi hitam',
    is_available: true,
    ingredients: [
      { inventoryId: 'inv-11', amount: 0.02 }
    ]
  },
  {
    id: '11',
    name: 'Nugget Ayam',
    price: 22000,
    category: 'Makanan Pendamping',
    image_url: 'https://images.unsplash.com/photo-1562967915-92ae0c320a01?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Nugget ayam dengan saus',
    is_available: true,
    ingredients: [
      { inventoryId: 'inv-6', amount: 0.15 }
    ]
  },
  {
    id: '12',
    name: 'Salad Buah',
    price: 25000,
    category: 'Makanan Penutup',
    image_url: 'https://images.unsplash.com/photo-1564093497595-593b96d80180?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Salad buah segar dengan yogurt',
    is_available: true,
    ingredients: [
      { inventoryId: 'inv-12', amount: 0.3 },
      { inventoryId: 'inv-13', amount: 0.2 }
    ]
  },
  {
    id: '13',
    name: 'Puding',
    price: 15000,
    category: 'Makanan Penutup',
    image_url: 'https://images.unsplash.com/photo-1516715094483-75da7dee9758?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Puding coklat dengan vla',
    is_available: true,
    ingredients: [
      { inventoryId: 'inv-5', amount: 0.1 },
      { inventoryId: 'inv-14', amount: 0.05 }
    ]
  },
  {
    id: '14',
    name: 'Pisang Goreng',
    price: 18000,
    category: 'Makanan Penutup',
    image_url: 'https://images.unsplash.com/photo-1581969901161-14425e8b0336?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Pisang goreng dengan topping keju',
    is_available: true,
    ingredients: [
      { inventoryId: 'inv-15', amount: 0.3 },
      { inventoryId: 'inv-4', amount: 0.1 }
    ]
  },
  {
    id: '15',
    name: 'Teh Botol',
    price: 8000,
    category: 'Minuman',
    image_url: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Teh botol dingin',
    is_available: true,
    ingredients: [
      { inventoryId: 'inv-16', amount: 1 }
    ]
  },
  {
    id: '16',
    name: 'Sosis Bakar',
    price: 15000,
    category: 'Makanan Pendamping',
    image_url: 'https://images.unsplash.com/photo-1527324688151-0e627063f2b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Sosis bakar dengan saus',
    is_available: true,
    ingredients: [
      { inventoryId: 'inv-17', amount: 2 }
    ]
  },
  {
    id: '17',
    name: 'Roti Bakar',
    price: 18000,
    category: 'Makanan Pendamping',
    image_url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80',
    description: 'Roti bakar dengan selai pilihan',
    is_available: true,
    ingredients: [
      { inventoryId: 'inv-18', amount: 2 },
      { inventoryId: 'inv-19', amount: 0.05 }
    ]
  }
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
  },
  {
    id: 'inv-4',
    name: 'Keju',
    quantity: 8,
    unit: 'kg',
    cost_price: 80000,
    threshold_quantity: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'inv-5',
    name: 'Susu',
    quantity: 15,
    unit: 'liter',
    cost_price: 18000,
    threshold_quantity: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'inv-6',
    name: 'Ayam',
    quantity: 25,
    unit: 'kg',
    cost_price: 35000,
    threshold_quantity: 10,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'inv-7',
    name: 'Telur',
    quantity: 100,
    unit: 'butir',
    cost_price: 2000,
    threshold_quantity: 30,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'inv-8',
    name: 'Mie',
    quantity: 30,
    unit: 'kg',
    cost_price: 15000,
    threshold_quantity: 10,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'inv-9',
    name: 'Kacang Tanah',
    quantity: 12,
    unit: 'kg',
    cost_price: 25000,
    threshold_quantity: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'inv-10',
    name: 'Jeruk',
    quantity: 15,
    unit: 'kg',
    cost_price: 18000,
    threshold_quantity: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'inv-11',
    name: 'Kopi',
    quantity: 10,
    unit: 'kg',
    cost_price: 150000,
    threshold_quantity: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'inv-12',
    name: 'Buah Campuran',
    quantity: 15,
    unit: 'kg',
    cost_price: 25000,
    threshold_quantity: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'inv-13',
    name: 'Yogurt',
    quantity: 10,
    unit: 'liter',
    cost_price: 30000,
    threshold_quantity: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'inv-14',
    name: 'Coklat',
    quantity: 5,
    unit: 'kg',
    cost_price: 80000,
    threshold_quantity: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'inv-15',
    name: 'Pisang',
    quantity: 20,
    unit: 'kg',
    cost_price: 15000,
    threshold_quantity: 8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'inv-16',
    name: 'Teh Botol',
    quantity: 50,
    unit: 'botol',
    cost_price: 5000,
    threshold_quantity: 20,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'inv-17',
    name: 'Sosis',
    quantity: 40,
    unit: 'buah',
    cost_price: 2500,
    threshold_quantity: 15,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'inv-18',
    name: 'Roti',
    quantity: 30,
    unit: 'lembar',
    cost_price: 3000,
    threshold_quantity: 10,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'inv-19',
    name: 'Selai',
    quantity: 5,
    unit: 'kg',
    cost_price: 45000,
    threshold_quantity: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Define the Customer interface
export interface Customer {
  id: string;
  name: string;
  contact: string;
  visitCount: number;
  lastVisitDate: string;
  lastTransactionAmount: number;
  totalSpent: number;
  notes?: string;
}

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
    
    // Reduce inventory based on menu items in the order
    localStorageHelper.reduceInventoryFromOrder(order);
  },
  
  getOrderById: (id: string): LocalOrder | undefined => {
    const orders = localStorageHelper.getOrders();
    return orders.find(order => order.id === id);
  },
  
  // Function to reduce inventory based on order
  reduceInventoryFromOrder: (order: LocalOrder): void => {
    const menuItems = localStorageHelper.getMenuItems();
    const inventoryItems = localStorageHelper.getInventoryItems();
    
    // For each item in the order
    order.items.forEach(orderItem => {
      // Find the menu item
      const menuItem = menuItems.find(menu => menu.id === orderItem.id);
      
      // If menu item exists and has ingredients
      if (menuItem && menuItem.ingredients && menuItem.ingredients.length > 0) {
        menuItem.ingredients.forEach(ingredient => {
          // Find the inventory item
          const inventoryIndex = inventoryItems.findIndex(inv => inv.id === ingredient.inventoryId);
          
          if (inventoryIndex !== -1) {
            const inventoryItem = inventoryItems[inventoryIndex];
            let reduceAmount = ingredient.amount * orderItem.quantity;
            
            // Apply unit conversion if needed
            if (ingredient.unit && inventoryItem.unit) {
              const normalizedIngredientUnit = normalizeUnit(ingredient.unit);
              const normalizedInventoryUnit = normalizeUnit(inventoryItem.unit);
              
              // If units are different, try to convert
              if (normalizedIngredientUnit !== normalizedInventoryUnit) {
                const convertedAmount = convertUnit(
                  reduceAmount,
                  normalizedIngredientUnit,
                  normalizedInventoryUnit
                );
                
                if (convertedAmount !== null) {
                  reduceAmount = convertedAmount;
                  console.log(`Converted ${ingredient.amount} ${ingredient.unit} to ${reduceAmount} ${inventoryItem.unit}`);
                } else {
                  console.error(`Failed to convert ${ingredient.amount} ${ingredient.unit} to ${inventoryItem.unit} for ${menuItem.name}`);
                }
              }
            }
            
            // Update inventory quantity
            inventoryItems[inventoryIndex].quantity = Math.max(0, inventoryItems[inventoryIndex].quantity - reduceAmount);
            inventoryItems[inventoryIndex].updated_at = new Date().toISOString();
            
            console.log(`Reduced ${reduceAmount} ${inventoryItems[inventoryIndex].unit} of ${inventoryItems[inventoryIndex].name} from inventory`);
          }
        });
      }
    });
    
    // Save updated inventory
    localStorageHelper.setInventoryItems(inventoryItems);
  },
  
  // Customer management
  getCustomers(): Customer[] {
    try {
      const customers = localStorage.getItem('customers');
      return customers ? JSON.parse(customers) : [];
    } catch (error) {
      console.error('Error getting customers:', error);
      return [];
    }
  },

  getCustomerByContact(contact: string): Customer | undefined {
    try {
      const customers = this.getCustomers();
      return customers.find(customer => customer.contact === contact);
    } catch (error) {
      console.error('Error getting customer by contact:', error);
      return undefined;
    }
  },

  updateCustomer(customerData: {
    name: string;
    contact: string;
    lastVisitDate: string;
    lastTransactionAmount: number;
    visitCount: number;
    totalSpent: number;
    notes?: string;
  }): void {
    try {
      const customers = this.getCustomers();
      const existingCustomerIndex = customers.findIndex(c => c.contact === customerData.contact);
      
      if (existingCustomerIndex !== -1) {
        // Update existing customer
        const existingCustomer = customers[existingCustomerIndex];
        customers[existingCustomerIndex] = {
          ...existingCustomer,
          name: customerData.name,
          lastVisitDate: customerData.lastVisitDate,
          lastTransactionAmount: customerData.lastTransactionAmount,
          visitCount: existingCustomer.visitCount + 1,
          totalSpent: existingCustomer.totalSpent + customerData.totalSpent,
          notes: customerData.notes || existingCustomer.notes
        };
      } else {
        // Add new customer
        customers.push({
          id: `customer-${Date.now()}`,
          name: customerData.name,
          contact: customerData.contact,
          lastVisitDate: customerData.lastVisitDate,
          lastTransactionAmount: customerData.lastTransactionAmount,
          visitCount: customerData.visitCount,
          totalSpent: customerData.totalSpent,
          notes: customerData.notes
        });
      }
      
      localStorage.setItem('customers', JSON.stringify(customers));
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  },

  deleteCustomer(id: string): void {
    try {
      const customers = this.getCustomers();
      const updatedCustomers = customers.filter(customer => customer.id !== id);
      localStorage.setItem('customers', JSON.stringify(updatedCustomers));
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  }
};
