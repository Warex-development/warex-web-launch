import { motion } from 'framer-motion'
import { Zap, Shield, Star, MapPin, Users, CheckCircle, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const BENEFITS = [
  { icon: Zap, title: 'Speed', color: 'text-amber-400 bg-amber-400/10', desc: 'Most requests matched within 24-48 hours. Same-day options available for critical production stoppages. ETA communicated at every step.' },
  { icon: Star, title: 'Quality Control', color: 'text-blue-400 bg-blue-400/10', desc: 'Every listing is manually reviewed by WareX\'s quality team. OEM numbers verified against manufacturer databases before any listing goes LIVE.' },
  { icon: MapPin, title: 'Nepal-Focused', color: 'text-purple-400 bg-purple-400/10', desc: 'Built for Nepal\'s industrial landscape. Pricing in NPR. Understanding of local supply chains, import logistics, and industry-specific requirements.' },
  { icon: Users, title: 'Admin-Backed', color: 'text-red-400 bg-red-400/10', desc: 'A dedicated WareX operations team manages every deal. Manual matching ensures the best fit. Not an algorithm — real expertise behind every match.' },
  { icon: CheckCircle, title: 'Verified Network', color: 'text-cyan-400 bg-cyan-400/10', desc: 'All sellers are manually vetted before joining. Buyers are verified companies. This isn\'t an open marketplace — it\'s a curated industrial network.' },
]

export default function WhyWareXPage() {
  return (
    <div className="min-h-screen pt-20 pb-24">
      <div className="page-container">
        <div className="text-center py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1A1A1A] mb-4 leading-tight">Why Choose <span className="gradient-text">WareX?</span></h1>
            <p className="text-[#333333] text-xl max-w-2xl mx-auto">We're not just another marketplace. We're a purpose-built system for Nepal's industrial equipments and parts ecosystem.</p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {BENEFITS.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 hover:border-[#4A3A5C]/20 transition-all group"
            >
              <div className={`w-14 h-14 rounded-2xl ${b.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                <b.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">{b.title}</h3>
              <p className="text-[#333333] leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Comparison */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card p-8 mb-24">
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-8 text-center">WareX vs. Traditional Sourcing</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E5E5E5]">
                  <th className="text-left py-3 px-4 text-[#333333] font-medium">Feature</th>
                  <th className="text-center py-3 px-4 text-[#4A3A5C] font-bold">WareX</th>
                  <th className="text-center py-3 px-4 text-[#666666] font-medium">Traditional</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Time to source', '24–48 hours', '2–4 weeks'],
                  ['Quality verification', '✅ Admin-verified', '❌ Trust-based only'],
                  ['Nepal-local network', '✅ Built for Nepal', '⚠️ Generic'],
                  ['Deal tracking', '✅ Full pipeline visibility', '❌ Phone calls only'],
                ].map(([feature, warex, traditional]) => (
                  <tr key={feature} className="border-b border-[#E5E5E5]">
                    <td className="py-3 px-4 text-[#333333]">{feature}</td>
                    <td className="py-3 px-4 text-center text-[#4A3A5C] font-medium text-sm">{warex}</td>
                    <td className="py-3 px-4 text-center text-[#666666] text-sm">{traditional}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Roles & Benefits */}
        <div className="grid md:grid-cols-2 gap-8 mb-24">
          {/* Our Role */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card p-10 bg-[#F3F1F7]/50">
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-8">Our Role (Value Added Services)</h2>
            <ul className="space-y-6">
              {[
                'Validate product specs & condition',
                'Facilitate negotiation',
                'Ensure trust between parties',
                'Seamless transactions',
              ].map((role, i) => (
                <li key={i} className="flex items-center gap-4 text-lg font-medium text-[#333333]">
                  <div className="w-2 h-2 bg-[#4A3A5C] rounded-full" />
                  {role}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Benefits */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card p-10 border-[#4A3A5C]/20 bg-[#4A3A5C]/5">
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-8">Benefits</h2>
            <ul className="space-y-6">
              {[
                'Reduced downtime',
                'Faster availability',
                'Better inventory utilization',
                'Lower capital blockage',
              ].map((benefit, i) => (
                <li key={i} className="flex items-center gap-4 text-lg font-medium text-[#333333]">
                  <CheckCircle className="w-6 h-6 text-emerald-500" />
                  {benefit}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Conclusion */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          whileInView={{ opacity: 1, scale: 1 }} 
          viewport={{ once: true }}
          className="text-center py-20 px-8 rounded-[3rem] bg-[#1A1A1A] text-white overflow-hidden relative mb-20"
        >
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <Shield className="w-64 h-64 rotate-12" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black mb-8 relative z-10 leading-tight">
            Transforming Nepal’s equipments and parts ecosystem from reactive to connected & efficient
          </h2>
          <div className="w-24 h-1 bg-emerald-500 mx-auto mb-8 relative z-10" />
          <p className="text-white/60 text-lg relative z-10 max-w-2xl mx-auto">
            Join the industrial revolution. Let's make every equipment and part count.
          </p>
        </motion.div>

        <div className="text-center">
          <Link to="/register" className="btn-primary px-10 py-4 text-base inline-flex">
            Get Started With WareX <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
