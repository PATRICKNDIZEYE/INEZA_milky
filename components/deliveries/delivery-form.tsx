"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Package } from 'lucide-react'

interface Farmer {
  id: string
  name: string
  phone: string
  pricePerL: number
}

interface DeliveryFormProps {
  onSuccess: () => void
}

export function DeliveryForm({ onSuccess }: DeliveryFormProps) {
  const [loading, setLoading] = useState(false)
  const [farmers, setFarmers] = useState<Farmer[]>([])
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>('')
  const { toast } = useToast()

  useEffect(() => {
    fetchFarmers()
  }, [])

  async function fetchFarmers() {
    try {
      const response = await fetch('/api/farmers')
      if (response.ok) {
        const data = await response.json()
        setFarmers(data)
      }
    } catch (error) {
      console.error('Failed to fetch farmers:', error)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      farmerId: selectedFarmerId,
      quantity: parseFloat(formData.get('quantity') as string),
      quality: formData.get('quality') as string,
      notes: formData.get('notes') as string
    }

    try {
      const response = await fetch('/api/deliveries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) throw new Error('Failed to record delivery')

      toast({
        title: 'Success',
        description: 'Delivery has been recorded successfully.'
      })

      onSuccess()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to record delivery. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Package className="h-5 w-5" />
          <span>Record New Delivery</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="farmer">Select Farmer</Label>
            <Select value={selectedFarmerId} onValueChange={setSelectedFarmerId} required>
              <SelectTrigger>
                <SelectValue placeholder="Choose a farmer" />
              </SelectTrigger>
              <SelectContent>
                {farmers.map((farmer) => (
                  <SelectItem key={farmer.id} value={farmer.id}>
                    {farmer.name} - {farmer.phone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity (Liters)</Label>
              <Input 
                id="quantity" 
                name="quantity" 
                type="number" 
                step="0.1" 
                min="0.1"
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quality">Milk Quality</Label>
              <Select name="quality" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select quality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EXCELLENT">Excellent</SelectItem>
                  <SelectItem value="GOOD">Good</SelectItem>
                  <SelectItem value="FAIR">Fair</SelectItem>
                  <SelectItem value="POOR">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea id="notes" name="notes" rows={3} />
          </div>

          <Button type="submit" disabled={loading || !selectedFarmerId} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Recording...
              </>
            ) : (
              'Record Delivery'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}