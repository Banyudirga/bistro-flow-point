import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/auth';
import { Navigate } from 'react-router-dom';

// Import custom hooks
import { useMenuItems } from '@/hooks/useMenuItems';
import { useCart } from '@/hooks/useCart';
import { useOrderManagement } from '@/hooks/useOrderManagement';

// Import components
import { MenuCategories } from '@/components/pos/MenuCategories';
import { Cart } from '@/components/pos/Cart';
import { PaymentDialog } from '@/components/pos/PaymentDialog';
import { ReceiptDialog } from '@/components/pos/ReceiptDialog';

const Pos = () => {
  const { user } = useAuth();
  const { menuItems, categories, isLoading } = useMenuItems();
  const { cart, addToCart, removeFromCart, clearCart, calculateTotal } = useCart();
  const { 
    paymentDialogOpen, 
    setPaymentDialogOpen,
    receiptDialogOpen, 
    setReceiptDialogOpen,
    currentReceipt,
    createOrderMutation
  } = useOrderManagement(user?.id);

  // Handle payment
  const handlePayment = (paymentMethod: string, amountPaid: string) => {
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
    clearCart();
    setReceiptDialogOpen(false);
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
                <MenuCategories 
                  categories={categories}
                  menuItems={menuItems}
                  onSelectItem={addToCart}
                />
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
              <Cart 
                items={cart}
                onClearCart={clearCart}
                onRemoveItem={removeFromCart}
                onAddItem={(id) => {
                  const menuItem = menuItems?.find(mi => mi.id === id);
                  if (menuItem) {
                    addToCart(menuItem);
                  }
                }}
                onCheckout={() => setPaymentDialogOpen(true)}
              />
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Payment Dialog */}
      <PaymentDialog 
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        cart={cart}
        onCompletePayment={handlePayment}
      />
      
      {/* Receipt Dialog */}
      <ReceiptDialog 
        open={receiptDialogOpen}
        onOpenChange={setReceiptDialogOpen}
        receipt={currentReceipt}
        onPrintReceipt={printReceipt}
      />
    </div>
  );
};

export default Pos;
