import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function GuestLeadModal({ isOpen, onClose, listing }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Name and email are required')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch(`${API}/api/leads/guest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          listing_id: listing?.id
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to submit interest')

      setIsSuccess(true)
      setTimeout(() => {
        onClose()
        setIsSuccess(false)
        setFormData({ name: '', email: '', phone: '', message: '' })
      }, 3000)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen || !listing) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden relative"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#E5E5E5] bg-white">
            <div>
              <h2 className="text-xl font-bold text-[#1A1A1A]">Interested in this item?</h2>
              <p className="text-sm text-[#666666] mt-1 truncate max-w-xs">{listing.name}</p>
            </div>
            <button onClick={onClose} className="text-[#999999] hover:text-[#1A1A1A] transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700 mb-4">
                <strong>Note:</strong> You are requesting as a guest. <a href="/register" className="underline font-medium hover:text-amber-800">Register as a member</a> to track requests and match faster.
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Full Name <span className="text-red-500">*</span></label>
                <input type="text" name="name" value={formData.name} onChange={handleChange}
                  placeholder="Your full name" required
                  className="w-full px-3 py-2 border border-[#E5E5E5] rounded-lg text-sm placeholder-[#999999] focus:outline-none focus:ring-2 focus:ring-[#4A3A5C]" />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Email <span className="text-red-500">*</span></label>
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  placeholder="your@email.com" required
                  className="w-full px-3 py-2 border border-[#E5E5E5] rounded-lg text-sm placeholder-[#999999] focus:outline-none focus:ring-2 focus:ring-[#4A3A5C]" />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Phone Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                  placeholder="+977-98XXXXXXXX"
                  className="w-full px-3 py-2 border border-[#E5E5E5] rounded-lg text-sm placeholder-[#999999] focus:outline-none focus:ring-2 focus:ring-[#4A3A5C]" />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Message / Requirement</label>
                <textarea name="message" value={formData.message} onChange={handleChange}
                  placeholder="Tell us what you're looking for..." rows="3"
                  className="w-full px-3 py-2 border border-[#E5E5E5] rounded-lg text-sm placeholder-[#999999] focus:outline-none focus:ring-2 focus:ring-[#4A3A5C] resize-none" />
              </div>

              <button type="submit" disabled={isSubmitting}
                className="w-full bg-[#4A3A5C] hover:bg-[#574B66] text-white font-medium py-2.5 rounded-lg transition flex items-center justify-center gap-2 mt-4">
                {isSubmitting ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</>
                ) : 'Send Interest'}
              </button>
              
              <p className="text-xs text-[#999999] text-center mt-3">We'll review and respond within 24 hours.</p>
            </form>
          ) : (
            <div className="p-6 text-center py-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#4A3A5C]/10 mb-4"
              >
                <CheckCircle className="w-8 h-8 text-[#4A3A5C]" />
              </motion.div>
              <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">Interest Sent Successfully!</h3>
              <p className="text-sm text-[#666666]">
                Our team will review your interest and contact you shortly.
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
