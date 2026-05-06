import { useState } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, ClipboardList, CheckSquare, Users, Layers,
  GitMerge, TrendingUp, BarChart2, Bell, LogOut, Menu,
  ChevronLeft, ChevronRight, Shield, UserCheck, Target
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useAppStore } from '../store/appStore'
import ScrollToTop from '../components/ScrollToTop'

const ADMIN_NAV = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true, roles: ['admin', 'reviewer'] },
  { to: '/admin/pending-queue', icon: ClipboardList, label: 'Pending Queue', badge: 'pending', roles: ['admin', 'reviewer'] },
  { to: '/admin/approved-inventory', icon: CheckSquare, label: 'Approved Inventory', roles: ['admin'] },
  { to: '/admin/buyer-requests', icon: Layers, label: 'Buyer Requests', roles: ['admin'] },
  { to: '/admin/matching-engine', icon: GitMerge, label: 'Matching Engine', roles: ['admin'] },
  { to: '/admin/deals-pipeline', icon: TrendingUp, label: 'Deals Pipeline', roles: ['admin'] },
  { to: '/admin/revenue', icon: BarChart2, label: 'Revenue Tracker', roles: ['admin'] },
  { to: '/admin/users', icon: Users, label: 'User Management', roles: ['admin'] },
  { to: '/admin/commission', icon: BarChart2, label: 'Commission Analytics', roles: ['admin'] },
  { to: '/admin/registrations', icon: UserCheck, label: 'Registrations', roles: ['admin'] },
  { to: '/admin/membership-requests', icon: UserCheck, label: 'Membership Requests', roles: ['admin'] },
  { to: '/admin/leads', icon: Target, label: 'Guest Leads', roles: ['admin'] },
]

export default function AdminLayout() {
  const { user, logout } = useAuthStore()
  const { listings, notifications } = useAppStore()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const pendingCount = listings.filter(i => i.status === 'PENDING REVIEW').length
  const unread = notifications.filter(n => !n.read).length

  const handleLogout = () => { logout(); navigate('/') }
  const userNavItems = ADMIN_NAV.filter(item => item.roles.includes(user?.role))

  const Sidebar = ({ mobile = false }) => (
    <div className={`flex flex-col h-full bg-white border-r border-[#E5E5E5] transition-all duration-300 ${mobile ? 'w-72' : collapsed ? 'w-16' : 'w-60'}`}>
      {/* Logo */}
      <div className={`flex items-center h-16 px-4 border-b border-[#E5E5E5] ${collapsed && !mobile ? 'justify-center' : 'justify-between'}`}>
        {(!collapsed || mobile) && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#4A3A5C] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">W</span>
            </div>
            <div>
              <span className="font-bold text-[#1A1A1A] text-base">WareX</span>
              <span className="text-[#4A3A5C] text-xs font-semibold ml-1.5">ADMIN</span>
            </div>
          </div>
        )}
        {!mobile && (
          <button onClick={() => setCollapsed(!collapsed)} className="p-1 text-[#666666] hover:text-[#1A1A1A] transition-colors">
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* User card */}
      {(!collapsed || mobile) && (
        <div className="p-4 border-b border-[#E5E5E5]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#F3F1F7] border border-[#E5E5E5] rounded-full flex items-center justify-center text-[#4A3A5C] font-bold text-sm shrink-0">
              {user?.avatar}
            </div>
            <div className="min-w-0">
              <p className="text-[#1A1A1A] font-semibold text-sm truncate">{user?.name}</p>
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-[#4A3A5C]" />
                <span className="text-xs text-[#4A3A5C] capitalize font-medium">{user?.role}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {userNavItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => mobile && setMobileOpen(false)}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''} ${collapsed && !mobile ? 'justify-center px-2' : ''}`
            }
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {(!collapsed || mobile) && <span>{item.label}</span>}
            {item.badge === 'pending' && pendingCount > 0 && (!collapsed || mobile) && (
              <span className="ml-auto bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {pendingCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-[#E5E5E5]">
        <button onClick={handleLogout} className={`sidebar-link w-full text-[#4A3A5C] hover:bg-[#F3F1F7] hover:text-[#4A3A5C] ${collapsed && !mobile ? 'justify-center px-2' : ''}`}>
          <LogOut className="w-4 h-4 shrink-0" />
          {(!collapsed || mobile) && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <ScrollToTop />
      <div className="hidden md:flex shrink-0"><Sidebar /></div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
            <motion.div initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 bottom-0 z-50 md:hidden flex">
              <Sidebar mobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center h-16 px-4 md:px-6 border-b border-[#E5E5E5] bg-[#4A3A5C] shrink-0">
          <button className="md:hidden p-2 text-white hover:text-[#E8DDF5] mr-2" onClick={() => setMobileOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[#E8DDF5]">Admin</span>
            {location.pathname !== '/admin' && (
              <>
                <ChevronRight className="w-3 h-3 text-[#E8DDF5]/50" />
                <span className="text-white capitalize">
                  {location.pathname.split('/').pop()?.replace(/-/g, ' ') || ''}
                </span>
              </>
            )}
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8DDF5] border border-[#4A3A5C]/20 text-[#4A3A5C] text-xs font-semibold">
              <Shield className="w-3.5 h-3.5" />
              {user?.role === 'reviewer' ? 'Reviewer' : 'Admin Panel'}
            </span>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
