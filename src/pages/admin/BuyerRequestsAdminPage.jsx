import { useState, useEffect } from 'react'
import { useAppStore } from '../../store/appStore'
import Pagination from '../../components/ui/Pagination'
import { Loader2 } from 'lucide-react'
import DataTable from '../../components/ui/DataTable'
import { motion } from 'framer-motion'
import { Button } from '../../components/ui/FormComponents'

export default function BuyerRequestsAdminPage() {
  const { requests, fetchAllRequests, loading } = useAppStore()
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const loadData = async (pageNumber = 1) => {
    const data = await fetchAllRequests(pageNumber, 10)
    if (data && !Array.isArray(data)) {
      setTotalPages(data.totalPages || 1)
    }
  }

  useEffect(() => {
    loadData(page)
  }, [page])

  const statusColors = {
    'pending': 'bg-amber-50 text-amber-700 border-amber-200',
    'matched': 'bg-blue-50 text-blue-700 border-blue-200',
    'quote_sent': 'bg-purple-50 text-purple-700 border-purple-200',
    'accepted': 'bg-green-50 text-green-700 border-green-200',
  }

  const columns = [
    { key: 'request_id', label: 'Request ID', sortable: true, render: (row) => <span className="font-mono text-[#4A3A5C] font-bold">{row.request_id}</span> },
    { key: 'description', label: 'Description', sortable: false, render: (row) => <span className="truncate max-w-xs text-[#1A1A1A]">{row.description}</span> },
    { key: 'buyer_code', label: 'Buyer Code', sortable: true, render: (row) => <span className="font-mono text-[#4A3A5C]">{row.buyer_code}</span> },
    { key: 'urgency', label: 'Urgency', sortable: true, render: (row) => <span className="capitalize">{row.urgency}</span> },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true,
      render: (row) => (
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${statusColors[row.status] || 'bg-gray-50'}`}>
          {row.status.replace('_', ' ').toUpperCase()}
        </span>
      )
    },
    { key: 'created_at', label: 'Submitted', sortable: true, render: (row) => new Date(row.created_at).toLocaleDateString() },
  ]

  const actions = (row) => [
    {
      label: 'Match Items',
      onClick: () => alert(`Matching items for ${row.request_id}`),
      className: 'bg-purple-100 hover:bg-purple-200 text-[#4A3A5C] border border-purple-300 px-3 py-1.5 text-xs font-medium rounded-lg transition',
    }
  ]

  const handleSearch = (data, term) => {
    return data.filter(item =>
      item.request_id.toLowerCase().includes(term.toLowerCase()) ||
      item.description.toLowerCase().includes(term.toLowerCase())
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Buyer Requests</h1>
        <p className="text-[#666666]">All requests from buyers</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white border border-[#E5E5E5] rounded-xl p-6 shadow-sm hover:shadow-md transition"
      >
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 text-[#4A3A5C] animate-spin" />
          </div>
        ) : (
          <>
            <DataTable
              columns={columns}
              data={requests}
              actions={actions}
              onSearch={handleSearch}
              searchPlaceholder="Search requests..."
              pageSize={10}
            />
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </motion.div>
    </div>
  )
}
