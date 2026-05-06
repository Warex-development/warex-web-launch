import { useAppStore } from '../../store/appStore'
import Pagination from '../../components/ui/Pagination'
import { useAuthStore } from '../../store/authStore'
import { useState, useEffect } from 'react'
import { CheckCircle2, XCircle, AlertCircle, Mail, Phone, Building } from 'lucide-react'
import Modal from '../../components/ui/Modal'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function AdminRegistrationsPage() {
  const { registrations, fetchPendingRegistrations, approveUser, rejectUser, isLoadingRegistrations } = useAppStore()

  const { user, token } = useAuthStore()
  const [selectedReg, setSelectedReg] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [action, setAction] = useState(null) // 'approve' | 'reject'
  const [isProcessing, setIsProcessing] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)


  const loadData = async (pageNumber = 1) => {
    const data = await fetchPendingRegistrations(pageNumber, 10)
    if (data && !Array.isArray(data)) {
      setTotalPages(data.totalPages || 1)
    }
  }

  // Fetch pending registrations from API when component mounts
  useEffect(() => {
    if (user && token && user.role === 'admin') {
      loadData(page)
    }
  }, [user, token, page])

  // Get pending registrations from store
  const pendingRegistrations = registrations.filter(reg => reg.status === 'pending')

  const handleApprove = async () => {
    if (!selectedReg) return
    setIsProcessing(true)
    try {
      const result = await approveUser(selectedReg.id, token)
      if (result.success) {
        toast.success(`✅ Approved: ${selectedReg.full_name} from ${selectedReg.company_name}\n\nUser can now login with their email/VAT number`)
      } else {
        toast.error(`Failed to approve user: ${result.error}`)
      }
      setIsModalOpen(false)
      setSelectedReg(null)
      setAction(null)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async () => {
    if (!selectedReg) return
    if (!rejectionReason.trim() || rejectionReason.trim().length < 5) {
      toast.error('Please enter a rejection reason (min 5 characters)')
      return
    }
    setIsProcessing(true)
    try {
      const result = await rejectUser(selectedReg.id, rejectionReason.trim())
      if (result.success) {
        toast.error(`❌ Rejected: ${selectedReg.full_name} (${selectedReg.company_name})`)
        setIsModalOpen(false)
        setSelectedReg(null)
        setAction(null)
        setRejectionReason('')
      } else {
        toast.error(`Failed to reject: ${result.error}`)
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const openModal = (reg, actionType) => {
    setSelectedReg(reg)
    setAction(actionType)
    setRejectionReason('')
    setIsModalOpen(true)
  }


  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Pending Registrations</h1>
        <p className="text-[#666666]">Review and approve new member applications</p>
      </motion.div>

      {isLoadingRegistrations ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 border-2 border-dashed border-[#E5E5E5] rounded-xl"
        >
          <div className="w-8 h-8 border-3 border-[#4A3A5C]/20 border-t-[#4A3A5C] rounded-full animate-spin mb-4" />
          <p className="text-[#1A1A1A]">Loading pending registrations...</p>
        </motion.div>
      ) : pendingRegistrations.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {pendingRegistrations.map((reg, idx) => (
            <motion.div
              key={reg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white border border-[#E5E5E5] rounded-xl p-6 hover:shadow-md transition"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Company Info */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Building className="w-5 h-5 text-[#4A3A5C]" />
                      <h3 className="text-lg font-bold text-[#1A1A1A]">{reg.company_name}</h3>
                    </div>
                    <p className="text-xs text-[#666666]">VAT: <span className="font-mono text-[#1A1A1A]">{reg.vat_number}</span></p>
                  </div>

                  <div>
                    <p className="text-sm text-[#666666] mb-1">Contact Person</p>
                    <p className="text-[#1A1A1A] font-medium">{reg.full_name}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-[#666666] mb-1">Industry</p>
                      <p className="text-sm text-[#1A1A1A]">{reg.industry}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#666666] mb-1">Role</p>
                      <p className="text-sm text-[#1A1A1A]">{reg.role}</p>
                    </div>
                  </div>
                </div>

                {/* Right: Contact + Actions */}
                <div className="space-y-4">
                  <div className="bg-[#F3F1F7] rounded-lg p-4 space-y-3 border border-[#E5E5E5]">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#4A3A5C]" />
                      <a href={`mailto:${reg.email}`} className="text-sm text-[#4A3A5C] hover:text-[#4A3A5C] truncate">
                        {reg.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#4A3A5C]" />
                      <a href={`tel:${reg.mobile}`} className="text-sm text-[#4A3A5C] hover:text-[#4A3A5C]">
                        {reg.mobile}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <AlertCircle className="w-4 h-4 text-[#4A3A5C]" />
                    <span className="text-[#666666]">
                      {reg.hasVatDoc ? (
                        <span className="text-[#4A3A5C]">✓ VAT document attached</span>
                      ) : (
                        <span className="text-[#4A3A5C]">⚠ No VAT document</span>
                      )}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => openModal(reg, 'approve')}
                      className="flex-1 bg-purple-100 hover:bg-purple-200 text-[#4A3A5C] border border-purple-300 px-3 py-2 rounded-lg font-medium text-sm transition flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => openModal(reg, 'reject')}
                      className="flex-1 bg-[#F3F1F7] hover:bg-[#E8E3F0] text-[#4A3A5C] border border-[#E5E5E5] px-3 py-2 rounded-lg font-medium text-sm transition flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>

                  <p className="text-xs text-[#666666] text-center">Applied: {new Date(reg.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </motion.div>
          ))}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 border-2 border-dashed border-[#E5E5E5] rounded-xl"
        >
          <CheckCircle2 className="w-12 h-12 text-[#CCCCCC] mb-4" />
          <p className="text-[#1A1A1A] mb-2">All caught up!</p>
          <p className="text-[#666666] text-sm">No pending registrations to review</p>
        </motion.div>
      )}

      {/* Approval Modal */}
      <Modal
        isOpen={isModalOpen && action === 'approve'}
        onClose={() => setIsModalOpen(false)}
        title={`Approve Registration: ${selectedReg?.full_name}`}
      >
        <div className="space-y-6">
          <div className="bg-purple-100 border border-purple-300 rounded-lg p-4">
            <p className="text-slate-300 mb-2">
              <span className="font-semibold">Company:</span> {selectedReg?.company_name}
            </p>
            <p className="text-slate-300">
              <span className="font-semibold">VAT:</span> {selectedReg?.vat_number}
            </p>
          </div>

<p className="text-[#666666]">
            Approving this registration will activate the account and send a confirmation email to {selectedReg?.email}.
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => setIsModalOpen(false)}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-[#1A1A1A] px-4 py-2 rounded-lg font-medium transition"
            >
              Cancel
            </button>
            <button
              onClick={handleApprove}
              disabled={isProcessing}
              className="flex-1 bg-[#4A3A5C] hover:bg-[#574B66] text-white px-4 py-2 rounded-lg font-medium transition disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Confirm Approval'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Rejection Modal */}
      <Modal
        isOpen={isModalOpen && action === 'reject'}
        onClose={() => { setIsModalOpen(false); setRejectionReason('') }}
        title={`Reject Registration: ${selectedReg?.full_name}`}
      >
        <div className="space-y-5">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-[#1A1A1A] font-semibold mb-1">{selectedReg?.company_name}</p>
            <p className="text-sm text-[#666666]">VAT: <span className="font-mono">{selectedReg?.vat_number}</span></p>
            <p className="text-sm text-[#666666]">Email: {selectedReg?.email}</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
              Rejection Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              placeholder="e.g. Incomplete VAT documentation, Duplicate application, Business not operating in our regions..."
              rows={4}
              className="w-full px-3 py-2.5 border border-[#E5E5E5] rounded-lg text-sm text-[#1A1A1A] placeholder-[#999999] focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent resize-none"
            />
            <p className="text-xs text-[#999999] mt-1">{rejectionReason.length}/200 characters (min 5)</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs text-amber-700">
              ⚠️ The applicant will receive a notification with this reason. This action marks their account as <strong>rejected</strong>.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => { setIsModalOpen(false); setRejectionReason('') }}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-[#1A1A1A] px-4 py-2.5 rounded-lg font-medium transition"
            >
              Cancel
            </button>
            <button
              onClick={handleReject}
              disabled={isProcessing || rejectionReason.trim().length < 5}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-lg font-medium transition flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Rejecting...</>
              ) : (
                <><XCircle className="w-4 h-4" />Confirm Rejection</>
              )}
            </button>
          </div>
        </div>
      </Modal>

    </div>
  )
}
