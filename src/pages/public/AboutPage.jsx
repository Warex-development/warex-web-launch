import { motion } from 'framer-motion'
import { Shield, Zap, Globe, Users, Target, Heart } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

export default function AboutPage() {
  const navigate = useNavigate()
  return (
    <div className="space-y-20 py-20">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center page-container"
      >
        <h1 className="text-5xl font-bold text-[#1A1A1A] mb-2">About WareX</h1>
        <p className="text-sm font-bold text-[#4A3A5C]/60 tracking-[0.2em] uppercase mb-6">Connect • Share • Save</p>
        <p className="text-2xl font-bold text-[#4A3A5C] max-w-4xl mx-auto mb-8">
          WareX — The Common Bank for Industrial Equipments and Parts
        </p>
      </motion.div>

      {/* Main Content */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="page-container max-w-4xl space-y-12 text-[#333333] text-lg leading-relaxed"
      >
        <p>
          At WareX, we are redefining how industries manage non-moving inventory.
          We built a smart and trusted industrial e-commerce ecosystem where factories can unlock the value of surplus spares while helping other industries find critical components faster and more efficiently.
        </p>

        <p>
          WareX connects seller industries with idle inventory to buyer industries with urgent requirements — all through a secure, technically validated, and professionally managed platform.
        </p>

        <div className="bg-white border border-[#E5E5E5] rounded-xl p-8 shadow-sm">
          <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">Unlike conventional marketplaces, WareX actively participates in every transaction by ensuring:</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <li className="flex items-center gap-3"><Shield className="w-5 h-5 text-[#4A3A5C]" /> Technical compatibility</li>
            <li className="flex items-center gap-3"><Shield className="w-5 h-5 text-[#4A3A5C]" /> Product validation</li>
            <li className="flex items-center gap-3"><Shield className="w-5 h-5 text-[#4A3A5C]" /> Secure escrow payments</li>
            <li className="flex items-center gap-3"><Shield className="w-5 h-5 text-[#4A3A5C]" /> Safe logistics coordination</li>
            <li className="flex items-center gap-3"><Shield className="w-5 h-5 text-[#4A3A5C]" /> Trusted delivery assurance</li>
          </ul>
        </div>

        <div className="text-center py-8">
          <h2 className="text-3xl font-bold text-[#1A1A1A] mb-2">Our mission is simple:</h2>
          <p className="text-4xl font-black text-[#4A3A5C] tracking-tight">Connect. Share. Save.</p>
        </div>

        <div className="bg-[#F8F8FA] border border-[#E5E5E5] rounded-xl p-8">
          <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">By turning unused industrial stock into opportunity, WareX helps industries:</h3>
          <ul className="space-y-4">
            <li className="flex items-center gap-3"><Zap className="w-5 h-5 text-emerald-500" /> Reduce inventory holding costs</li>
            <li className="flex items-center gap-3"><Zap className="w-5 h-5 text-emerald-500" /> Improve operational efficiency</li>
            <li className="flex items-center gap-3"><Zap className="w-5 h-5 text-emerald-500" /> Access hard-to-find spares</li>
            <li className="flex items-center gap-3"><Zap className="w-5 h-5 text-emerald-500" /> Promote industrial sustainability</li>
            <li className="flex items-center gap-3"><Zap className="w-5 h-5 text-emerald-500" /> Build a transparent and collaborative supply network</li>
          </ul>
        </div>

        <p className="text-xl text-center font-medium leading-relaxed">
          Whether it is boilers, pumps, instrumentation, water treatment systems, compressors, or factory consumables — WareX creates one common platform where industries trade with confidence.
        </p>

        <div className="text-center py-12 border-t border-[#E5E5E5]">
          <h2 className="text-3xl font-black text-[#1A1A1A] mb-4">WareX is more than a marketplace.</h2>
          <p className="text-2xl text-[#4A3A5C] font-bold">It is the trusted exchange network for industrial growth.</p>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-[#4A3A5C]/10 to-[#574B66]/10 border border-[#4A3A5C]/20 rounded-2xl p-12 text-center page-container"
      >
        <h2 className="text-3xl font-bold text-[#1A1A1A] mb-4">Ready to Join?</h2>
        <p className="text-[#333333] mb-8 max-w-2xl mx-auto">
          Whether you're sourcing rare parts or listing your inventory, WareX is your trusted platform.
        </p>
        <button
          onClick={() => navigate('/launching-soon')}
          className="inline-block bg-[#4A3A5C] hover:bg-[#574B66] text-white px-8 py-3 rounded-lg font-semibold transition"
        >
          Get Started Now
        </button>
      </motion.section>
    </div>
  )
}
