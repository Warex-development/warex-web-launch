import { useState, useEffect } from 'react'
import DataTable from '../../components/ui/DataTable'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { adminGetAllListings } from '../../services/listingsService'
import Pagination from '../../components/ui/Pagination'

export default function ApprovedInventoryPage() {
  const [approvedItems, setApprovedItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchApproved = async (pageNumber = 1) => {
    setIsLoading(true)
    try {
      const data = await adminGetAllListings('approved', pageNumber, 10)
      const list = Array.isArray(data) ? data : (data.data || data.listings || [])
      setApprovedItems(list)
      if (!Array.isArray(data)) {
        setTotalPages(data.totalPages || 1)
      }
    } catch (error) {
      toast.error('Failed to load approved inventory')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchApproved(page)
  }, [page])

  const columns = [
    { key: 'request_id', label: 'Request ID', sortable: true, render: (row) => <span className="font-mono text-[#4A3A5C]">{row.request_id}</span> },
    { key: 'name', label: 'Item', sortable: true, render: (row) => row.name || row.item_name },
    { key: 'oem', label: 'OEM Number', sortable: true, render: (row) => <span className="font-mono">{row.oem || row.oem_part_no || 'N/A'}</span> },
    { key: 'make', label: 'Make', sortable: true, render: (row) => row.make || '—' },
    { 
      key: 'seller_bid_price', 
      label: 'Bid Price', 
      sortable: true, 
      render: (row) => <span className="text-[#4A3A5C] font-bold">NPR {parseFloat(row.seller_bid_price || row.bid_price || 0).toLocaleString()}</span> 
    },
    { key: 'seller_id', label: 'Seller ID', sortable: true, render: (row) => <span className="font-mono text-[#666666] text-xs truncate max-w-[100px] inline-block">{row.seller_id}</span> },
    { key: 'approved_on', label: 'Approved', sortable: true, render: (row) => (row.approved_on || row.approved_at) ? new Date(row.approved_on || row.approved_at).toLocaleDateString() : 'N/A' },
  ]

  const actions = (row) => [
    {
      label: 'View',
      onClick: () => alert(`Details for ${row.id}`),
      className: 'bg-gray-200 hover:bg-gray-300 text-[#1A1A1A] px-3 py-1.5 text-xs font-medium rounded-lg transition',
    }
  ]

  const handleSearch = (data, term) => {
    return data.filter(item =>
      (item.request_id || '').toLowerCase().includes(term.toLowerCase()) ||
      (item.name || item.item_name || '').toLowerCase().includes(term.toLowerCase()) ||
      ((item.oem || item.oem_part_no || '')).toLowerCase().includes(term.toLowerCase()) ||
      (item.make || '').toLowerCase().includes(term.toLowerCase())
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Approved Inventory</h1>
        <p className="text-[#666666]">All LIVE listings in the system</p>
      </motion.div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-[#E5E5E5] rounded-xl">
          <Loader2 className="w-8 h-8 text-[#4A3A5C] animate-spin mb-4" />
          <p className="text-[#666666]">Loading inventory data...</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-[#E5E5E5] rounded-xl p-6 shadow-sm hover:shadow-md transition"
        >
          <DataTable
            columns={columns}
            data={approvedItems}
            actions={actions}
            onSearch={handleSearch}
            searchPlaceholder="Search by Request ID, item name, or OEM..."
            pageSize={10}
          />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </motion.div>
      )}
    </div>
  )
}
