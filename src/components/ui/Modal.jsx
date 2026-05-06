import { motion } from 'framer-motion'
import { X } from 'lucide-react'

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className={`bg-white border border-[#E5E5E5] rounded-xl shadow-xl ${sizeClasses[size]}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E5E5E5]">
          <h3 className="text-lg font-semibold text-[#1A1A1A]">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#F3F1F7] rounded-lg transition text-[#999999] hover:text-[#4A3A5C]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </motion.div>
    </motion.div>
  )
}
