
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { CartItem } from './useCart';

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
  const queryClient = useQueryClient();

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: async ({
      orderItems,
      total,
      paymentMethod
    }: {
      orderItems: CartItem[],
      total: number,
      paymentMethod: string
    }) => {
      // Generate order number (prefix with current date + sequential number)
      const orderNumber = `R${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${Math.floor(Math.random() * 1000)}`;
      
      // 1. Create the order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            order_number: orderNumber,
            total_amount: total,
            payment_method: paymentMethod,
            status: 'completed',
            cashier_id: userId
          }
        ])
        .select()
        .single();
        
      if (orderError) throw orderError;
      
      // 2. Create the order items
      const orderItemsToInsert = orderItems.map(item => ({
        order_id: orderData.id,
        menu_item_id: item.id,
        quantity: item.quantity,
        unit_price: item.price
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsToInsert);
        
      if (itemsError) throw itemsError;
      
      return {
        ...orderData,
        items: orderItems,
        date: new Date(),
        paymentMethod: paymentMethod,
        total: total,
        orderNumber: orderNumber
      };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['receipts'] });
      setCurrentReceipt({
        id: data.id,
        items: data.items,
        total: data.total,
        date: new Date(),
        paymentMethod: data.paymentMethod,
        orderNumber: data.orderNumber
      });
      setReceiptDialogOpen(true);
    },
    onError: (error) => {
      toast.error(`Failed to create order: ${(error as Error).message}`);
      setPaymentDialogOpen(false);
    }
  });

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
