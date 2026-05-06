import { useAppStore } from '../../store/appStore'
import { useState } from 'react'
import { CheckCircle2, Heart, Clock, MessageSquare } from 'lucide-react'
import DataTable from '../../components/ui/DataTable'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function AdminLeadsPage() {
  const { leads } = useAppStore()
  const [searchTerm, setSearchTerm] = useState('')

  const allLeads = leads || []

  const statusColors = {
    'new': 'bg-[#F3F1F7] text-[#4A3A5C] border-[#4A3A5C]/30',
    'contacted': 'bg-[#F3F1F7] text-[#4A3A5C] border-[#4A3A5C]/30',
    'closed': 'bg-[#F3F1F7] text-[#4A3A5C] border-[#4A3A5C]/30',
  }

  const handleMarkContacted = async (leadId) => {
    await new Promise(r => setTimeout(r, 500))
    toast.success('Lead marked as contacted')
  }

  const handleMarkClosed = async (leadId) => {
    await new Promise(r => setTimeout(r, 500))
    toast.success('Lead marked as closed')
  }

  const columns = [
    {
      key: 'listingName',
      label: 'Listing',
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-medium text-[#1A1A1A] truncate max-w-sm">{row.listingName}</p>
          <p className="text-xs text-[#666666] mt-0.5">{row.listingId}</p>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Contact',
      sortable: false,
      render: (row) => (
        <div>
          <p className="text-sm text-[#1A1A1A]">{row.phone}</p>
          <p className="text-xs text-[#666666] mt-0.5">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'timestamp',
      label: 'Submitted',
      sortable: true,
      render: (row) => <span className="text-sm text-[#666666]">{row.timestamp}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (row) => (
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${
            statusColors[row.status] || statusColors['new']
          }`}
        >
          {row.status === 'new' ? 'New' : row.status === 'contacted' ? 'Contacted' : 'Closed'}
        </span>
      ),
    },
  ]

  const actions = (row) => [
    row.status === 'new' && {
      label: 'Mark Contacted',
      onClick: () => handleMarkContacted(row.id),
      className: 'bg-[#F3F1F7] hover:bg-[#E8E3F0] text-[#4A3A5C] border border-[#E5E5E5] px-3 py-1.5 text-xs font-medium rounded-lg transition',
    },
    {
      label: 'View Details',
      onClick: () => {
        const details = `
Listing: ${row.listingName}
Phone: ${row.phone}
Email: ${row.email}
Submitted: ${row.timestamp}
Status: ${row.status}
        `
        alert(details)
      },
      className: 'bg-gray-100 hover:bg-gray-200 text-[#1A1A1A] border border-[#E5E5E5] px-3 py-1.5 text-xs font-medium rounded-lg transition',
    },
  ].filter(Boolean)

  const handleSearch = (data, term) => {
    return data.filter(
      item =>
        item.listingName.toLowerCase().includes(term.toLowerCase()) ||
        item.phone.includes(term) ||
        item.email.toLowerCase().includes(term.toLowerCase())
    )
  }

  const filteredLeads = handleSearch(allLeads, searchTerm)

  const stats = [
    {
      label: 'Total Leads',
      value: allLeads.length,
      icon: Heart,
      color: 'emerald',
    },
    {
      label: 'New Leads',
      value: allLeads.filter(l => l.status === 'new').length,
      icon: Clock,
      color: 'amber',
    },
    {
      label: 'Contacted',
      value: allLeads.filter(l => l.status === 'contacted').length,
      icon: CheckCircle2,
      color: 'blue',
    },
    {
      label: 'Conversion Rate',
      value: allLeads.length > 0 ? `${Math.round((allLeads.filter(l => l.status === 'contacted').length / allLeads.length) * 100)}%` : '0%',
      icon: MessageSquare,
      color: 'purple',
    },
  ]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Guest Leads & Interests</h1>
        <p className="text-[#666666]">Track and manage guest interest submissions from the public search page</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          const colorMap = {
            emerald: 'from-purple-100 to-purple-100 border-purple-300',
            amber: 'from-amber-100 to-amber-100 border-amber-300',
            blue: 'from-blue-100 to-blue-100 border-blue-300',
            purple: 'from-purple-100 to-purple-100 border-purple-300',
          }

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`bg-gradient-to-br ${colorMap[stat.color]} border rounded-xl p-4`}
            >
              <div className="flex items-center justify-between mb-3">
                <Icon className="w-5 h-5 text-[#4A3A5C]" />
              </div>
              <p className="text-[#666666] text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-[#4A3A5C]">{stat.value}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Search and Table */}
      {allLeads.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-[#E5E5E5] rounded-xl p-6 shadow-sm hover:shadow-md transition"
        >
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by listing name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-[#E5E5E5] rounded-lg text-[#1A1A1A] placeholder-[#999999] focus:outline-none focus:ring-2 focus:ring-[#4A3A5C]"
            />
          </div>

          <DataTable
            columns={columns}
            data={filteredLeads}
            actions={actions}
            searchPlaceholder="Search leads..."
            emptyMessage="No leads found"
          />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 border-2 border-dashed border-[#E5E5E5] rounded-xl"
        >
          <Heart className="w-12 h-12 text-[#CCCCCC] mb-4" />
          <p className="text-[#1A1A1A] mb-2">No guest leads yet</p>
          <p className="text-[#666666] text-sm">Guest interests from the public search page will appear here</p>
        </motion.div>
      )}
    </div>
  )
}
