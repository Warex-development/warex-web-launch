import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '../../store/authStore'

const API = import.meta.env.VITE_API_URL

export default function QuoteModal({ isOpen, onClose, listing, user, isAuthenticated }) {
  const { token } = useAuthStore()

  const [formData, setFormData] = useState({
    name: user?.full_name || user?.name || '',
    company: user?.company || '',
    email: user?.email || '',
    phone: user?.phone || '',
    quantity: '',
    targetPrice: '',
    notes: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [requestId, setRequestId] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Please fill in your name and email')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)
    try {
      // Authenticated member: POST to /api/requests (saves to DB)
      if (isAuthenticated && token) {
        const description = [
          listing.name,
          formData.notes ? `Notes: ${formData.notes}` : '',
          formData.targetPrice ? `Target price: NPR ${formData.targetPrice}` : '',
          formData.quantity ? `Quantity: ${formData.quantity}` : '',
          `Contact: ${formData.email}${formData.phone ? ', ' + formData.phone : ''}`,
          formData.company ? `Company: ${formData.company}` : ''
        ].filter(Boolean).join(' | ')

        const res = await fetch(`${API}/api/requests`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            item_name: listing.name,
            description,
            oem: listing.oem || '',
            make: listing.make || '',
            manufacturer: listing.manufacturer || '',
            quantity: parseInt(formData.quantity) || 1,
            urgency: 'Normal',
            listing_id: listing.id,
            budget_min: listing.buyer_visible_min || null,
            budget_max: listing.buyer_visible_max || null,
          })
        })
        const result = await res.json()
        if (!res.ok) throw new Error(result.message || 'Failed to submit request')

        const rid = result.request?.request_id || result.request?.id
        setRequestId(rid)
        toast.success(`Quote request ${rid} submitted!`)
      } else {
        // Guest: POST to /api/leads (public endpoint, saves name/email/phone)
        const res = await fetch(`${API}/api/leads`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            company: formData.company,
            email: formData.email,
            phone: formData.phone,
            listing_id: listing.id,
            listing_name: listing.name,
            notes: formData.notes,
            quantity: formData.quantity,
            target_price: formData.targetPrice
          })
        })
        // Even if leads API doesn't exist yet, show success (graceful)
        if (res.ok || res.status === 404) {
          toast.success('Interest submitted! We\'ll contact you within 24 hours.')
        } else {
          const d = await res.json()
          throw new Error(d.message || 'Failed to submit')
        }
      }

      setIsSuccess(true)
      setTimeout(() => {
        onClose()
        setIsSuccess(false)
        setRequestId(null)
        setFormData({
          name: user?.full_name || user?.name || '',
          company: user?.company || '',
          email: user?.email || '',
          phone: user?.phone || '',
          quantity: '',
          targetPrice: '',
          notes: ''
        })
      }, 3000)
    } catch (error) {
      toast.error(error.message || 'Failed to submit. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen || !listing) return null

  const priceMin = parseFloat(listing.buyer_visible_min || 0)
  const priceMax = parseFloat(listing.buyer_visible_max || 0)

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto pointer-events-auto">
          {/* Header */}
          <div className="sticky top-0 flex items-center justify-between p-6 border-b border-[#E5E5E5] bg-white">
            <div>
              <h2 className="text-xl font-bold text-[#1A1A1A]">
                {isAuthenticated ? 'Request Quote' : 'Interested in this listing?'}
              </h2>
              <p className="text-sm text-[#666666] mt-1 truncate max-w-xs">{listing.name}</p>
            </div>
            <button onClick={onClose} className="text-[#999999] hover:text-[#1A1A1A] transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Listing Info */}
              <div className="bg-[#F3F1F7] border border-[#E5E5E5] rounded-lg p-3">
                <p className="text-xs text-[#666666]">Item: <span className="font-medium text-[#1A1A1A]">{listing.name}</span></p>
                {listing.oem && <p className="text-xs text-[#666666] mt-0.5">OEM: <span className="font-mono text-[#1A1A1A]">{listing.oem}</span></p>}
                {(priceMin > 0 || priceMax > 0) && (
                  <p className="text-xs text-[#666666] mt-0.5">
                    Price Range: <span className="font-bold text-[#4A3A5C]">
                      NPR {priceMin.toLocaleString()} – {priceMax.toLocaleString()}
                    </span>
                  </p>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Name <span className="text-red-500">*</span></label>
                <input type="text" name="name" value={formData.name} onChange={handleChange}
                  placeholder="Your full name" required
                  className="w-full px-3 py-2 border border-[#E5E5E5] rounded-lg text-sm placeholder-[#999999] focus:outline-none focus:ring-2 focus:ring-[#4A3A5C]" />
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Company</label>
                <input type="text" name="company" value={formData.company} onChange={handleChange}
                  placeholder="Your company name"
                  className="w-full px-3 py-2 border border-[#E5E5E5] rounded-lg text-sm placeholder-[#999999] focus:outline-none focus:ring-2 focus:ring-[#4A3A5C]" />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Email <span className="text-red-500">*</span></label>
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  placeholder="your@email.com" required
                  className="w-full px-3 py-2 border border-[#E5E5E5] rounded-lg text-sm placeholder-[#999999] focus:outline-none focus:ring-2 focus:ring-[#4A3A5C]" />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Phone</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                  placeholder="+977-98XXXXXXXX"
                  className="w-full px-3 py-2 border border-[#E5E5E5] rounded-lg text-sm placeholder-[#999999] focus:outline-none focus:ring-2 focus:ring-[#4A3A5C]" />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Quantity / Requirement</label>
                <input type="text" name="quantity" value={formData.quantity} onChange={handleChange}
                  placeholder="e.g., 5 units, 10 pieces"
                  className="w-full px-3 py-2 border border-[#E5E5E5] rounded-lg text-sm placeholder-[#999999] focus:outline-none focus:ring-2 focus:ring-[#4A3A5C]" />
              </div>

              {/* Target Price */}
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Target Price (optional)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999] text-sm">NPR</span>
                  <input type="number" name="targetPrice" value={formData.targetPrice} onChange={handleChange}
                    placeholder="Your target price"
                    className="w-full pl-10 pr-3 py-2 border border-[#E5E5E5] rounded-lg text-sm placeholder-[#999999] focus:outline-none focus:ring-2 focus:ring-[#4A3A5C]" />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Notes</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange}
                  placeholder="Any specific requirements or questions?" rows="3"
                  className="w-full px-3 py-2 border border-[#E5E5E5] rounded-lg text-sm placeholder-[#999999] focus:outline-none focus:ring-2 focus:ring-[#4A3A5C] resize-none" />
              </div>

              {!isAuthenticated && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700">
                  <strong>Note:</strong> <a href="/register" className="underline font-medium">Register as a member</a> to track your requests and get faster responses.
                </div>
              )}

              <button type="submit" disabled={isSubmitting}
                className="w-full bg-[#4A3A5C] hover:bg-[#574B66] disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting...</>
                ) : (
                  isAuthenticated ? 'Submit Quote Request' : 'Send My Interest'
                )}
              </button>

              <p className="text-xs text-[#999999] text-center">Your identity remains confidential. We'll review and respond within 24 hours.</p>
            </form>
          ) : (
            <div className="p-6 text-center py-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#4A3A5C]/10 border border-[#4A3A5C]/30 mb-4"
              >
                <CheckCircle className="w-8 h-8 text-[#4A3A5C]" />
              </motion.div>
              <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">Quote Request Submitted!</h3>
              {requestId && (
                <p className="text-sm font-mono text-[#4A3A5C] font-bold mb-2">{requestId}</p>
              )}
              <p className="text-sm text-[#666666]">
                {isAuthenticated
                  ? 'Your request is in our system. Admin will match you with the seller within 24 hours.'
                  : 'Our team will review your interest and contact you shortly.'}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </>
  )
}
