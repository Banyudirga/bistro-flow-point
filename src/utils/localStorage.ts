
import { toast } from "@/components/ui/sonner";

export interface LocalStorageUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
}

export interface LocalOrder {
  id: string;
  orderNumber: string;
  items: any[];
  total: number;
  date: string;
  paymentMethod: string;
  cashierId: string;
  customerName?: string;  // Added customer fields
  customerContact?: string;
}

export interface LocalCustomer {
  id: string;
  name: string;
  contact: string;
  lastVisitDate: string;
  lastTransactionAmount: number;
  visitCount: number;
  totalSpent: number;
  notes?: string; // Added notes field
}

export interface LocalInventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  costPrice?: number;
  thresholdQuantity?: number;
  createdAt: string;
  updatedAt: string;
}

export interface LocalMenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image_url: string | null;
  description: string | null;
  is_available: boolean;
  ingredients?: Array<{
    inventoryId: string;
    amount: number;
    unit: string;
  }>;
}

// Function to set user data in localStorage
const setUser = (user: LocalStorageUser) => {
  localStorage.setItem('pos_user', JSON.stringify(user));
};

// Function to get user data from localStorage
const getUser = (): LocalStorageUser | null => {
  const userStr = localStorage.getItem('pos_user');
  return userStr ? JSON.parse(userStr) : null;
};

// Function to remove user data from localStorage (logout)
const removeUser = () => {
  localStorage.removeItem('pos_user');
};

// Function to add an order to localStorage
const addOrder = (order: LocalOrder) => {
  let orders = getOrders();
  orders.push(order);
  localStorage.setItem('pos_orders', JSON.stringify(orders));
};

// Function to get all orders from localStorage
const getOrders = (): LocalOrder[] => {
  const ordersStr = localStorage.getItem('pos_orders');
  return ordersStr ? JSON.parse(ordersStr) : [];
};

// Function to clear all orders from localStorage (e.g., after a shift)
const clearOrders = () => {
  localStorage.removeItem('pos_orders');
};

// Add or update a customer in localStorage
const updateCustomer = (customer: LocalCustomer) => {
  // Get existing customers
  const customersStr = localStorage.getItem('pos_customers');
  const customers: Record<string, LocalCustomer> = customersStr ? JSON.parse(customersStr) : {};
  
  // Use contact as key since it should be unique
  const contactKey = customer.contact;
  const customerId = customer.id || `customer-${Date.now()}`;
  
  if (customers[contactKey]) {
    // Customer exists, update values
    customers[contactKey] = {
      ...customers[contactKey],
      id: customerId,
      name: customer.name,
      lastVisitDate: customer.lastVisitDate,
      lastTransactionAmount: customer.lastTransactionAmount,
      visitCount: customers[contactKey].visitCount + 1,
      totalSpent: customers[contactKey].totalSpent + customer.totalSpent,
      notes: customer.notes
    };
  } else {
    // New customer
    customers[contactKey] = {
      ...customer,
      id: customerId
    };
  }
  
  localStorage.setItem('pos_customers', JSON.stringify(customers));
};

// Delete a customer by ID
const deleteCustomer = (id: string) => {
  const customersStr = localStorage.getItem('pos_customers');
  if (!customersStr) return;
  
  const customers: Record<string, LocalCustomer> = JSON.parse(customersStr);
  
  // Find and delete the customer with matching ID
  Object.keys(customers).forEach(key => {
    if (customers[key].id === id) {
      delete customers[key];
    }
  });
  
  localStorage.setItem('pos_customers', JSON.stringify(customers));
};

// Get all customers
const getCustomers = (): LocalCustomer[] => {
  const customersStr = localStorage.getItem('pos_customers');
  const customersObj = customersStr ? JSON.parse(customersStr) : {};
  
  // Convert object to array for easier use in components
  return Object.values(customersObj);
};

// Function to add an item to inventory
const addItemToInventory = (item: LocalInventoryItem) => {
  let inventory = getInventory();
  inventory.push(item);
  localStorage.setItem('pos_inventory', JSON.stringify(inventory));
};

// Function to get inventory from localStorage
const getInventory = (): LocalInventoryItem[] => {
  const inventoryString = localStorage.getItem('pos_inventory');
  return inventoryString ? JSON.parse(inventoryString) : [];
};

// Function to update an item in inventory
const updateInventoryItem = (updatedItem: LocalInventoryItem) => {
  let inventory = getInventory();
  inventory = inventory.map((item: LocalInventoryItem) => {
    if (item.id === updatedItem.id) {
      return updatedItem;
    }
    return item;
  });
  localStorage.setItem('pos_inventory', JSON.stringify(inventory));
};

// Function to delete an item from inventory
const deleteInventoryItem = (itemId: string) => {
  let inventory = getInventory();
  inventory = inventory.filter((item: LocalInventoryItem) => item.id !== itemId);
  localStorage.setItem('pos_inventory', JSON.stringify(inventory));
};

// Get inventory items with proper typing
const getInventoryItems = (): LocalInventoryItem[] => {
  return getInventory();
};

// Menu items functions
const addMenuItem = (menuItem: LocalMenuItem) => {
  const menuItems = getMenuItems();
  menuItems.push(menuItem);
  localStorage.setItem('pos_menu_items', JSON.stringify(menuItems));
};

const getMenuItems = (): LocalMenuItem[] => {
  const menuItemsStr = localStorage.getItem('pos_menu_items');
  return menuItemsStr ? JSON.parse(menuItemsStr) : [];
};

const updateMenuItem = (updatedItem: LocalMenuItem) => {
  let menuItems = getMenuItems();
  menuItems = menuItems.map(item => {
    if (item.id === updatedItem.id) {
      return updatedItem;
    }
    return item;
  });
  localStorage.setItem('pos_menu_items', JSON.stringify(menuItems));
};

const deleteMenuItem = (itemId: string) => {
  let menuItems = getMenuItems();
  menuItems = menuItems.filter(item => item.id !== itemId);
  localStorage.setItem('pos_menu_items', JSON.stringify(menuItems));
};

export const localStorageHelper = {
  setUser,
  getUser,
  removeUser,
  addOrder,
  getOrders,
  clearOrders,
  updateCustomer,
  getCustomers,
  deleteCustomer,
  addItemToInventory,
  getInventory,
  updateInventoryItem,
  deleteInventoryItem,
  getInventoryItems,
  addMenuItem,
  getMenuItems,
  updateMenuItem,
  deleteMenuItem
};
