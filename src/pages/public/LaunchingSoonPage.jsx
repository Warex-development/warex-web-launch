import { motion } from 'framer-motion'
import { Rocket, ArrowLeft, Shield, Zap, Globe } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function LaunchingSoonPage() {
  const navigate = useNavigate()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen bg-[#F8F8FA] text-[#1A1A1A] flex flex-col relative overflow-x-hidden font-sans w-full">
      {/* Premium Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(74,58,92,0.08)_0%,transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_100%,rgba(16,185,129,0.05)_0%,transparent_40%)]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#4A3A5C 1px, transparent 1px), linear-gradient(90deg, #4A3A5C 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
        <div className="absolute inset-0 noise-bg opacity-20 pointer-events-none" />
      </div>

      <div className="page-container relative z-10 flex-1 flex flex-col pt-20 md:pt-32 pb-20 w-full">
        {/* Navigation */}
        <div className="mb-12 md:mb-0">
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="group relative md:absolute top-0 md:top-12 left-0 md:left-8 flex items-center gap-2 text-[#4A3A5C]/60 hover:text-[#4A3A5C] transition-all font-semibold text-[10px] md:text-sm z-50"
          >
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-[#4A3A5C]/10 flex items-center justify-center group-hover:bg-[#F3F1F7] transition-colors">
              <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" />
            </div>
            <span>Back to Marketplace</span>
          </motion.button>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto w-full"
        >
          {/* Header Section */}
          <div className="text-center mb-20">
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#4A3A5C]/10 text-[#4A3A5C] text-xs font-bold tracking-widest uppercase mb-8 shadow-sm"
            >
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Launching Q2 2026
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black mb-6 md:mb-8 tracking-tight md:tracking-tighter text-[#1A1A1A] leading-[1.1] md:leading-[0.9] text-balance mx-auto w-full"
            >
              Coming <span className="gradient-text">Soon.</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-[#666666] font-medium max-w-3xl mx-auto leading-relaxed"
            >
              WareXhub — The Common Bank for Industrial Equipments and Parts. <br className="hidden md:block" />
              Redefining how industries manage non-moving inventory through a smart and trusted industrial e-commerce ecosystem.
            </motion.p>
          </div>

          {/* Launch Date Card - Simplified */}
          <motion.div
            variants={itemVariants}
            className="relative max-w-3xl mx-auto mb-24"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#4A3A5C] to-[#574B66] blur-2xl opacity-10" />
            <div className="relative glass-card border-none p-8 md:p-16 overflow-hidden bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl md:rounded-[3rem]">
              <div className="absolute top-0 right-0 p-12 opacity-5 hidden lg:block">
                <Rocket className="w-48 h-48 -rotate-45" />
              </div>

              <div className="relative z-10 flex flex-col items-center">
                <span className="text-[#4A3A5C] font-black text-sm tracking-[0.5em] uppercase mb-4">Official Launch Date</span>
                <motion.div
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="text-3xl sm:text-4xl md:text-7xl font-black text-[#1A1A1A] leading-tight"
                >
                  30th <span className="text-emerald-500">May</span> 2026
                </motion.div>
                <div className="mt-6 px-6 py-2 bg-[#F3F1F7] rounded-full text-[10px] font-black text-[#4A3A5C] uppercase tracking-widest">
                  Live Countdown Active in Top Banner
                </div>
              </div>
            </div>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {[
              {
                icon: Shield,
                title: 'Admin-Verified',
                desc: 'All industrial equipments and parts are manually inspected by the WareXhub team before validation.',
                accent: 'bg-emerald-50 text-emerald-600'
              },
              {
                icon: Zap,
                title: 'Smarter Sourcing',
                desc: 'Locate critical components faster. Reduce your factory downtime and unlock working capital.',
                accent: 'bg-[#F3F1F7] text-[#4A3A5C]'
              },
              {
                icon: Globe,
                title: 'Industrial Network',
                desc: 'A unified ecosystem connecting Nepal\'s industrial hubs for better efficiency.',
                accent: 'bg-blue-50 text-blue-600'
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white border border-[#E5E5E5] p-6 sm:p-10 rounded-2xl sm:rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                <div className={`w-14 h-14 rounded-2xl ${item.accent} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">{item.title}</h3>
                <p className="text-[#666666] leading-relaxed text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Premium Industrial Ticker */}
          <motion.div
            variants={itemVariants}
            className="mt-12 pt-16 border-t border-[#E5E5E5] w-full"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#4A3A5C]/30 mb-12 text-center">Targeted Industrial Ecosystem</p>

            <div className="relative overflow-x-hidden border-y border-[#E5E5E5] bg-white py-8 w-full">
              <div className="animate-marquee flex gap-10 whitespace-nowrap items-center">
                {['Steel', 'Hydro', 'Cement', 'Brewery', 'Dairy', 'FMCG', 'Pumps', 'Boilers', 'VFD', 'PLC', 'Instrumentation', 'Thermax', 'Alfa Laval', 'Grundfos'].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-[#1A1A1A] uppercase tracking-[0.2em]">{item}</span>
                    <div className="w-1 h-1 bg-[#4A3A5C]/20 rounded-full" />
                  </div>
                ))}
              </div>
              <div className="absolute top-8 animate-marquee2 flex gap-10 whitespace-nowrap items-center">
                {['Steel', 'Hydro', 'Cement', 'Brewery', 'Dairy', 'FMCG', 'Pumps', 'Boilers', 'VFD', 'PLC', 'Instrumentation', 'Thermax', 'Alfa Laval', 'Grundfos'].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-[#1A1A1A] uppercase tracking-[0.2em]">{item}</span>
                    <div className="w-1 h-1 bg-[#4A3A5C]/20 rounded-full" />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-16 max-w-3xl mx-auto flex flex-wrap justify-center gap-x-8 gap-y-4">
              {['24/7 Admin Support', 'Verified Logistics', 'Technical Validation'].map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 border border-[#4A3A5C] rounded-full" />
                  <span className="text-[10px] font-bold text-[#4A3A5C]/60 uppercase tracking-widest">{feature}</span>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-[#999999] font-bold uppercase tracking-[0.2em] mt-16 text-center">Building Nepal's most trusted industrial exchange</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Industrial Footer */}
      <div className="py-12 border-t border-[#E5E5E5] bg-white relative z-10">
        <div className="page-container flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-xs font-black text-[#1A1A1A] tracking-[0.4em] uppercase mb-1">WareXhub</span>
            <span className="text-[10px] font-bold text-[#4A3A5C]/40 uppercase tracking-widest">Connect • Share • Save</span>
          </div>
          <div className="text-[10px] text-[#999999] font-bold uppercase tracking-widest text-center">
            © 2026 WareXhub. Developed by <a href="https://brandnestagency.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-[#4A3A5C] hover:underline transition-all">BrandNest</a>.
          </div>
          <div className="flex gap-8">
            <span className="text-[10px] font-bold text-[#666666] uppercase tracking-widest hover:text-[#4A3A5C] cursor-pointer">Privacy</span>
            <span className="text-[10px] font-bold text-[#666666] uppercase tracking-widest hover:text-[#4A3A5C] cursor-pointer">Terms</span>
          </div>
        </div>
      </div>
    </div>
  )
}
