
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cart: CartItem[];
  onCompletePayment: (paymentMethod: string, amountPaid: string) => void;
}

export const PaymentDialog: React.FC<PaymentDialogProps> = ({
  open,
  onOpenChange,
  cart,
  onCompletePayment
}) => {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [amountPaid, setAmountPaid] = useState("");

  // Calculate total
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handlePayment = () => {
    onCompletePayment(paymentMethod, amountPaid);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-4">
            <div className="font-medium mb-2">Payment Method</div>
            <div className="flex space-x-2">
              <Button 
                variant={paymentMethod === "cash" ? "default" : "outline"} 
                onClick={() => setPaymentMethod("cash")}
              >
                Cash
              </Button>
              <Button 
                variant={paymentMethod === "card" ? "default" : "outline"} 
                onClick={() => setPaymentMethod("card")}
              >
                Card
              </Button>
            </div>
          </div>
          
          <div className="font-medium mb-2">Order Summary</div>
          <div className="mb-4 border rounded-md p-3 bg-gray-50">
            <div className="flex justify-between mb-2">
              <span>Items:</span>
              <span>{cart.reduce((total, item) => total + item.quantity, 0)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
          
          {paymentMethod === "cash" && (
            <div className="mb-4">
              <Label htmlFor="amount">Amount Paid</Label>
              <Input 
                id="amount" 
                type="number" 
                min={calculateTotal()} 
                step="0.01"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                placeholder="Enter amount"
                className="mt-1"
              />
              
              {amountPaid && !isNaN(parseFloat(amountPaid)) && parseFloat(amountPaid) >= calculateTotal() && (
                <div className="mt-2 text-right">
                  <div className="text-sm">Change:</div>
                  <div className="font-medium">${(parseFloat(amountPaid) - calculateTotal()).toFixed(2)}</div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handlePayment}>
            Complete Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
