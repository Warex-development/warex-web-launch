import { useAppStore } from '../../store/appStore'
import { useAuthStore } from '../../store/authStore'

import { motion } from 'framer-motion'
import { GripVertical, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Pagination from '../../components/ui/Pagination'

const STAGES = ['initiated', 'nda_signed', 'payment_pending', 'payment_done', 'delivery', 'completed']
const STAGE_LABELS = {
  'initiated': 'Initiated',
  'nda_signed': 'NDA Signed',
  'payment_pending': 'Payment Pending',
  'payment_done': 'Payment Done',
  'delivery': 'In Delivery',
  'completed': 'Completed'
}

export default function DealsPipelinePage() {
  const { deals, fetchAllDeals } = useAppStore()
  const { token } = useAuthStore()
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const loadData = async (pageNumber = 1) => {
    const data = await fetchAllDeals(pageNumber, 20)
    if (data && !Array.isArray(data)) {
      setTotalPages(data.totalPages || 1)
    }
  }

  useEffect(() => {
    loadData(page)
  }, [page])

  const dealsByStage = STAGES.reduce((acc, stage) => {
    acc[stage] = deals.filter(d => d.status === stage)
    return acc
  }, {})

  const handleDragStart = (e, deal, stage) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('deal', JSON.stringify({ ...deal, fromStage: stage }))
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, toStage) => {
    e.preventDefault()
    const data = JSON.parse(e.dataTransfer.getData('deal'))
    if (data.fromStage !== toStage) {
      toast.error('Move Deal API not implemented yet')
    }
  }

  const handleComplete = async (dealId) => {
    if (!window.confirm('Mark this deal as COMPLETED? This will log revenue and close the deal.')) return
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/deals/admin/${dealId}/complete`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to complete deal')
      
      toast.success(`✅ Deal ${dealId} completed! Revenue logged.`)
      loadData(page)
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Deals Pipeline</h1>
        <p className="text-[#666666]">Track deals through the sales funnel (drag to move)</p>
      </motion.div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {STAGES.map((stage, idx) => (
          <motion.div
            key={stage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage)}
            className="bg-white border border-[#E5E5E5] rounded-xl p-4 min-h-[600px] transition hover:shadow-md shadow-sm"
          >
            <div className="mb-4">
              <h3 className="font-bold text-[#1A1A1A] text-xs uppercase tracking-wider mb-1">{STAGE_LABELS[stage]}</h3>
              <p className="text-xs text-[#666666]">{dealsByStage[stage]?.length || 0} deals</p>
            </div>

            {/* Cards */}
            <div className="space-y-3">
              {dealsByStage[stage].map((deal, didx) => (
                <motion.div
                  key={deal.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: didx * 0.05 }}
                  draggable
                  onDragStart={(e) => handleDragStart(e, deal, stage)}
                  className="bg-gray-50 border border-[#E5E5E5] rounded-lg p-3 cursor-grab active:cursor-grabbing hover:border-[#4A3A5C] hover:shadow-md transition group"
                >
                  <div className="flex gap-2 mb-2">
                    <GripVertical className="w-4 h-4 text-[#CCCCCC] group-hover:text-[#999999] transition flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-mono text-[#4A3A5C] text-sm font-bold">{deal.deal_id || deal.id}</p>
                      <p className="text-xs text-[#666666] mt-0.5">{deal.listing_name || deal.description}</p>
                    </div>
                  </div>
                  
                  <div className="bg-[#F3F1F7] rounded-lg p-2 mb-2 border border-[#E5E5E5]">
                    <p className="text-xs text-[#666666] mb-0.5">Value</p>
                    <p className="text-[#4A3A5C] font-bold">NPR {parseFloat(deal.final_price || deal.deal_value || 0).toLocaleString()}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-1 text-xs mb-3">
                    <div>
                      <span className="text-[#666666]">Buyer:</span>
                      <p className="text-[#4A3A5C] font-mono truncate">{deal.buyer_name || deal.buyerCode}</p>
                    </div>
                    <div>
                      <span className="text-[#666666]">Seller:</span>
                      <p className="text-[#4A3A5C] font-mono truncate">{deal.seller_name || deal.sellerCode}</p>
                    </div>
                  </div>

                  {stage === 'delivery' && (
                    <button
                      onClick={() => handleComplete(deal.id)}
                      className="w-full py-1.5 bg-[#4A3A5C] text-white text-xs font-bold rounded hover:bg-[#574B66] transition shadow-sm"
                    >
                      Complete Deal
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="bg-white border border-[#E5E5E5] rounded-lg p-4 text-center shadow-sm hover:shadow-md transition">
          <p className="text-3xl font-bold text-[#4A3A5C]">{deals.length}</p>
          <p className="text-xs text-[#666666] mt-1">Total Deals</p>
        </div>
        <div className="bg-white border border-[#E5E5E5] rounded-lg p-4 text-center shadow-sm hover:shadow-md transition">
          <p className="text-3xl font-bold text-[#4A3A5C]">{deals.filter(d => d.status === 'new').length}</p>
          <p className="text-xs text-[#666666] mt-1">New</p>
        </div>
        <div className="bg-white border border-[#E5E5E5] rounded-lg p-4 text-center shadow-sm hover:shadow-md transition">
          <p className="text-3xl font-bold text-[#4A3A5C]">{deals.filter(d => d.status === 'quote_sent').length}</p>
          <p className="text-xs text-[#666666] mt-1">Quoted</p>
        </div>
        <div className="bg-white border border-[#E5E5E5] rounded-lg p-4 text-center shadow-sm hover:shadow-md transition">
          <p className="text-3xl font-bold text-[#4A3A5C]">{deals.filter(d => d.status === 'completed').length}</p>
          <p className="text-xs text-[#666666] mt-1">Completed</p>
        </div>
      </motion.div>
    </div>
  )
}
