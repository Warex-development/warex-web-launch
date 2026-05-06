import { useState, useMemo, useEffect } from 'react'
import { Search, TrendingUp, X, Loader2 } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Fuse from 'fuse.js'
import QuoteModal from '../../components/ui/QuoteModal'
import GuestLeadModal from '../../components/ui/GuestLeadModal'
import AdvancedFilter from '../../components/ui/AdvancedFilter'
import { getApprovedListings } from '../../services/listingsService'
import Pagination from '../../components/ui/Pagination'

export default function SearchPage() {
  const { isAuthenticated, user } = useAuthStore()
  const [inventory, setInventory] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  
  const fetchListings = async (pageNumber = 1) => {
    setIsLoading(true)
    try {
      const data = await getApprovedListings(pageNumber, 20)
      const list = Array.isArray(data) ? data : (data.data || data.listings || [])
      setInventory(list)
      if (!Array.isArray(data)) {
        setTotalPages(data.totalPages || 1)
      }
    } catch (error) {
      // Silently fail or show error
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchListings(page)
  }, [page])
  
  // Search term
  const [searchTerm, setSearchTerm] = useState('')
  
  // Unified filters state - PRACTICAL BUYING FILTERS ONLY
  const [filters, setFilters] = useState({
    brands: [],
    brandOther: '',
    applications: [],
    applicationOther: '',
    oem: '',
    conditions: [],
    priceRange: { min: 0, max: 5000000 },
    listingAge: ''
  })
  
  // UI State
  const [quoteModalOpen, setQuoteModalOpen] = useState(false)
  const [guestModalOpen, setGuestModalOpen] = useState(false)
  const [selectedListing, setSelectedListing] = useState(null)

  const liveInventory = inventory // Already filtered to status='approved' by API

  const suggestCorrection = (term) => {
    if (!term || term.length < 2) return null
    const searchData = liveInventory.map(item => ({
      id: item.id,
      name: item.name,
      oem: item.oem,
      make: item.make,
    }))
    const fuse = new Fuse(searchData, {
      keys: ['name', 'oem', 'make'],
      threshold: 0.35,
      distance: 100,
      minMatchCharLength: 2,
      ignoreLocation: true,
    })
    const results = fuse.search(term)
    if (results.length > 0) {
      const bestMatch = results[0].item
      if (bestMatch.name.toLowerCase() !== term.toLowerCase()) {
        return bestMatch.name
      }
    }
    return null
  }

  // Helper function to check listing age
  const isWithinListingAge = (submittedDate, filterAge) => {
    if (!filterAge) return true
    
    const today = new Date('2025-01-15') // Reference date for demo
    const listingDate = new Date(submittedDate)
    const diffTime = Math.abs(today - listingDate)
    const daysOld = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (filterAge === 'today') return daysOld === 0
    if (filterAge === '7days') return daysOld <= 7
    if (filterAge === '30days') return daysOld <= 30
    if (filterAge === 'thisyear') return listingDate.getFullYear() === 2025
    
    return true
  }

  const filteredInventory = useMemo(() => {
    let results = liveInventory

    // Search
    if (searchTerm) {
      const searchData = liveInventory.map(item => ({
        id: item.id,
        name: item.name,
        oem: item.oem,
        make: item.make,
      }))
      const fuse = new Fuse(searchData, {
        keys: ['name', 'oem', 'make'],
        threshold: 0.4,
        distance: 100,
        minMatchCharLength: 2,
      })
      const searchResults = fuse.search(searchTerm)
      const matchedIds = searchResults.map(r => r.item.id)
      results = results.filter(item => matchedIds.includes(item.id))
    }

    // Apply practical buying filters
    results = results.filter(item => {
      // Brand filter logic including "Other"
      let matchesBrand = filters.brands.length === 0
      if (filters.brands.length > 0) {
        const hasOther = filters.brands.includes('Other')
        const regularBrands = filters.brands.filter(b => b !== 'Other')
        const matchesRegular = regularBrands.includes(item.make) || regularBrands.includes(item.manufacturer)
        const matchesOther = hasOther && filters.brandOther && (
          item.make.toLowerCase().includes(filters.brandOther.toLowerCase()) || 
          item.manufacturer.toLowerCase().includes(filters.brandOther.toLowerCase())
        )
        matchesBrand = matchesRegular || matchesOther
      }

      // Application filter logic (item.application is an array)
      let matchesApplication = filters.applications.length === 0
      if (filters.applications.length > 0) {
        const hasOther = filters.applications.includes('Other')
        const regularApps = filters.applications.filter(a => a !== 'Other')
        const matchesRegular = regularApps.some(app => item.application?.includes(app))
        const matchesOther = hasOther && filters.applicationOther && 
          item.application?.some(app => app.toLowerCase().includes(filters.applicationOther.toLowerCase()))
        matchesApplication = matchesRegular || matchesOther
      }

      const matchesOEM = !filters.oem || (item.oem && item.oem.toLowerCase().includes(filters.oem.toLowerCase()))
      const matchesCondition = filters.conditions.length === 0 || filters.conditions.includes(item.condition)
      
      // Use buyer_visible_min for price filtering
      const price = parseFloat(item.buyer_visible_min || 0)
      const matchesPrice = price >= filters.priceRange.min && price <= filters.priceRange.max
      const matchesListingAge = isWithinListingAge(item.created_at, filters.listingAge)

      return matchesBrand && matchesApplication && matchesOEM && matchesCondition && matchesPrice && matchesListingAge
    })

    return results
  }, [searchTerm, filters, liveInventory])

  const suggestion = suggestCorrection(searchTerm)
  const formatPrice = (price) => `NPR ${(price || 0).toLocaleString()}`

  // Get active filters count
  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'priceRange') return value.min > 0 || value.max < 5000000
    if (key === 'brandOther' || key === 'applicationOther') return false // Part of main filters
    if (Array.isArray(value)) return value.length > 0
    return value !== ''
  }).length

  const clearAllFilters = () => {
    setSearchTerm('')
    setFilters({
      brands: [],
      brandOther: '',
      applications: [],
      applicationOther: '',
      oem: '',
      conditions: [],
      priceRange: { min: 0, max: 5000000 },
      listingAge: ''
    })
  }

  const handleGetQuoteClick = (item) => {
    setSelectedListing(item)
    if (isAuthenticated) {
      setQuoteModalOpen(true)
    } else {
      setGuestModalOpen(true)
    }
  }

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-gradient-to-r from-[#4A3A5C]/10 to-white border border-[#E5E5E5] rounded-xl p-6 hover:shadow-md transition">
        <h1 className="text-2xl font-bold text-[#1A1A1A] mb-4">Search Inventory</h1>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999999]" />
          <input
            type="text"
            placeholder="Search by item name, OEM number, brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-[#E5E5E5] rounded-lg text-[#1A1A1A] placeholder-[#999999] focus:outline-none focus:ring-2 focus:ring-[#4A3A5C]"
          />
        </div>
      </div>

      {/* Suggestion Box */}
      {suggestion && searchTerm !== suggestion && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#4A3A5C]/10 border border-[#4A3A5C]/30 rounded-lg p-4 flex items-center gap-3"
        >
          <div className="w-5 h-5 text-[#4A3A5C] flex-shrink-0">⚡</div>
          <p className="text-sm text-[#666666]">Did you mean: 
            <button
              onClick={() => setSearchTerm(suggestion)}
              className="ml-2 text-[#4A3A5C] hover:text-[#574B66] font-medium transition"
            >
              {suggestion}
            </button>
          </p>
        </motion.div>
      )}

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          {filters.brands.length > 0 && (
            <div className="inline-flex items-center gap-2 bg-[#4A3A5C]/10 border border-[#4A3A5C]/30 text-[#4A3A5C] px-3 py-1.5 rounded-full text-sm">
              <span>Brand/Make/Mfg: {filters.brands.length}</span>
              <button onClick={() => setFilters({...filters, brands: []})} className="hover:text-[#574B66]">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          {filters.applications.length > 0 && (
            <div className="inline-flex items-center gap-2 bg-[#4A3A5C]/10 border border-[#4A3A5C]/30 text-[#4A3A5C] px-3 py-1.5 rounded-full text-sm">
              <span>Applications: {filters.applications.length}</span>
              <button onClick={() => setFilters({...filters, applications: []})} className="hover:text-[#574B66]">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          {filters.oem && (
            <div className="inline-flex items-center gap-2 bg-[#4A3A5C]/10 border border-[#4A3A5C]/30 text-[#4A3A5C] px-3 py-1.5 rounded-full text-sm">
              <span>OEM: {filters.oem}</span>
              <button onClick={() => setFilters({...filters, oem: ''})} className="hover:text-[#574B66]">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          {filters.conditions.length > 0 && (
            <div className="inline-flex items-center gap-2 bg-[#4A3A5C]/10 border border-[#4A3A5C]/30 text-[#4A3A5C] px-3 py-1.5 rounded-full text-sm">
              <span>Conditions: {filters.conditions.length}</span>
              <button onClick={() => setFilters({...filters, conditions: []})} className="hover:text-[#574B66]">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          {(filters.priceRange.min > 0 || filters.priceRange.max < 5000000) && (
            <div className="inline-flex items-center gap-2 bg-[#4A3A5C]/10 border border-[#4A3A5C]/30 text-[#4A3A5C] px-3 py-1.5 rounded-full text-sm">
              <span>Price: NPR {filters.priceRange.min?.toLocaleString()} - {filters.priceRange.max?.toLocaleString()}</span>
              <button onClick={() => setFilters({...filters, priceRange: { min: 0, max: 5000000 }})} className="hover:text-[#574B66]">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          {filters.listingAge && (
            <div className="inline-flex items-center gap-2 bg-[#4A3A5C]/10 border border-[#4A3A5C]/30 text-[#4A3A5C] px-3 py-1.5 rounded-full text-sm">
              <span>Age: {filters.listingAge === 'today' ? 'Today' : filters.listingAge === '7days' ? 'Last 7 Days' : filters.listingAge === '30days' ? 'Last 30 Days' : 'Older'}</span>
              <button onClick={() => setFilters({...filters, listingAge: ''})} className="hover:text-[#574B66]">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <button
            onClick={clearAllFilters}
            className="text-xs text-[#999999] hover:text-[#1A1A1A] transition ml-2 underline"
          >
            Clear all
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Advanced Filter Sidebar */}
        <div className="lg:col-span-1">
          <AdvancedFilter
            filters={filters}
            onFilterChange={setFilters}
            onClearFilters={clearAllFilters}
          />
        </div>

        {/* Results Grid */}
        <div className="lg:col-span-4">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[#333333]">
              {isLoading ? 'Searching...' : (
                <>Showing <span className="text-[#4A3A5C] font-bold">{filteredInventory.length}</span> results</>
              )}
            </p>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-[#E5E5E5] rounded-xl">
              <Loader2 className="w-8 h-8 text-[#4A3A5C] animate-spin mb-4" />
              <p className="text-[#666666]">Scanning inventory...</p>
            </div>
          ) : filteredInventory.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredInventory.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white border border-[#E5E5E5] hover:border-[#4A3A5C]/50 hover:shadow-lg rounded-lg overflow-hidden transition group"
                >
                  {/* Image */}
                  <div className="h-40 relative overflow-hidden bg-[#F9F9FB]">
                    {item.images && item.images.length > 0 ? (
                      <img 
                        src={item.images[0]} 
                        alt={item.name} 
                        className="w-full h-full object-cover transition duration-500 group-hover:scale-105" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#4A3A5C]/20 to-[#574B66]/20">
                        <TrendingUp className="w-12 h-12 text-[#4A3A5C]/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition" />
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-[#1A1A1A] group-hover:text-[#4A3A5C] transition truncate">{item.name}</h3>
                      <p className="text-xs text-[#666666] mt-1">OEM: <span className="text-[#1A1A1A] font-mono">{item.oem}</span></p>
                      <p className="text-xs text-[#666666] mt-1">Manufacturer: <span className="text-[#4A3A5C] font-medium">{item.manufacturer}</span></p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-[#999999]">Make</p>
                        <p className="text-[#1A1A1A] font-medium">{item.make}</p>
                      </div>
                      <div>
                        <p className="text-[#999999]">Condition</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <div className={`w-2 h-2 rounded-full ${
                            item.condition === 'Brand New' ? 'bg-green-500' :
                            item.condition === 'Unused' ? 'bg-blue-500' :
                            item.condition === 'Used But In Good Condition' ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                          <span className="text-[#1A1A1A]">{item.condition}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-[#999999]">Year</p>
                        <p className="text-[#1A1A1A]">{item.year}</p>
                      </div>
                      <div>
                        <p className="text-[#999999]">ETA</p>
                        <p className="text-[#1A1A1A]">{item.eta}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="bg-[#F3F1F7] rounded-lg p-3 border border-[#E5E5E5]">
                      <p className="text-xs text-[#666666] mb-1">Expected Price Range</p>
                      <p className="text-lg font-bold text-[#4A3A5C]">
                        NPR {parseFloat(item.buyer_visible_min || 0).toLocaleString()} – {parseFloat(item.buyer_visible_max || 0).toLocaleString()}
                      </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleGetQuoteClick(item)}
                        className="w-full bg-[#4A3A5C] hover:bg-[#574B66] text-white font-medium py-2.5 rounded-lg transition text-center text-sm"
                      >
                        Interested / Get Quote
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Search className="w-12 h-12 text-[#E5E5E5] mb-4" />
              <p className="text-[#666666] mb-2">No items found</p>
              <p className="text-[#999999] text-sm mb-6">Try adjusting your filters or search term</p>
              {!isAuthenticated && (
                <Link
                  to="/register"
                  className="text-[#4A3A5C] hover:text-[#574B66] text-sm font-medium"
                >
                  Register to browse listings →
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {!isLoading && filteredInventory.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      {/* Quote Modal */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        listing={selectedListing}
        user={user}
        isAuthenticated={isAuthenticated}
      />

      {/* Guest Lead Modal */}
      <GuestLeadModal
        isOpen={guestModalOpen}
        onClose={() => setGuestModalOpen(false)}
        listing={selectedListing}
      />
    </div>
  )
}
