import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import DataTable from '../../components/ui/DataTable'
import { useAppStore } from '../../store/appStore'
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

export default function RevenueTrackerPage() {
  const { fetchRevenueAnalytics } = useAppStore()
  const [revenueData, setRevenueData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchRevenueAnalytics()
        // API returns { total_revenue, deal_revenue, membership_revenue, breakdown: [...] }
        const breakdown = data?.breakdown || []
        const formatted = breakdown.map(d => ({
          month: new Date(d.month).toLocaleString('default', { month: 'short', year: '2-digit' }),
          revenue: parseFloat(d.revenue) || 0,
          commission: parseFloat(d.revenue) * 0.1 || 0, // 10% commission
          deals: parseInt(d.count) || 0
        })).reverse()
        setRevenueData(formatted)
      } catch (e) {
        console.error('Revenue load error:', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const totalRevenue = revenueData.reduce((sum, d) => sum + d.revenue, 0)
  const totalCommission = revenueData.reduce((sum, d) => sum + d.commission, 0)
  const totalDeals = revenueData.reduce((sum, d) => sum + d.deals, 0)

  const revenueBreakdown = [
    { name: 'Commission', value: totalCommission, color: '#4A3A5C' },
    { name: 'Other (Simulation)', value: totalRevenue * 0.05, color: '#3b82f6' },
  ]

  const columns = [
    { key: 'month', label: 'Period', sortable: true },
    { key: 'revenue', label: 'Total Revenue', sortable: true, render: (row) => <span className="text-[#4A3A5C] font-bold">NPR {row.revenue.toLocaleString()}</span> },
    { key: 'commission', label: 'Commission', sortable: true, render: (row) => <span className="text-[#4A3A5C]">NPR {row.commission.toLocaleString()}</span> },
    { key: 'deals', label: 'Deals', sortable: true },
  ]

  const handleSearch = (data, term) => {
    return data.filter(item =>
      item.month.toLowerCase().includes(term.toLowerCase())
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-[#4A3A5C] animate-spin mb-4" />
        <p className="text-[#666666]">Loading financial data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Revenue Tracker</h1>
        <p className="text-[#666666]">Financial performance and transaction history</p>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Revenue (YTD)', value: `NPR ${(totalRevenue / 100000).toFixed(1)}L`, color: 'purple' },
          { label: 'Total Commission', value: `NPR ${(totalCommission / 100000).toFixed(1)}L`, color: 'blue' },
          { label: 'Total Deals', value: totalDeals, color: 'purple' },
        ].map((metric, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`bg-gradient-to-br from-[#F3F1F7] to-[#F3F1F7] border border-[#E5E5E5] rounded-xl p-6`}
          >
            <p className="text-[#666666] text-sm mb-2">{metric.label}</p>
            <p className={`text-3xl font-bold text-[#4A3A5C]`}>{metric.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-[#E5E5E5] rounded-xl p-6 shadow-sm hover:shadow-md transition"
        >
          <h3 className="text-lg font-bold text-[#1A1A1A] mb-4">Revenue Trend (Monthly)</h3>
          {revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(229, 229, 229, 0.5)" />
                <XAxis dataKey="month" stroke="#1A1A1A" />
                <YAxis stroke="#1A1A1A" />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', color: '#1A1A1A' }} />
                <Legend />
                <Line type="monotone" dataKey="revenue" name="Total Revenue" stroke="#4A3A5C" strokeWidth={2} />
                <Line type="monotone" dataKey="commission" name="Commission" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-[#666666]">No revenue data available yet</p>
            </div>
          )}
        </motion.div>

        {/* Revenue Breakdown */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-[#E5E5E5] rounded-xl p-6 shadow-sm hover:shadow-md transition"
        >
          <h3 className="text-lg font-bold text-[#1A1A1A] mb-4">Revenue Breakdown</h3>
          {totalRevenue > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={revenueBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                    {revenueBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', color: '#1A1A1A' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2 text-sm">
                {revenueBreakdown.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                      <span className="text-[#666666]">{item.name}</span>
                    </div>
                    <span className="text-[#1A1A1A] font-bold">NPR {item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-[#666666]">No breakdown data yet</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Summary Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white border border-[#E5E5E5] rounded-xl p-6 shadow-sm hover:shadow-md transition"
      >
        <h3 className="text-lg font-bold text-[#1A1A1A] mb-4">Monthly Financial Summary</h3>
        <DataTable
          columns={columns}
          data={revenueData}
          onSearch={handleSearch}
          searchPlaceholder="Search months..."
          pageSize={5}
          emptyMessage="No financial records found"
        />
      </motion.div>
    </div>
  )
}
