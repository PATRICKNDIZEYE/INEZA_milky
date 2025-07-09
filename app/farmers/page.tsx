'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FarmerForm } from '@/components/farmers/farmer-form'
import { FarmerList } from '@/components/farmers/farmer-list'
import { BulkImport } from '@/components/farmers/bulk-import'
import { Plus, Search, Upload, Download } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface Farmer {
  id: string
  farmerId: string
  name: string
  phone: string
  location: string
  isActive: boolean
  collectionCenter: {
    name: string
  }
  _count: {
    deliveries: number
  }
}

export default function FarmersPage() {
  const [farmers, setFarmers] = useState<Farmer[]>([])
  const [filteredFarmers, setFilteredFarmers] = useState<Farmer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [showBulkImport, setShowBulkImport] = useState(false)

  useEffect(() => {
    fetchFarmers()
  }, [])

  useEffect(() => {
    const filtered = farmers.filter(farmer =>
      farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.farmerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.phone.includes(searchTerm)
    )
    setFilteredFarmers(filtered)
  }, [farmers, searchTerm])

  const fetchFarmers = async () => {
    try {
      const response = await fetch('/api/farmers')
      if (response.ok) {
        const data = await response.json()
        setFarmers(data)
      }
    } catch (error) {
      toast.error('Failed to fetch farmers')
    } finally {
      setLoading(false)
    }
  }

  const exportFarmers = async () => {
    try {
      const response = await fetch('/api/farmers/export')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `farmers-${new Date().toISOString().split('T')[0]}.xlsx`
      a.click()
      toast.success('Farmers exported successfully')
    } catch (error) {
      toast.error('Failed to export farmers')
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Farmers</h2>
          <p className="text-gray-600">Manage farmer registrations and information</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportFarmers}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={() => setShowBulkImport(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Bulk Import
          </Button>
          <Button onClick={() => setShowForm(true)} className="bg-sky-500 hover:bg-sky-600">
            <Plus className="w-4 h-4 mr-2" />
            Add Farmer
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-sky-600">{farmers.length}</div>
            <p className="text-sm text-gray-600">Total Farmers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {farmers.filter(f => f.isActive).length}
            </div>
            <p className="text-sm text-gray-600">Active Farmers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {farmers.filter(f => !f.isActive).length}
            </div>
            <p className="text-sm text-gray-600">Inactive Farmers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {farmers.reduce((sum, f) => sum + f._count.deliveries, 0)}
            </div>
            <p className="text-sm text-gray-600">Total Deliveries</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search farmers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Farmers List */}
      <FarmerList 
        farmers={filteredFarmers} 
        onUpdate={fetchFarmers}
      />

      {/* Modals */}
      {showForm && (
        <FarmerForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false)
            fetchFarmers()
          }}
        />
      )}

      {showBulkImport && (
        <BulkImport
          onClose={() => setShowBulkImport(false)}
          onSuccess={() => {
            setShowBulkImport(false)
            fetchFarmers()
          }}
        />
      )}
    </div>
  )
}