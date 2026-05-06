import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Shield, Zap, Star, CheckCircle } from 'lucide-react'
import { INDUSTRIES, TESTIMONIALS } from '../../data/constants'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const STAT_CONFIGS = [
  { id: 'stat-active-members', key: 'activeMembers', label: 'Active Members', suffix: '' },
  { id: 'stat-premium-members', key: 'premiumMembers', label: 'Premium Members', suffix: '' },
  { id: 'stat-parts-listed', key: 'partsListed', label: 'Equipments & Parts Listed', suffix: '+' },
  { id: 'stat-deals', key: 'dealsThisMonth', label: 'Deals This Month', suffix: '' },
]

function animateCount(el, target, duration = 1500) {
  if (!el || !target) return
  let start = null
  const step = (timestamp) => {
    if (!start) start = timestamp
    const progress = Math.min((timestamp - start) / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    el.textContent = Math.floor(eased * target).toLocaleString()
    if (progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'List Your Inventory',
    desc: 'Sellers submit parts with OEM numbers, condition, and technical specs. Every listing is reviewed for accuracy before validation.',
    icon: '📦',
    color: 'from-blue-500/20 to-blue-600/5',
    border: 'border-blue-500/30',
  },
  {
    step: '02',
    title: 'Admin Reviews & Approves',
    desc: 'Every listing is manually reviewed by the WareX team. We verify OEM numbers and pricing against manufacturer databases before going LIVE.',
    icon: '🔍',
    color: 'from-amber-500/20 to-amber-600/5',
    border: 'border-amber-500/30',
  },
  {
    step: '03',
    title: 'Buyer Requests → WareX Fulfills',
    desc: 'Buyers find verified spares and request quotes. WareX facilitates the entire deal, ensuring trust, quality, and seamless fulfillment.',
    icon: '⚡',
    color: 'from-emerald-500/20 to-emerald-600/5',
    border: 'border-emerald-500/30',
  },
]

const headline = ['Industrial Equipments & Parts.', 'Sourced Fast.']

function AnimatedHeadline() {
  const [line, setLine] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [charIdx, setCharIdx] = useState(0)

  useEffect(() => {
    if (charIdx < headline[line].length) {
      const t = setTimeout(() => {
        setDisplayed(prev => prev + headline[line][charIdx])
        setCharIdx(c => c + 1)
      }, 40)
      return () => clearTimeout(t)
    } else if (line < headline.length - 1) {
      const t = setTimeout(() => {
        setLine(l => l + 1)
        setDisplayed('')
        setCharIdx(0)
      }, 500)
      return () => clearTimeout(t)
    }
  }, [charIdx, line])

  return (
    <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-tight">
      {headline.slice(0, line).map((l, i) => (
        <span key={i} className={`block ${i === 0 ? 'gradient-text' : ''}`}>{l}</span>
      ))}
      <span className={`block ${line === 0 ? 'gradient-text' : ''}`}>
        {displayed}
        <span className="animate-pulse text-purple-700">|</span>
      </span>
    </h1>
  )
}

export default function HomePage() {
  const [statsData, setStatsData] = useState(null)
  const [industryCounts, setIndustryCounts] = useState({})
  const statsSectionRef = useRef(null)
  const animatedRef = useRef(false)

  // Fetch homepage stats
  useEffect(() => {
    fetch(`${API_BASE}/api/stats/homepage`)
      .then(r => r.ok ? r.json() : null)
      .catch(() => null)
      .then(data => { if (data) setStatsData(data) })
  }, [])

  // Fetch industry listing counts
  useEffect(() => {
    fetch(`${API_BASE}/api/listings/count-by-industry`)
      .then(r => r.ok ? r.json() : null)
      .catch(() => null)
      .then(data => { if (data) setIndustryCounts(data) })
  }, [])

  // Count-up animation via IntersectionObserver
  useEffect(() => {
    if (!statsData) return
    const section = statsSectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true
          STAT_CONFIGS.forEach(cfg => {
            const val = statsData[cfg.key]
            if (val && val > 0) {
              animateCount(document.getElementById(cfg.id), val)
            }
          })
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [statsData])

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-16">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-white" />
        <div className="absolute inset-0 noise-bg" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-200/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl" />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }}
        />

        <div className="page-container relative z-10 py-20">
          <div className="max-w-4xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-purple-100 border border-purple-300 text-purple-700 text-[10px] sm:text-xs md:text-sm font-semibold">
                <span className="w-2 h-2 bg-purple-700 rounded-full animate-pulse" />
                Nepal's #1 B2B Industrial Equipments & Parts Platform
              </span>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <AnimatedHeadline />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
              className="text-[#333333] text-xl mt-8 max-w-2xl leading-relaxed"
            >
              Nepal's most trusted B2B marketplace for industrial equipments and parts. Admin-verified listings. Faster than any alternative.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
              className="flex flex-wrap gap-4 mt-10"
            >
              <Link to="/register" className="btn-primary px-8 py-4 text-base animate-glow">
                Start Sourcing Today <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/search" className="btn-secondary px-8 py-4 text-base">
                Browse Inventory
              </Link>
              <Link to="/how-it-works" className="btn-secondary px-8 py-4 text-base">
                See How It Works
              </Link>
            </motion.div>


          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section id="stats-section" ref={statsSectionRef} className="relative py-12 bg-[#F8F8FA] border-y border-[#E5E5E5]">
        <div className="page-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STAT_CONFIGS.map((cfg, i) => {
              const rawVal = statsData ? statsData[cfg.key] : null
              const hasData = rawVal && rawVal > 0
              return (
                <motion.div
                  key={cfg.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  {hasData ? (
                    <p className="text-3xl font-black text-[#1A1A1A]">
                      <span id={cfg.id}>0</span>
                      <span className="text-[#4A3A5C] text-xl">{cfg.suffix}</span>
                    </p>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-12 bg-gray-200/50 rounded animate-pulse mb-1" />
                    </div>
                  )}
                  <p className="text-[#666666] text-sm mt-1">{cfg.label}</p>
                </motion.div>
              )
            })}
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mt-10 text-[10px] font-black uppercase tracking-[0.3em] text-[#4A3A5C]/40"
          >
            Live ecosystem data will be available here post-launch (30th May 2026)
          </motion.p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 page-container">
        <div className="text-center mb-16">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="section-title">
            How WareX Works
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="section-subtitle mx-auto">
            A three-step process designed for quality and speed.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-px bg-gradient-to-r from-blue-500/30 via-amber-500/30 to-[#4A3A5C]/30" />
          {HOW_IT_WORKS.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass-card p-8 relative"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} border ${step.border} flex items-center justify-center text-3xl mb-6`}>
                {step.icon}
              </div>
              <div className={`absolute top-6 right-6 code-text text-4xl font-black opacity-10 text-[#4A3A5C]`}>
                {step.step}
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">{step.title}</h3>
              <p className="text-[#333333] leading-relaxed">{step.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-[#4A3A5C] text-sm font-medium">
                <Shield className="w-3.5 h-3.5" />
                <span>Quality guaranteed</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Industries */}
      <section className="py-24 bg-[#F8F8FA]">
        <div className="page-container">
          <div className="text-center mb-14">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="section-title">
              Industries We Serve
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="section-subtitle mx-auto">
              Specialized sourcing for Nepal's key industrial sectors
            </motion.p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {INDUSTRIES.map((ind, i) => (
              <motion.div
                key={ind.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                className="glass-card p-6 cursor-pointer group hover:border-[#4A3A5C]/30 transition-all"
              >
                <div className="text-4xl mb-3">{ind.icon}</div>
                <h3 className="text-[#1A1A1A] font-bold mb-1">{ind.name}</h3>
                <p className="text-[#333333] text-xs mb-3">{ind.description}</p>
                {(() => {
                  const key = ind.name.toLowerCase().replace(/[^a-z]/g, '')
                  const count = industryCounts[key] ?? industryCounts[ind.name.toLowerCase()] ?? null
                  return count && count > 0
                    ? <span className="text-[#4A3A5C] text-xs font-semibold">{count} listings</span>
                    : <span className="text-[#AAAAAA] text-xs font-medium">NA</span>
                })()}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 page-container">
        <div className="text-center mb-14">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="section-title">
            Trusted by Nepal's Industry Leaders
          </motion.h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="glass-card p-8"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-[#333333] leading-relaxed mb-6">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#F3F1F7] border border-[#4A3A5C]/20 rounded-full flex items-center justify-center text-[#4A3A5C] font-bold text-sm code-text">
                  {t.initials}
                </div>
                <div>
                  <p className="text-[#1A1A1A] font-semibold text-sm">{t.company}</p>
                  <p className="text-[#666666] text-xs">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#4A3A5C]/10 via-[#4A3A5C]/5 to-[#1A1A1A]" />
        <div className="absolute inset-0 noise-bg" />
        <div className="page-container relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-5xl font-black text-[#1A1A1A] mb-4">
              Ready to Transform Your<br />
              <span className="gradient-text">Parts Sourcing?</span>
            </h2>
            <p className="text-[#333333] text-lg mb-10 max-w-xl mx-auto">
              Join 284 industrial companies already saving time and money with WareX.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register" className="btn-primary px-10 py-4 text-base animate-glow">
                Get Started Free <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/membership" className="btn-outline px-10 py-4 text-base">
                View Membership Plans
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
