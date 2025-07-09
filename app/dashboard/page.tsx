'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Droplets, CreditCard, TrendingUp, AlertTriangle } from 'lucide-react'
import { StatsCard } from '@/components/dashboard/stats-card'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { CollectionChart } from '@/components/dashboard/collection-chart'

interface DashboardStats {
  totalFarmers: number
  activeFarmers: number
  todayCollection: number
  monthlyCollection: number
  pendingPayments: number
  totalRevenue: number
  lowQualityDeliveries: number
  recentDeliveries: any[]
  collectionTrend: any[]
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (!stats) {
    return <div>Failed to load dashboard data</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600">Overview of your dairy management system</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Farmers"
          value={stats.totalFarmers}
          subtitle={`${stats.activeFarmers} active`}
          icon={Users}
          color="blue"
          trend={{ value: 12, label: 'vs last month' }}
        />
        <StatsCard
          title="Today's Collection"
          value={`${stats.todayCollection.toLocaleString()}L`}
          subtitle="Fresh milk collected"
          icon={Droplets}
          color="green"
          trend={{ value: 8, label: 'vs yesterday' }}
        />
        <StatsCard
          title="Pending Payments"
          value={stats.pendingPayments}
          subtitle="Awaiting processing"
          icon={CreditCard}
          color="orange"
        />
        <StatsCard
          title="Monthly Revenue"
          value={`${stats.totalRevenue.toLocaleString()} RWF`}
          subtitle="This month"
          icon={TrendingUp}
          color="green"
          trend={{ value: 15, label: 'vs last month' }}
        />
      </div>

      {/* Quality Alert */}
      {stats.lowQualityDeliveries > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">Quality Alert</p>
                <p className="text-sm text-yellow-700">
                  {stats.lowQualityDeliveries} deliveries with quality issues require attention
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts and Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <CollectionChart data={stats.collectionTrend} />
        <RecentActivity deliveries={stats.recentDeliveries} />
      </div>
    </div>
  )
}