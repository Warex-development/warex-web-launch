import { useAppStore } from '../../store/appStore'
import { useAuthStore } from '../../store/authStore'
import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import Modal from '../../components/ui/Modal'
import { TextArea, Button, FormField } from '../../components/ui/FormComponents'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

const CORRECTION_CODES = {
  'CR-01': 'Missing OEM Number',
  'CR-02': 'Incorrect Category',
  'CR-03': 'Price Out of Market Range',
  'CR-04': 'Incomplete Description',
  'CR-05': 'Invalid Images',
  'CR-06': 'Unclear Condition',
  'CR-07': 'Invalid ETA',
  'CR-08': 'Other - See Admin Note',
}

export default function PendingReviewsPage() {
  const { inventory, updateListingStatus } = useAppStore()
  const { user } = useAuthStore()
  const [selectedItem, setSelectedItem] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isResubmitting, setIsResubmitting] = useState(false)

  const pendingItems = inventory.filter(
    i => i.sellerCode === user?.code && i.status === 'NEEDS CORRECTION'
  )

  const handleResubmit = async (itemId) => {
    setIsResubmitting(true)
    try {
      await new Promise(r => setTimeout(r, 1200))
      updateListingStatus(itemId, 'PENDING REVIEW')
      toast.success('Item resubmitted for review')
      setIsEditModalOpen(false)
      setSelectedItem(null)
    } catch (error) {
      toast.error('Failed to resubmit')
    } finally {
      setIsResubmitting(false)
    }
  }

  if (pendingItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="bg-emerald-50 border border-emerald-200 rounded-full p-6 mb-4">
          <AlertCircle className="w-8 h-8 text-[#4A3A5C] mx-auto" />
        </div>
        <h2 className="text-xl font-bold text-[#1A1A1A] mb-1">All Clear!</h2>
        <p className="text-[#666666]">No items requiring corrections at the moment.</p>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Pending Reviews</h1>
        <p className="text-[#666666]">Items flagged by admin for corrections</p>
      </motion.div>

      <div className="space-y-4">
        {pendingItems.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-amber-50 border border-amber-200 rounded-lg p-6"
          >
            <div className="flex gap-4">
              {/* Icon */}
              <div className="flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-[#1A1A1A]">{item.name}</h3>
                    <p className="text-sm text-amber-600 font-mono mt-1">{item.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#666666]">OEM</p>
                    <p className="text-[#1A1A1A] font-mono font-bold">{item.oem}</p>
                  </div>
                </div>

                {/* Correction Reason */}
                <div className="bg-amber-100/30 rounded-lg p-3 mb-4 border border-amber-200">
                  <p className="text-xs text-[#666666] mb-1">Correction Required</p>
                  <p className="text-[#1A1A1A] font-medium mb-1">{CORRECTION_CODES['CR-04']}</p>
                  <p className="text-sm text-[#666666]">
                    {item.adminNote || 'Please review your item details and ensure all fields are complete and accurate.'}
                  </p>
                </div>

                {/* Actions */}
                <button
                  onClick={() => {
                    setSelectedItem(item)
                    setIsEditModalOpen(true)
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition text-sm"
                >
                  Edit & Resubmit
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit: ${selectedItem?.name}`}
        size="lg"
      >
        {selectedItem && (
          <div className="space-y-4">
            <FormField label="Item Name">
              <input
                type="text"
                defaultValue={selectedItem.name}
                className="w-full px-4 py-2.5 bg-white border border-[#E5E5E5] rounded-lg text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#4A3A5C]"
              />
            </FormField>

            <FormField label="Description">
              <TextArea
                defaultValue={selectedItem.description}
                rows={4}
              />
            </FormField>

            <FormField label="OEM Part Number">
              <input
                type="text"
                defaultValue={selectedItem.oem}
                className="w-full px-4 py-2.5 bg-white border border-[#E5E5E5] rounded-lg text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#4A3A5C]"
              />
            </FormField>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => handleResubmit(selectedItem.id)}
                loading={isResubmitting}
              >
                Resubmit for Review
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
