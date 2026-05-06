import { useAuthStore } from '../../store/authStore'
import { useAppStore } from '../../store/appStore'
import Pagination from '../../components/ui/Pagination'
import DataTable from '../../components/ui/DataTable'
import { Edit2, Trash2, RotateCcw, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Modal from '../../components/ui/Modal'
import toast from 'react-hot-toast'
import { getMyListings } from '../../services/listingsService'

export default function MyInventoryPage() {
  const { user } = useAuthStore()
  const { listings, loading: isLoading, fetchMyListings } = useAppStore()
  const [selectedListing, setSelectedListing] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const loadData = async (pageNumber = 1) => {
    const data = await fetchMyListings(pageNumber, 10)
    if (data && !Array.isArray(data)) {
      setTotalPages(data.totalPages || 1)
    }
  }

  useEffect(() => {
    loadData(page)
  }, [page])

  const statusColors = {
    'pending': 'bg-amber-100 text-amber-800 border-amber-300',
    'pending_review': 'bg-amber-100 text-amber-800 border-amber-300', // legacy compat
    'approved': 'bg-green-100 text-green-800 border-green-300',
    'rejected': 'bg-red-100 text-red-800 border-red-300',
    'counter_sent': 'bg-blue-100 text-blue-800 border-blue-300',
  }

  const statusLabels = {
    'pending': 'PENDING REVIEW',
    'pending_review': 'PENDING REVIEW',
    'approved': 'LIVE ✅',
    'rejected': 'REJECTED ❌',
    'counter_sent': 'COUNTER OFFER',
  }

  const columns = [
    { key: 'name', label: 'Item Name', sortable: true, render: (row) => (
      <div>
        <p className="font-medium text-[#1A1A1A]">{row.name || row.item_name}</p>
        <p className="text-xs text-[#999999] mt-0.5">{row.oem || row.oem_part_no}</p>
      </div>
    )},
    { key: 'condition', label: 'Condition', sortable: true },
    { key: 'seller_bid_price', label: 'Bid Price', sortable: true, render: (row) => `NPR ${parseFloat(row.seller_bid_price || row.bid_price || 0).toLocaleString()}` },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true,
      render: (row) => (
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${statusColors[row.status]}`}>
          {statusLabels[row.status] || row.status}
        </span>
      )
    },
  ]

  const actions = (row) => [
    {
      label: 'View',
      onClick: () => {
        setSelectedListing(row)
        setIsModalOpen(true)
      },
      className: 'bg-[#E5E5E5] hover:bg-[#D9D9D9] text-[#1A1A1A] border border-[#E5E5E5]',
    },
  ]

  const handleSearch = (data, term) => {
    return data.filter(item =>
      item.name.toLowerCase().includes(term.toLowerCase()) ||
      item.request_id.toLowerCase().includes(term.toLowerCase()) ||
      (item.oem && item.oem.toLowerCase().includes(term.toLowerCase()))
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">My Inventory</h1>
            <p className="text-[#666666]">Manage your equipments and parts listings</p>
          </div>
          <button 
            onClick={fetchMyListings}
            className="p-2 text-[#4A3A5C] hover:bg-[#4A3A5C]/10 rounded-lg transition"
            title="Refresh list"
          >
            <RotateCcw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </motion.div>

      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center bg-[#F9F9FB] border-2 border-dashed border-[#E5E5E5] rounded-xl"
        >
          <Loader2 className="w-8 h-8 text-[#4A3A5C] animate-spin mb-4" />
          <p className="text-[#666666]">Loading your inventory...</p>
        </motion.div>
      ) : listings.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-[#E5E5E5] rounded-xl p-6 hover:shadow-md transition"
        >
          <DataTable
            columns={columns}
            data={listings}
            actions={actions}
            onSearch={handleSearch}
            searchPlaceholder="Search by item name or Request ID..."
            pageSize={10}
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
          className="flex flex-col items-center justify-center py-20 text-center bg-[#F9F9FB] border-2 border-dashed border-[#E5E5E5] rounded-xl"
        >
          <p className="text-[#666666] mb-2">No inventory items yet</p>
          <p className="text-[#999999] text-sm">Start by adding your first equipment and part listing</p>
        </motion.div>
      )}

      {/* Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedListing?.name}
        size="lg"
      >
        {selectedListing && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-[#666666]">Request ID</p>
                <p className="text-[#4A3A5C] font-mono font-bold mt-1">{selectedListing.request_id}</p>
              </div>
              <div>
                <p className="text-sm text-[#666666]">OEM Number</p>
                <p className="text-[#1A1A1A] font-mono font-bold mt-1">{selectedListing.oem || selectedListing.oem_part_no || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-[#666666]">Make/Brand</p>
                <p className="text-[#1A1A1A] font-semibold mt-1">{selectedListing.make}</p>
              </div>
              <div>
                <p className="text-sm text-[#666666]">Condition</p>
                <p className="text-[#1A1A1A] font-semibold mt-1">{selectedListing.condition}</p>
              </div>
              <div>
                <p className="text-sm text-[#666666]">Year</p>
                <p className="text-[#1A1A1A] font-semibold mt-1">{selectedListing.year || selectedListing.year_of_purchase || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-[#666666]">Bid Price</p>
                <p className="text-[#4A3A5C] font-bold text-lg mt-1">NPR {parseFloat(selectedListing.seller_bid_price || selectedListing.bid_price || 0).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-[#666666]">Status</p>
                <p className={`text-[#1A1A1A] font-semibold mt-1 px-3 py-1 rounded-full text-xs w-fit border ${statusColors[selectedListing.status]}`}>
                  {statusLabels[selectedListing.status] || selectedListing.status}
                </p>
              </div>
            </div>
            {/* Rejection Reason (Phase 8 Test 4) */}
            {selectedListing.status === 'rejected' && selectedListing.rejection_reason && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-red-700 mb-1">Rejection Reason</p>
                <p className="text-sm text-red-600">{selectedListing.rejection_reason}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-[#666666]">Description / Remarks</p>
              <p className="text-[#1A1A1A] mt-1">{selectedListing.description || selectedListing.remarks || '—'}</p>
            </div>
            <div>
              <p className="text-sm text-[#666666]">ETA</p>
              <p className="text-[#1A1A1A] font-semibold mt-1">{selectedListing.eta}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
