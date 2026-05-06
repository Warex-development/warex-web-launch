import { ChevronUp, ChevronDown, Search } from 'lucide-react'
import { useState, useMemo } from 'react'

export default function DataTable({
  columns,
  data,
  onSearch,
  searchPlaceholder = 'Search...',
  pageSize = 10,
  actions,
  emptyMessage = 'No data available'
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [currentPage, setCurrentPage] = useState(1)

  const filteredData = useMemo(() => {
    let result = data
    if (searchTerm && onSearch) {
      result = onSearch(data, searchTerm)
    }
    return result
  }, [data, searchTerm, onSearch])

  const sortedData = useMemo(() => {
    let result = [...filteredData]
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key]
        const bVal = b[sortConfig.key]
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }
    return result
  }, [filteredData, sortConfig])

  const paginatedData = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize
    return sortedData.slice(startIdx, startIdx + pageSize)
  }, [sortedData, currentPage, pageSize])

  const totalPages = Math.ceil(sortedData.length / pageSize)

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  return (
    <div className="w-full">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999999]" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E5E5E5] rounded-lg text-[#1A1A1A] placeholder-[#999999] focus:outline-none focus:ring-2 focus:ring-[#4A3A5C] focus:border-transparent transition"
          />
        </div>
      </div>

      {/* Table */}
      {paginatedData.length > 0 ? (
        <div className="overflow-x-auto border border-[#E5E5E5] rounded-lg">
          <table className="w-full">
            <thead className="bg-[#F3F1F7] border-b border-[#E5E5E5]">
              <tr>
                {columns.map(col => (
                  <th
                    key={col.key}
                    onClick={() => col.sortable && handleSort(col.key)}
                    className={`px-6 py-3 text-left text-sm font-semibold text-[#1A1A1A] ${
                      col.sortable ? 'cursor-pointer hover:bg-[#E8E3F0]' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{col.label}</span>
                      {col.sortable && sortConfig.key === col.key && (
                        sortConfig.direction === 'asc' ? 
                          <ChevronUp className="w-4 h-4 text-[#4A3A5C]" /> :
                          <ChevronDown className="w-4 h-4 text-[#4A3A5C]" />
                      )}
                    </div>
                  </th>
                ))}
                {actions && <th className="px-6 py-3 text-left text-sm font-semibold text-[#1A1A1A]">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  className="border-b border-[#E5E5E5] hover:bg-[#F9F9FB] transition"
                >
                  {columns.map(col => (
                    <td key={`${row.id}-${col.key}`} className="px-6 py-4 text-sm text-[#1A1A1A]">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        {actions(row).map((action, idx) => (
                          <button
                            key={idx}
                            onClick={action.onClick}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${action.className}`}
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center border border-[#E5E5E5] rounded-lg">
          <p className="text-[#666666]">{emptyMessage}</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-[#666666]">
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm font-medium rounded-lg bg-[#F3F1F7] text-[#1A1A1A] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#E8E3F0] transition"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 text-sm font-medium rounded-lg transition ${
                  currentPage === page
                    ? 'bg-[#4A3A5C] text-white'
                    : 'bg-[#F3F1F7] text-[#1A1A1A] hover:bg-[#E8E3F0]'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm font-medium rounded-lg bg-[#F3F1F7] text-[#1A1A1A] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#E8E3F0] transition"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
