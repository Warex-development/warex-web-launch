import { motion } from 'framer-motion'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import DataTable from '../../components/ui/DataTable'
import { useAppStore } from '../../store/appStore'
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

export default function CommissionAnalyticsPage() {
  const { fetchDealsAnalytics } = useAppStore()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const result = await fetchDealsAnalytics()
      setData(result)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-[#4A3A5C] animate-spin mb-4" />
        <p className="text-[#666666]">Loading analytics...</p>
      </div>
    )
  }

  const commissionByCategory = data?.categories || []
  const commissionByDealType = data?.stages?.map(s => ({
    name: s.stage.replace('_', ' ').toUpperCase(),
    value: parseFloat(s.total_commission || 0),
    color: s.stage === 'completed' ? '#4A3A5C' : s.stage === 'accepted' ? '#3b82f6' : '#94a3b8'
  })) || []
  const topSellers = data?.sellers || []
  const summary = data?.summary || { total_deals: 0, completed: 0, avg_deal_value: 0 }

  const totalCommission = commissionByCategory.reduce((sum, d) => sum + parseFloat(d.commission), 0)

  const columns = [
    { key: 'code', label: 'Seller Code', sortable: true, render: (row) => <span className="font-mono text-[#4A3A5C] font-bold">{row.code}</span> },
    { key: 'sales', label: 'Total Sales', sortable: true, render: (row) => <span className="text-[#1A1A1A]">NPR {parseFloat(row.sales).toLocaleString()}</span> },
    { key: 'commission', label: 'Commission', sortable: true, render: (row) => <span className="text-[#4A3A5C] font-bold">NPR {parseFloat(row.commission).toLocaleString()}</span> },
    { key: 'deals', label: 'Deals', sortable: true },
  ]

  const handleSearch = (data, term) => {
    return data.filter(item => item.code.toLowerCase().includes(term.toLowerCase()))
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Commission Analytics</h1>
        <p className="text-[#666666]">Performance metrics and seller rankings</p>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Commission', value: `NPR ${(totalCommission / 100000).toFixed(1)}L`, color: 'purple' },
          { label: 'Avg Deal Value', value: `NPR ${(parseFloat(summary.avg_deal_value || 0) / 1000).toFixed(0)}K`, color: 'blue' },
          { label: 'Total Deals', value: summary.total_deals, color: 'purple' },
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
        {/* Commission by Category */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-[#E5E5E5] rounded-xl p-6 shadow-sm hover:shadow-md transition"
        >
          <h3 className="text-lg font-bold text-[#1A1A1A] mb-4">Commission by Category</h3>
          {commissionByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={commissionByCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(229, 229, 229, 0.5)" />
                <XAxis dataKey="category" stroke="#1A1A1A" />
                <YAxis stroke="#1A1A1A" />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', color: '#1A1A1A' }} />
                <Bar dataKey="commission" fill="#4A3A5C" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-[#666666]">No category data yet</p>
            </div>
          )}
        </motion.div>

        {/* Deal Type Distribution */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-[#E5E5E5] rounded-xl p-6 shadow-sm hover:shadow-md transition"
        >
          <h3 className="text-lg font-bold text-[#1A1A1A] mb-4">Commission by Deal Stage</h3>
          {commissionByDealType.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={commissionByDealType} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                    {commissionByDealType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', color: '#1A1A1A' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2 text-sm">
                {commissionByDealType.map((item, idx) => (
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
              <p className="text-[#666666]">No deal data yet</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Top Sellers */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white border border-[#E5E5E5] rounded-xl p-6 shadow-sm hover:shadow-md transition"
      >
        <h3 className="text-lg font-bold text-[#1A1A1A] mb-4">Top 5 Sellers by Commission</h3>
        <DataTable
          columns={columns}
          data={topSellers}
          onSearch={handleSearch}
          searchPlaceholder="Search sellers..."
          pageSize={5}
          emptyMessage="No seller data found"
        />
      </motion.div>
    </div>
  )
}
