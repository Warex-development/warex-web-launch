import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisiblePages = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8 py-4">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="p-2 rounded-lg border border-[#E5E5E5] hover:bg-[#F3F1F7] disabled:opacity-50 disabled:cursor-not-allowed transition text-[#4A3A5C]"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-1">
        {startPage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className={`w-10 h-10 rounded-lg border border-[#E5E5E5] transition text-sm font-medium ${
                currentPage === 1 ? 'bg-[#4A3A5C] text-white border-[#4A3A5C]' : 'hover:bg-[#F3F1F7] text-[#1A1A1A]'
              }`}
            >
              1
            </button>
            {startPage > 2 && <span className="px-1 text-[#999999]">...</span>}
          </>
        )}

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-10 h-10 rounded-lg border border-[#E5E5E5] transition text-sm font-medium ${
              currentPage === p ? 'bg-[#4A3A5C] text-white border-[#4A3A5C]' : 'hover:bg-[#F3F1F7] text-[#1A1A1A]'
            }`}
          >
            {p}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-1 text-[#999999]">...</span>}
            <button
              onClick={() => onPageChange(totalPages)}
              className={`w-10 h-10 rounded-lg border border-[#E5E5E5] transition text-sm font-medium ${
                currentPage === totalPages ? 'bg-[#4A3A5C] text-white border-[#4A3A5C]' : 'hover:bg-[#F3F1F7] text-[#1A1A1A]'
              }`}
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="p-2 rounded-lg border border-[#E5E5E5] hover:bg-[#F3F1F7] disabled:opacity-50 disabled:cursor-not-allowed transition text-[#4A3A5C]"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
