import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Shield, ArrowRight, Lock, Mail } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

export default function AdminLoginPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
  const setAuth = useAuthStore(state => state.setAuth)
  const navigate = useNavigate()
  const [showPass, setShowPass] = useState(false)
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  const onSubmit = async (data) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          password: data.password
        })
      })

      const result = await res.json()

      if (!res.ok) {
        // Agar admin nahi hai → redirect to member login
        if (result.code === 'NOT_ADMIN') {
          toast.error('You are not an admin.')
          setTimeout(() => navigate('/login'), 2000)
          return
        }
        toast.error(result.message || 'Login failed')
        return
      }

      // Admin login success
      toast.success(`Welcome back to Admin Portal!`)
      setAuth(result.token, result.user)
      navigate('/admin')

    } catch (err) {
      toast.error('Connection failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-[#4A3A5C] rounded-xl flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">W</span>
          </div>
          <h2 className="text-2xl font-bold text-[#1A1A1A]">Admin Portal</h2>
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            <Shield className="w-3.5 h-3.5" />
            <span>Restricted access — authorized personnel only</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="input-label">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                {...register('email', { required: 'Email is required' })}
                type="email"
                placeholder="admin@warexhub.com"
                className="input-field pl-10"
                autoComplete="off"
              />
            </div>
            {errors.email && <p className="text-[#4A3A5C] text-xs mt-1">{errors.email.message}</p>}
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
            className="w-full py-3 bg-[#4A3A5C] text-white rounded-lg font-medium hover:bg-[#574B66] transition flex justify-center items-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>Sign in to Admin Panel <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <Link to="/login" className="text-sm text-gray-500 hover:text-[#4A3A5C] transition">
            Not an admin? <span className="font-medium underline">Member Login →</span>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
