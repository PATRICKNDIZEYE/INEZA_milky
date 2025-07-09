'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Package, Plus, Minus, RotateCcw } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  category: string;
  stockLevel: number;
  minStock: number;
  unit: string;
  basePrice: number;
}

export default function InventoryManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [adjustmentForm, setAdjustmentForm] = useState<{
    productId: string;
    quantity: string;
    type: 'STOCK_IN' | 'STOCK_OUT' | 'ADJUSTMENT';
    reason: string;
  }>({
    productId: '',
    quantity: '',
    type: 'STOCK_IN',
    reason: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/inventory');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      toast.error('Failed to fetch inventory data');
    } finally {
      setLoading(false);
    }
  };

  const handleStockAdjustment = async (productId: string, type: 'add' | 'remove', quantity: number) => {
    try {
      const response = await fetch('/api/admin/inventory/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          type: type === 'add' ? 'STOCK_IN' : 'STOCK_OUT',
          quantity,
          reason: `Manual ${type === 'add' ? 'addition' : 'removal'} by admin`,
        }),
      });

      if (response.ok) {
        toast.success(`Stock ${type === 'add' ? 'added' : 'removed'} successfully`);
        fetchProducts();
      } else {
        toast.error('Failed to adjust stock');
      }
    } catch (error) {
      toast.error('Error adjusting stock');
    }
  };

  const getStockStatus = (product: Product) => {
    if (product.stockLevel <= 0) {
      return { status: 'OUT_OF_STOCK', color: 'bg-red-100 text-red-800', text: 'Out of Stock' };
    } else if (product.stockLevel <= product.minStock) {
      return { status: 'LOW_STOCK', color: 'bg-yellow-100 text-yellow-800', text: 'Low Stock' };
    } else {
      return { status: 'IN_STOCK', color: 'bg-green-100 text-green-800', text: 'In Stock' };
    }
  };

  const lowStockProducts = products.filter(p => p.stockLevel <= p.minStock);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
        <Button onClick={fetchProducts} variant="outline">
          <RotateCcw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="w-5 h-5" />
              Low Stock Alert ({lowStockProducts.length} items)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="flex justify-between items-center">
                  <span className="font-medium">{product.name}</span>
                  <span className="text-sm text-yellow-700">
                    {product.stockLevel} {product.unit} remaining
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inventory Grid */}
      <div className="grid gap-6">
        {products.map((product) => {
          const stockStatus = getStockStatus(product);
          
          return (
            <Card key={product.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {product.category.replace('_', ' ')} • ${product.basePrice.toFixed(2)} per {product.unit}
                    </p>
                  </div>
                  <Badge className={stockStatus.color}>
                    {stockStatus.text}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Package className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                    <div className="text-2xl font-bold text-gray-900">
                      {product.stockLevel}
                    </div>
                    <div className="text-sm text-gray-600">Current Stock</div>
                  </div>

                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                    <div className="text-2xl font-bold text-gray-900">
                      {product.minStock}
                    </div>
                    <div className="text-sm text-gray-600">Minimum Stock</div>
                  </div>

                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                      {product.unit}
                    </div>
                    <div className="text-sm text-gray-600">Unit</div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStockAdjustment(product.id, 'remove', 1)}
                    disabled={product.stockLevel <= 0}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  
                  <Input
                    type="number"
                    placeholder="Qty"
                    className="w-20 text-center"
                    min="1"
                  />
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStockAdjustment(product.id, 'add', 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>

                  <Button
                    size="sm"
                    className="ml-auto bg-sky-500 hover:bg-sky-600"
                  >
                    Reorder
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {products.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">No products in inventory</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}