import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { INDUSTRIES } from '../../data/constants'

export default function IndustriesPage() {
  const [industryCounts, setIndustryCounts] = useState(null)
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  useEffect(() => {
    fetch(`${API_BASE}/api/listings/count-by-industry`)
      .then(r => r.ok ? r.json() : null)
      .catch(() => null)
      .then(data => { if (data) setIndustryCounts(data) })
  }, [])
  return (
    <div className="min-h-screen pt-20 pb-24">
      <div className="page-container">
        <div className="text-center py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl font-black text-[#1A1A1A] mb-4">Industries We Serve</h1>
            <p className="text-[#333333] text-xl max-w-2xl mx-auto">
              Specialized parts sourcing across Nepal's key industrial sectors. Sector-specific expertise from our team.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {INDUSTRIES.map((ind, i) => (
            <motion.div
              key={ind.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -6 }}
              className="glass-card p-8 cursor-pointer hover:border-[#4A3A5C]/30 transition-all group"
            >
              <div className="text-5xl mb-4">{ind.icon}</div>
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">{ind.name}</h3>
              <p className="text-[#333333] text-sm mb-4 leading-relaxed">{ind.description}</p>
              <div className="flex items-center justify-between">
                {industryCounts === null ? (
                  <span className="w-20 h-5 bg-gray-200 rounded animate-pulse" />
                ) : (() => {
                  const key = ind.name.toLowerCase().replace(/[^a-z]/g, '')
                  const count = industryCounts[key] ?? industryCounts[ind.name.toLowerCase()] ?? null
                  return count && count > 0
                    ? <span className="badge-live">{count} listings</span>
                    : <span className="text-[#AAAAAA] text-sm font-medium">NA</span>
                })()}
                <ArrowRight className="w-4 h-4 text-[#4A3A5C] group-hover:text-[#4A3A5C] transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 glass-card p-10 text-center">
          <h2 className="text-3xl font-bold text-[#1A1A1A] mb-4">Don't See Your Industry?</h2>
          <p className="text-[#333333] mb-6 max-w-lg mx-auto">
            WareXhub is expanding. We source parts for any industrial application. Contact our team and we'll set up a custom sourcing workflow for your sector.
          </p>
          <Link to="/contact" className="btn-primary inline-flex">
            Contact Our Team <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
