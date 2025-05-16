
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileText, Search, Printer } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

// Define receipt and order item types
interface OrderItem {
  id: string;
  menu_item: {
    name: string;
  };
  quantity: number;
  unit_price: number;
  notes: string | null;
}

// Updated Receipt interface to make nullable types explicit
interface Receipt {
  id: string;
  order_number: string;
  total_amount: number;
  payment_method: string;
  created_at: string;
  customer_name: string | null;
  status: string;
  cashier: {
    first_name: string | null;
    last_name: string | null;
  } | null;
  items: OrderItem[];
}

const Receipts = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Fetch receipts with order items
  const { data: receipts, isLoading, error } = useQuery({
    queryKey: ['receipts'],
    queryFn: async () => {
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id, 
          order_number, 
          total_amount, 
          payment_method, 
          created_at, 
          customer_name,
          status,
          cashier:profiles(first_name, last_name)
        `)
        .order('created_at', { ascending: false });
      
      if (ordersError) throw ordersError;
      
      // For each order, fetch its items
      const receiptsWithItems = await Promise.all(
        orders.map(async (order) => {
          const { data: items, error: itemsError } = await supabase
            .from('order_items')
            .select(`
              id,
              quantity,
              unit_price,
              notes,
              menu_item:menu_items(name)
            `)
            .eq('order_id', order.id);
            
          if (itemsError) throw itemsError;
          
          // Explicitly handle the type structure to match Receipt interface
          return {
            ...order,
            items: items || [],
            // Ensure cashier is correctly handled with proper type structure
            cashier: order.cashier && !('error' in order.cashier) 
              ? order.cashier 
              : null
          } as Receipt;
        })
      );
      
      return receiptsWithItems;
    }
  });
  
  // Filter receipts based on search query
  const filteredReceipts = receipts?.filter(receipt => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      receipt.order_number.toLowerCase().includes(query) ||
      (receipt.customer_name && receipt.customer_name.toLowerCase().includes(query)) ||
      (receipt.cashier?.first_name && receipt.cashier.first_name.toLowerCase().includes(query)) ||
      (receipt.cashier?.last_name && receipt.cashier.last_name.toLowerCase().includes(query))
    );
  });
  
  // View receipt details
  const handleViewReceipt = (receipt: Receipt) => {
    setSelectedReceipt(receipt);
    setIsDialogOpen(true);
  };
  
  // Print receipt
  const handlePrintReceipt = () => {
    window.print();
    toast.success('Receipt printed');
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy h:mm a');
    } catch (error) {
      return dateString;
    }
  };
  
  // Check if user is authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Receipt History</h1>
        
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search receipts..."
            className="pl-8 w-full sm:w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-8">Loading receipts...</div>
      ) : error ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-red-500">
              Error loading receipts: {(error as Error).message}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>All Receipts</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Receipt #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Cashier</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReceipts && filteredReceipts.length > 0 ? (
                  filteredReceipts.map(receipt => (
                    <TableRow key={receipt.id}>
                      <TableCell className="font-medium">{receipt.order_number}</TableCell>
                      <TableCell>{formatDate(receipt.created_at)}</TableCell>
                      <TableCell>${receipt.total_amount.toFixed(2)}</TableCell>
                      <TableCell className="capitalize">{receipt.payment_method || 'N/A'}</TableCell>
                      <TableCell>{receipt.customer_name || 'Guest'}</TableCell>
                      <TableCell>
                        <span 
                          className={`px-2 py-1 text-xs rounded-md ${
                            receipt.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : receipt.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {receipt.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {receipt.cashier
                          ? `${receipt.cashier.first_name || ''} ${receipt.cashier.last_name || ''}`
                          : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleViewReceipt(receipt)}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6">
                      {searchQuery 
                        ? 'No receipts found matching your search.' 
                        : 'No receipts found.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      
      {/* Receipt Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md print:shadow-none print:border-none">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Receipt Details</span>
              <Button
                variant="outline"
                size="sm"
                className="print:hidden"
                onClick={handlePrintReceipt}
              >
                <Printer className="h-4 w-4 mr-1" />
                Print
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          {selectedReceipt && (
            <div className="py-4">
              <div className="text-center border-b pb-2 mb-2">
                <h3 className="font-bold text-lg">Restaurant Name</h3>
                <p className="text-sm">123 Restaurant St, City</p>
                <p className="text-sm">Tel: (123) 456-7890</p>
              </div>
              
              <div className="border-b pb-2 mb-2">
                <div className="flex justify-between text-sm">
                  <span>Receipt #:</span>
                  <span>{selectedReceipt.order_number}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Date:</span>
                  <span>{formatDate(selectedReceipt.created_at)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Cashier:</span>
                  <span>
                    {selectedReceipt.cashier
                      ? `${selectedReceipt.cashier.first_name || ''} ${selectedReceipt.cashier.last_name || ''}`
                      : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Customer:</span>
                  <span>{selectedReceipt.customer_name || 'Guest'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Payment Method:</span>
                  <span className="capitalize">{selectedReceipt.payment_method || 'N/A'}</span>
                </div>
              </div>
              
              <div className="border-b pb-2 mb-2">
                <div className="text-sm font-semibold mb-1 flex justify-between">
                  <span>Item</span>
                  <span>Total</span>
                </div>
                {selectedReceipt.items.map((item, index) => (
                  <div key={index} className="text-sm flex justify-between">
                    <span>{item.quantity} x {item.menu_item.name}</span>
                    <span>${(item.unit_price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="font-bold flex justify-between">
                <span>Total:</span>
                <span>${selectedReceipt.total_amount.toFixed(2)}</span>
              </div>
              
              <div className="text-center mt-4 text-sm">
                <p>Thank you for your visit!</p>
                <p>Please come again</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Receipts;
