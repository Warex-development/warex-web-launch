import { useState, useEffect } from 'react'
import { useAppStore } from '../../store/appStore'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Clock, DollarSign, User, Building, Mail, Package } from 'lucide-react'
import toast from 'react-hot-toast'
import DataTable from '../../components/ui/DataTable'

export default function MembershipRequestsPage() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/membership/requests`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await res.json()
      if (res.ok) {
        setRequests(data)
      }
    } catch (error) {
      console.error('Fetch requests error:', error)
      toast.error('Failed to load membership requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const handleApprove = async (id, planType) => {
    const price = window.prompt(`Enter annual price for ${planType} plan (NPR):`, '4999')
    if (price === null) return

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/membership/approve/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          plan_price: parseFloat(price),
          admin_note: 'Approved by admin'
        })
      })

      if (res.ok) {
        toast.success('Membership upgrade approved!')
        fetchRequests()
      } else {
        const data = await res.json()
        toast.error(data.message || 'Failed to approve')
      }
    } catch (error) {
      toast.error('Error approving request')
    }
  }

  const columns = [
    { key: 'user', label: 'Member', render: (row) => (
      <div>
        <p className="font-bold text-[#1A1A1A]">{row.full_name}</p>
        <p className="text-xs text-[#666666]">{row.email}</p>
      </div>
    )},
    { key: 'company', label: 'Company', render: (row) => (
      <span className="text-sm">{row.company_name}</span>
    )},
    { key: 'plans', label: 'Plans', render: (row) => (
      <div className="flex items-center gap-2">
        <span className="text-xs px-2 py-0.5 bg-gray-100 rounded border">{row.current_plan}</span>
        <span className="text-gray-400">→</span>
        <span className="text-xs px-2 py-0.5 bg-[#4A3A5C]/10 text-[#4A3A5C] font-bold rounded border border-[#4A3A5C]/20">{row.plan_type}</span>
      </div>
    )},
    { key: 'status', label: 'Status', render: (row) => (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
        row.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-200' :
        row.status === 'approved' ? 'bg-green-50 text-green-600 border-green-200' :
        'bg-red-50 text-red-600 border-red-200'
      }`}>
        {row.status.toUpperCase()}
      </span>
    )},
    { key: 'created_at', label: 'Requested', render: (row) => (
      <span className="text-xs text-[#666666]">{new Date(row.created_at).toLocaleDateString()}</span>
    )},
    { key: 'actions', label: 'Actions', render: (row) => (
      row.status === 'pending' && (
        <button
          onClick={() => handleApprove(row.id, row.plan_type)}
          className="bg-[#4A3A5C] text-white px-4 py-1.5 rounded text-xs font-bold hover:bg-[#574B66] transition shadow-sm"
        >
          Approve & Monetize
        </button>
      )
    )},
  ]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Membership Requests</h1>
        <p className="text-[#666666]">Manage member upgrade requests and monetization</p>
      </motion.div>

      <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-sm">
        <DataTable
          columns={columns}
          data={requests}
          loading={loading}
        />
      </div>
    </div>
  )
}
