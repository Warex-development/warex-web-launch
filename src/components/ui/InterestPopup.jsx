import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, CheckCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '../../store/authStore'
import { useAppStore } from '../../store/appStore'

export default function InterestPopup({ isOpen, onClose, listing }) {
  const { isAuthenticated, user } = useAuthStore()
  const { addLead } = useAppStore()
  
  const [formData, setFormData] = useState({
    phone: user?.phone || '',
    email: user?.email || '',
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate
    if (!formData.phone.trim() || !formData.email.trim()) {
      toast.error('Please enter both phone and email')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise(r => setTimeout(r, 800))

    // Add to leads array
    const newLead = {
      id: `LEAD-${Date.now()}`,
      phone: formData.phone,
      email: formData.email,
      listingId: listing.id,
      listingName: listing.name,
      timestamp: new Date().toLocaleString(),
      status: 'new',
    }

    addLead(newLead)
    setIsSubmitting(false)
    setIsSuccess(true)

    // Auto-close after 3 seconds
    setTimeout(() => {
      onClose()
      setIsSuccess(false)
      setFormData({ phone: '', email: '' })
    }, 3000)
  }

  if (!isOpen || !listing) return null

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white border border-[#E5E5E5] rounded-xl shadow-2xl z-50 max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-[#999999] hover:text-[#1A1A1A] transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success State */}
        {isSuccess ? (
          <div className="text-center py-8 px-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="mb-4"
            >
              <CheckCircle className="w-16 h-16 text-[#4A3A5C] mx-auto" />
            </motion.div>
            <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Thank you!</h3>
            <p className="text-[#333333] text-sm mb-2">
              Our team will contact you within 24 hours.
            </p>
            <p className="text-xs text-[#666666]">
              Your details are shared with WareXhub admin only — never with the seller.
            </p>
          </div>
        ) : (
          <div className="px-6 pt-6 pb-6">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-1">Interested in this listing?</h2>
              <p className="text-sm text-[#666666]">
                Share your contact details and our team will reach out with availability and pricing.
              </p>
            </div>

            {/* Listing Summary */}
            <div className="bg-[#F3F1F7] rounded-lg p-3 mb-6 border border-[#E5E5E5]">
              <p className="text-xs text-[#666666] mb-1">Item</p>
              <p className="text-sm font-semibold text-[#1A1A1A] truncate">{listing.name}</p>
              <p className="text-xs text-[#999999] mt-2">OEM: <span className="text-[#1A1A1A] font-mono">{listing.oem}</span></p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Phone */}
              <div>
                <label className="block text-xs font-medium text-[#1A1A1A] mb-2">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 9841234567"
                  disabled={isSubmitting}
                  className="w-full px-3 py-2.5 bg-white border border-[#E5E5E5] rounded-lg text-[#1A1A1A] placeholder-[#999999] focus:outline-none focus:ring-2 focus:ring-[#4A3A5C] disabled:opacity-50"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-[#1A1A1A] mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  disabled={isSubmitting}
                  className="w-full px-3 py-2.5 bg-white border border-[#E5E5E5] rounded-lg text-[#1A1A1A] placeholder-[#999999] focus:outline-none focus:ring-2 focus:ring-[#4A3A5C] disabled:opacity-50"
                />
              </div>

              {/* Privacy Notice */}
              <div className="bg-[#4A3A5C]/10 border border-[#4A3A5C]/30 rounded-lg p-3 flex gap-2">
                <AlertCircle className="w-4 h-4 text-[#4A3A5C] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[#4A3A5C]">
                  Your details are shared with WareXhub admin only — never with the seller.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#4A3A5C] hover:bg-[#574B66] disabled:bg-[#4A3A5C]/50 text-white font-medium py-2.5 rounded-lg transition disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send My Interest'}
              </button>
            </form>
          </div>
        )}
      </motion.div>
    </>
  )
}
