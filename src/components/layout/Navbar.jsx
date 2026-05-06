import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, X, Bell, ChevronDown, LogOut, Settings, User,
  Home, Search, FileText, Package, Plus, RefreshCw, UploadCloud,
  CreditCard, Shield
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useAppStore } from '../../store/appStore'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/why-warex', label: 'Why WareX' },
  { to: '/membership', label: 'Membership' },
  { to: '/industries', label: 'Industries' },
]

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const { notifications } = useAppStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const unread = notifications.filter(n => !n.is_read).length

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const getDashboardPath = () => {
    if (user?.role === 'admin' || user?.role === 'reviewer') return '/admin'
    return '/dashboard'
  }

  return (
    <nav className="fixed top-[56px] left-0 right-0 z-50 bg-white border-b border-[#E5E5E5]">
      <div className="page-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#4A3A5C] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-[#4A3A5C] leading-none">WareX</span>
              <span className="text-[10px] font-medium text-[#4A3A5C]/60 tracking-wider">Connect • Share • Save</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'text-[#4A3A5C] bg-[#F3F1F7]'
                    : 'text-[#333333] hover:text-[#4A3A5C] hover:bg-[#F8F8FA]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to={`${getDashboardPath()}/notifications`} className="relative p-2 text-[#666666] hover:text-[#1A1A1A] transition-colors">
                  <Bell className="w-5 h-5" />
                  {unread > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-[#4A3A5C] rounded-full text-xs flex items-center justify-center text-white font-bold">
                      {unread}
                    </span>
                  )}
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#F3F1F7] transition-colors"
                  >
                    <div className="w-8 h-8 bg-[#F3F1F7] border border-[#4A3A5C]/20 rounded-full flex items-center justify-center text-[#4A3A5C] text-sm font-bold overflow-hidden">
                      {user?.avatar && user.avatar.startsWith('http') ? (
                        <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        user?.avatar
                      )}
                    </div>
                    <ChevronDown className="w-4 h-4 text-[#666666]" />
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        className="absolute right-0 mt-2 w-56 glass-card-dark border border-[#E5E5E5] rounded-xl shadow-2xl overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-[#E5E5E5]">
                          <p className="text-[#1A1A1A] font-semibold text-sm">{user?.name}</p>
                          <p className="text-[#666666] text-xs mt-0.5">{user?.company}</p>
                          <p className="text-[#999999] text-xs code-text mt-1">{user?.code}</p>
                        </div>
                        <div className="p-2">
                          <Link
                            to={getDashboardPath()}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#666666] hover:bg-[#F3F1F7] hover:text-[#1A1A1A] transition-colors"
                            onClick={() => setProfileOpen(false)}
                          >
                            <Home className="w-4 h-4" /> Dashboard
                          </Link>
                          {user?.role === 'member' && (
                            <Link
                              to="/dashboard/profile"
                              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#666666] hover:bg-[#F3F1F7] hover:text-[#1A1A1A] transition-colors"
                              onClick={() => setProfileOpen(false)}
                            >
                              <User className="w-4 h-4" /> Profile
                            </Link>
                          )}
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#4A3A5C] hover:bg-[#F3F1F7] transition-colors"
                          >
                            <LogOut className="w-4 h-4" /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <button onClick={(e) => { e.preventDefault(); navigate('/launching-soon') }} className="btn-secondary py-2 px-4 text-sm">Sign In</button>
                <button onClick={(e) => { e.preventDefault(); navigate('/launching-soon') }} className="btn-primary py-2 px-4 text-sm">Get Started</button>
              </div>
            )}

            {/* Mobile Menu */}
            <button
              className="lg:hidden p-2 text-[#666666] hover:text-[#1A1A1A]"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-[#E5E5E5] bg-white"
          >
            <div className="page-container py-4 space-y-1">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-lg text-sm font-medium text-[#333333] hover:text-[#4A3A5C] hover:bg-[#F3F1F7] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <div className="pt-3 border-t border-[#E5E5E5] flex gap-3">
                  <button onClick={(e) => { e.preventDefault(); setMenuOpen(false); navigate('/launching-soon') }} className="btn-secondary flex-1 justify-center text-sm py-2">Sign In</button>
                  <button onClick={(e) => { e.preventDefault(); setMenuOpen(false); navigate('/launching-soon') }} className="btn-primary flex-1 justify-center text-sm py-2">Get Started</button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
