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
  name: string;
  contact: string;
  lastVisitDate: string;
  lastTransactionAmount: number;
  visitCount: number;
  totalSpent: number;
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
  
  if (customers[contactKey]) {
    // Customer exists, update values
    customers[contactKey] = {
      ...customers[contactKey],
      name: customer.name,
      lastVisitDate: customer.lastVisitDate,
      lastTransactionAmount: customer.lastTransactionAmount,
      visitCount: customers[contactKey].visitCount + 1,
      totalSpent: customers[contactKey].totalSpent + customer.totalSpent
    };
  } else {
    // New customer
    customers[contactKey] = customer;
  }
  
  localStorage.setItem('pos_customers', JSON.stringify(customers));
};

// Get all customers
const getCustomers = () => {
  const customersStr = localStorage.getItem('pos_customers');
  return customersStr ? JSON.parse(customersStr) : {};
};

// Function to add an item to inventory
const addItemToInventory = (item: any) => {
    let inventory = getInventory();
    inventory.push(item);
    localStorage.setItem('pos_inventory', JSON.stringify(inventory));
};

// Function to get inventory from localStorage
const getInventory = () => {
    const inventoryString = localStorage.getItem('pos_inventory');
    return inventoryString ? JSON.parse(inventoryString) : [];
};

// Function to update an item in inventory
const updateInventoryItem = (updatedItem: any) => {
    let inventory = getInventory();
    inventory = inventory.map((item: any) => {
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
    inventory = inventory.filter((item: any) => item.id !== itemId);
    localStorage.setItem('pos_inventory', JSON.stringify(inventory));
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
  addItemToInventory,
  getInventory,
  updateInventoryItem,
  deleteInventoryItem
};
