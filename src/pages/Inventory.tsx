import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/auth';
import { Navigate } from 'react-router-dom';
import { localStorageHelper } from '@/utils/localStorage';

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

// Define inventory categories
const INVENTORY_CATEGORIES = ['SEMUA', 'BAHAN', 'BUMBU', 'MINUMAN', 'PERLENGKAPAN', 'PERALATAN'];

// Function to determine item category based on name or other properties
const getCategoryForItem = (item: InventoryItem): string => {
  const name = item.name.toLowerCase();
  
  // Food ingredients
  if (name.includes('ayam') || name.includes('fillet') || name.includes('daging') || 
      name.includes('telur') || name.includes('tepung') || name.includes('ikan') ||
      name.includes('baso') || name.includes('dumpling') || name.includes('ceker') ||
      name.includes('tulang') || name.includes('sayur') || name.includes('sawi') ||
      name.includes('jamur') || name.includes('tofu') || name.includes('tahu') ||
      name.includes('cumi') || name.includes('udang') || name.includes('paha') ||
      name.includes('sayap') || name.includes('kulit') || name.includes('lidah') ||
      name.includes('kerupuk') || name.includes('krupuk') || name.includes('timun')) {
    return 'BAHAN';
  }
  
  // Spices and seasonings
  if (name.includes('bawang') || name.includes('cabe') || name.includes('garam') ||
      name.includes('merica') || name.includes('kencur') || name.includes('royco') ||
      name.includes('saos') || name.includes('kecap') || name.includes('rawit') ||
      name.includes('jeruk') || name.includes('wijen')) {
    return 'BUMBU';
  }
  
  // Drinks
  if (name.includes('air') || name.includes('minuman') || name.includes('goodday') ||
      name.includes('vit') || name.includes('teh') || name.includes('kopi')) {
    return 'MINUMAN';
  }
  
  // Utensils and equipment
  if (name.includes('mangkuk') || name.includes('piring') || name.includes('sendok') ||
      name.includes('garpu') || name.includes('pisau') || name.includes('wajan') ||
      name.includes('kompor') || name.includes('steropom')) {
    return 'PERALATAN';
  }
  
  // Supplies
  if (name.includes('plastik') || name.includes('sedotan') || name.includes('tissue') ||
      name.includes('serbet') || name.includes('lap')) {
    return 'PERLENGKAPAN';
  }
  
  return 'BAHAN'; // Default category
};

const Inventory = () => {
  const { user } = useAuth();
  
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
  
  // State for inventory items
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [activeCategory, setActiveCategory] = useState('SEMUA');

  // Load inventory items from localStorage
  useEffect(() => {
    try {
      const inventoryItems = localStorageHelper.getInventoryItems();
      setItems(inventoryItems);
      setFilteredItems(inventoryItems);
      setIsLoading(false);
    } catch (err) {
      console.error('Error loading inventory items:', err);
      setError(err as Error);
      setIsLoading(false);
    }
  }, []);
  
  // Filter items when category changes
  useEffect(() => {
    if (activeCategory === 'SEMUA') {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(item => getCategoryForItem(item) === activeCategory);
      setFilteredItems(filtered);
    }
  }, [activeCategory, items]);
  
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
    if (confirm('Apakah Anda yakin ingin menghapus item ini?')) {
      try {
        localStorageHelper.deleteInventoryItem(id);
        setItems(prevItems => prevItems.filter(item => item.id !== id));
        toast.success('Item berhasil dihapus');
      } catch (error) {
        console.error('Error deleting item:', error);
        toast.error('Gagal menghapus item');
      }
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.unit || formData.cost_price <= 0) {
      toast.error('Mohon isi semua kolom yang diperlukan');
      return;
    }
    
    try {
      if (isNewItem) {
        const newItem: InventoryItem = {
          id: `inv-${Date.now()}`,
          name: formData.name,
          quantity: formData.quantity,
          unit: formData.unit,
          cost_price: formData.cost_price,
          threshold_quantity: formData.threshold_quantity,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        localStorageHelper.addInventoryItem(newItem);
        setItems(prevItems => [...prevItems, newItem]);
        toast.success('Item berhasil ditambahkan');
      } else if (currentItemId) {
        const updatedItem: InventoryItem = {
          id: currentItemId,
          name: formData.name,
          quantity: formData.quantity,
          unit: formData.unit,
          cost_price: formData.cost_price,
          threshold_quantity: formData.threshold_quantity,
          created_at: items.find(item => item.id === currentItemId)?.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        localStorageHelper.updateInventoryItem(updatedItem);
        setItems(prevItems => 
          prevItems.map(item => 
            item.id === currentItemId ? updatedItem : item
          )
        );
        toast.success('Item berhasil diperbarui');
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving item:', error);
      toast.error('Gagal menyimpan item');
    }
  };
  
  // Handle category button click
  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
  };
  
  // Check if user is authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if user has appropriate role
  const canManageInventory = true; // Simplified for this example
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manajemen Inventaris</h1>
        
        {canManageInventory && (
          <Button onClick={handleAddItem}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Item
          </Button>
        )}
      </div>
      
      {/* Category Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {INVENTORY_CATEGORIES.map(category => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </Button>
        ))}
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-8">Memuat inventaris...</div>
      ) : error ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-red-500 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Error memuat inventaris: {error.message}</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Item Inventaris {activeCategory !== 'SEMUA' ? `- ${activeCategory}` : ''}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Satuan</TableHead>
                  <TableHead>Harga Modal</TableHead>
                  <TableHead>Batas Stok</TableHead>
                  <TableHead>Status</TableHead>
                  {canManageInventory && <TableHead className="text-right">Aksi</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems && filteredItems.length > 0 ? (
                  filteredItems.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell>Rp{item.cost_price.toLocaleString('id-ID')}</TableCell>
                      <TableCell>{item.threshold_quantity !== null ? item.threshold_quantity : 'N/A'}</TableCell>
                      <TableCell>
                        {item.threshold_quantity !== null && item.quantity <= item.threshold_quantity ? (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-md text-xs">
                            Stok Rendah
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs">
                            Tersedia
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
                      {activeCategory === 'SEMUA' 
                        ? 'Tidak ada item inventaris ditemukan.' 
                        : `Tidak ada item inventaris dalam kategori ${activeCategory}.`}
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
              {isNewItem ? 'Tambah Item Inventaris Baru' : 'Edit Item Inventaris'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nama Item</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama item"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Jumlah</Label>
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
                  <Label htmlFor="unit">Satuan</Label>
                  <Input
                    id="unit"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    placeholder="mis., kg, liter, buah"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="cost_price">Harga Modal (Rp)</Label>
                  <Input
                    id="cost_price"
                    name="cost_price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.cost_price}
                    onChange={handleInputChange}
                    placeholder="0"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="threshold_quantity">
                    Batas Jumlah Stok (opsional)
                  </Label>
                  <Input
                    id="threshold_quantity"
                    name="threshold_quantity"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.threshold_quantity ?? ''}
                    onChange={handleInputChange}
                    placeholder="Batas stok rendah"
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit">
                {isNewItem ? 'Tambah Item' : 'Perbarui Item'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;
