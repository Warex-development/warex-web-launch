import { Link } from 'react-router-dom'
import { Shield, Mail, Phone, MapPin, ExternalLink } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#4A3A5C] border-t border-[#574B66] mt-20">
      <div className="page-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-[#4A3A5C] font-bold text-sm">W</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white leading-none">WareXhub</span>
                <span className="text-[10px] font-medium text-[#E8DDF5]/60 tracking-wider">Connect • Share • Save</span>
              </div>
            </Link>
            <p className="text-[#E8DDF5] text-sm leading-relaxed mb-4">
              Nepal's premium B2B industrial equipments and parts sourcing platform. Where industry meets trust.
            </p>
            <div className="flex items-center gap-2 text-[#E8DDF5] text-xs">
              <Shield className="w-3.5 h-3.5" />
              <span>Admin-Verified Listings Only</span>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2.5">
              {[
                ['How It Works', '/how-it-works'],
                ['Why WareXhub', '/why-warexhub'],
                ['Membership Plans', '/membership'],
                ['Industries Served', '/industries'],
              ].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="text-[#E8DDF5] hover:text-white text-sm transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2.5">
              {[
                ['About Us', '/about'],
                ['Contact', '/contact'],
                ['FAQ', '/faq'],
              ].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="text-[#E8DDF5] hover:text-white text-sm transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Technical & Agency</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://brandnestagency.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#E8DDF5] hover:text-white text-sm transition-colors"
                >
                  <span>Contact Brandnest (Agency)</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                </a>
              </li>
              <li>
                <a
                  href="https://tushkarmakar.vercel.app/client"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#E8DDF5] hover:text-white text-sm transition-colors"
                >
                  <span>Quick Connect Developer</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#574B66] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#E8DDF5] text-xs">© 2026 WareXhub. <a href="https://brandnestagency.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Developed by BrandNest</a></p>
          <div className="flex gap-4">
            <Link to="/privacy-policy" className="text-[#E8DDF5] text-xs hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="text-[#E8DDF5] text-xs hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
