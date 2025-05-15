
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Settings as SettingsIcon, Building, Printer, Receipt } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

// Restaurant settings interface
interface RestaurantSettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  taxRate: number;
  logo: string | null;
}

// Receipt settings interface
interface ReceiptSettings {
  showLogo: boolean;
  showTaxDetails: boolean;
  footerText: string;
  printAutomatically: boolean;
}

// Initial restaurant settings
const initialRestaurantSettings: RestaurantSettings = {
  name: 'Restaurant Name',
  address: '123 Restaurant St, City',
  phone: '(123) 456-7890',
  email: 'info@restaurant.com',
  taxRate: 8.5,
  logo: null
};

// Initial receipt settings
const initialReceiptSettings: ReceiptSettings = {
  showLogo: true,
  showTaxDetails: true,
  footerText: 'Thank you for your visit!\nPlease come again',
  printAutomatically: true
};

const Settings = () => {
  const { isAuthorized } = useAuth();
  
  // Redirect if not authorized
  if (!isAuthorized(['owner'])) {
    return <Navigate to="/pos" replace />;
  }
  
  const [restaurantSettings, setRestaurantSettings] = useState<RestaurantSettings>(initialRestaurantSettings);
  const [receiptSettings, setReceiptSettings] = useState<ReceiptSettings>(initialReceiptSettings);
  
  // Handle restaurant settings change
  const handleRestaurantSettingChange = (key: keyof RestaurantSettings, value: string | number | null) => {
    setRestaurantSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Handle receipt settings change
  const handleReceiptSettingChange = (key: keyof ReceiptSettings, value: boolean | string) => {
    setReceiptSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Save restaurant settings
  const saveRestaurantSettings = () => {
    // In a real app, this would call an API to save the settings
    toast.success("Restaurant settings saved successfully");
  };
  
  // Save receipt settings
  const saveReceiptSettings = () => {
    // In a real app, this would call an API to save the settings
    toast.success("Receipt settings saved successfully");
  };
  
  return (
    <div className="h-full">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <SettingsIcon className="mr-2 h-6 w-6" />
          Settings
        </h1>
      </div>
      
      <Tabs defaultValue="restaurant" className="space-y-4">
        <TabsList>
          <TabsTrigger value="restaurant" className="flex items-center">
            <Building className="mr-2 h-4 w-4" />
            Restaurant
          </TabsTrigger>
          <TabsTrigger value="receipt" className="flex items-center">
            <Receipt className="mr-2 h-4 w-4" />
            Receipt
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="restaurant" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Information</CardTitle>
              <CardDescription>
                Manage your restaurant details that appear on receipts and reports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="restaurant-name">Restaurant Name</Label>
                  <Input
                    id="restaurant-name"
                    value={restaurantSettings.name}
                    onChange={(e) => handleRestaurantSettingChange('name', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="restaurant-phone">Phone Number</Label>
                  <Input
                    id="restaurant-phone"
                    value={restaurantSettings.phone}
                    onChange={(e) => handleRestaurantSettingChange('phone', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="restaurant-address">Address</Label>
                <Input
                  id="restaurant-address"
                  value={restaurantSettings.address}
                  onChange={(e) => handleRestaurantSettingChange('address', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="restaurant-email">Email</Label>
                  <Input
                    id="restaurant-email"
                    type="email"
                    value={restaurantSettings.email}
                    onChange={(e) => handleRestaurantSettingChange('email', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                  <Input
                    id="tax-rate"
                    type="number"
                    min="0"
                    step="0.01"
                    value={restaurantSettings.taxRate}
                    onChange={(e) => handleRestaurantSettingChange('taxRate', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="restaurant-logo">Logo</Label>
                <div className="flex items-center gap-4">
                  {restaurantSettings.logo ? (
                    <div className="w-16 h-16 border rounded flex items-center justify-center overflow-hidden">
                      <img src={restaurantSettings.logo} alt="Restaurant logo" className="max-w-full max-h-full" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 border rounded flex items-center justify-center bg-gray-100 text-gray-500 text-xs">
                      No logo
                    </div>
                  )}
                  
                  <Button variant="outline" size="sm">
                    Upload Logo
                  </Button>
                  
                  {restaurantSettings.logo && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-500"
                      onClick={() => handleRestaurantSettingChange('logo', null)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <p className="text-sm text-gray-500">Recommended size: 200x200 pixels</p>
              </div>
              
              <Separator />
              
              <div className="flex justify-end">
                <Button onClick={saveRestaurantSettings}>
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="receipt" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Receipt Settings</CardTitle>
              <CardDescription>
                Customize how receipts are displayed and printed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show-logo">Show Logo on Receipt</Label>
                  <p className="text-sm text-gray-500">Display your restaurant logo on printed receipts</p>
                </div>
                <Switch
                  id="show-logo"
                  checked={receiptSettings.showLogo}
                  onCheckedChange={(checked) => handleReceiptSettingChange('showLogo', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show-tax-details">Show Tax Details</Label>
                  <p className="text-sm text-gray-500">Display detailed tax breakdown on receipts</p>
                </div>
                <Switch
                  id="show-tax-details"
                  checked={receiptSettings.showTaxDetails}
                  onCheckedChange={(checked) => handleReceiptSettingChange('showTaxDetails', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="footer-text">Receipt Footer Text</Label>
                <Input
                  id="footer-text"
                  value={receiptSettings.footerText}
                  onChange={(e) => handleReceiptSettingChange('footerText', e.target.value)}
                  placeholder="Thank you message"
                />
                <p className="text-sm text-gray-500">This text will appear at the bottom of each receipt</p>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="print-automatically">Print Automatically</Label>
                  <p className="text-sm text-gray-500">Automatically print receipt after completing a transaction</p>
                </div>
                <Switch
                  id="print-automatically"
                  checked={receiptSettings.printAutomatically}
                  onCheckedChange={(checked) => handleReceiptSettingChange('printAutomatically', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center space-x-4">
                <Printer className="h-5 w-5 text-gray-500" />
                <div>
                  <h4 className="font-medium">Printer Configuration</h4>
                  <p className="text-sm text-gray-500">Configure receipt printer settings</p>
                </div>
                <Button variant="outline" size="sm" className="ml-auto">
                  Configure Printer
                </Button>
              </div>
              
              <Separator />
              
              <div className="flex justify-end">
                <Button onClick={saveReceiptSettings}>
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
