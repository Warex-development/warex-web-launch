import { motion } from 'framer-motion'
import { Shield, ClipboardList, CheckCircle, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const STEPS = [
  {
    num: '01',
    title: 'List Your Inventory',
    subtitle: 'Sellers submit verified parts',
    points: [
      'Fill in Item Name, OEM Number, Make, Condition, Year, Bid Price',
      'Upload images for review',
      'Provide accurate technical specifications',
      'Define availability and lead times',
    ],
    icon: '📦',
    color: 'border-[#4A3A5C]/40 bg-[#4A3A5C]/5',
    badge: 'Seller Action',
    badgeColor: 'bg-[#4A3A5C]/20 text-[#4A3A5C]',
  },
  {
    num: '02',
    title: 'Admin Reviews & Approves',
    subtitle: 'WareX quality control team verifies',
    points: [
      'Every listing is manually inspected by the WareX team',
      'OEM numbers cross-referenced with manufacturer databases',
      'Condition claims verified, pricing checked against market rates',
      'Listings get LIVE status or sent back with correction codes (CR-01 to CR-08)',
    ],
    icon: '🔍',
    color: 'border-amber-500/40 bg-amber-500/5',
    badge: 'WareX Action',
    badgeColor: 'bg-amber-500/20 text-amber-400',
  },
  {
    num: '03',
    title: 'Buyer Requests → WareX Fulfills',
    subtitle: 'Trust-based matching & deal facilitation',
    points: [
      'Buyers search the verified catalogue for critical spares',
      'Send a quote request with description and urgency level',
      'WareX matches requests to best-fit sellers using a scoring engine',
      'Deal facilitated entirely through WareX — ensuring security and quality',
    ],
    icon: '⚡',
    color: 'border-emerald-500/40 bg-emerald-500/5',
    badge: 'Buyer Action',
    badgeColor: 'bg-emerald-500/20 text-emerald-400',
  },
]

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen pt-20 pb-24">
      <div className="page-container">
        {/* Header */}
        <div className="text-center py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1A1A1A] mb-6">How WareX Works</h1>
            <p className="text-[#333333] text-xl max-w-3xl mx-auto">
              Building a smarter Nepal industrial ecosystem where unused inventory from one factory becomes a valuable resource for another — helping industries reduce waste, unlock working capital, and improve operational efficiency.
            </p>
          </motion.div>
        </div>

        {/* Infographic Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="bg-white p-4 md:p-8 rounded-3xl border border-[#E5E5E5] shadow-xl overflow-hidden group">
            <div className="relative rounded-2xl overflow-hidden bg-[#F8F8FA]">
              <img 
                src="/Howitworks.webp" 
                alt="WareX How It Works Infographic" 
                loading="lazy"
                className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm font-bold text-[#4A3A5C]/40 uppercase tracking-[0.3em]">Visual Process Architecture</p>
            </div>
          </div>
        </motion.div>

        {/* Steps */}
        <div className="space-y-8 mb-24">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={`glass-card p-8 md:p-12 border ${step.color}`}
            >
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-[#F3F1F7] border border-[#E5E5E5] flex items-center justify-center text-5xl">
                    {step.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="code-text text-[#4A3A5C] text-5xl font-black leading-none">{step.num}</span>
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${step.badgeColor} mb-1`}>{step.badge}</span>
                      <h2 className="text-2xl font-bold text-[#1A1A1A]">{step.title}</h2>
                      <p className="text-[#333333] font-medium">{step.subtitle}</p>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {step.points.map((point, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-[#4A3A5C] shrink-0 mt-0.5" />
                        <span className="text-[#333333]">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  )
}
