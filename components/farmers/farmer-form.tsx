'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface CollectionCenter {
  id: string
  name: string
  code: string
}

interface AddFarmerFormProps {
  onClose: () => void
  onSuccess: () => void
}

interface EditFarmerFormProps {
  farmer: any
  onClose: () => void
  onSuccess: () => void
}

export function AddFarmerForm({ onClose, onSuccess }: AddFarmerFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    address: '',
    bankName: '',
    accountNumber: '',
    accountName: '',
    pricePerL: '300',
    collectionCenterId: '',
    isActive: true
  })
  const [collectionCenters, setCollectionCenters] = useState<CollectionCenter[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCollectionCenters()
  }, [])

  const fetchCollectionCenters = async () => {
    try {
      const response = await fetch('/api/collection-centers')
      if (response.ok) {
        const data = await response.json()
        setCollectionCenters(data)
      }
    } catch (error) {
      console.error('Failed to fetch collection centers:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/farmers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          pricePerL: formData.pricePerL === '' ? 300 : parseFloat(formData.pricePerL)
        })
      })

      if (response.ok) {
        toast.success('Farmer created successfully')
        onSuccess()
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to save farmer')
      }
    } catch (error) {
      toast.error('An error occurred while saving farmer')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open onOpenChange={open => { if (!open) onClose(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Farmer</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Full Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountName">Account Name</Label>
              <Input
                id="accountName"
                value={formData.accountName}
                onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pricePerL">Price per Liter (RWF)</Label>
              <Input
                id="pricePerL"
                type="number"
                step="0.01"
                value={formData.pricePerL ?? ''}
                onChange={(e) => setFormData({ ...formData, pricePerL: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="collectionCenter">Collection Center *</Label>
              <Select
                value={formData.collectionCenterId}
                onValueChange={(value) => setFormData({ ...formData, collectionCenterId: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select collection center" />
                </SelectTrigger>
                <SelectContent>
                  {collectionCenters.map((center) => (
                    <SelectItem key={center.id} value={center.id}>
                      {center.name} ({center.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
            <Label htmlFor="isActive">Active Farmer</Label>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-sky-500 hover:bg-sky-600">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Add Farmer'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function EditFarmerForm({ farmer, onClose, onSuccess }: EditFarmerFormProps) {
  const [formData, setFormData] = useState({
    name: farmer.name    ,
    phone: farmer.phone,
    email:farmer.email,
    location: farmer.location,
    address: farmer.address,
    bankName: farmer.bankName,
    accountNumber:farmer.accountNumber,
    accountName: farmer.accountName,
    pricePerL: farmer.pricePerL ,
    collectionCenterId: farmer.collectionCenterId,
    isActive: farmer.isActive
  })
  const [collectionCenters, setCollectionCenters] = useState<CollectionCenter[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (farmer) {
      setFormData({
        name: farmer.name ?? '',
        phone: farmer.phone ?? '',
        email: farmer.email ?? '',
        location: farmer.location ?? '',
        address: farmer.address ?? '',
        bankName: farmer.bankName ?? '',
        accountNumber: farmer.accountNumber ?? '',
        accountName: farmer.accountName ?? '',
        pricePerL: farmer.pricePerL !== undefined && farmer.pricePerL !== null ? String(farmer.pricePerL) : '300',
        collectionCenterId: farmer.collectionCenterId ?? '',
        isActive: typeof farmer.isActive === 'boolean' ? farmer.isActive : true
      });
    }
  }, [farmer]);

  useEffect(() => {
    fetchCollectionCenters()
  }, [])

  const fetchCollectionCenters = async () => {
    try {
      const response = await fetch('/api/collection-centers')
      if (response.ok) {
        const data = await response.json()
        setCollectionCenters(data)
      }
    } catch (error) {
      console.error('Failed to fetch collection centers:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = `/api/farmers/${farmer.id}`
      const method = 'PUT'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          pricePerL: formData.pricePerL === '' ? 300 : parseFloat(formData.pricePerL)
        })
      })

      if (response.ok) {
        toast.success('Farmer updated successfully')
        onSuccess()
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to update farmer')
      }
    } catch (error) {
      toast.error('An error occurred while updating farmer')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open onOpenChange={open => { if (!open) onClose(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Farmer</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <input
                id="name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
                style={{ border: '1px solid red', width: '100%', borderRadius: 4, padding: 8 }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <input
                id="phone"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                required
                style={{ border: '1px solid red', width: '100%', borderRadius: 4, padding: 8 }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                style={{ border: '1px solid red', width: '100%', borderRadius: 4, padding: 8 }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <input
                id="location"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                required
                style={{ border: '1px solid red', width: '100%', borderRadius: 4, padding: 8 }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Full Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountName">Account Name</Label>
              <Input
                id="accountName"
                value={formData.accountName}
                onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pricePerL">Price per Liter (RWF)</Label>
              <Input
                id="pricePerL"
                type="number"
                step="0.01"
                value={formData.pricePerL ?? ''}
                onChange={(e) => setFormData({ ...formData, pricePerL: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="collectionCenter">Collection Center *</Label>
              <Select
                value={formData.collectionCenterId}
                onValueChange={(value) => setFormData({ ...formData, collectionCenterId: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select collection center" />
                </SelectTrigger>
                <SelectContent>
                  {collectionCenters.map((center) => (
                    <SelectItem key={center.id} value={center.id}>
                      {center.name} ({center.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
            <Label htmlFor="isActive">Active Farmer</Label>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-sky-500 hover:bg-sky-600">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Update Farmer'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}