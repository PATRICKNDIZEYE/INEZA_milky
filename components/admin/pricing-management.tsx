'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Edit, Save, X, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ProductPrice {
  id: string;
  productId: string;
  product: {
    name: string;
    category: string;
  };
  category: string;
  price: number;
  minQuantity: number;
}

export default function PricingManagement() {
  const [prices, setPrices] = useState<ProductPrice[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    price: '',
    minQuantity: '',
    category: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    try {
      const response = await fetch('/api/admin/pricing');
      const data = await response.json();
      setPrices(data);
    } catch (error) {
      toast.error('Failed to fetch pricing data');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (price: ProductPrice) => {
    setEditingId(price.id);
    setEditForm({
      price: price.price.toString(),
      minQuantity: price.minQuantity.toString(),
      category: price.category,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ price: '', minQuantity: '', category: '' });
  };

  const saveEdit = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/pricing/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price: parseFloat(editForm.price),
          minQuantity: parseInt(editForm.minQuantity),
          category: editForm.category,
        }),
      });

      if (response.ok) {
        toast.success('Price updated successfully');
        fetchPrices();
        cancelEdit();
      } else {
        toast.error('Failed to update price');
      }
    } catch (error) {
      toast.error('Error updating price');
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      REGULAR: 'bg-blue-100 text-blue-800',
      BULK: 'bg-green-100 text-green-800',
      PREMIUM: 'bg-purple-100 text-purple-800',
      WHOLESALE: 'bg-orange-100 text-orange-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Pricing Management</h2>
        <Button className="bg-sky-500 hover:bg-sky-600">
          <Plus className="w-4 h-4 mr-2" />
          Add New Price
        </Button>
      </div>

      <div className="grid gap-4">
        {prices.map((price) => (
          <Card key={price.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {price.product.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {price.product.category.replace('_', ' ')}
                    </p>
                  </div>

                  <div>
                    <Badge className={getCategoryColor(price.category)}>
                      {price.category}
                    </Badge>
                  </div>

                  <div>
                    {editingId === price.id ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={editForm.price}
                        onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                        className="w-24"
                      />
                    ) : (
                      <div>
                        <span className="text-lg font-semibold text-sky-600">
                          ${price.price.toFixed(2)}
                        </span>
                        <p className="text-xs text-gray-500">
                          Min: {price.minQuantity} units
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    {editingId === price.id ? (
                      <Input
                        type="number"
                        value={editForm.minQuantity}
                        onChange={(e) => setEditForm({ ...editForm, minQuantity: e.target.value })}
                        className="w-20"
                      />
                    ) : (
                      <span className="text-sm text-gray-600">
                        Min: {price.minQuantity}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {editingId === price.id ? (
                    <>
                      <Button
                        size="sm"
                        onClick={() => saveEdit(price.id)}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={cancelEdit}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEdit(price)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {prices.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">No pricing data available</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}