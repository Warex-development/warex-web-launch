import { motion } from 'framer-motion'
import { CheckCircle, Minus, ArrowRight, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { MEMBERSHIP_PLANS } from '../../data/constants'
import { FeatureCheck } from '../../components/ui/SharedComponents'
import { useState } from 'react'

export default function MembershipPage() {
  const [period, setPeriod] = useState('monthly') // 'monthly' | 'quarterly' | 'yearly'

  const getSavings = (plan) => {
    if (!plan.monthly) return null
    const monthlyTotal = plan.monthly * 12
    const yearlyPrice = plan.yearly
    if (period === 'yearly' && yearlyPrice) {
      const savings = monthlyTotal - yearlyPrice
      return Math.round((savings / monthlyTotal) * 100)
    }
    return null
  }

  return (
    <div className="min-h-screen pt-20 pb-24">
      <div className="page-container">
        <div className="text-center py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1A1A1A] mb-4">Membership Plans</h1>
            <p className="text-[#333333] text-xl max-w-2xl mx-auto">
              Choose the plan that matches your sourcing needs. All prices in NPR. Cancel anytime.
            </p>
          </motion.div>

          {/* Period Toggle */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex items-center justify-center gap-4 mt-8">
            <div className="flex gap-2 bg-[#F3F1F7] p-1 rounded-lg w-fit">
              {[
                { value: 'monthly', label: 'Monthly' },
                { value: 'quarterly', label: 'Quarterly' },
                { value: 'yearly', label: 'Yearly' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setPeriod(opt.value)}
                  className={`px-4 py-2 rounded-md font-medium transition ${
                    period === opt.value
                      ? 'bg-[#4A3A5C] text-white'
                      : 'text-[#333333] hover:text-[#1A1A1A]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {period === 'yearly' && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#F3F1F7] border border-[#4A3A5C]/30 text-[#4A3A5C] px-3 py-1.5 rounded-lg text-xs font-bold">
                Save up to 28%
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Plan Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {MEMBERSHIP_PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`glass-card p-8 relative flex flex-col ${plan.badge === 'Most Popular' ? 'border-[#4A3A5C]/40 bg-gradient-to-br from-white to-[#F3F1F7]' : ''}`}
            >
              {plan.badge && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold ${plan.badge === 'Most Popular' ? 'bg-[#4A3A5C] text-white' : 'bg-amber-500 text-white'}`}>
                  {plan.badge}
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-1">{plan.name}</h3>
                <p className="text-[#333333] text-sm mb-4">{plan.description}</p>
                <div className="flex items-end gap-1 min-h-[3rem]">
                  {plan.name === 'Free' ? (
                    <>
                      <span className="text-4xl font-black text-[#1A1A1A]">NPR 0</span>
                      <span className="text-[#333333] mb-1">/forever</span>
                    </>
                  ) : (
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-[#4A3A5C] uppercase tracking-widest mb-1">Price Revealed On</span>
                      <span className="text-2xl font-black text-[#1A1A1A]">30th May 2026</span>
                    </div>
                  )}
                </div>
                {plan.name === 'Free' && !plan.custom && period === 'yearly' && getSavings(plan) && (
                  <div className="text-xs text-[#4A3A5C] mt-2">Save {getSavings(plan)}% vs monthly</div>
                )}
              </div>
              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((feat, j) => (
                  <li key={j} className="flex items-center gap-3">
                    <FeatureCheck included={feat.included} />
                    <span className={`text-sm ${feat.included ? 'text-[#333333]' : 'text-[#666666]'}`}>{feat.text}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/register"
                className={`w-full justify-center py-3 ${plan.badge === 'Most Popular' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Feature Matrix */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card p-8">
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-8 text-center">Full Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E5E5E5]">
                  <th className="text-left py-3 px-4 text-[#333333] font-medium">Feature</th>
                  {MEMBERSHIP_PLANS.map(p => (
                    <th key={p.name} className={`text-center py-3 px-4 font-bold ${p.badge === 'Most Popular' ? 'text-[#4A3A5C]' : 'text-[#1A1A1A]'}`}>{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MEMBERSHIP_PLANS[0].features.map((feat, i) => (
                  <tr key={i} className="border-b border-[#E5E5E5]">
                    <td className="py-3 px-4 text-[#333333] text-sm">{feat.text}</td>
                    {MEMBERSHIP_PLANS.map(plan => (
                      <td key={plan.name} className="py-3 px-4 text-center">
                        <FeatureCheck included={plan.features[i].included} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <div className="mt-12 text-center">
          <p className="text-[#333333] mb-4">Not sure which plan? Talk to our team.</p>
          <Link to="/contact" className="btn-outline inline-flex">Contact Sales</Link>
        </div>
      </div>
    </div>
  )
}
