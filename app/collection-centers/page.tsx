"use client";
import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Building2, CheckCircle, XCircle, MapPin, Phone, User } from "lucide-react";
import { Input } from '@/components/ui/input';

interface CollectionCenter {
  id: string;
  name: string;
  code: string;
  location: string;
  address?: string;
  phone?: string;
  manager?: string;
  capacity?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function CollectionCentersPage() {
  const [centers, setCenters] = useState<CollectionCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCenter, setEditCenter] = useState<CollectionCenter | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<CollectionCenter | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [form, setForm] = useState({
    name: "",
    code: "",
    location: "",
    address: "",
    phone: "",
    manager: "",
    capacity: "",
    isActive: true,
  });
  const [formLoading, setFormLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCenters();
  }, []);

  useEffect(() => {
    if (editCenter) {
      setForm({
        name: editCenter.name,
        code: editCenter.code,
        location: editCenter.location,
        address: editCenter.address || "",
        phone: editCenter.phone || "",
        manager: editCenter.manager || "",
        capacity: editCenter.capacity?.toString() || "",
        isActive: editCenter.isActive,
      });
    } else {
      setForm({ name: "", code: "", location: "", address: "", phone: "", manager: "", capacity: "", isActive: true });
    }
  }, [editCenter, showModal]);

  const fetchCenters = async () => {
    setLoading(true);
    const res = await fetch("/api/collection-centers");
    if (res.ok) {
      setCenters(await res.json());
    }
    setLoading(false);
  };

  const handleEdit = (center: CollectionCenter) => {
    setEditCenter(center);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditCenter(null);
    setShowModal(true);
  };

  const handleDelete = async (center: CollectionCenter) => {
    setConfirmDelete(center);
  };

  const confirmDeleteCenter = async () => {
    if (!confirmDelete) return;
    const res = await fetch(`/api/collection-centers/${confirmDelete.id}`, { method: "DELETE" });
    if (res.ok) {
      setToast({ type: "success", message: "Collection center deleted" });
      fetchCenters();
    } else {
      setToast({ type: "error", message: "Failed to delete collection center" });
    }
    setConfirmDelete(null);
  };

  const handleStatusToggle = async (center: CollectionCenter) => {
    const res = await fetch(`/api/collection-centers/${center.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !center.isActive }),
    });
    if (res.ok) {
      setToast({ type: "success", message: "Status updated" });
      fetchCenters();
    } else {
      setToast({ type: "error", message: "Failed to update status" });
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;
    const name = target.name;
    if (target.type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: (target as HTMLInputElement).checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: target.value }));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    let res;
    if (editCenter) {
      // Edit
      res = await fetch(`/api/collection-centers/${editCenter.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          code: form.code,
          location: form.location,
          address: form.address,
          phone: form.phone,
          manager: form.manager,
          capacity: form.capacity ? parseFloat(form.capacity) : undefined,
          isActive: form.isActive,
        }),
      });
    } else {
      // Add
      res = await fetch("/api/collection-centers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          capacity: form.capacity ? parseFloat(form.capacity) : undefined,
        }),
      });
    }
    if (res && res.ok) {
      setToast({ type: "success", message: editCenter ? "Collection center updated" : "Collection center added" });
      setShowModal(false);
      fetchCenters();
    } else {
      setToast({ type: "error", message: "Failed to save collection center" });
    }
    setFormLoading(false);
  };

  const filteredCenters = centers.filter(center =>
    center.name.toLowerCase().includes(search.toLowerCase()) ||
    center.code.toLowerCase().includes(search.toLowerCase()) ||
    center.location.toLowerCase().includes(search.toLowerCase()) ||
    (center.manager || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 relative">
      {/* Search Bar */}
     
      {/* Floating Add Center Button */}
      <button
        onClick={handleAdd}
        className="fixed bottom-8 right-8 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-4 flex items-center gap-2 transition-all duration-150"
        title="Add Collection Center"
      >
        <Plus className="w-6 h-6" />
        <span className="hidden md:inline font-semibold">Add Center</span>
      </button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Collection Centers</h1>
      </div>

      <div className="mb-4 max-w-xs">
        <Input
          placeholder="Search collection centers..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Code</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Manager</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Capacity</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={8} className="text-center py-8"><span className="animate-spin inline-block w-6 h-6 border-4 border-blue-400 border-t-transparent rounded-full"></span></td></tr>
            ) : filteredCenters.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-8">No collection centers found.</td></tr>
            ) : (
              filteredCenters.map((center) => (
                <tr key={center.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-medium"><span className="inline-flex items-center gap-2"><Building2 className="w-4 h-4 text-blue-500" />{center.name}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap">{center.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className="inline-flex items-center gap-1"><MapPin className="w-4 h-4 text-gray-400" />{center.location}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap">{center.manager}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{center.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{center.capacity ? `${center.capacity}L` : '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold transition-colors ${center.isActive ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-red-100 text-red-800 hover:bg-red-200"}`}
                      onClick={() => handleStatusToggle(center)}
                      title={center.isActive ? "Deactivate" : "Activate"}
                    >
                      {center.isActive ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      {center.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => handleEdit(center)}
                      className="text-blue-600 hover:text-blue-800 p-2 rounded-full transition-colors"
                      title="Edit Center"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(center)}
                      className="text-red-600 hover:text-red-800 p-2 rounded-full transition-colors ml-2"
                      title="Delete Center"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-blue-100">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              {editCenter ? <Edit2 className="w-5 h-5 text-blue-600" /> : <Plus className="w-5 h-5 text-blue-600" />}
              {editCenter ? "Edit Center" : "Add Center"}
            </h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input name="name" value={form.name} onChange={handleFormChange} className="mt-1 block w-full border rounded px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Code</label>
                <input name="code" value={form.code} onChange={handleFormChange} className="mt-1 block w-full border rounded px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input name="location" value={form.location} onChange={handleFormChange} className="mt-1 block w-full border rounded px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input name="address" value={form.address} onChange={handleFormChange} className="mt-1 block w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input name="phone" value={form.phone} onChange={handleFormChange} className="mt-1 block w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Manager</label>
                <input name="manager" value={form.manager} onChange={handleFormChange} className="mt-1 block w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Capacity (L)</label>
                <input name="capacity" type="number" value={form.capacity} onChange={handleFormChange} className="mt-1 block w-full border rounded px-3 py-2" />
              </div>
              <div className="flex items-center">
                <input id="isActive" name="isActive" type="checkbox" checked={form.isActive} onChange={handleFormChange} className="mr-2" />
                <label htmlFor="isActive" className="text-sm">Active</label>
              </div>
              <div className="flex gap-4 mt-6">
                <button type="submit" disabled={formLoading} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow">
                  {formLoading ? "Saving..." : editCenter ? "Update Center" : "Add Center"}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="bg-gray-200 px-4 py-2 rounded">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Trash2 className="w-5 h-5 text-red-600" /> Delete Center</h2>
            <p className="mb-4">Are you sure you want to delete <span className="font-semibold">{confirmDelete.name}</span>?</p>
            <div className="flex gap-4">
              <button onClick={confirmDeleteCenter} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow">Delete</button>
              <button onClick={() => setConfirmDelete(null)} className="bg-gray-200 px-4 py-2 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-4 py-2 rounded shadow-lg z-50 ${toast.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
          {toast.message}
          <button className="ml-4" onClick={() => setToast(null)}>&times;</button>
        </div>
      )}
    </div>
  );
} 