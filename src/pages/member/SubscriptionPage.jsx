import { useAuthStore } from '../../store/authStore'
import { Check, X } from 'lucide-react'
import { Button } from '../../components/ui/FormComponents'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { useState } from 'react'

const PLANS = [
  {
    name: 'Free',
    description: 'Basic access for new members',
    features: [
      { name: 'Max 5 Listings', included: true },
      { name: 'Basic Search', included: true },
      { name: 'Unlimited Quote Requests', included: true },
      { name: 'Self-service Help', included: true },
      { name: 'Bulk Upload', included: false },
      { name: 'Priority Matching', included: false },
      { name: 'Dedicated Account Manager', included: false },
    ],
    pricing: {
      monthly: { price: 0, cycle: 'Monthly', save: 0 },
      quarterly: { price: 0, cycle: 'Quarterly', save: 0 },
      annual: { price: 0, cycle: 'Annual', save: 0 },
    }
  },
  {
    name: 'Standard',
    description: 'For growing businesses',
    features: [
      { name: 'Max 50 Listings', included: true },
      { name: 'Advanced Search', included: true },
      { name: 'Unlimited Quote Requests', included: true },
      { name: 'Email Support', included: true },
      { name: 'Bulk Upload', included: true },
      { name: 'Priority Matching', included: false },
      { name: 'Dedicated Account Manager', included: false },
    ],
    pricing: {
      monthly: { price: 4999, cycle: 'Monthly', save: 0 },
      quarterly: { price: 13499, cycle: 'Quarterly', save: 15 },
      annual: { price: 47990, cycle: 'Annual', save: 25 },
    }
  },
  {
    name: 'Professional',
    description: 'Best for active traders',
    features: [
      { name: 'Max 200 Listings', included: true },
      { name: 'Advanced Search', included: true },
      { name: 'Unlimited Quote Requests', included: true },
      { name: 'Priority Support', included: true },
      { name: 'Bulk Upload (CSV)', included: true },
      { name: 'Priority Matching', included: true },
      { name: 'Dedicated Account Manager', included: false },
    ],
    popular: true,
    pricing: {
      monthly: { price: 12499, cycle: 'Monthly', save: 0 },
      quarterly: { price: 33749, cycle: 'Quarterly', save: 15 },
      annual: { price: 119990, cycle: 'Annual', save: 25 },
    }
  },
  {
    name: 'Enterprise',
    description: 'For high-volume operations',
    features: [
      { name: 'Unlimited Listings', included: true },
      { name: 'Full Search Access', included: true },
      { name: 'Unlimited Quote Requests', included: true },
      { name: '24/7 Premium Support', included: true },
      { name: 'Bulk Upload (CSV)', included: true },
      { name: 'Priority Matching', included: true },
      { name: 'Dedicated Account Manager', included: true },
    ],
    pricing: {
      monthly: { price: 29999, cycle: 'Monthly', save: 0 },
      quarterly: { price: 84999, cycle: 'Quarterly', save: 15 },
      annual: { price: 299999, cycle: 'Annual', save: 25 },
    }
  },
]

export default function SubscriptionPage() {
  const { user } = useAuthStore()
  const [billingCycle, setBillingCycle] = useState('monthly')
  const [loading, setLoading] = useState(false)

  const [showContactPopup, setShowContactPopup] = useState(false)

  const handleUpgrade = async (plan) => {
    try {
      setLoading(true)
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/membership/upgrade-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ plan_type: plan })
      })
      
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.message || 'Failed to submit request')
      
      toast.success(`🚀 Upgrade request for ${plan} submitted!`)
      setShowContactPopup(true)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Subscription Plans</h1>
        <p className="text-[#666666]">Choose the right plan for your business</p>
      </motion.div>

      {/* Billing Cycle Selector */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center gap-3 bg-white border border-[#E5E5E5] rounded-xl p-2 w-fit mx-auto hover:shadow-md transition"
      >
        <button
          onClick={() => setBillingCycle('monthly')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            billingCycle === 'monthly'
              ? 'bg-[#4A3A5C] text-white'
              : 'text-[#666666] hover:text-[#4A3A5C]'
          }`}
        >
          📅 Monthly
        </button>
        <button
          onClick={() => setBillingCycle('quarterly')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            billingCycle === 'quarterly'
              ? 'bg-[#4A3A5C] text-white'
              : 'text-[#666666] hover:text-[#4A3A5C]'
          }`}
        >
          📊 Quarterly (-15%)
        </button>
        <button
          onClick={() => setBillingCycle('annual')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            billingCycle === 'annual'
              ? 'bg-[#4A3A5C] text-white'
              : 'text-[#666666] hover:text-[#4A3A5C]'
          }`}
        >
          🎯 Annual (-25%)
        </button>
      </motion.div>

      {/* Current Plan Card */}
      {user?.plan && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gradient-to-r from-[#4A3A5C]/10 to-[#F3F1F7] border border-[#E5E5E5] rounded-xl p-8 hover:shadow-md transition"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#666666] text-sm mb-1">Current Plan</p>
              <p className="text-2xl font-bold text-[#1A1A1A]">{user.plan} <span className="text-[#4A3A5C]">NPR {PLANS.find(p => p.name === user.plan)?.pricing?.[billingCycle]?.price || PLANS.find(p => p.name === user.plan)?.pricing?.monthly?.price}/-</span></p>
              <p className="text-sm text-[#666666] mt-2">Billing: <span className="text-[#4A3A5C] font-semibold capitalize">{billingCycle}</span> • Valid until <span className="text-[#4A3A5C] font-semibold">{user.planExpiry}</span></p>
            </div>
            <div className="text-right">
              <p className="text-[#4A3A5C] font-semibold text-lg">Active</p>
              <p className="text-xs text-[#666666] mt-1">Auto-renews</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`rounded-xl border overflow-hidden transition transform hover:shadow-lg ${
              plan.popular
                ? 'md:scale-105 border-[#4A3A5C] bg-[#F3F1F7]'
                : 'border-[#E5E5E5] bg-white'
            }`}
          >
            {plan.popular && (
              <div className="bg-[#4A3A5C] text-white text-sm font-semibold py-2 text-center">
                MOST POPULAR
              </div>
            )}

            <div className="p-8">
              {/* Header */}
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-1">{plan.name}</h3>
              <p className="text-sm text-[#666666] mb-4">{plan.description}</p>

              {/* Price */}
              <div className="mb-6">
                <p className="text-4xl font-bold text-[#1A1A1A]">
                  NPR {plan.pricing[billingCycle].price.toLocaleString()}
                  <span className="text-lg text-[#666666] font-normal">/-</span>
                </p>
                <p className="text-sm text-[#666666] mt-1">{plan.pricing[billingCycle].cycle}</p>
                {plan.pricing[billingCycle].save > 0 && (
                  <p className="text-sm text-[#4A3A5C] font-semibold mt-2">Save {plan.pricing[billingCycle].save}% vs monthly</p>
                )}
              </div>

              {/* CTA */}
              <Button
                variant={plan.popular ? 'primary' : 'secondary'}
                fullWidth
                onClick={() => handleUpgrade(plan.name)}
                disabled={user?.plan === plan.name}
              >
                {user?.plan === plan.name ? 'Current Plan' : 'Upgrade Now'}
              </Button>

              {/* Features */}
              <div className="mt-8 space-y-3 border-t border-[#E5E5E5] pt-8">
                {plan.features.map((feature, fidx) => (
                  <div key={fidx} className="flex items-center gap-3">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-[#4A3A5C] flex-shrink-0" />
                    ) : (
                      <X className="w-5 h-5 text-[#CCCCCC] flex-shrink-0" />
                    )}
                    <span className={feature.included ? 'text-[#1A1A1A]' : 'text-[#999999]'}>
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white border border-[#E5E5E5] rounded-xl p-8 hover:shadow-md transition"
      >
        <h3 className="text-lg font-bold text-[#1A1A1A] mb-6">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <details className="group cursor-pointer">
            <summary className="flex items-center justify-between py-3 text-[#1A1A1A] font-medium hover:text-[#4A3A5C] transition">
              Can I change my plan anytime?
              <span className="group-open:rotate-180 transition">▼</span>
            </summary>
            <p className="text-[#666666] text-sm pl-4 pb-3">Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
          </details>

          <details className="group cursor-pointer">
            <summary className="flex items-center justify-between py-3 text-[#1A1A1A] font-medium hover:text-[#4A3A5C] transition">
              Do you offer refunds?
              <span className="group-open:rotate-180 transition">▼</span>
            </summary>
            <p className="text-[#666666] text-sm pl-4 pb-3">We offer a 7-day money-back guarantee. If you're not satisfied, contact support within 7 days of purchase.</p>
          </details>

          <details className="group cursor-pointer">
            <summary className="flex items-center justify-between py-3 text-[#1A1A1A] font-medium hover:text-[#4A3A5C] transition">
              What payment methods do you accept?
              <span className="group-open:rotate-180 transition">▼</span>
            </summary>
            <p className="text-[#666666] text-sm pl-4 pb-3">We accept bank transfers, credit cards, and digital wallets. All payments are secure and processed through our trusted partners.</p>
          </details>

          <details className="group cursor-pointer">
            <summary className="flex items-center justify-between py-3 text-[#1A1A1A] font-medium hover:text-[#4A3A5C] transition">
              Is there a setup fee?
              <span className="group-open:rotate-180 transition">▼</span>
            </summary>
            <p className="text-[#666666] text-sm pl-4 pb-3">No hidden fees! You only pay the monthly subscription price. There are no setup, cancellation, or additional charges.</p>
          </details>
        </div>
      </motion.div>

      {/* Contact Admin Popup */}
      <AnimatePresence>
        {showContactPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowContactPopup(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center"
            >
              <div className="w-16 h-16 bg-[#F3F1F7] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📧</span>
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Contact WareX Admin</h3>
              <p className="text-[#666666] mb-8">
                Your request has been logged. Please contact our admin team at <span className="font-bold text-[#4A3A5C]">support@warex.com</span> to complete the payment and activate your plan.
              </p>
              <Button
                variant="primary"
                fullWidth
                onClick={() => setShowContactPopup(false)}
              >
                Got it
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
