import { useAuthStore } from '../../store/authStore'
import { useState, useEffect } from 'react'
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react'
import Modal from '../../components/ui/Modal'
import { TextArea, Select, Button, FormField } from '../../components/ui/FormComponents'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { adminGetPendingListings, adminApproveListing, adminRejectListing } from '../../services/listingsService'
import Pagination from '../../components/ui/Pagination'

const CORRECTION_CODES = [
  { value: 'CR-01', label: 'CR-01: Missing OEM Number' },
  { value: 'CR-02', label: 'CR-02: Incorrect Category' },
  { value: 'CR-03', label: 'CR-03: Price Out of Range' },
  { value: 'CR-04', label: 'CR-04: Incomplete Description' },
  { value: 'CR-05', label: 'CR-05: Invalid Images' },
  { value: 'CR-06', label: 'CR-06: Unclear Condition' },
  { value: 'CR-07', label: 'CR-07: Invalid ETA' },
  { value: 'CR-08', label: 'CR-08: Other' },
]

export default function PendingQueuePage() {
  const { user } = useAuthStore()
  const [pendingItems, setPendingItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState(null)
  const [modalType, setModalType] = useState(null) // 'approve' | 'reject' | 'pending'
  const [isProcessing, setIsProcessing] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchPending = async () => {
    setIsLoading(true)
    try {
      const data = await adminGetPendingListings()
      const list = Array.isArray(data) ? data : (data.data || [])
      setPendingItems(list)
    } catch (error) {
      toast.error('Failed to load pending listings')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchPending()
    }
  }, [user])

  const handleApprove = async (itemId) => {
    setIsProcessing(true)
    try {
      await adminApproveListing(itemId)
      toast.success('Item approved — now LIVE to buyers ✅')
      setModalType(null)
      fetchPending()
    } catch (error) {
      toast.error(error.message || 'Approval failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async (itemId, reason) => {
    const finalReason = reason || rejectionReason
    if (!finalReason.trim()) {
      return toast.error('Please provide a reason')
    }
    setIsProcessing(true)
    try {
      await adminRejectListing(itemId, finalReason)
      toast.error('Item rejected')
      setModalType(null)
      setRejectionReason('')
      fetchPending()
    } catch (error) {
      toast.error(error.message || 'Rejection failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePendingReview = async (itemId, correctionCode, note) => {
    handleReject(itemId, `${correctionCode}: ${note}`)
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Pending Listings Queue</h1>
        <p className="text-[#666666]">Review and approve/reject listings</p>
      </motion.div>

      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 border-2 border-dashed border-[#E5E5E5] rounded-xl"
        >
          <Loader2 className="w-8 h-8 text-[#4A3A5C] animate-spin mb-4" />
          <p className="text-[#1A1A1A]">Loading pending items...</p>
        </motion.div>
      ) : pendingItems.length > 0 ? (
        <div className="space-y-4">
          {pendingItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white border border-[#E5E5E5] hover:shadow-md rounded-lg p-6 transition shadow-sm"
            >
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                <div>
                  <p className="text-xs text-[#666666] mb-1">Item Name</p>
                  <p className="text-[#1A1A1A] font-medium">{item.name || item.item_name}</p>
                </div>
                <div>
                  <p className="text-xs text-[#666666] mb-1">Request ID</p>
                  <p className="text-[#4A3A5C] font-mono font-bold">{item.request_id}</p>
                </div>
                <div>
                  <p className="text-xs text-[#666666] mb-1">OEM Number</p>
                  <p className="text-[#1A1A1A] font-mono text-sm">{item.oem || item.oem_part_no || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-[#666666] mb-1">Seller</p>
                  <p className="text-[#1A1A1A] text-sm font-medium">{item.seller_name || '—'}</p>
                  <p className="text-[#999999] text-xs truncate">{item.seller_email || item.seller_id}</p>
                </div>
                <div>
                  <p className="text-xs text-[#666666] mb-1">Submitted</p>
                  <p className="text-[#1A1A1A]">{new Date(item.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Description Preview */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4 border border-[#E5E5E5]">
                <p className="text-xs text-[#666666] mb-1">Description</p>
                <p className="text-sm text-[#1A1A1A] line-clamp-2">{item.description}</p>
              </div>

              <div className="mb-4 flex gap-4 text-sm flex-wrap">
                <div>
                  <span className="text-[#666666]">Bid Price:</span>
                  <span className="ml-2 text-[#4A3A5C] font-bold">NPR {parseFloat(item.seller_bid_price || item.bid_price || 0).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[#666666]">Condition:</span>
                  <span className="ml-2 text-[#1A1A1A]">{item.condition}</span>
                </div>
                <div>
                  <span className="text-[#666666]">Year:</span>
                  <span className="ml-2 text-[#1A1A1A]">{item.year || item.year_of_purchase || '—'}</span>
                </div>
                <div>
                  <span className="text-[#666666]">Make:</span>
                  <span className="ml-2 text-[#1A1A1A]">{item.make || '—'}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSelectedItem(item)
                    setModalType('approve')
                  }}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Approve
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    setSelectedItem(item)
                    setModalType('reject')
                  }}
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSelectedItem(item)
                    setModalType('pending')
                  }}
                >
                  <AlertCircle className="w-4 h-4" />
                  Corrections Needed
                </Button>
              </div>
            </motion.div>
          ))}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => { setPage(p); fetchPending(); }}
          />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 border-2 border-dashed border-[#E5E5E5] rounded-xl"
        >
          <CheckCircle2 className="w-12 h-12 text-[#4A3A5C] mb-4 opacity-50" />
          <p className="text-[#1A1A1A] mb-1">Queue is empty!</p>
          <p className="text-[#666666] text-sm">All pending listings have been reviewed</p>
        </motion.div>
      )}

      {/* Approve Modal */}
      <Modal
        isOpen={modalType === 'approve' && !!selectedItem}
        onClose={() => setModalType(null)}
        title="Approve Listing"
      >
        <div className="space-y-4">
          <p className="text-[#1A1A1A]">
            Are you sure you want to approve <span className="font-bold text-[#4A3A5C]">{selectedItem?.name}</span>?
          </p>
          <p className="text-sm text-[#666666]">This item will be marked as LIVE and visible to buyers immediately.</p>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setModalType(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              loading={isProcessing}
              onClick={() => handleApprove(selectedItem.id)}
            >
              Approve & Go Live
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={modalType === 'reject' && !!selectedItem}
        onClose={() => setModalType(null)}
        title="Reject Listing"
      >
        <div className="space-y-4">
          <FormField label="Rejection Reason" required>
            <TextArea
              placeholder="Provide a detailed reason for rejection..."
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </FormField>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setModalType(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              loading={isProcessing}
              onClick={() => handleReject(selectedItem.id)}
            >
              Reject
            </Button>
          </div>
        </div>
      </Modal>

      {/* Pending Review Modal */}
      <Modal
        isOpen={modalType === 'pending' && !!selectedItem}
        onClose={() => setModalType(null)}
        title="Request Corrections"
      >
        <div className="space-y-4">
          <FormField label="Correction Code" required>
            <Select
              options={CORRECTION_CODES}
              placeholder="Select reason for correction"
            />
          </FormField>
          <FormField label="Admin Note">
            <TextArea
              placeholder="Additional notes for the seller..."
              rows={3}
            />
          </FormField>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setModalType(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              loading={isProcessing}
              onClick={() => handlePendingReview(selectedItem.id, 'CR-04', 'Please add more details')}
            >
              Send Corrections Request
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
