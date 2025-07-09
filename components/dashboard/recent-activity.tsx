import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { format } from 'date-fns'

interface Delivery {
  id: string
  quantity: number
  quality: string
  date: string
  farmer: {
    name: string
    farmerId: string
  }
  collectionCenter: {
    name: string
  }
}

interface RecentActivityProps {
  deliveries: Delivery[]
}

export function RecentActivity({ deliveries }: RecentActivityProps) {
  const qualityColors = {
    EXCELLENT: 'bg-green-100 text-green-800',
    GOOD: 'bg-blue-100 text-blue-800',
    FAIR: 'bg-yellow-100 text-yellow-800',
    POOR: 'bg-red-100 text-red-800'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Collections</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {deliveries.map((delivery) => (
            <div key={delivery.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-sky-100 text-sky-700">
                    {delivery.farmer.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">{delivery.farmer.name}</p>
                  <p className="text-sm text-gray-500">
                    ID: {delivery.farmer.farmerId} • {delivery.collectionCenter.name}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">{delivery.quantity}L</span>
                  <Badge className={qualityColors[delivery.quality as keyof typeof qualityColors]}>
                    {delivery.quality}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {format(new Date(delivery.date), 'MMM dd, HH:mm')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}