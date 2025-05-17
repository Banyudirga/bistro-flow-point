
import { useState } from 'react';
import { toast } from '@/components/ui/sonner';
import { CartItem } from './useCart';
import { localStorageHelper } from '@/utils/localStorage';

export interface Receipt {
  id: string;
  items: CartItem[];
  total: number;
  date: Date;
  paymentMethod: string;
  orderNumber: string;
}

export const useOrderManagement = (userId: string | undefined) => {
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState<Receipt | null>(null);

  // Create order mutation
  const createOrderMutation = {
    mutate: async ({
      orderItems,
      total,
      paymentMethod
    }: {
      orderItems: CartItem[],
      total: number,
      paymentMethod: string
    }) => {
      try {
        // Generate order number (prefix with current date + sequential number)
        const orderNumber = `R${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${Math.floor(Math.random() * 1000)}`;
        
        const orderId = `order-${Date.now()}`;
        
        // Create the order in localStorage
        localStorageHelper.addOrder({
          id: orderId,
          orderNumber,
          items: orderItems,
          total,
          date: new Date().toISOString(),
          paymentMethod,
          cashierId: userId || 'unknown'
        });
        
        const receipt = {
          id: orderId,
          items: orderItems,
          total,
          date: new Date(),
          paymentMethod,
          orderNumber
        };
        
        setCurrentReceipt(receipt);
        setReceiptDialogOpen(true);
        
        toast.success('Order created successfully');
        return receipt;
      } catch (error) {
        toast.error(`Failed to create order: ${(error as Error).message}`);
        setPaymentDialogOpen(false);
        throw error;
      }
    },
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
    reset: () => {}
  };

  return {
    paymentDialogOpen,
    setPaymentDialogOpen,
    receiptDialogOpen,
    setReceiptDialogOpen,
    currentReceipt,
    setCurrentReceipt,
    createOrderMutation
  };
};
