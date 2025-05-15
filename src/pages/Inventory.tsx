
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Define inventory item type
interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  cost_price: number;
  threshold_quantity: number | null;
  created_at: string;
  updated_at: string;
}

// Form data type
interface InventoryFormData {
  name: string;
  quantity: number;
  unit: string;
  cost_price: number;
  threshold_quantity: number | null;
}

const Inventory = () => {
  const { user, isAuthorized } = useAuth();
  const queryClient = useQueryClient();
  
  // State for dialog and form
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNewItem, setIsNewItem] = useState(true);
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);
  const [formData, setFormData] = useState<InventoryFormData>({
    name: '',
    quantity: 0,
    unit: '',
    cost_price: 0,
    threshold_quantity: null
  });
  
  // Fetch inventory items
  const { data: items, isLoading, error } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .order('name');
        
      if (error) throw error;
      return data as InventoryItem[];
    }
  });
  
  // Add inventory item mutation
  const addItemMutation = useMutation({
    mutationFn: async (item: InventoryFormData) => {
      const { data, error } = await supabase
        .from('inventory_items')
        .insert([item])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success('Item added successfully');
      setIsDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error adding item:', error);
      toast.error('Failed to add item');
    }
  });
  
  // Update inventory item mutation
  const updateItemMutation = useMutation({
    mutationFn: async ({ id, item }: { id: string, item: InventoryFormData }) => {
      const { data, error } = await supabase
        .from('inventory_items')
        .update(item)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success('Item updated successfully');
      setIsDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error updating item:', error);
      toast.error('Failed to update item');
    }
  });
  
  // Delete inventory item mutation
  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success('Item deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    }
  });
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'name' || name === 'unit' 
        ? value 
        : name === 'threshold_quantity' && value === '' 
          ? null 
          : parseFloat(value)
    }));
  };
  
  // Handle adding a new item
  const handleAddItem = () => {
    setIsNewItem(true);
    setCurrentItemId(null);
    setFormData({
      name: '',
      quantity: 0,
      unit: '',
      cost_price: 0,
      threshold_quantity: null
    });
    setIsDialogOpen(true);
  };
  
  // Handle editing an item
  const handleEditItem = (item: InventoryItem) => {
    setIsNewItem(false);
    setCurrentItemId(item.id);
    setFormData({
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      cost_price: item.cost_price,
      threshold_quantity: item.threshold_quantity
    });
    setIsDialogOpen(true);
  };
  
  // Handle deleting an item
  const handleDeleteItem = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      deleteItemMutation.mutate(id);
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.unit || formData.cost_price <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (isNewItem) {
      addItemMutation.mutate(formData);
    } else if (currentItemId) {
      updateItemMutation.mutate({ id: currentItemId, item: formData });
    }
  };
  
  // Check if user is authorized to access this page
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if user has appropriate role
  const canManageInventory = isAuthorized(['owner', 'warehouse_admin']);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        
        {canManageInventory && (
          <Button onClick={handleAddItem}>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-8">Loading inventory...</div>
      ) : error ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-red-500 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Error loading inventory: {(error as Error).message}</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Inventory Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Cost Price</TableHead>
                  <TableHead>Threshold</TableHead>
                  <TableHead>Status</TableHead>
                  {canManageInventory && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {items && items.length > 0 ? (
                  items.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell>${item.cost_price.toFixed(2)}</TableCell>
                      <TableCell>{item.threshold_quantity !== null ? item.threshold_quantity : 'N/A'}</TableCell>
                      <TableCell>
                        {item.threshold_quantity !== null && item.quantity <= item.threshold_quantity ? (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-md text-xs">
                            Low Stock
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs">
                            In Stock
                          </span>
                        )}
                      </TableCell>
                      {canManageInventory && (
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditItem(item)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleDeleteItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={canManageInventory ? 7 : 6} className="text-center py-6">
                      No inventory items found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      
      {/* Add/Edit Item Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isNewItem ? 'Add New Inventory Item' : 'Edit Inventory Item'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Item Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter item name"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="0"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    placeholder="e.g., kg, liter, piece"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="cost_price">Cost Price ($)</Label>
                  <Input
                    id="cost_price"
                    name="cost_price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.cost_price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="threshold_quantity">
                    Threshold Quantity (optional)
                  </Label>
                  <Input
                    id="threshold_quantity"
                    name="threshold_quantity"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.threshold_quantity ?? ''}
                    onChange={handleInputChange}
                    placeholder="Low stock threshold"
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {isNewItem ? 'Add Item' : 'Update Item'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;
