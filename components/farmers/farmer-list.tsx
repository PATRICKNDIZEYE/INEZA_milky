'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AddFarmerForm, EditFarmerForm } from './farmer-form'
import { Edit, Trash2, Phone, MapPin, Building2 } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface Farmer {
  id: string
  farmerId: string
  name: string
  phone: string
  email?: string
  location: string
  address?: string
  bankName?: string
  accountNumber?: string
  accountName?: string
  pricePerL: number
  isActive: boolean
  joinDate?: string
  createdAt?: string
  updatedAt?: string
  collectionCenterId: string
  collectionCenter: {
    name: string
    code: string
  }
  _count: {
    deliveries: number
  }
}

interface FarmerEdit {
  id: string
  farmerId: string
  name: string
  phone: string
  email?: string
  location: string
  address?: string
  bankName?: string
  accountNumber?: string
  accountName?: string
  pricePerL: string
  collectionCenterId: string
  isActive: boolean
}

interface FarmerListProps {
  farmers: Farmer[]
  onUpdate: () => void
}

export function FarmerList({ farmers, onUpdate }: FarmerListProps) {
  const [editingFarmer, setEditingFarmer] = useState<FarmerEdit | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  const handleDelete = async (farmerId: string) => {
    if (!confirm('Are you sure you want to delete this farmer?')) return

    try {
      const response = await fetch(`/api/farmers/${farmerId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Farmer deleted successfully')
        onUpdate()
      } else {
        toast.error('Failed to delete farmer')
      }
    } catch (error) {
      toast.error('An error occurred while deleting farmer')
    }
  }

  const toggleStatus = async (farmerId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/farmers/${farmerId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive })
      })

      if (response.ok) {
        toast.success(`Farmer ${!isActive ? 'activated' : 'deactivated'} successfully`)
        onUpdate()
      } else {
        toast.error('Failed to update farmer status')
      }
    } catch (error) {
      toast.error('An error occurred while updating farmer status')
    }
  }

  const getCompleteFarmer = (farmer: Farmer): FarmerEdit => {
    const result = {
      id: farmer.id,
      farmerId: farmer.farmerId,
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
      isActive: farmer.isActive ?? true
    };
    console.log('Editing farmer:', result);
    return result;
  }

  if (farmers.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-gray-500">No farmers found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Button className="mb-4" onClick={() => setShowAddModal(true)}>
        + Add Farmer
      </Button>
      <div className="grid gap-4">
        {farmers.map((farmer) => (
          <Card key={farmer.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {farmer.name}
                    </h3>
                    <Badge variant={farmer.isActive ? "default" : "secondary"}>
                      {farmer.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant="outline">
                      ID: {farmer.farmerId}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span>{farmer.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{farmer.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4" />
                      <span>{farmer.collectionCenter.name}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="text-sm">
                      <span className="font-medium">Price: </span>
                      <span className="text-sky-600">{farmer.pricePerL} RWF/L</span>
                      <span className="mx-2">•</span>
                      <span className="font-medium">Deliveries: </span>
                      <span>{farmer._count.deliveries}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingFarmer(getCompleteFarmer(farmer))}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={farmer.isActive ? "outline" : "default"}
                    size="sm"
                    onClick={() => toggleStatus(farmer.id, farmer.isActive)}
                  >
                    {farmer.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(farmer.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showAddModal && (
        <AddFarmerForm
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false)
            onUpdate()
          }}
        />
      )}
      {editingFarmer && (
        <EditFarmerForm
          farmer={editingFarmer}
          onClose={() => setEditingFarmer(null)}
          onSuccess={() => {
            setEditingFarmer(null)
            onUpdate()
          }}
        />
      )}
    </>
  )
}