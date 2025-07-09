"use client";
import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, UserCheck, UserX, User, Shield } from "lucide-react";
import { Input } from '@/components/ui/input';

interface User {
  id: string;
  name: string;
  email: string;
  username: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const roleColors: Record<string, string> = {
  ADMIN: "bg-blue-100 text-blue-800",
  MANAGER: "bg-green-100 text-green-800",
  OPERATOR: "bg-yellow-100 text-yellow-800",
  VIEWER: "bg-gray-100 text-gray-800",
};

const roleIcons: Record<string, JSX.Element> = {
  ADMIN: <Shield className="inline w-4 h-4 mr-1" />,
  MANAGER: <UserCheck className="inline w-4 h-4 mr-1" />,
  OPERATOR: <User className="inline w-4 h-4 mr-1" />,
  VIEWER: <UserX className="inline w-4 h-4 mr-1" />,
};

const roles = ["ADMIN", "MANAGER", "OPERATOR", "VIEWER"];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<User | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    role: "OPERATOR",
    isActive: true,
  });
  const [formLoading, setFormLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (editUser) {
      setForm({
        name: editUser.name,
        email: editUser.email,
        username: editUser.username || "",
        password: "",
        role: editUser.role,
        isActive: editUser.isActive,
      });
    } else {
      setForm({ name: "", email: "", username: "", password: "", role: "OPERATOR", isActive: true });
    }
  }, [editUser, showModal]);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetch("/api/users");
    if (res.ok) {
      setUsers(await res.json());
    }
    setLoading(false);
  };

  const handleEdit = (user: User) => {
    setEditUser(user);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditUser(null);
    setShowModal(true);
  };

  const handleDelete = async (user: User) => {
    setConfirmDelete(user);
  };

  const confirmDeleteUser = async () => {
    if (!confirmDelete) return;
    const res = await fetch(`/api/users/${confirmDelete.id}`, { method: "DELETE" });
    if (res.ok) {
      setToast({ type: "success", message: "User deleted" });
      fetchUsers();
    } else {
      setToast({ type: "error", message: "Failed to delete user" });
    }
    setConfirmDelete(null);
  };

  const handleStatusToggle = async (user: User) => {
    const res = await fetch(`/api/users/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !user.isActive }),
    });
    if (res.ok) {
      setToast({ type: "success", message: "Status updated" });
      fetchUsers();
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
    if (editUser) {
      // Edit
      res = await fetch(`/api/users/${editUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          username: form.username,
          password: form.password || undefined,
          role: form.role,
          isActive: form.isActive,
        }),
      });
    } else {
      // Add
      res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    if (res && res.ok) {
      setToast({ type: "success", message: editUser ? "User updated" : "User added" });
      setShowModal(false);
      fetchUsers();
    } else {
      setToast({ type: "error", message: "Failed to save user" });
    }
    setFormLoading(false);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    (user.username || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 relative">
      {/* Search Bar */}
      <div className="mb-4 max-w-xs">
        <Input
          placeholder="Search users..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>
      {/* Floating Add User Button */}
      <button
        onClick={handleAdd}
        className="fixed bottom-8 right-8 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-4 flex items-center gap-2 transition-all duration-150"
        title="Add User"
      >
        <Plus className="w-6 h-6" />
        <span className="hidden md:inline font-semibold">Add User</span>
      </button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
      </div>
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={6} className="text-center py-8"><span className="animate-spin inline-block w-6 h-6 border-4 border-blue-400 border-t-transparent rounded-full"></span></td></tr>
            ) : filteredUsers.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8">No users found.</td></tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold gap-1 ${roleColors[user.role] || "bg-gray-100 text-gray-800"}`}>
                      {roleIcons[user.role] || <User className="inline w-4 h-4 mr-1" />} {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold transition-colors ${user.isActive ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-red-100 text-red-800 hover:bg-red-200"}`}
                      onClick={() => handleStatusToggle(user)}
                      title={user.isActive ? "Deactivate" : "Activate"}
                    >
                      {user.isActive ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                      {user.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-blue-600 hover:text-blue-800 p-2 rounded-full transition-colors"
                      title="Edit User"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(user)}
                      className="text-red-600 hover:text-red-800 p-2 rounded-full transition-colors ml-2"
                      title="Delete User"
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
              {editUser ? <Edit2 className="w-5 h-5 text-blue-600" /> : <Plus className="w-5 h-5 text-blue-600" />}
              {editUser ? "Edit User" : "Add User"}
            </h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input name="name" value={form.name} onChange={handleFormChange} className="mt-1 block w-full border rounded px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input name="email" type="email" value={form.email} onChange={handleFormChange} className="mt-1 block w-full border rounded px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input name="username" value={form.username} onChange={handleFormChange} className="mt-1 block w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password {editUser && <span className="text-xs text-gray-400">(leave blank to keep unchanged)</span>}</label>
                <input name="password" type="password" value={form.password} onChange={handleFormChange} className="mt-1 block w-full border rounded px-3 py-2" required={!editUser} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select name="role" value={form.role} onChange={handleFormChange} className="mt-1 block w-full border rounded px-3 py-2">
                  {roles.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center">
                <input id="isActive" name="isActive" type="checkbox" checked={form.isActive} onChange={handleFormChange} className="mr-2" />
                <label htmlFor="isActive" className="text-sm">Active</label>
              </div>
              <div className="flex gap-4 mt-6">
                <button type="submit" disabled={formLoading} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow">
                  {formLoading ? "Saving..." : editUser ? "Update User" : "Add User"}
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
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Trash2 className="w-5 h-5 text-red-600" /> Delete User</h2>
            <p className="mb-4">Are you sure you want to delete <span className="font-semibold">{confirmDelete.name}</span>?</p>
            <div className="flex gap-4">
              <button onClick={confirmDeleteUser} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow">Delete</button>
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