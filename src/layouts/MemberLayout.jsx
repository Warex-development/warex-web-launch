import { useState } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Search, FileText, Package, Plus, RefreshCw,
  UploadCloud, CreditCard, Bell, LogOut, Menu, X, ChevronLeft,
  ShoppingCart, Store, ChevronRight
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useAppStore } from '../store/appStore'
import ScrollToTop from '../components/ScrollToTop'

const getNavItems = (mode) => {
  const common = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/dashboard/notifications', icon: Bell, label: 'Notifications' },
    { to: '/dashboard/subscription', icon: CreditCard, label: 'Subscription' },
  ]
  const buyerItems = [
    { to: '/dashboard/search', icon: Search, label: 'Search Parts' },
    { to: '/dashboard/request-quote', icon: FileText, label: 'Request Quote' },
    { to: '/dashboard/my-requests', icon: Package, label: 'My Requests' },
  ]
  const sellerItems = [
    { to: '/dashboard/inventory', icon: Package, label: 'My Inventory' },
    { to: '/dashboard/add-listing', icon: Plus, label: 'Add Listing' },
    { to: '/dashboard/pending-reviews', icon: RefreshCw, label: 'Pending Reviews' },
    { to: '/dashboard/bulk-upload', icon: UploadCloud, label: 'Bulk Upload' },
  ]
  if (mode === 'buyer') return [common[0], ...buyerItems, ...common.slice(1)]
  if (mode === 'seller') return [common[0], ...sellerItems, ...common.slice(1)]
  return [...common, ...buyerItems, ...sellerItems]
}

export default function MemberLayout() {
  const { user, logout, switchMode } = useAuthStore()
  const { notifications } = useAppStore()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const unread = notifications.filter(n => !n.read).length
  const navItems = getNavItems(user?.mode)

  const handleLogout = () => { logout(); navigate('/') }
  const handleModeSwitch = () => {
    switchMode(user?.mode === 'buyer' ? 'seller' : 'buyer')
  }

  const Sidebar = ({ mobile = false }) => (
    <div className={`flex flex-col h-full bg-white border-r border-[#E5E5E5] transition-all duration-300 ${mobile ? 'w-72' : collapsed ? 'w-16' : 'w-60'}`}>
      {/* Logo */}
      <div className={`flex items-center h-16 px-4 border-b border-[#E5E5E5] ${collapsed && !mobile ? 'justify-center' : 'justify-between'}`}>
        {(!collapsed || mobile) && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#4A3A5C] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">W</span>
            </div>
            <span className="font-bold text-[#1A1A1A] text-lg">WareX</span>
          </div>
        )}
        {!mobile && (
          <button onClick={() => setCollapsed(!collapsed)} className="p-1 text-[#666666] hover:text-[#1A1A1A] transition-colors">
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* User Card */}
      {(!collapsed || mobile) && (
        <div className="p-4 border-b border-[#E5E5E5]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#F3F1F7] border border-[#4A3A5C]/20 rounded-full flex items-center justify-center text-[#4A3A5C] font-bold text-sm shrink-0">
              {user?.avatar}
            </div>
            <div className="min-w-0">
              <p className="text-[#1A1A1A] font-semibold text-sm truncate">{user?.name}</p>
              <p className="code-text text-xs text-[#333333]">{user?.code}</p>
            </div>
          </div>
          {/* Mode Toggle */}
          <button
            onClick={handleModeSwitch}
            className="w-full mt-3 flex items-center justify-between px-3 py-2 rounded-lg bg-[#F8F8FA] border border-[#E5E5E5] hover:border-[#4A3A5C]/30 transition-all"
          >
            <div className="flex items-center gap-2">
              {user?.mode === 'buyer' ? (
                <ShoppingCart className="w-3.5 h-3.5 text-[#4A3A5C]" />
              ) : (
                <Store className="w-3.5 h-3.5 text-[#4A3A5C]" />
              )}
              <span className="text-xs font-semibold capitalize text-[#1A1A1A]">{user?.mode} Mode</span>
            </div>
            <span className="text-xs text-[#333333]">Switch</span>
          </button>
        </div>
      )}

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''} ${collapsed && !mobile ? 'justify-center px-2' : ''}`
            }
            onClick={() => mobile && setMobileOpen(false)}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {(!collapsed || mobile) && <span>{item.label}</span>}
            {item.label === 'Notifications' && unread > 0 && (!collapsed || mobile) && (
              <span className="ml-auto bg-[#4A3A5C] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unread}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-[#E5E5E5]">
        <button onClick={handleLogout} className={`sidebar-link w-full text-[#4A3A5C] hover:bg-[#F3F1F7] hover:text-[#4A3A5C] ${collapsed && !mobile ? 'justify-center px-2' : ''}`}>
          <LogOut className="w-4 h-4 shrink-0" />
          {(!collapsed || mobile) && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F8FA]">
      <ScrollToTop />
      {/* Desktop Sidebar */}
      <div className="hidden md:flex shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 bottom-0 z-50 md:hidden flex"
            >
              <Sidebar mobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center h-16 px-4 md:px-6 border-b border-[#E5E5E5] bg-white shrink-0">
          <button className="md:hidden p-2 text-[#666666] hover:text-[#1A1A1A] mr-2" onClick={() => setMobileOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[#333333]">Dashboard</span>
            {location.pathname !== '/dashboard' && (
              <>
                <ChevronRight className="w-3 h-3 text-[#CCCCCC]" />
                <span className="text-[#1A1A1A] capitalize">
                  {location.pathname.split('/').pop()?.replace(/-/g, ' ') || ''}
                </span>
              </>
            )}
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3F1F7] border border-[#4A3A5C]/20 text-[#4A3A5C] text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4A3A5C]" />
              {user?.plan} Member
            </span>
          </div>
        </div>

        {/* Page Content */}
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
