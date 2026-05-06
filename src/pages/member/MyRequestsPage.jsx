import { useAppStore } from '../../store/appStore'
import Pagination from '../../components/ui/Pagination'
import { useAuthStore } from '../../store/authStore'
import DataTable from '../../components/ui/DataTable'
import { Badge } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function MyRequestsPage() {
  const { requests, fetchMyRequests } = useAppStore()
  const { user } = useAuthStore()
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const loadData = async (pageNumber = 1) => {
    const data = await fetchMyRequests(pageNumber, 10)
    if (data && !Array.isArray(data)) {
      setTotalPages(data.totalPages || 1)
    }
  }

  useEffect(() => {
    loadData(page)
  }, [page])

  const statusColors = {
    'pending': 'bg-amber-100 text-amber-800 border-amber-300',
    'matched': 'bg-blue-100 text-blue-800 border-blue-300',
    'quote_sent': 'bg-green-100 text-green-800 border-green-300',
    'accepted': 'bg-purple-100 text-purple-800 border-purple-300',
  }

  const columns = [
    { key: 'request_id', label: 'Request ID', sortable: true },
    { key: 'item_name', label: 'Item Name', sortable: true, render: (row) => (
      <span className="truncate max-w-xs font-medium">{row.item_name}</span>
    )},
    { key: 'urgency', label: 'Urgency', sortable: true },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true,
      render: (row) => (
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${statusColors[row.status?.toLowerCase()] || 'bg-[#E8E3F0] text-[#4A3A5C] border-[#4A3A5C]/30'}`}>
          {row.status?.toUpperCase()}
        </span>
      )
    },
    { key: 'created_at', label: 'Submitted Date', sortable: true, render: (row) => row.created_at?.split('T')[0] },
  ]

  const actions = (row) => [
    {
      label: 'View Details',
      onClick: () => alert(`Details for ${row.request_id}`),
      className: 'bg-[#E8E3F0] hover:bg-[#D8D1E0] text-[#4A3A5C] px-3 py-1.5 text-xs font-medium rounded-lg transition',
    }
  ]

  const handleSearch = (data, term) => {
    return data.filter(item =>
      item.request_id.toLowerCase().includes(term.toLowerCase()) ||
      item.item_name.toLowerCase().includes(term.toLowerCase())
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">My Requests</h1>
        <p className="text-[#666666]">Track all your quote requests and responses from sellers</p>
      </motion.div>

      {requests.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-[#E5E5E5] rounded-xl p-6 shadow-sm hover:shadow-md transition"
        >
          <DataTable
            columns={columns}
            data={requests}
            actions={actions}
            onSearch={handleSearch}
            searchPlaceholder="Search requests by ID or description..."
            emptyMessage="No requests yet"
          />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center bg-[#F3F1F7] border-2 border-dashed border-[#E5E5E5] rounded-xl"
        >
          <p className="text-[#1A1A1A] mb-2">No requests yet</p>
          <p className="text-[#666666] text-sm">Create your first quote request to get started</p>
        </motion.div>
      )}
    </div>
  )
}
