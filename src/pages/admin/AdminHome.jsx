import { BarChart3, Users, CheckCircle2, TrendingUp, Package, AlertCircle } from 'lucide-react'
import { useAppStore } from '../../store/appStore'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'

export default function AdminHome() {
  const { 
    listings, requests, deals, users, 
    fetchAllUsers, fetchAllRequests, fetchAllDeals,
    fetchAdminListings,
    fetchRevenueAnalytics, fetchDealsAnalytics
  } = useAppStore()

  const [revenueData, setRevenueData] = useState([])
  const [dealsAnalytics, setDealsAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAll = async () => {
      try {
        await Promise.all([
          fetchAllUsers(),
          fetchAllRequests(),
          fetchAllDeals(),
          fetchAdminListings ? fetchAdminListings() : Promise.resolve()
        ])
        
        const [revData, dlsData] = await Promise.all([
          fetchRevenueAnalytics(),
          fetchDealsAnalytics()
        ])
        
        setRevenueData(revData)
        setDealsAnalytics(dlsData)
      } catch (err) {
        console.error('Failed to load dashboard data', err)
      } finally {
        setLoading(false)
      }
    }
    loadAll()
  }, [])

  const stats = [
    { label: 'Total Members', value: (users || []).filter(u => u.role === 'member').length, icon: Users, color: 'emerald' },
    { label: 'Active Listings', value: (listings || []).filter(i => i.status === 'approved').length, icon: Package, color: 'blue' },
    { label: 'Revenue (Deals)', value: revenueData?.deal_revenue ? `NPR ${(revenueData.deal_revenue / 100000).toFixed(1)}L` : '0', icon: TrendingUp, color: 'green' },
    { label: 'Revenue (Memberships)', value: revenueData?.membership_revenue ? `NPR ${(revenueData.membership_revenue / 100000).toFixed(1)}L` : '0', icon: TrendingUp, color: 'purple' },
    { label: 'Total Deals', value: (deals || []).length, icon: BarChart3, color: 'amber' },
    { label: 'Active Requests', value: (requests || []).filter(r => r.status === 'pending' || r.status === 'open').length, icon: CheckCircle2, color: 'cyan' },
  ]

  const aggregatedRevenue = (revenueData?.breakdown || []).reduce((acc, curr) => {
    const month = new Date(curr.month).toLocaleString('default', { month: 'short' })
    if (!acc[month]) {
      acc[month] = { month, revenue: 0, deals: 0, membership: 0 }
    }
    acc[month].revenue += parseFloat(curr.revenue) / 100000
    if (curr.source_type === 'deal') acc[month].deals += parseFloat(curr.revenue) / 100000
    if (curr.source_type === 'membership') acc[month].membership += parseFloat(curr.revenue) / 100000
    return acc
  }, {})

  const revenueTrendData = Object.values(aggregatedRevenue).reverse()

  const dealsData = (revenueData?.breakdown || []).filter(d => d.source_type === 'deal').map(d => ({
    month: new Date(d.month).toLocaleString('default', { month: 'short' }),
    deals: parseInt(d.count)
  })).reverse()

  const categoryData = dealsAnalytics?.categories || []

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-[#4A3A5C] animate-spin mb-4" />
        <h2 className="text-xl font-bold text-[#1A1A1A]">Initializing Dashboard...</h2>
        <p className="text-[#666666]">Connecting to live data nodes</p>
      </div>
    )
  }

  const colorMap = {
    emerald: 'from-[#4A3A5C]/10 to-[#574B66]/10 border-[#4A3A5C]/20',
    blue: 'from-blue-500/10 to-blue-600/10 border-blue-500/20',
    amber: 'from-amber-500/10 to-amber-600/10 border-amber-500/20',
    green: 'from-[#4A3A5C]/10 to-[#574B66]/10 border-[#4A3A5C]/20',
    purple: 'from-[#4A3A5C]/10 to-[#574B66]/10 border-[#4A3A5C]/20',
    cyan: 'from-blue-500/10 to-blue-600/10 border-blue-500/20',
  }

  const textMap = {
    emerald: 'text-[#4A3A5C]',
    blue: 'text-[#4A3A5C]',
    amber: 'text-[#4A3A5C]',
    green: 'text-[#4A3A5C]',
    purple: 'text-[#4A3A5C]',
    cyan: 'text-[#4A3A5C]',
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-1">Dashboard</h1>
        <p className="text-[#666666]">WareX Platform Overview</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`bg-gradient-to-br ${colorMap[stat.color]} border rounded-xl p-6 hover:shadow-md transition`}
            >
              <div className="flex items-center justify-between mb-3">
                <Icon className={`w-6 h-6 ${textMap[stat.color]}`} />
              </div>
              <p className="text-[#666666] text-sm mb-1">{stat.label}</p>
              <p className={`text-3xl font-bold ${textMap[stat.color]}`}>{stat.value}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-[#E5E5E5] rounded-xl p-6 hover:shadow-md transition"
        >
          <h3 className="text-lg font-bold text-[#1A1A1A] mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(200, 200, 200, 0.1)" />
              <XAxis dataKey="month" stroke="#999999" />
              <YAxis stroke="#999999" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', color: '#1A1A1A' }}
                formatter={(value) => [`${value} Lakhs`, '']}
              />
              <Legend />
              <Line
                name="Deals Revenue"
                type="monotone"
                dataKey="deals"
                stroke="#4A3A5C"
                strokeWidth={2}
                dot={{ fill: '#4A3A5C' }}
                activeDot={{ r: 6 }}
              />
              <Line
                name="Membership Revenue"
                type="monotone"
                dataKey="membership"
                stroke="#574B66"
                strokeWidth={2}
                dot={{ fill: '#574B66' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-[#E5E5E5] rounded-xl p-6 hover:shadow-md transition"
        >
          <h3 className="text-lg font-bold text-[#1A1A1A] mb-4">Monthly Deals</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dealsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(200, 200, 200, 0.1)" />
              <XAxis dataKey="month" stroke="#999999" />
              <YAxis stroke="#999999" />
              <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', color: '#1A1A1A' }} />
              <Bar dataKey="deals" fill="#4A3A5C" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="bg-white border border-[#E5E5E5] rounded-xl p-6 hover:shadow-md transition"
      >
        <h3 className="text-lg font-bold text-[#1A1A1A] mb-4">Commission by Category</h3>
        {categoryData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              layout="vertical"
              data={categoryData}
              margin={{ left: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(200, 200, 200, 0.1)" horizontal={false} />
              <XAxis type="number" stroke="#999999" />
              <YAxis dataKey="category" type="category" stroke="#999999" width={120} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', color: '#1A1A1A' }}
                formatter={(value) => [`NPR ${parseFloat(value).toLocaleString()}`, 'Commission']}
              />
              <Bar dataKey="commission" fill="#4A3A5C" radius={[0, 4, 4, 0]}>
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#4A3A5C' : '#574B66'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[200px] flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-[#666666]">No category commissions yet</p>
          </div>
        )}
      </motion.div>

      {/* System Status */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white border border-[#E5E5E5] rounded-xl p-6 hover:shadow-md transition"
      >
        <h3 className="text-lg font-bold text-[#1A1A1A] mb-4">System Integration Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium text-green-700">Inventory Sync Active</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium text-green-700">User DB Connected</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium text-green-700">Analytics Live</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium text-green-700">Payments API Ready</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
