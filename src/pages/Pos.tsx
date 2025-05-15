
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ShoppingCart, Printer, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

// Mock data for menu items
const CATEGORIES = [
  { id: 'foods', name: 'Foods' },
  { id: 'drinks', name: 'Drinks' },
  { id: 'desserts', name: 'Desserts' },
  { id: 'sides', name: 'Sides' },
];

const MENU_ITEMS = [
  { id: '1', name: 'Burger', price: 8.99, category: 'foods', image: 'https://via.placeholder.com/80' },
  { id: '2', name: 'Pizza', price: 12.99, category: 'foods', image: 'https://via.placeholder.com/80' },
  { id: '3', name: 'Salad', price: 7.99, category: 'foods', image: 'https://via.placeholder.com/80' },
  { id: '4', name: 'Steak', price: 18.99, category: 'foods', image: 'https://via.placeholder.com/80' },
  { id: '5', name: 'Pasta', price: 10.99, category: 'foods', image: 'https://via.placeholder.com/80' },
  { id: '6', name: 'Chicken Wings', price: 9.99, category: 'foods', image: 'https://via.placeholder.com/80' },
  { id: '7', name: 'Soda', price: 2.99, category: 'drinks', image: 'https://via.placeholder.com/80' },
  { id: '8', name: 'Juice', price: 3.99, category: 'drinks', image: 'https://via.placeholder.com/80' },
  { id: '9', name: 'Coffee', price: 3.49, category: 'drinks', image: 'https://via.placeholder.com/80' },
  { id: '10', name: 'Tea', price: 2.99, category: 'drinks', image: 'https://via.placeholder.com/80' },
  { id: '11', name: 'Cake', price: 5.99, category: 'desserts', image: 'https://via.placeholder.com/80' },
  { id: '12', name: 'Ice Cream', price: 4.99, category: 'desserts', image: 'https://via.placeholder.com/80' },
  { id: '13', name: 'French Fries', price: 3.99, category: 'sides', image: 'https://via.placeholder.com/80' },
  { id: '14', name: 'Onion Rings', price: 4.99, category: 'sides', image: 'https://via.placeholder.com/80' },
];

// Cart item type
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// Receipt type
interface Receipt {
  id: string;
  items: CartItem[];
  total: number;
  date: Date;
  paymentMethod: string;
}

const Pos = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [amountPaid, setAmountPaid] = useState("");
  const [currentReceipt, setCurrentReceipt] = useState<Receipt | null>(null);

  // Add item to cart
  const addToCart = (item: { id: string; name: string; price: number }) => {
    setCart(prev => {
      const existingItem = prev.find(i => i.id === item.id);
      if (existingItem) {
        return prev.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
    
    toast.success(`Added ${item.name} to cart`);
  };

  // Remove item from cart
  const removeFromCart = (id: string) => {
    setCart(prev => {
      const existingItem = prev.find(i => i.id === id);
      
      if (existingItem && existingItem.quantity > 1) {
        return prev.map(i => 
          i.id === id ? { ...i, quantity: i.quantity - 1 } : i
        );
      } else {
        return prev.filter(i => i.id !== id);
      }
    });
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    toast.info("Cart cleared");
  };

  // Calculate total
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Handle payment
  const handlePayment = () => {
    const total = calculateTotal();
    
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    
    const paid = parseFloat(amountPaid);
    if (paymentMethod === "cash" && (isNaN(paid) || paid < total)) {
      toast.error("Invalid amount paid");
      return;
    }
    
    const receipt: Receipt = {
      id: `R${Date.now().toString().slice(-6)}`,
      items: [...cart],
      total: total,
      date: new Date(),
      paymentMethod: paymentMethod
    };
    
    setCurrentReceipt(receipt);
    setPaymentDialogOpen(false);
    setReceiptDialogOpen(true);
    
    // In a real app, we would save the order to the database here
  };

  // Print receipt
  const printReceipt = () => {
    window.print();
    toast.success("Receipt printed");
    
    // Clear the cart after successful payment
    setCart([]);
    setCurrentReceipt(null);
    setReceiptDialogOpen(false);
    setPaymentMethod("cash");
    setAmountPaid("");
  };

  return (
    <div className="h-full flex flex-col">
      <div className="text-2xl font-bold mb-4">Point of Sale</div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Menu Section */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardContent className="p-4 h-full">
              <Tabs defaultValue="foods" className="h-full flex flex-col">
                <TabsList className="mb-4">
                  {CATEGORIES.map(category => (
                    <TabsTrigger key={category.id} value={category.id}>
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {CATEGORIES.map(category => (
                  <TabsContent 
                    key={category.id} 
                    value={category.id} 
                    className="flex-1 mt-0"
                  >
                    <ScrollArea className="h-[calc(100vh-220px)]">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-2">
                        {MENU_ITEMS.filter(item => item.category === category.id).map(item => (
                          <div 
                            key={item.id} 
                            className="border rounded-lg p-2 cursor-pointer hover:bg-gray-50 transition-colors text-center"
                            onClick={() => addToCart(item)}
                          >
                            <div className="flex justify-center mb-2">
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-20 h-20 object-cover rounded"
                              />
                            </div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-green-600">${item.price.toFixed(2)}</div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {/* Cart Section */}
        <div>
          <Card className="h-full flex flex-col">
            <CardContent className="p-4 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Current Order
                </h3>
                {cart.length > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearCart}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
              
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 text-gray-500">
                  <ShoppingCart className="h-12 w-12 mb-2" />
                  <p>Your cart is empty</p>
                  <p className="text-sm">Add items from the menu</p>
                </div>
              ) : (
                <div className="flex flex-col flex-1">
                  <ScrollArea className="flex-1">
                    <div className="space-y-2">
                      {cart.map(item => (
                        <div key={item.id} className="flex justify-between items-center p-2 border-b">
                          <div className="flex-1">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-gray-500">
                              ${item.price.toFixed(2)} x {item.quantity}
                            </div>
                          </div>
                          <div className="font-semibold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                          <div className="flex items-center ml-4">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-7 w-7"
                              onClick={() => removeFromCart(item.id)}
                            >
                              -
                            </Button>
                            <span className="mx-2">{item.quantity}</span>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-7 w-7"
                              onClick={() => addToCart(item)}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  
                  <div className="border-t pt-4 mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                    
                    <Button 
                      className="w-full mt-4" 
                      size="lg"
                      onClick={() => setPaymentDialogOpen(true)}
                    >
                      Checkout
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
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
            <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePayment}>
              Complete Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Receipt Dialog */}
      <Dialog open={receiptDialogOpen} onOpenChange={setReceiptDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Receipt</DialogTitle>
          </DialogHeader>
          
          {currentReceipt && (
            <div className="py-4">
              <div className="text-center border-b pb-2 mb-2">
                <h3 className="font-bold text-lg">Restaurant Name</h3>
                <p className="text-sm">123 Restaurant St, City</p>
                <p className="text-sm">Tel: (123) 456-7890</p>
              </div>
              
              <div className="border-b pb-2 mb-2">
                <div className="flex justify-between text-sm">
                  <span>Receipt #:</span>
                  <span>{currentReceipt.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Date:</span>
                  <span>{currentReceipt.date.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Payment Method:</span>
                  <span className="capitalize">{currentReceipt.paymentMethod}</span>
                </div>
              </div>
              
              <div className="border-b pb-2 mb-2">
                <div className="text-sm font-semibold mb-1 flex justify-between">
                  <span>Item</span>
                  <span>Total</span>
                </div>
                {currentReceipt.items.map((item, index) => (
                  <div key={index} className="text-sm flex justify-between">
                    <span>{item.quantity} x {item.name}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="font-bold flex justify-between">
                <span>Total:</span>
                <span>${currentReceipt.total.toFixed(2)}</span>
              </div>
              
              <div className="text-center mt-4 text-sm">
                <p>Thank you for your visit!</p>
                <p>Please come again</p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setReceiptDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={printReceipt}>
              <Printer className="mr-2 h-4 w-4" />
              Print Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Pos;
