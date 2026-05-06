import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Shield, ArrowRight, Lock, FileText } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
  const { login } = useAuthStore()
  const navigate = useNavigate()
  const [showPass, setShowPass] = useState(false)
  const [statsData, setStatsData] = useState(null)
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  useEffect(() => {
    fetch(`${API_BASE}/api/stats/homepage`)
      .then(r => r.ok ? r.json() : null)
      .catch(() => null)
      .then(data => { if (data) setStatsData(data) })
  }, [])

  useEffect(() => {
    if (!statsData) return

    const animateCount = (element, target, prefix = '', suffix = '') => {
      let start = 0
      const duration = 2000
      const increment = target / (duration / 16)
      
      const updateCount = () => {
        start += increment
        if (start < target) {
          element.innerText = prefix + Math.ceil(start).toLocaleString() + suffix
          requestAnimationFrame(updateCount)
        } else {
          // Special formatting for Deals (NPR X.XL)
          if (element.id === 'stat-dealsThisMonth') {
            element.innerText = `NPR ${(target / 100000).toFixed(1)}L`
          } else {
            element.innerText = prefix + target.toLocaleString() + suffix
          }
        }
      }
      updateCount()
    }

    if (statsData.activeMembers > 0) animateCount(document.getElementById('stat-activeMembers'), statsData.activeMembers)
    if (statsData.partsListed > 0) animateCount(document.getElementById('stat-partsListed'), statsData.partsListed, '', '+')
    if (statsData.dealsThisMonth > 0) animateCount(document.getElementById('stat-dealsThisMonth'), statsData.dealsThisMonth)
    
  }, [statsData])

  const onSubmit = async (data) => {
    const result = await login(data.username, data.password)
    if (result.success) {
      toast.success(`Welcome back, ${result.user.full_name || result.user.name}!`)
      // Role-based redirect
      if (result.user.role === 'admin' || result.user.role === 'reviewer') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    } else {
      toast.error(result.error || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-[#1a1625] text-white p-12 relative overflow-hidden">
        <div className="absolute inset-0 noise-bg opacity-20" />
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#4A3A5C]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-[#4A3A5C] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">W</span>
            </div>
            <span className="text-2xl font-bold text-white">WareX</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-white leading-tight">
              Industrial Equipments &amp; Parts.<br />
              <span className="gradient-text">Sourced Fast.</span>
            </h1>
            <p className="text-[#a89ec9] mt-4 text-lg leading-relaxed">
              Nepal's most trusted B2B platform for industrial equipments and parts. Admin-verified. Buyer-anonymous.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#2a2140] rounded-xl p-4 border border-white/5 shadow-sm">
              <p id="stat-activeMembers" className="text-2xl font-bold text-white">--</p>
              <p className="text-[#a89ec9] text-sm">Active Members</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#2a2140] rounded-xl p-4 border border-white/5 shadow-sm">
              <p id="stat-partsListed" className="text-2xl font-bold text-white">--</p>
              <p className="text-[#a89ec9] text-sm">Parts Listed</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[#2a2140] rounded-xl p-4 border border-white/5 shadow-sm">
              <p id="stat-dealsThisMonth" className="text-2xl font-bold text-white">--</p>
              <p className="text-[#a89ec9] text-sm">Monthly Deals</p>
            </motion.div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-[#a89ec9] text-sm">
          <Shield className="w-4 h-4 text-[#4A3A5C]" />
          <span>Admin verified members only.</span>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-[#4A3A5C] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <span className="text-xl font-bold text-[#1A1A1A]">WareX</span>
          </div>

          <h2 className="text-3xl font-bold text-[#1A1A1A] mb-1">Sign In</h2>
          <p className="text-[#333333] mb-8">Access your WareX member dashboard</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="input-label">VAT Number</label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999999]" />
                <input
                  {...register('username', { required: 'VAT Number is required' })}
                  type="text"
                  placeholder="Enter your 9-digit VAT number"
                  className="input-field pl-10"
                  autoComplete="off"
                />
              </div>
              {errors.username && <p className="text-[#4A3A5C] text-xs mt-1">{errors.username.message}</p>}
            </div>

            <div>
              <label className="input-label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  {...register('password', { required: 'Password is required' })}
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="input-field pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-[#4A3A5C] text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full justify-center py-3 text-base"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-[#333333] text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#4A3A5C] hover:text-[#574B66] font-semibold">Request Access</Link>
          </p>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-400 mb-3">
              Are you a WareX Administrator?
            </p>
            <button
              type="button"
              onClick={() => navigate('/admin/login')}
              className="text-sm text-[#4A3A5C] hover:text-[#574B66] font-medium underline transition"
            >
              Continue as Admin →
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
