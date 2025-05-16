
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Printer } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Receipt {
  id: string;
  items: CartItem[];
  total: number;
  date: Date;
  paymentMethod: string;
  orderNumber: string;
}

interface ReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receipt: Receipt | null;
  onPrintReceipt: () => void;
}

export const ReceiptDialog: React.FC<ReceiptDialogProps> = ({
  open,
  onOpenChange,
  receipt,
  onPrintReceipt
}) => {
  if (!receipt) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md print:shadow-none print:border-none">
        <DialogHeader>
          <DialogTitle>Receipt</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="text-center border-b pb-2 mb-2">
            <h3 className="font-bold text-lg">Restaurant Name</h3>
            <p className="text-sm">123 Restaurant St, City</p>
            <p className="text-sm">Tel: (123) 456-7890</p>
          </div>
          
          <div className="border-b pb-2 mb-2">
            <div className="flex justify-between text-sm">
              <span>Receipt #:</span>
              <span>{receipt.orderNumber}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Date:</span>
              <span>{receipt.date.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Payment Method:</span>
              <span className="capitalize">{receipt.paymentMethod}</span>
            </div>
          </div>
          
          <div className="border-b pb-2 mb-2">
            <div className="text-sm font-semibold mb-1 flex justify-between">
              <span>Item</span>
              <span>Total</span>
            </div>
            {receipt.items.map((item, index) => (
              <div key={index} className="text-sm flex justify-between">
                <span>{item.quantity} x {item.name}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div className="font-bold flex justify-between">
            <span>Total:</span>
            <span>${receipt.total.toFixed(2)}</span>
          </div>
          
          <div className="text-center mt-4 text-sm">
            <p>Thank you for your visit!</p>
            <p>Please come again</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={onPrintReceipt}>
            <Printer className="mr-2 h-4 w-4" />
            Print Receipt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
