
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Clock, DollarSign, Users } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';

// Types for shift data
interface SalesCategory {
  name: string;
  amount: number;
}

interface Shift {
  id: string;
  startTime: string;
  endTime: string | null;
  cashier: string;
  totalSales: number;
  transactionCount: number;
  salesByCategory: SalesCategory[];
  cashDrawerStart: number;
  cashDrawerEnd: number | null;
  status: 'active' | 'closed';
}

// Mock shift data
const MOCK_SHIFTS: Shift[] = [
  {
    id: 'S12345',
    startTime: '2023-05-15 08:00 AM',
    endTime: '2023-05-15 04:00 PM',
    cashier: 'Bob Cashier',
    totalSales: 523.45,
    transactionCount: 32,
    salesByCategory: [
      { name: 'Food', amount: 350.25 },
      { name: 'Drinks', amount: 120.75 },
      { name: 'Desserts', amount: 52.45 }
    ],
    cashDrawerStart: 200.00,
    cashDrawerEnd: 450.50,
    status: 'closed'
  },
  {
    id: 'S12346',
    startTime: '2023-05-14 08:00 AM',
    endTime: '2023-05-14 04:00 PM',
    cashier: 'Bob Cashier',
    totalSales: 478.90,
    transactionCount: 28,
    salesByCategory: [
      { name: 'Food', amount: 320.15 },
      { name: 'Drinks', amount: 108.25 },
      { name: 'Desserts', amount: 50.50 }
    ],
    cashDrawerStart: 200.00,
    cashDrawerEnd: 430.25,
    status: 'closed'
  },
  {
    id: 'S12347',
    startTime: '2023-05-16 08:00 AM',
    endTime: null,
    cashier: 'Bob Cashier',
    totalSales: 215.75,
    transactionCount: 14,
    salesByCategory: [
      { name: 'Food', amount: 148.50 },
      { name: 'Drinks', amount: 52.25 },
      { name: 'Desserts', amount: 15.00 }
    ],
    cashDrawerStart: 200.00,
    cashDrawerEnd: null,
    status: 'active'
  }
];

const Shifts = () => {
  const { user } = useAuth();
  const [shifts, setShifts] = useState<Shift[]>(MOCK_SHIFTS);
  const [currentShift, setCurrentShift] = useState<Shift | null>(null);
  const [shiftDetailsOpen, setShiftDetailsOpen] = useState(false);
  const [closeShiftOpen, setCloseShiftOpen] = useState(false);
  const [cashDrawerEnd, setCashDrawerEnd] = useState<number>(0);
  
  // Get active shift
  const activeShift = shifts.find(shift => shift.status === 'active');
  
  // Start a new shift
  const handleStartShift = () => {
    if (activeShift) {
      toast.error("There is already an active shift. Please close it first.");
      return;
    }
    
    const now = new Date();
    const timeString = now.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
    const newShift: Shift = {
      id: `S${Date.now().toString().slice(-5)}`,
      startTime: timeString,
      endTime: null,
      cashier: `${user?.firstName} ${user?.lastName}`,
      totalSales: 0,
      transactionCount: 0,
      salesByCategory: [],
      cashDrawerStart: 200.00, // Default starting amount
      cashDrawerEnd: null,
      status: 'active'
    };
    
    setShifts(prev => [newShift, ...prev]);
    toast.success("Shift started successfully");
  };
  
  // View shift details
  const handleViewShift = (shift: Shift) => {
    setCurrentShift(shift);
    setShiftDetailsOpen(true);
  };
  
  // Open the close shift dialog
  const handleCloseShiftDialog = () => {
    if (!activeShift) {
      toast.error("No active shift to close");
      return;
    }
    
    setCurrentShift(activeShift);
    setCashDrawerEnd(activeShift.cashDrawerStart + activeShift.totalSales);
    setCloseShiftOpen(true);
  };
  
  // Close the shift
  const handleCloseShift = () => {
    if (!currentShift) return;
    
    const now = new Date();
    const timeString = now.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
    setShifts(prev => prev.map(shift => 
      shift.id === currentShift.id 
        ? { 
            ...shift, 
            endTime: timeString, 
            cashDrawerEnd: cashDrawerEnd,
            status: 'closed' 
          } 
        : shift
    ));
    
    toast.success("Shift closed successfully");
    setCloseShiftOpen(false);
  };
  
  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <Clock className="mr-2 h-6 w-6" />
          Shift Management
        </h1>
        
        <div className="flex gap-3">
          {activeShift ? (
            <Button 
              variant="destructive" 
              onClick={handleCloseShiftDialog}
            >
              Close Current Shift
            </Button>
          ) : (
            <Button 
              onClick={handleStartShift}
            >
              Start New Shift
            </Button>
          )}
        </div>
      </div>
      
      {activeShift && (
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center text-green-700">
              <Clock className="mr-2 h-5 w-5" />
              Active Shift
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-500">Started</div>
                <div className="font-semibold">{activeShift.startTime}</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-500">Cashier</div>
                <div className="font-semibold">{activeShift.cashier}</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
                <DollarSign className="h-8 w-8 text-green-600 mr-2" />
                <div>
                  <div className="text-sm text-gray-500">Sales</div>
                  <div className="font-semibold">${activeShift.totalSales.toFixed(2)}</div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
                <Users className="h-8 w-8 text-blue-600 mr-2" />
                <div>
                  <div className="text-sm text-gray-500">Transactions</div>
                  <div className="font-semibold">{activeShift.transactionCount}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Shift History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Shift ID</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>End Time</TableHead>
                <TableHead>Cashier</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead>Transactions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shifts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No shifts found
                  </TableCell>
                </TableRow>
              ) : (
                shifts.map(shift => (
                  <TableRow key={shift.id}>
                    <TableCell className="font-medium">{shift.id}</TableCell>
                    <TableCell>{shift.startTime}</TableCell>
                    <TableCell>{shift.endTime || "Active"}</TableCell>
                    <TableCell>{shift.cashier}</TableCell>
                    <TableCell>${shift.totalSales.toFixed(2)}</TableCell>
                    <TableCell>{shift.transactionCount}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        shift.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {shift.status === 'active' ? 'Active' : 'Closed'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewShift(shift)}
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
      
      {/* Shift Details Dialog */}
      <Dialog open={shiftDetailsOpen} onOpenChange={setShiftDetailsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Shift Details</DialogTitle>
          </DialogHeader>
          
          {currentShift && (
            <div className="py-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-500">Shift ID</div>
                  <div className="font-medium">{currentShift.id}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Status</div>
                  <div className="font-medium capitalize">{currentShift.status}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Start Time</div>
                  <div className="font-medium">{currentShift.startTime}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">End Time</div>
                  <div className="font-medium">{currentShift.endTime || "Active"}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Cashier</div>
                  <div className="font-medium">{currentShift.cashier}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Transactions</div>
                  <div className="font-medium">{currentShift.transactionCount}</div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md mb-4">
                <div className="text-sm font-medium mb-2">Sales Summary</div>
                <div className="flex justify-between font-medium">
                  <span>Total Sales:</span>
                  <span>${currentShift.totalSales.toFixed(2)}</span>
                </div>
                
                {currentShift.salesByCategory.length > 0 && (
                  <div className="mt-2 pt-2 border-t">
                    <div className="text-xs text-gray-500 mb-1">Sales by Category</div>
                    {currentShift.salesByCategory.map((category, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{category.name}:</span>
                        <span>${category.amount.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-sm font-medium mb-2">Cash Drawer</div>
                <div className="flex justify-between text-sm">
                  <span>Starting Amount:</span>
                  <span>${currentShift.cashDrawerStart.toFixed(2)}</span>
                </div>
                {currentShift.cashDrawerEnd !== null && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span>Ending Amount:</span>
                      <span>${currentShift.cashDrawerEnd.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium mt-1 pt-1 border-t">
                      <span>Difference:</span>
                      <span>${(currentShift.cashDrawerEnd - currentShift.cashDrawerStart).toFixed(2)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShiftDetailsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Close Shift Dialog */}
      <Dialog open={closeShiftOpen} onOpenChange={setCloseShiftOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Close Shift</DialogTitle>
          </DialogHeader>
          
          {currentShift && (
            <div className="py-4">
              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-1">Shift Information</div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="grid grid-cols-2 gap-y-2">
                    <div className="text-sm">Shift ID:</div>
                    <div className="text-sm font-medium">{currentShift.id}</div>
                    
                    <div className="text-sm">Started:</div>
                    <div className="text-sm font-medium">{currentShift.startTime}</div>
                    
                    <div className="text-sm">Cashier:</div>
                    <div className="text-sm font-medium">{currentShift.cashier}</div>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-1">Sales Summary</div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Sales:</span>
                    <span className="text-sm font-medium">${currentShift.totalSales.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Transactions:</span>
                    <span className="text-sm font-medium">{currentShift.transactionCount}</span>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-1">Cash Drawer</div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Starting Amount:</span>
                    <span className="text-sm font-medium">${currentShift.cashDrawerStart.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between mb-2">
                    <label htmlFor="cashDrawerEnd" className="text-sm">Ending Amount:</label>
                    <input
                      id="cashDrawerEnd"
                      type="number"
                      min="0"
                      step="0.01"
                      value={cashDrawerEnd}
                      onChange={(e) => setCashDrawerEnd(parseFloat(e.target.value) || 0)}
                      className="w-24 px-2 py-1 text-right border rounded"
                    />
                  </div>
                  
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-sm font-medium">Expected:</span>
                    <span className="text-sm font-medium">
                      ${(currentShift.cashDrawerStart + currentShift.totalSales).toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Difference:</span>
                    <span className={`text-sm font-medium ${
                      cashDrawerEnd !== (currentShift.cashDrawerStart + currentShift.totalSales) 
                        ? 'text-red-500' 
                        : ''
                    }`}>
                      ${(cashDrawerEnd - (currentShift.cashDrawerStart + currentShift.totalSales)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCloseShiftOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCloseShift}>
              Close Shift
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Shifts;
