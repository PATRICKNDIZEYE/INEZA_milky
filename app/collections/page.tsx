"use client";
import { useEffect, useState } from "react";
import { DeliveryForm } from '@/components/deliveries/delivery-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Package, User, Calendar, Trash2, Edit2, Search } from 'lucide-react';
import { format } from 'date-fns';

interface Delivery {
  id: string;
  quantity: number;
  quality: string;
  date: string;
  collectionTime?: string;
  notes?: string;
  farmer: {
    name: string;
    farmerId: string;
  };
  collectionCenter: {
    name: string;
  };
}

const qualityColors: Record<string, string> = {
  EXCELLENT: 'bg-green-100 text-green-800',
  GOOD: 'bg-blue-100 text-blue-800',
  FAIR: 'bg-yellow-100 text-yellow-800',
  POOR: 'bg-red-100 text-red-800',
};

export default function CollectionsPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [editDelivery, setEditDelivery] = useState<Delivery | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteDelivery, setDeleteDelivery] = useState<Delivery | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    setLoading(true);
    const res = await fetch('/api/deliveries');
    if (res.ok) {
      setDeliveries(await res.json());
    }
    setLoading(false);
  };

  const filteredDeliveries = deliveries.filter(d =>
    d.farmer.name.toLowerCase().includes(search.toLowerCase()) ||
    d.farmer.farmerId.toLowerCase().includes(search.toLowerCase()) ||
    d.collectionCenter.name.toLowerCase().includes(search.toLowerCase()) ||
    d.quality.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (delivery: Delivery) => {
    setEditDelivery(delivery);
    setShowEditModal(true);
  };

  const handleDelete = (delivery: Delivery) => {
    setDeleteDelivery(delivery);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteDelivery) return;
    const res = await fetch(`/api/deliveries/${deleteDelivery.id}`, { method: 'DELETE' });
    if (res.ok) {
      setToast({ type: 'success', message: 'Delivery deleted' });
      fetchDeliveries();
    } else {
      setToast({ type: 'error', message: 'Failed to delete delivery' });
    }
    setShowDeleteModal(false);
    setDeleteDelivery(null);
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editDelivery) return;
    const formData = new FormData(e.currentTarget);
    const data = {
      quantity: parseFloat(formData.get('quantity') as string),
      quality: formData.get('quality') as string,
      notes: formData.get('notes') as string,
      collectionTime: formData.get('collectionTime') as string,
    };
    const res = await fetch(`/api/deliveries/${editDelivery.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setToast({ type: 'success', message: 'Delivery updated' });
      fetchDeliveries();
      setShowEditModal(false);
      setEditDelivery(null);
    } else {
      setToast({ type: 'error', message: 'Failed to update delivery' });
    }
  };

  const recentDeliveries = filteredDeliveries.slice(0, 2);
  const olderDeliveries = filteredDeliveries.slice(2);

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Milk Collection</h1>
          <p className="text-gray-600">Record and manage all milk collections</p>
        </div>
        <div className="max-w-xs w-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search collections..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* All Collections Table (full width) */}
    

      <div className="grid gap-6 lg:grid-cols-2">
        <DeliveryForm onSuccess={fetchDeliveries} />
        <Card>
          <CardHeader>
            <CardTitle>Recent Collections ({filteredDeliveries.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-32">Loading...</div>
              ) : filteredDeliveries.length === 0 ? (
                <div className="text-center text-gray-500 py-8">No collections found.</div>
              ) : (
                <>
                  {recentDeliveries.map((delivery) => (
                    <div key={delivery.id} className="p-4 border rounded-lg bg-gray-50 relative">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Package className="h-4 w-4 text-gray-500" />
                          <span className="font-semibold">{delivery.quantity}L</span>
                        </div>
                        <Badge className={qualityColors[delivery.quality] || 'bg-gray-100 text-gray-800'}>
                          {delivery.quality}
                        </Badge>
                        <div className="flex items-center gap-2 absolute top-2 right-2 mt-8">
                          <button onClick={() => handleEdit(delivery)} className="text-blue-600 hover:text-blue-800 p-1 rounded-full" title="Edit">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(delivery)} className="text-red-600 hover:text-red-800 p-1 rounded-full" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>{delivery.farmer.name} ({delivery.farmer.farmerId})</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{format(new Date(delivery.date), 'PPP')}{delivery.collectionTime ? ` ${delivery.collectionTime}` : ''}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">Center:</span>
                          <span>{delivery.collectionCenter?.name || '-'}</span>
                        </div>
                        {delivery.notes && (
                          <div className="text-xs text-gray-500 mt-2">{delivery.notes}</div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                </>
              )}
            </div>
          </CardContent>
        </Card>
        
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>All Collections ({filteredDeliveries.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase">Farmer</th>
                  <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase">Quantity</th>
                  <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase">Quality</th>
                  <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase">Center</th>
                  <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase">Notes</th>
                  <th className="px-4 py-2 text-center text-xs font-bold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDeliveries.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-8">No collections found.</td></tr>
                ) : (
                  filteredDeliveries.map((delivery) => (
                    <tr key={delivery.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 whitespace-nowrap">{delivery.farmer.name} ({delivery.farmer.farmerId})</td>
                      <td className="px-4 py-2 whitespace-nowrap">{format(new Date(delivery.date), 'PPP')}{delivery.collectionTime ? ` ${delivery.collectionTime}` : ''}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{delivery.quantity}L</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <Badge className={qualityColors[delivery.quality] || 'bg-gray-100 text-gray-800'}>{delivery.quality}</Badge>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">{delivery.collectionCenter?.name || '-'}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">{delivery.notes || '-'}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-center">
                        <button onClick={() => handleEdit(delivery)} className="text-blue-600 hover:text-blue-800 p-1 rounded-full" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(delivery)} className="text-red-600 hover:text-red-800 p-1 rounded-full ml-2" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      {/* Edit Modal */}
      {showEditModal && editDelivery && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-blue-100">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Edit2 className="w-5 h-5 text-blue-600" /> Edit Delivery
            </h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Quantity (L)</label>
                <input name="quantity" type="number" step="0.1" min="0.1" defaultValue={editDelivery.quantity} className="mt-1 block w-full border rounded px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Quality</label>
                <select name="quality" defaultValue={editDelivery.quality} className="mt-1 block w-full border rounded px-3 py-2">
                  <option value="EXCELLENT">Excellent</option>
                  <option value="GOOD">Good</option>
                  <option value="FAIR">Fair</option>
                  <option value="POOR">Poor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Collection Time</label>
                <input name="collectionTime" type="text" defaultValue={editDelivery.collectionTime || ''} className="mt-1 block w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea name="notes" defaultValue={editDelivery.notes || ''} className="mt-1 block w-full border rounded px-3 py-2" />
              </div>
              <div className="flex gap-4 mt-6">
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow">Update</button>
                <button type="button" onClick={() => setShowEditModal(false)} className="bg-gray-200 px-4 py-2 rounded">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {showDeleteModal && deleteDelivery && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Trash2 className="w-5 h-5 text-red-600" /> Delete Delivery</h2>
            <p className="mb-4">Are you sure you want to delete this delivery?</p>
            <div className="flex gap-4">
              <button onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow">Delete</button>
              <button onClick={() => setShowDeleteModal(false)} className="bg-gray-200 px-4 py-2 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-4 py-2 rounded shadow-lg z-50 ${toast.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
          {toast.message}
          <button className="ml-4" onClick={() => setToast(null)}>&times;</button>
        </div>
      )}
    </div>
  );
} 