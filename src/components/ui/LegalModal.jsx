import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export default function LegalModal({ isOpen, onClose, title, children, onAccept, acceptLabel = 'Accept' }) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)
  const contentRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setHasScrolledToBottom(false)
      setTimeout(() => {
        if (contentRef.current) {
          const { scrollHeight, clientHeight } = contentRef.current
          if (scrollHeight <= clientHeight + 10) {
            setHasScrolledToBottom(true)
          }
        }
      }, 100)
    }
  }, [isOpen])

  const handleScroll = () => {
    if (contentRef.current && !hasScrolledToBottom) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current
      if (Math.ceil(scrollTop + clientHeight) >= scrollHeight - 10) {
        setHasScrolledToBottom(true)
      }
    }
  }
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-white to-gray-50">
                <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Content */}
              <div 
                ref={contentRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-6"
              >
                <div className="prose prose-invert max-w-none">
                  {children}
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-3 justify-end">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-900 hover:bg-gray-100 transition-colors font-medium"
                >
                  Close
                </button>
                {onAccept && (
                  <button
                    onClick={() => {
                      onAccept()
                      onClose()
                    }}
                    disabled={!hasScrolledToBottom}
                    className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                      hasScrolledToBottom 
                        ? 'bg-purple-700 text-white hover:bg-purple-800' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {acceptLabel}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
