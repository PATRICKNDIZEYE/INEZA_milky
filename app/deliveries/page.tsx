"use client"

import { useState, useEffect } from 'react'
import { DeliveryForm } from '@/components/deliveries/delivery-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loading } from '@/components/ui/loading'
import { format } from 'date-fns'
import { Package, User, Calendar, Award } from 'lucide-react'

interface Delivery {
  id: string
  quantity: number
  quality: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR'
  date: string
  notes?: string
  farmer: {
    name: string
    phone: string
  }
  recordedBy: {
    name: string
  }
}

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDeliveries()
  }, [])

  async function fetchDeliveries() {
    try {
      const response = await fetch('/api/deliveries')
      if (response.ok) {
        const data = await response.json()
        setDeliveries(data)
      }
    } catch (error) {
      console.error('Failed to fetch deliveries:', error)
    } finally {
      setLoading(false)
    }
  }

  const qualityColors = {
    EXCELLENT: 'bg-green-100 text-green-800',
    GOOD: 'bg-blue-100 text-blue-800',
    FAIR: 'bg-yellow-100 text-yellow-800',
    POOR: 'bg-red-100 text-red-800'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loading size="lg" text="Loading deliveries..." />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Deliveries</h2>
        <p className="text-gray-600">Record and track milk deliveries</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DeliveryForm onSuccess={fetchDeliveries} />
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Deliveries ({deliveries.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {deliveries.map((delivery) => (
                <div key={delivery.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-gray-500" />
                      <span className="font-semibold">{delivery.quantity}L</span>
                    </div>
                    <Badge className={qualityColors[delivery.quality]}>
                      {delivery.quality}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{delivery.farmer.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(delivery.date), 'PPP')}</span>
                    </div>
                    {delivery.notes && (
                      <div className="text-xs text-gray-500 mt-2">
                        {delivery.notes}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-xs text-gray-500 mt-2">
                    Recorded by: {delivery.recordedBy.name}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}