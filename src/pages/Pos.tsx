
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
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Define menu item and cart item types
interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image_url: string | null;
  description: string | null;
  is_available: boolean | null;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// Receipt interface
interface Receipt {
  id: string;
  items: CartItem[];
  total: number;
  date: Date;
  paymentMethod: string;
  orderNumber: string;
}

const Pos = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [amountPaid, setAmountPaid] = useState("");
  const [currentReceipt, setCurrentReceipt] = useState<Receipt | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch menu items from Supabase
  const { data: menuItems, isLoading } = useQuery({
    queryKey: ['menuItems'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('name');
        
      if (error) throw error;
      
      // Extract unique categories
      const uniqueCategories = Array.from(new Set((data as MenuItem[]).map(item => item.category)));
      setCategories(uniqueCategories);
      
      return data as MenuItem[];
    }
  });

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
            cashier_id: user?.id
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
        items: cart,
        total: calculateTotal(),
        date: new Date(),
        paymentMethod: paymentMethod,
        orderNumber: data.orderNumber
      });
      setReceiptDialogOpen(true);
    },
    onError: (error) => {
      toast.error(`Failed to create order: ${(error as Error).message}`);
      setPaymentDialogOpen(false);
    }
  });

  // Add item to cart
  const addToCart = (item: MenuItem) => {
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
    
    createOrderMutation.mutate({
      orderItems: cart,
      total,
      paymentMethod
    });
    
    setPaymentDialogOpen(false);
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

  // Check if user is authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="text-2xl font-bold mb-4">Point of Sale</div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Menu Section */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardContent className="p-4 h-full">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  Loading menu items...
                </div>
              ) : menuItems && menuItems.length > 0 ? (
                <Tabs defaultValue={categories[0] || "foods"} className="h-full flex flex-col">
                  <TabsList className="mb-4">
                    {categories.map(category => (
                      <TabsTrigger key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {categories.map(category => (
                    <TabsContent 
                      key={category} 
                      value={category} 
                      className="flex-1 mt-0"
                    >
                      <ScrollArea className="h-[calc(100vh-220px)]">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-2">
                          {menuItems
                            .filter(item => item.category === category && item.is_available !== false)
                            .map(item => (
                              <div 
                                key={item.id} 
                                className="border rounded-lg p-2 cursor-pointer hover:bg-gray-50 transition-colors text-center"
                                onClick={() => addToCart(item)}
                              >
                                <div className="flex justify-center mb-2">
                                  <img 
                                    src={item.image_url || 'https://via.placeholder.com/80'} 
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
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <p>No menu items found.</p>
                  <p className="text-sm">Add menu items in the inventory page.</p>
                </div>
              )}
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
        <DialogContent className="sm:max-w-md print:shadow-none print:border-none">
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
                  <span>{currentReceipt.orderNumber}</span>
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
