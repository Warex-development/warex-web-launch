import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Minus } from 'lucide-react'

// ============= Status Badge =============
export function StatusBadge({ status }) {
  const map = {
    'LIVE': 'badge-live',
    'PENDING REVIEW': 'badge-pending',
    'REJECTED': 'badge-rejected',
    'NEEDS CORRECTION': 'badge-correction',
    'DRAFT': 'badge-draft',
    'MATCHED': 'badge-matched',
    'SOLD': 'badge-live',
    'Pending': 'badge-pending',
    'Matched': 'badge-matched',
    'Quote Sent': 'badge-correction',
    'Accepted': 'badge-live',
    'Active': 'badge-live',
    'Suspended': 'badge-rejected',
  }
  const dots = {
    'LIVE': 'bg-purple-400',
    'Accepted': 'bg-purple-400',
    'Active': 'bg-purple-400',
    'PENDING REVIEW': 'bg-amber-400',
    'Pending': 'bg-amber-400',
    'REJECTED': 'bg-red-400',
    'Suspended': 'bg-red-400',
    'NEEDS CORRECTION': 'bg-orange-400',
    'Quote Sent': 'bg-orange-400',
    'DRAFT': 'bg-purple-300',
    'MATCHED': 'bg-blue-400',
    'Matched': 'bg-blue-400',
  }
  return (
    <span className={map[status] || 'badge-draft'}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status] || 'bg-slate-400'}`} />
      {status}
    </span>
  )
}

// ============= Skeleton Loader =============
export function SkeletonRow({ cols = 5 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-3 px-4">
          <div className="skeleton h-4 rounded" style={{ width: `${60 + Math.random() * 40}%` }} />
        </td>
      ))}
    </tr>
  )
}

export function SkeletonCard() {
  return (
    <div className="glass-card p-6 space-y-3">
      <div className="skeleton h-4 w-24 rounded" />
      <div className="skeleton h-8 w-32 rounded" />
      <div className="skeleton h-3 w-16 rounded" />
    </div>
  )
}

// ============= Empty State =============
export function EmptyState({ icon, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="text-6xl mb-4">{icon || '📭'}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-sm">{description}</p>
      {action}
    </motion.div>
  )
}

// ============= Page Header =============
export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-gray-600 mt-1 text-sm">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  )
}

// ============= Modal =============
export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null
  const sizeMap = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={`relative w-full ${sizeMap[size]} glass-card-dark p-6 z-10`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900 transition-colors">
            <XCircle className="w-5 h-5" />
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  )
}

// ============= Stats Card =============
export function StatCard({ icon: Icon, label, value, change, color = 'emerald' }) {
  const colorMap = {
    emerald: 'text-[#4A3A5C] bg-[#F3F1F7]',
    blue: 'text-[#4A3A5C] bg-[#F3F1F7]',
    amber: 'text-[#4A3A5C] bg-[#F3F1F7]',
    red: 'text-[#4A3A5C] bg-[#F3F1F7]',
    purple: 'text-[#4A3A5C] bg-[#F3F1F7]',
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="stat-card"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {change && <p className="text-xs text-purple-700 mt-1">{change}</p>}
        </div>
        <div className={`p-3 rounded-xl ${colorMap[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  )
}

// ============= Search Input =============
export function SearchInput({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || 'Search...'}
        className="input-field pl-10 pr-4"
      />
    </div>
  )
}

// ============= Code Chip =============
export function CodeChip({ value }) {
  return (
    <span className="code-text text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded border border-purple-200">
      {value}
    </span>
  )
}

// ============= Pricing Card =============
export function PriceRange({ bidPrice }) {
  const low = Math.round(bidPrice * 0.95)
  const high = Math.round(bidPrice * 1.30)
  return (
    <span className="text-purple-700 font-semibold">
      NPR {low.toLocaleString()} – {high.toLocaleString()}
    </span>
  )
}

// ============= Feature Check =============
export function FeatureCheck({ included }) {
  if (included) return <CheckCircle className="w-5 h-5 text-purple-700" />
  return <Minus className="w-5 h-5 text-gray-400" />
}

// ============= Loading Spinner =============
export function Spinner({ size = 'md' }) {
  const s = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' }
  return (
    <div className={`${s[size]} border-2 border-purple-700/30 border-t-purple-700 rounded-full animate-spin`} />
  )
}

// ============= Pagination =============
export function Pagination({ page, totalPages, onPageChange }) {
  return (
    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
      <p className="text-sm text-gray-600">Page {page} of {totalPages}</p>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="btn-secondary px-3 py-1.5 text-sm disabled:opacity-40"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="btn-secondary px-3 py-1.5 text-sm disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  )
}

// ============= UrgencyBadge =============
export function UrgencyBadge({ urgency }) {
  const map = {
    Urgent: 'bg-[#4A3A5C]/10 text-[#4A3A5C] border-[#4A3A5C]/30',
    High: 'bg-[#4A3A5C]/10 text-[#4A3A5C] border-[#4A3A5C]/30',
    Normal: 'bg-[#4A3A5C]/10 text-[#4A3A5C] border-[#4A3A5C]/30',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${map[urgency] || map.Normal}`}>
      {urgency}
    </span>
  )
}
