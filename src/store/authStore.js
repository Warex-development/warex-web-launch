import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const API_URL = import.meta.env.VITE_API_URL

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      
      login: async (identifier, password) => {
        try {
          console.log(`🔓 [AUTH] Attempting API login for: ${identifier}`)
          
          const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ identifier, password })
          })
          
          const data = await response.json()
          
          if (!response.ok) {
            console.log(`⚠️  [AUTH] Login failed: ${data.message}`)
            return { success: false, error: data.message }
          }
          
          // Save token and user data
          const { token, user } = data
          set({ user, isAuthenticated: true, token })
          
          console.log(`✅ [AUTH] Login successful for: ${user.email}`)
          return { success: true, user }
        } catch (error) {
          console.error('❌ [AUTH] Login error:', error)
          return { success: false, error: error.message || 'Connection failed. Please check if backend is running.' }
        }
      },

      logout: () => {
        // Clear user state and isAuthenticated
        set({ user: null, isAuthenticated: false })
        // Force localStorage to clear by removing the persisted key
        if (typeof window !== 'undefined') {
          try {
            localStorage.removeItem('warexhub-auth')
          } catch (e) {
            console.warn('Could not clear localStorage:', e)
          }
        }
      },

      switchMode: (mode) => {
        set(state => ({
          user: state.user ? { ...state.user, mode } : null
        }))
      },

      setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
      
      setToken: (token) => set({ token }),

      updateMembershipPlan: (planName, billingCycle) => {
        set(state => {
          if (!state.user) return state
          
          // Calculate plan expiry based on billing cycle
          const today = new Date()
          let expiryDate = new Date(today)
          
          if (billingCycle === 'monthly') {
            expiryDate.setMonth(expiryDate.getMonth() + 1)
          } else if (billingCycle === 'quarterly') {
            expiryDate.setMonth(expiryDate.getMonth() + 3)
          } else if (billingCycle === 'annual') {
            expiryDate.setFullYear(expiryDate.getFullYear() + 1)
          }
          
          const expiryString = expiryDate.toISOString().split('T')[0]
          
          return {
            user: {
              ...state.user,
              plan: planName,
              planCycle: billingCycle,
              planExpiry: expiryString,
            }
          }
        })
      },
    }),
    {
      name: 'warexhub-auth',
    }
  )
)
