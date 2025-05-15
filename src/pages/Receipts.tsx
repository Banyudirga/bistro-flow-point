
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { FileText, Search, Printer } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

// Types for receipt data
interface ReceiptItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Receipt {
  id: string;
  items: ReceiptItem[];
  total: number;
  date: string;
  time: string;
  paymentMethod: string;
  cashier: string;
}

// Mock receipt data
const MOCK_RECEIPTS: Receipt[] = [
  {
    id: 'R123456',
    items: [
      { id: '1', name: 'Burger', price: 8.99, quantity: 2 },
      { id: '7', name: 'Soda', price: 2.99, quantity: 2 }
    ],
    total: 23.96,
    date: '2023-05-15',
    time: '12:30 PM',
    paymentMethod: 'cash',
    cashier: 'Bob Cashier'
  },
  {
    id: 'R123457',
    items: [
      { id: '2', name: 'Pizza', price: 12.99, quantity: 1 },
      { id: '8', name: 'Juice', price: 3.99, quantity: 1 }
    ],
    total: 16.98,
    date: '2023-05-15',
    time: '01:15 PM',
    paymentMethod: 'card',
    cashier: 'Bob Cashier'
  },
  {
    id: 'R123458',
    items: [
      { id: '5', name: 'Pasta', price: 10.99, quantity: 1 },
      { id: '11', name: 'Cake', price: 5.99, quantity: 1 },
      { id: '9', name: 'Coffee', price: 3.49, quantity: 1 }
    ],
    total: 20.47,
    date: '2023-05-14',
    time: '07:45 PM',
    paymentMethod: 'card',
    cashier: 'Bob Cashier'
  },
  {
    id: 'R123459',
    items: [
      { id: '3', name: 'Salad', price: 7.99, quantity: 1 },
      { id: '10', name: 'Tea', price: 2.99, quantity: 1 }
    ],
    total: 10.98,
    date: '2023-05-14',
    time: '12:10 PM',
    paymentMethod: 'cash',
    cashier: 'Bob Cashier'
  },
  {
    id: 'R123460',
    items: [
      { id: '4', name: 'Steak', price: 18.99, quantity: 1 },
      { id: '13', name: 'French Fries', price: 3.99, quantity: 1 },
      { id: '7', name: 'Soda', price: 2.99, quantity: 1 }
    ],
    total: 25.97,
    date: '2023-05-13',
    time: '08:30 PM',
    paymentMethod: 'card',
    cashier: 'Bob Cashier'
  }
];

const Receipts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState<Receipt | null>(null);
  
  // Filter receipts based on search term
  const filteredReceipts = MOCK_RECEIPTS.filter(receipt => 
    receipt.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    receipt.date.includes(searchTerm) ||
    receipt.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()) ||
    receipt.cashier.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleViewDetails = (receipt: Receipt) => {
    setCurrentReceipt(receipt);
    setDetailsOpen(true);
  };
  
  const handlePrintReceipt = () => {
    window.print();
    toast.success("Receipt printed");
  };
  
  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <FileText className="mr-2 h-6 w-6" />
          Receipt History
        </h1>
        
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search receipts..."
            className="pl-9 w-[250px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Recent Receipts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Receipt #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Cashier</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReceipts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No receipts found
                  </TableCell>
                </TableRow>
              ) : (
                filteredReceipts.map(receipt => (
                  <TableRow key={receipt.id}>
                    <TableCell className="font-medium">{receipt.id}</TableCell>
                    <TableCell>{receipt.date}</TableCell>
                    <TableCell>{receipt.time}</TableCell>
                    <TableCell>{receipt.items.length}</TableCell>
                    <TableCell>${receipt.total.toFixed(2)}</TableCell>
                    <TableCell className="capitalize">{receipt.paymentMethod}</TableCell>
                    <TableCell>{receipt.cashier}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewDetails(receipt)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Receipt Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Receipt Details</DialogTitle>
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
                  <span>{currentReceipt.date} {currentReceipt.time}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Cashier:</span>
                  <span>{currentReceipt.cashier}</span>
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
            <Button variant="outline" onClick={() => setDetailsOpen(false)}>
              Close
            </Button>
            <Button onClick={handlePrintReceipt}>
              <Printer className="mr-2 h-4 w-4" />
              Print Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Receipts;
