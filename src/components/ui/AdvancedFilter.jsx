import { useState } from 'react'
import { ChevronDown, ChevronUp, Search } from 'lucide-react'

import { 
  BRAND_OPTIONS, 
  APPLICATION_TYPES, 
  CONDITIONS 
} from '../../data/constants'

const LISTING_AGE_OPTIONS = [
  { label: 'Today',      value: 'today'    },
  { label: 'This Week',  value: '7days'    },
  { label: 'This Month', value: '30days'   },
  { label: 'This Year',  value: 'thisyear' },
]

export default function AdvancedFilter({
  filters,
  onFilterChange,
  onClearFilters
}) {
  const [expandedSections, setExpandedSections] = useState({
    brand: true,
    application: false,
    oem: false,
    condition: false,
    priceRange: true,
    listingAge: false
  })

  const [brandSearch, setBrandSearch] = useState('')

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleFilterChange = (filterKey, value) => {
    onFilterChange({
      ...filters,
      [filterKey]: value
    })
  }

  const handleMultiSelectToggle = (filterKey, value) => {
    const current = filters[filterKey] || []
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value]
    handleFilterChange(filterKey, updated)
  }

  const handlePriceChange = (field, value) => {
    const newPrice = { ...filters.priceRange }
    if (field === 'min') {
      newPrice.min = Math.max(0, parseInt(value) || 0)
    } else {
      newPrice.max = Math.max(0, parseInt(value) || 0)
    }
    // Ensure min <= max
    if (newPrice.min > newPrice.max) {
      if (field === 'min') newPrice.max = newPrice.min
      else newPrice.min = newPrice.max
    }
    handleFilterChange('priceRange', newPrice)
  }

  // Filter brands based on search
  const filteredBrands = BRAND_OPTIONS.filter(brand =>
    brand.toLowerCase().includes(brandSearch.toLowerCase())
  )

  // Count active filters (exclude default priceRange)
  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'priceRange') return value.min > 0 || value.max < 5000000
    if (Array.isArray(value)) return value.length > 0
    return value !== ''
  }).length

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-lg overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-[#E5E5E5] flex items-center justify-between bg-gradient-to-r from-[#F3F1F7] to-white">
        <h3 className="font-semibold text-[#1A1A1A] flex items-center gap-2">
          Filters
          {activeFiltersCount > 0 && (
            <span className="text-xs bg-[#4A3A5C] text-white px-2 py-1 rounded-full font-medium">
              {activeFiltersCount}
            </span>
          )}
        </h3>
        {activeFiltersCount > 0 && (
          <button
            onClick={onClearFilters}
            className="text-xs font-medium text-[#4A3A5C] hover:text-[#574B66] transition"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Filter Sections */}
      <div className="divide-y divide-[#E5E5E5]">
        {/* Brand / Make Filter (Searchable) */}
        <div>
          <button
            onClick={() => toggleSection('brand')}
            className="w-full flex items-center justify-between p-4 hover:bg-[#F9F9F9] transition"
          >
            <span className="font-medium text-[#1A1A1A]">Brand / Make / Manufacturer</span>
            {expandedSections.brand ? (
              <ChevronUp className="w-4 h-4 text-[#999999]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#999999]" />
            )}
          </button>
          {expandedSections.brand && (
            <div className="px-4 pb-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999999]" />
                <input
                  type="text"
                  placeholder="Search brands..."
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-[#E5E5E5] rounded-lg text-sm placeholder-[#999999] focus:outline-none focus:ring-2 focus:ring-[#4A3A5C]"
                />
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {filteredBrands.map(brand => (
                  <label key={brand} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(filters.brands || []).includes(brand)}
                      onChange={() => handleMultiSelectToggle('brands', brand)}
                      className="w-4 h-4 accent-[#4A3A5C] rounded"
                    />
                    <span className="text-sm text-[#333333]">{brand}</span>
                  </label>
                ))}
                
                <div className="pt-2 border-t border-[#E5E5E5] mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(filters.brands || []).includes('Other')}
                      onChange={() => handleMultiSelectToggle('brands', 'Other')}
                      className="w-4 h-4 accent-[#4A3A5C] rounded"
                    />
                    <span className="text-sm text-[#333333] font-medium">Other (specify)</span>
                  </label>
                  
                  {(filters.brands || []).includes('Other') && (
                    <div className="mt-2 pl-6">
                      <input
                        type="text"
                        placeholder="Enter brand name..."
                        value={filters.brandOther || ''}
                        onChange={(e) => handleFilterChange('brandOther', e.target.value)}
                        className="w-full px-3 py-1.5 border border-[#E5E5E5] rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#4A3A5C]"
                      />
                    </div>
                  )}
                </div>

                {filteredBrands.length === 0 && !brandSearch && (
                  <p className="text-xs text-[#999999] py-2">No brands found</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Application Filter */}
        <div>
          <button
            onClick={() => toggleSection('application')}
            className="w-full flex items-center justify-between p-4 hover:bg-[#F9F9F9] transition"
          >
            <span className="font-medium text-[#1A1A1A]">Application</span>
            {expandedSections.application ? (
              <ChevronUp className="w-4 h-4 text-[#999999]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#999999]" />
            )}
          </button>
          {expandedSections.application && (
            <div className="px-4 pb-4 space-y-2">
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {APPLICATION_TYPES.map(app => (
                  <label key={app} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(filters.applications || []).includes(app)}
                      onChange={() => handleMultiSelectToggle('applications', app)}
                      className="w-4 h-4 accent-[#4A3A5C] rounded"
                    />
                    <span className="text-sm text-[#333333]">{app}</span>
                  </label>
                ))}
                
                <div className="pt-2 border-t border-[#E5E5E5] mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(filters.applications || []).includes('Other')}
                      onChange={() => handleMultiSelectToggle('applications', 'Other')}
                      className="w-4 h-4 accent-[#4A3A5C] rounded"
                    />
                    <span className="text-sm text-[#333333] font-medium">Other (specify)</span>
                  </label>
                  
                  {(filters.applications || []).includes('Other') && (
                    <div className="mt-2 pl-6">
                      <input
                        type="text"
                        placeholder="Enter application..."
                        value={filters.applicationOther || ''}
                        onChange={(e) => handleFilterChange('applicationOther', e.target.value)}
                        className="w-full px-3 py-1.5 border border-[#E5E5E5] rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#4A3A5C]"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>


        {/* OEM Number Filter */}
        <div>
          <button
            onClick={() => toggleSection('oem')}
            className="w-full flex items-center justify-between p-4 hover:bg-[#F9F9F9] transition"
          >
            <span className="font-medium text-[#1A1A1A]">OEM Part Number / OEM Part Code</span>
            {expandedSections.oem ? (
              <ChevronUp className="w-4 h-4 text-[#999999]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#999999]" />
            )}
          </button>
          {expandedSections.oem && (
            <div className="px-4 pb-4">
              <input
                type="text"
                placeholder="e.g. 6ES7214-1AG40, SKF6205, CAT-AX220"
                value={filters.oem || ''}
                onChange={(e) => handleFilterChange('oem', e.target.value)}
                className="w-full px-3 py-2 border border-[#E5E5E5] rounded-lg text-sm placeholder-[#999999] focus:outline-none focus:ring-2 focus:ring-[#4A3A5C]"
              />
              <p className="text-xs text-[#666666] mt-2">Exact match or partial search</p>
            </div>
          )}
        </div>

        {/* Condition Filter */}
        <div>
          <button
            onClick={() => toggleSection('condition')}
            className="w-full flex items-center justify-between p-4 hover:bg-[#F9F9F9] transition"
          >
            <span className="font-medium text-[#1A1A1A]">Condition</span>
            {expandedSections.condition ? (
              <ChevronUp className="w-4 h-4 text-[#999999]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#999999]" />
            )}
          </button>
          {expandedSections.condition && (
            <div className="px-4 pb-4 space-y-2">
              {CONDITIONS.map(cond => (
                <label key={cond} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(filters.conditions || []).includes(cond)}
                    onChange={() => handleMultiSelectToggle('conditions', cond)}
                    className="w-4 h-4 accent-[#4A3A5C] rounded"
                  />
                  <span className="text-sm text-[#333333]">{cond}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price Range Filter */}
        <div>
          <button
            onClick={() => toggleSection('priceRange')}
            className="w-full flex items-center justify-between p-4 hover:bg-[#F9F9F9] transition"
          >
            <span className="font-medium text-[#1A1A1A]">Price Range</span>
            {expandedSections.priceRange ? (
              <ChevronUp className="w-4 h-4 text-[#999999]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#999999]" />
            )}
          </button>
          {expandedSections.priceRange && (
            <div className="px-4 pb-4 space-y-3">
              <div>
                <label className="text-xs font-medium text-[#333333]">Minimum (NPR)</label>
                <input
                  type="number"
                  min="0"
                  value={filters.priceRange?.min || 0}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-[#E5E5E5] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A3A5C]"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[#333333]">Maximum (NPR)</label>
                <input
                  type="number"
                  min="0"
                  value={filters.priceRange?.max || 5000000}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-[#E5E5E5] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A3A5C]"
                  placeholder="5000000"
                />
              </div>
              {filters.priceRange && (
                <div className="text-xs text-[#666666] bg-[#F9F9F9] p-3 rounded-lg border border-[#E5E5E5]">
                  <span className="font-medium">NPR {filters.priceRange.min?.toLocaleString()} - NPR {filters.priceRange.max?.toLocaleString()}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Listing Age Filter */}
        <div>
          <button
            onClick={() => toggleSection('listingAge')}
            className="w-full flex items-center justify-between p-4 hover:bg-[#F9F9F9] transition"
          >
            <span className="font-medium text-[#1A1A1A]">Listing Age</span>
            {expandedSections.listingAge ? (
              <ChevronUp className="w-4 h-4 text-[#999999]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#999999]" />
            )}
          </button>
          {expandedSections.listingAge && (
            <div className="px-4 pb-4 space-y-2">
              {LISTING_AGE_OPTIONS.map(option => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="listingAge"
                    value={option.value}
                    checked={filters.listingAge === option.value}
                    onChange={() => handleFilterChange('listingAge', option.value)}
                    className="w-4 h-4 accent-[#4A3A5C]"
                  />
                  <span className="text-sm text-[#333333]">{option.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
