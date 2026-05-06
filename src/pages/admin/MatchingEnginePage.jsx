import { useState, useEffect } from 'react'
import { useAppStore } from '../../store/appStore'
import { motion } from 'framer-motion'
import { Zap, Clock, Search, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function MatchingEnginePage() {
  const { requests, fetchAllRequests } = useAppStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        await fetchAllRequests()
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const pendingRequests = (requests || []).filter(r => r.status === 'pending')

  const features = [
    {
      icon: Search,
      title: 'Smart OEM Matching',
      desc: 'Automatically cross-references buyer OEM part numbers against seller inventory for exact or near-exact matches.',
      status: 'Planned'
    },
    {
      icon: Zap,
      title: 'Auto Deal Suggestion',
      desc: 'Engine will automatically suggest buyer-seller pairs ranked by match score, price proximity, and urgency.',
      status: 'Planned'
    },
    {
      icon: CheckCircle2,
      title: 'One-Click Deal Creation',
      desc: 'Admin selects a suggested match and creates a deal in one click — no manual search needed.',
      status: 'Planned'
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-[#1A1A1A]">Matching Engine</h1>
          <span className="px-3 py-1 bg-amber-100 text-amber-700 border border-amber-300 rounded-full text-xs font-semibold">
            Coming Soon
          </span>
        </div>
        <p className="text-[#666666]">Intelligent buyer-seller matching — automated deal suggestions coming in the next release.</p>
      </motion.div>

      {/* Current Status Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-amber-100 border border-amber-300 rounded-xl flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-amber-800 mb-1">Manual Matching Active</h3>
            <p className="text-sm text-amber-700 leading-relaxed">
              Until the automated engine is live, use the <strong>Buyer Requests</strong> page to view pending requests
              and the <strong>Deals Pipeline</strong> to manually create and manage deals between buyers and sellers.
            </p>
            <div className="flex gap-3 mt-4">
              <Link
                to="/admin/buyer-requests"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#4A3A5C] text-white text-sm font-medium rounded-lg hover:bg-[#574B66] transition"
              >
                View Buyer Requests <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/admin/deals-pipeline"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E5E5] text-[#1A1A1A] text-sm font-medium rounded-lg hover:bg-gray-50 transition"
              >
                Deals Pipeline <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Pending Requests Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white border border-[#E5E5E5] rounded-xl p-6 shadow-sm"
      >
        <h3 className="text-lg font-bold text-[#1A1A1A] mb-4">Pending Buyer Requests</h3>
        {loading ? (
          <div className="flex items-center gap-3 py-4 text-[#666666]">
            <Loader2 className="w-5 h-5 animate-spin text-[#4A3A5C]" />
            <span className="text-sm">Loading requests...</span>
          </div>
        ) : pendingRequests.length > 0 ? (
          <div className="space-y-3">
            {pendingRequests.slice(0, 5).map((req, idx) => (
              <motion.div
                key={req.request_id || req.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center justify-between p-3 bg-[#F8F8FA] border border-[#E5E5E5] rounded-lg hover:border-[#4A3A5C]/30 transition"
              >
                <div>
                  <p className="font-mono text-[#4A3A5C] text-sm font-bold">{req.request_id}</p>
                  <p className="text-[#666666] text-xs mt-0.5 truncate max-w-xs">{req.item_name || req.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  {req.urgency && (
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                      req.urgency === 'Urgent' ? 'bg-red-50 text-red-700 border-red-200' :
                      req.urgency === 'High' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                      'bg-gray-50 text-gray-600 border-gray-200'
                    }`}>
                      {req.urgency}
                    </span>
                  )}
                  <Link
                    to="/admin/deals-pipeline"
                    onClick={() => toast('Navigate to Deals Pipeline to create a deal for this request', { icon: '💡' })}
                    className="text-xs text-[#4A3A5C] hover:underline font-medium"
                  >
                    Create Deal →
                  </Link>
                </div>
              </motion.div>
            ))}
            {pendingRequests.length > 5 && (
              <Link to="/admin/buyer-requests" className="block text-center text-sm text-[#4A3A5C] hover:underline pt-2">
                View all {pendingRequests.length} requests →
              </Link>
            )}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <Search className="w-8 h-8 text-[#CCCCCC] mx-auto mb-2" />
            <p className="text-[#666666] text-sm">No pending buyer requests yet</p>
            <p className="text-[#999999] text-xs mt-1">Requests will appear here once buyers submit quote requests</p>
          </div>
        )}
      </motion.div>

      {/* Planned Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-lg font-bold text-[#1A1A1A] mb-4">Planned Engine Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + idx * 0.08 }}
                className="bg-white border border-[#E5E5E5] rounded-xl p-5 hover:shadow-md transition relative overflow-hidden"
              >
                <div className="absolute top-3 right-3">
                  <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full border border-gray-200">
                    {feature.status}
                  </span>
                </div>
                <div className="w-10 h-10 bg-[#4A3A5C]/10 border border-[#4A3A5C]/20 rounded-lg flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-[#4A3A5C]" />
                </div>
                <h4 className="font-bold text-[#1A1A1A] mb-2">{feature.title}</h4>
                <p className="text-sm text-[#666666] leading-relaxed">{feature.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Bottom note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center py-4 text-xs text-[#999999]"
      >
        Automated matching engine will be available in a future update. Manual deal creation is fully operational.
      </motion.div>
    </div>
  )
}
