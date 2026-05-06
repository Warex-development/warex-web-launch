import { useState, useEffect } from 'react'
import DataTable from '../../components/ui/DataTable'
import { motion } from 'framer-motion'
import { Button } from '../../components/ui/FormComponents'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAppStore } from '../../store/appStore'
import Pagination from '../../components/ui/Pagination'

export default function UserManagementPage() {
  const { users, fetchAllUsers, loading } = useAppStore()
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  const loadData = async (pageNumber = 1) => {
    const data = await fetchAllUsers(pageNumber, 10)
    if (data && !Array.isArray(data)) {
      setTotalPages(data.totalPages || 1)
      setTotalCount(data.total || data.count || 0)
    } else if (Array.isArray(data)) {
      setTotalCount(data.length)
    }
  }

  useEffect(() => {
    loadData(page)
  }, [page])

  const handleSuspend = async (id) => {
    // Suspend API not implemented yet, show placeholder
    toast.error('Suspend functionality coming soon')
  }

  const columns = [
    { key: 'full_name', label: 'Member', sortable: true, render: (row) => (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-purple-100 border border-purple-300 rounded-full flex items-center justify-center text-[#4A3A5C] font-bold text-sm">
          {row.full_name ? row.full_name[0] : 'U'}
        </div>
        <div>
          <p className="font-mono text-[#1A1A1A] text-sm">{row.code}</p>
          <p className="text-xs text-[#666666]">{row.email}</p>
        </div>
      </div>
    )},
    { key: 'role', label: 'Role', sortable: true, render: (row) => <span className="text-[#1A1A1A] capitalize">{row.role}</span> },
    { key: 'plan', label: 'Plan', sortable: true, render: (row) => <span className="text-[#1A1A1A]">{row.plan || 'Free'}</span> },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (row) => (
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${
          row.status === 'active' || row.status === 'approved'
            ? 'bg-green-50 text-green-700 border-green-200'
            : 'bg-amber-50 text-amber-700 border-amber-200'
        }`}>
          {row.status}
        </span>
      )
    },
    { key: 'created_at', label: 'Joined', sortable: true, render: (row) => <span className="text-[#1A1A1A]">{new Date(row.created_at).toLocaleDateString()}</span> },
  ]

  const actions = (row) => [
    {
      label: row.status === 'active' ? 'Suspend' : 'Activate',
      onClick: () => handleSuspend(row.id),
      className: 'bg-[#F3F1F7] hover:bg-[#E8E3F0] text-[#4A3A5C] border border-[#E5E5E5] px-3 py-1.5 text-xs font-medium rounded-lg transition',
    }
  ]

  const handleSearch = (data, term) => {
    return data.filter(item =>
      (item.full_name || '').toLowerCase().includes(term.toLowerCase()) ||
      (item.email || '').toLowerCase().includes(term.toLowerCase()) ||
      (item.code || '').toLowerCase().includes(term.toLowerCase())
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">User Management</h1>
        <p className="text-[#666666]">Manage platform members and their accounts</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Members', value: totalCount || users.length, color: 'purple' },
          { label: 'Active', value: users.filter(u => u.status === 'active' || u.status === 'approved').length, color: 'green' },
          { label: 'Pending/Other', value: users.filter(u => u.status !== 'active' && u.status !== 'approved').length, color: 'red' },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`bg-gradient-to-br from-[#F3F1F7] to-[#F3F1F7] border border-[#E5E5E5] rounded-lg p-4 shadow-sm hover:shadow-md transition`}
          >
            <p className="text-[#666666] text-sm">{stat.label}</p>
            <p className={`text-2xl font-bold text-[#4A3A5C] mt-1`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
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
              data={users}
              actions={actions}
              onSearch={handleSearch}
              searchPlaceholder="Search users..."
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
