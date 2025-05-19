
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

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
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amountPaid, setAmountPaid] = useState('');

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  // No tax calculation
  
  const changeAmount = parseFloat(amountPaid) - totalAmount;
  const showChange = paymentMethod === 'cash' && !isNaN(changeAmount) && changeAmount >= 0;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCompletePayment(paymentMethod, amountPaid);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pembayaran</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="mb-2">
              <div className="text-lg">Total: <span className="font-bold">Rp{totalAmount.toLocaleString('id-ID')}</span></div>
            </div>
            
            <div className="grid gap-2">
              <Label>Metode Pembayaran</Label>
              <RadioGroup 
                defaultValue={paymentMethod} 
                onValueChange={setPaymentMethod} 
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash">Tunai</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card">Kartu</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="qris" id="qris" />
                  <Label htmlFor="qris">QRIS</Label>
                </div>
              </RadioGroup>
            </div>
            
            {paymentMethod === 'cash' && (
              <div className="grid gap-2">
                <Label htmlFor="amount">Jumlah Tunai</Label>
                <Input
                  id="amount"
                  type="number"
                  min={totalAmount}
                  placeholder="Masukkan jumlah tunai"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                />
                
                {showChange && (
                  <div className="text-sm mt-1">
                    Kembalian: <span className="font-semibold">Rp{changeAmount.toLocaleString('id-ID')}</span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit">
              Selesaikan Pembayaran
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
