
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Package, Search, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';

// Mock inventory data
interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  costPrice: number;
  sellingPrice: number;
  lastUpdated: string;
}

const MOCK_INVENTORY: InventoryItem[] = [
  {
    id: '1',
    name: 'Beef Patty',
    category: 'Meat',
    stock: 45,
    unit: 'pc',
    costPrice: 1.25,
    sellingPrice: 2.50,
    lastUpdated: '2023-05-15'
  },
  {
    id: '2',
    name: 'Hamburger Buns',
    category: 'Bread',
    stock: 60,
    unit: 'pc',
    costPrice: 0.40,
    sellingPrice: 0.80,
    lastUpdated: '2023-05-14'
  },
  {
    id: '3',
    name: 'Tomatoes',
    category: 'Vegetables',
    stock: 15,
    unit: 'kg',
    costPrice: 2.20,
    sellingPrice: 3.50,
    lastUpdated: '2023-05-15'
  },
  {
    id: '4',
    name: 'Cola Syrup',
    category: 'Beverages',
    stock: 8,
    unit: 'liter',
    costPrice: 5.00,
    sellingPrice: 20.00,
    lastUpdated: '2023-05-10'
  },
  {
    id: '5',
    name: 'French Fries',
    category: 'Frozen',
    stock: 25,
    unit: 'kg',
    costPrice: 1.80,
    sellingPrice: 3.60,
    lastUpdated: '2023-05-12'
  }
];

const CATEGORIES = ['Meat', 'Bread', 'Vegetables', 'Beverages', 'Frozen', 'Dairy', 'Spices', 'Other'];
const UNITS = ['pc', 'kg', 'liter', 'gram', 'ml', 'box', 'pack'];

const Inventory = () => {
  const { isAuthorized } = useAuth();
  const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Partial<InventoryItem> | null>(null);
  const [isNewItem, setIsNewItem] = useState(true);
  
  // Filtered inventory based on search
  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Open dialog to add new item
  const handleAddNew = () => {
    setCurrentItem({
      name: '',
      category: '',
      stock: 0,
      unit: 'pc',
      costPrice: 0,
      sellingPrice: 0
    });
    setIsNewItem(true);
    setIsDialogOpen(true);
  };
  
  // Open dialog to edit existing item
  const handleEdit = (item: InventoryItem) => {
    setCurrentItem({ ...item });
    setIsNewItem(false);
    setIsDialogOpen(true);
  };
  
  // Save new/edited item
  const handleSave = () => {
    if (!currentItem || !currentItem.name || !currentItem.category) {
      toast.error("Please fill all required fields");
      return;
    }
    
    // Generate current date for lastUpdated
    const now = new Date().toISOString().split('T')[0];
    
    if (isNewItem) {
      // Add new item
      const newItem: InventoryItem = {
        ...currentItem as Omit<InventoryItem, 'id' | 'lastUpdated'>,
        id: Date.now().toString(),
        lastUpdated: now
      };
      
      setInventory(prev => [...prev, newItem]);
      toast.success("Item added successfully");
    } else {
      // Update existing item
      setInventory(prev => 
        prev.map(item => 
          item.id === currentItem.id 
            ? { ...currentItem as InventoryItem, lastUpdated: now } 
            : item
        )
      );
      toast.success("Item updated successfully");
    }
    
    setIsDialogOpen(false);
    setCurrentItem(null);
  };
  
  // Delete item
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      setInventory(prev => prev.filter(item => item.id !== id));
      toast.success("Item deleted successfully");
    }
  };
  
  // Update quantity
  const handleUpdateQuantity = (id: string, amount: number) => {
    setInventory(prev => 
      prev.map(item => {
        if (item.id === id) {
          const newStock = Math.max(0, item.stock + amount);
          return {
            ...item,
            stock: newStock,
            lastUpdated: new Date().toISOString().split('T')[0]
          };
        }
        return item;
      })
    );
    
    toast.success(`Inventory updated`);
  };
  
  const canEdit = isAuthorized(['owner', 'warehouse_admin']);
  
  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <Package className="mr-2 h-6 w-6" />
          Inventory Management
        </h1>
        
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search inventory..."
              className="pl-9 w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {canEdit && (
            <Button onClick={handleAddNew}>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          )}
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Inventory Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Cost Price</TableHead>
                <TableHead>Selling Price</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No inventory items found
                  </TableCell>
                </TableRow>
              ) : (
                filteredInventory.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      <div className={`font-medium ${item.stock < 10 ? 'text-red-500' : ''}`}>
                        {item.stock}
                      </div>
                    </TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>${item.costPrice.toFixed(2)}</TableCell>
                    <TableCell>${item.sellingPrice.toFixed(2)}</TableCell>
                    <TableCell>{item.lastUpdated}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {canEdit && (
                          <>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              onClick={() => handleUpdateQuantity(item.id, 1)}
                            >
                              +
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              onClick={() => handleUpdateQuantity(item.id, -1)}
                              disabled={item.stock <= 0}
                            >
                              -
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleEdit(item)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleDelete(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Add/Edit Item Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isNewItem ? 'Add New Inventory Item' : 'Edit Inventory Item'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Item Name</Label>
              <Input
                id="name"
                value={currentItem?.name || ''}
                onChange={(e) => setCurrentItem(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter item name"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={currentItem?.category || ''}
                onValueChange={(value) => setCurrentItem(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={currentItem?.stock || 0}
                  onChange={(e) => setCurrentItem(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="unit">Unit</Label>
                <Select
                  value={currentItem?.unit || 'pc'}
                  onValueChange={(value) => setCurrentItem(prev => ({ ...prev, unit: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {UNITS.map(unit => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="costPrice">Cost Price ($)</Label>
                <Input
                  id="costPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={currentItem?.costPrice || 0}
                  onChange={(e) => setCurrentItem(prev => ({ ...prev, costPrice: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="sellingPrice">Selling Price ($)</Label>
                <Input
                  id="sellingPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={currentItem?.sellingPrice || 0}
                  onChange={(e) => setCurrentItem(prev => ({ ...prev, sellingPrice: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;
