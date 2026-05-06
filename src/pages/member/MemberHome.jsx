import { BarChart3, ShoppingCart, AlertCircle, DollarSign, Package, Bell, Send, ArrowRight, Heart, Calendar } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useAppStore } from '../../store/appStore'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import DataTable from '../../components/ui/DataTable'

export default function MemberHome() {
  const { user, switchMode } = useAuthStore()
  const { 
    listings, requests, deals, notifications,
    fetchMyListings, fetchMyRequests, fetchMyDeals, fetchNotifications 
  } = useAppStore()
  const [mode, setMode] = useState(user?.mode || 'buyer')

  useEffect(() => {
    fetchMyListings()
    fetchMyRequests()
    fetchMyDeals()
    fetchNotifications()
  }, [])

  const toggleMode = (newMode) => {
    setMode(newMode)
    switchMode(newMode)
  }

  // Get metric values
  const activeListingsCount = listings.filter(l => l.status === 'approved').length
  const pendingReviewsCount = listings.filter(l => l.status === 'pending_review' || l.status === 'PENDING').length
  const myRequestsCount = requests.length
  const activeDealsCount = deals.length

  const buyerStats = [
    { label: 'My Requests', value: myRequestsCount, icon: Send, color: 'purple', desc: 'Active RFQs' },
    { label: 'Active Deals', value: activeDealsCount, icon: Heart, color: 'blue', desc: 'In progress' },
    { label: 'Membership Plan', value: user?.plan || 'Pro', icon: Package, color: 'purple', desc: 'Current tier' },
  ]

  const sellerStats = [
    { label: 'Active Listings', value: activeListingsCount, icon: Package, color: 'purple', desc: 'Live items' },
    { label: 'Pending Reviews', value: pendingReviewsCount, icon: AlertCircle, color: 'amber', desc: 'Under review' },
    { label: 'Membership Plan', value: user?.plan || 'Pro', icon: DollarSign, color: 'purple', desc: 'Current tier' },
  ]

  const stats = mode === 'buyer' ? buyerStats : sellerStats

  const quickActions = mode === 'buyer' 
    ? [
        { label: 'Search Inventory', icon: ShoppingCart, to: '/search', color: 'purple' },
        { label: 'Request Quote', icon: Send, to: '/dashboard/request-quote', color: 'blue' },
        { label: 'My Requests', icon: Package, to: '/dashboard/my-requests', color: 'purple' },
      ]
    : [
        { label: 'Add Listing', icon: Package, to: '/dashboard/add-listing', color: 'purple' },
        { label: 'Bulk Upload', icon: BarChart3, to: '/dashboard/bulk-upload', color: 'blue' },
        { label: 'My Inventory', icon: ShoppingCart, to: '/dashboard/inventory', color: 'purple' },
      ]

  // My Enquiries table setup
  const enquiryColumns = [
    { key: 'listingName', label: 'Listing', sortable: false, render: (row) => (
      <div>
        <p className="font-medium text-[#1A1A1A] truncate max-w-sm">{row.listingName}</p>
        <p className="text-xs text-[#999999] mt-0.5">ID: {row.id}</p>
      </div>
    )},
    { key: 'timestamp', label: 'Submitted', sortable: true, render: (row) => (
      <span className="text-sm text-[#666666]">{row.timestamp}</span>
    )},
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (row) => (
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${
          row.status === 'new' ? 'bg-[#4A3A5C]/10 text-[#4A3A5C] border-[#4A3A5C]/30' :
          row.status === 'contacted' ? 'bg-blue-500/10 text-blue-600 border-blue-500/30' :
          'bg-[#4A3A5C]/20 text-[#4A3A5C]'
        }`}>
          {row.status === 'new' ? 'Pending' : 'Contacted'}
        </span>
      )
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header with Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border-b border-[#E5E5E5] p-6 rounded-xl">
        <div>
          <h1 className="text-3xl font-bold text-[#1A1A1A] mb-1">Welcome, {user?.full_name?.split(' ')[0] || user?.first_name || 'Member'}</h1>
          <p className="text-[#666666]">Plan: <span className="text-[#4A3A5C] font-semibold">{user?.plan} Member</span> • VAT: <span className="font-mono text-[#1A1A1A]">{user?.vat_number}</span></p>
        </div>
        
        {/* Mode Toggle */}
        <div className="flex gap-2 bg-[#F3F1F7] p-1 rounded-lg w-fit border border-[#E5E5E5]">
          <button
            onClick={() => toggleMode('buyer')}
            className={`px-4 py-2.5 rounded-md font-medium transition ${
              mode === 'buyer'
                ? 'bg-[#4A3A5C] text-white'
                : 'text-[#666666] hover:text-[#4A3A5C]'
            }`}
          >
            🛍️ Buy
          </button>
          <button
            onClick={() => toggleMode('seller')}
            className={`px-4 py-2.5 rounded-md font-medium transition ${
              mode === 'seller'
                ? 'bg-[#4A3A5C] text-white'
                : 'text-[#666666] hover:text-[#4A3A5C]'
            }`}
          >
            📦 Sell
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          const colorMap = {
            emerald: 'border-[#E5E5E5] bg-gradient-to-br from-[#F9F9FB] to-white',
            blue: 'border-[#E5E5E5] bg-gradient-to-br from-[#F9F9FB] to-white',
            purple: 'border-[#E5E5E5] bg-gradient-to-br from-[#F9F9FB] to-white',
            amber: 'border-[#E5E5E5] bg-gradient-to-br from-[#F9F9FB] to-white',
            green: 'border-[#E5E5E5] bg-gradient-to-br from-[#F9F9FB] to-white',
          }

          const iconColorMap = {
            emerald: 'text-[#4A3A5C]',
            blue: 'text-blue-600',
            purple: 'text-[#4A3A5C]',
            amber: 'text-amber-600',
            green: 'text-[#4A3A5C]',
          }

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`border rounded-xl p-6 hover:shadow-md transition ${colorMap[stat.color]}`}
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className={`w-8 h-8 ${iconColorMap[stat.color]}`} />
              </div>
              <p className="text-[#666666] text-sm mb-1">{stat.label}</p>
              {typeof stat.value === 'number' ? (
                <p className="text-4xl font-bold text-[#1A1A1A]">{stat.value}</p>
              ) : (
                <p className="text-2xl font-bold text-[#4A3A5C]">{stat.value}</p>
              )}
              <p className="text-xs text-[#666666] mt-2">{stat.desc}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, idx) => {
            const Icon = action.icon
            return (
              <Link
                key={idx}
                to={action.to}
                className="group bg-[#F8F8FA] border border-[#E5E5E5] hover:border-[#4A3A5C] rounded-lg p-6 transition duration-300 hover:bg-[#F3F1F7]"
              >
                <Icon className={`w-8 h-8 mb-3 text-[#666666] group-hover:text-[#4A3A5C] transition`} />
                <p className="text-[#1A1A1A] font-medium group-hover:text-[#4A3A5C] transition flex items-center gap-2">
                  {action.label}
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition -translate-x-2 group-hover:translate-x-0" />
                </p>
              </Link>
            )
          })}
        </div>
      </div>


      {/* Plan Status */}
      <div className="bg-gradient-to-r from-[#F3F1F7] to-white border border-[#E5E5E5] rounded-xl p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-[#1A1A1A] mb-1">Upgrade Your Plan</h3>
            <p className="text-[#666666]">Unlock more features and higher limits with Professional or Enterprise plans</p>
          </div>
          <Link
            to="/dashboard/subscription"
            className="bg-[#4A3A5C] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#574B66] transition w-fit whitespace-nowrap"
          >
            View Plans
          </Link>
        </div>
      </div>
    </div>
  )
}
