import { useState, useRef, useEffect } from 'react'
import { Upload, Download, FileSpreadsheet, CheckCircle2, AlertCircle, Loader2, RotateCcw, X } from 'lucide-react'
import { Button } from '../../components/ui/FormComponents'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { bulkUploadListings } from '../../services/listingsService'

// Template columns matching backend mapping
const TEMPLATE_COLUMNS = [
  'Item Name',
  'ITEM DESCRIPTION SPEC',
  'MAKE',
  'OEM PART NO',
  'CONDITION',
  'YEAR OF PURCHASE',
  'BID PRICE',
  'PICTURE',
  'REMARKS',
]

const SAMPLE_ROWS = [
  [
    'Grundfos Centrifugal Pump',
    'Grundfos CM 15kW, 2000 hours usage, well maintained',
    'Grundfos',
    'GF-CM-15KW-2021',
    'Good',
    '2021',
    '185000',
    '',
    'Original packaging available'
  ],
  [
    'ABB Motor 75kW',
    'ABB 3-phase induction motor, minimal wear',
    'ABB',
    'ABB-M3BP-75',
    'Excellent',
    '2020',
    '250000',
    '',
    'Test certificate available'
  ],
]

function generateExcelTemplate() {
  // Build a simple CSV template
  const header = TEMPLATE_COLUMNS.join(',')
  const instruction = [
    '(Required: Item Name + Condition + BID PRICE)',
    '(Full description)',
    '(Brand)',
    '(Part number)',
    '(New/Good/Fair/Poor)',
    '(Optional: year)',
    '(Selling price in NPR)',
    '(Optional: image URL)',
    '(Optional: notes)'
  ].join(',')

  const rows = SAMPLE_ROWS.map(r =>
    r.map(cell =>
      cell.includes(',') ? `"${cell}"` : cell
    ).join(',')
  )

  return [header, instruction, ...rows].join('\n')
}

const STEPS = ['Download Template', 'Upload Excel', 'Confirm & Submit']

export default function BulkUploadPage() {
  const [step, setStep] = useState(0)
  const [file, setFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [result, setResult] = useState(null) // { count, message } on success
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const [previews, setPreviews] = useState([])
  const [selectedFiles, setSelectedFiles] = useState([])

  useEffect(() => {
    return () => {
      previews.forEach(url => {
        if (url?.startsWith('blob:')) {
          URL.revokeObjectURL(url)
        }
      })
    }
  }, [previews])

  // ─── Template Download ───────────────────────────────────────────
  const handleDownloadTemplate = () => {
    const csvContent = generateExcelTemplate()
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'warex-bulk-upload-template.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Template downloaded! Fill it out and upload in Step 2.')
  }

  // ─── File Selection ──────────────────────────────────────────────
  const acceptFile = (f) => {
    if (!f) return
    const ext = f.name.split('.').pop().toLowerCase()
    if (!['xlsx', 'xls', 'csv'].includes(ext)) {
      toast.error('Only .xlsx, .xls, or .csv files are supported')
      return
    }
    if (f.size > 10 * 1024 * 1024) {
      toast.error('File size must be under 10MB')
      return
    }
    setFile(f)
    setError(null)
    setStep(2)
  }

  const handleFileInput = (e) => acceptFile(e.target.files?.[0])

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    acceptFile(e.dataTransfer.files?.[0])
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const removeFile = () => {
    previews.forEach(url => {
      if (url?.startsWith('blob:')) {
        URL.revokeObjectURL(url)
      }
    })
    setPreviews([])
    setSelectedFiles([])
    setFile(null)
    setError(null)
    setUploadProgress(0)
    setStep(1)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // ─── Submit Upload ───────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!file) {
      toast.error('Please select a file first')
      return
    }

    setIsUploading(true)
    setUploadProgress(0)
    setError(null)
    setResult(null)

    try {
      const data = await bulkUploadListings(file, (pct) => setUploadProgress(pct))
      setResult(data)
      setUploadProgress(100)
      toast.success(`✅ ${data.count} listings submitted for admin review`)
    } catch (err) {
      setError(err.message || 'Upload failed. Please check your file and try again.')
      toast.error(err.message || 'Bulk upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const handleReset = () => {
    previews.forEach(url => {
      if (url?.startsWith('blob:')) {
        URL.revokeObjectURL(url)
      }
    })
    setPreviews([])
    setSelectedFiles([])
    setStep(0)
    setFile(null)
    setResult(null)
    setError(null)
    setUploadProgress(0)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // ─── Result Screen ───────────────────────────────────────────────
  if (result) {
    return (
      <div className="max-w-xl mx-auto py-16 space-y-6">
        <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto" />
        <h2 className="text-3xl font-bold text-center text-[#1A1A1A]">
          Upload Complete!
        </h2>

        {/* Success count */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
          <div className="flex justify-between text-sm mb-2">
            <span>✅ Successfully uploaded</span>
            <span className="font-bold text-emerald-700 text-lg">
              {result.count}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Total rows processed</span>
            <span className="font-medium">{result.total_rows}</span>
          </div>
        </div>

        {/* Failed rows — agar koi failed ho */}
        {result.failed && result.failed.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h3 className="font-bold text-red-700 mb-3">
              ⚠️ {result.failed.length} rows skipped:
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {result.failed.map((f, i) => (
                <div key={i}
                  className="bg-white border border-red-100 rounded-lg p-3"
                >
                  <p className="font-medium text-red-800 text-sm">
                    Row {f.row}: {f.item}
                  </p>
                  <ul className="mt-1 space-y-0.5">
                    {f.errors.map((e, j) => (
                      <li key={j}
                        className="text-red-600 text-xs"
                      >
                        • {e}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="text-red-600 text-xs mt-3">
              Fix these rows and upload again
            </p>
          </div>
        )}

        {/* All failed — koi success nahi */}
        {result.count === 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-700 text-sm text-center">
            No listings were uploaded. Please fix the errors and try again.
          </div>
        )}

        <div className="text-center mt-6">
          <Button variant="primary" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Upload Another File
          </Button>
        </div>
      </div>
    )
  }

  const steps = [
    // ── Step 0: Download Template ───────────────────────────────────
    {
      title: 'Download Template',
      description: 'Get the pre-formatted Excel/CSV template with correct column headers',
      content: (
        <div className="space-y-6">
          <div className="bg-[#F9F9FB] border border-[#E5E5E5] rounded-xl p-6">
            <p className="font-medium text-[#1A1A1A] mb-3">Template columns:</p>
            <div className="grid grid-cols-2 gap-2">
              {TEMPLATE_COLUMNS.map((col, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="w-5 h-5 rounded-full bg-[#4A3A5C] text-white text-[10px] flex items-center justify-center font-bold flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="font-mono text-[#333333]">{col}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-700">
              <span className="font-semibold">Required:</span> ITEM DESCRIPTION SPEC, CONDITION, BID PRICE
            </p>
          </div>

          <div className="text-center">
            <Button variant="primary" size="lg" onClick={handleDownloadTemplate}>
              <Download className="w-5 h-5 mr-2" />
              Download CSV Template
            </Button>
            <p className="text-xs text-[#999999] mt-3">
              You can also open the CSV in Excel and save as .xlsx
            </p>
          </div>
        </div>
      ),
    },

    // ── Step 1: Upload File ─────────────────────────────────────────
    {
      title: 'Upload Your File',
      description: 'Upload your filled Excel (.xlsx) or CSV file — max 10MB',
      content: (
        <div className="space-y-6">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-12 text-center transition cursor-pointer select-none ${
              isDragging
                ? 'border-[#4A3A5C] bg-[#4A3A5C]/5'
                : 'border-[#4A3A5C]/30 hover:border-[#4A3A5C]/60 bg-[#F9F9FB]'
            }`}
          >
            <FileSpreadsheet className="w-14 h-14 text-[#4A3A5C] mx-auto mb-4 opacity-70" />
            <p className="text-[#1A1A1A] font-medium mb-1">
              {isDragging ? 'Drop your file here' : 'Drag & drop or click to browse'}
            </p>
            <p className="text-xs text-[#666666]">.xlsx, .xls, .csv — max 10MB</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileInput}
              className="hidden"
              id="excel-upload"
            />
          </div>

          <div className="text-center text-sm text-[#999999]">
            Don't have the template yet?{' '}
            <button
              onClick={handleDownloadTemplate}
              className="text-[#4A3A5C] font-medium underline hover:no-underline"
            >
              Download it here
            </button>
          </div>
        </div>
      ),
    },

    // ── Step 2: Confirm & Submit ────────────────────────────────────
    {
      title: 'Confirm & Submit',
      description: 'Review your file then submit — all rows will be set to PENDING',
      content: (
        <div className="space-y-5">
          {/* File preview card */}
          {file && (
            <div className="flex items-center gap-4 bg-[#F9F9FB] border border-[#E5E5E5] rounded-xl p-4">
              <div className="w-12 h-12 bg-[#4A3A5C]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileSpreadsheet className="w-6 h-6 text-[#4A3A5C]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#1A1A1A] truncate">{file.name}</p>
                <p className="text-xs text-[#666666]">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              {!isUploading && (
                <button
                  onClick={removeFile}
                  className="p-1.5 text-[#999999] hover:text-red-500 hover:bg-red-50 rounded-lg transition flex-shrink-0"
                  title="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Upload progress */}
          <AnimatePresence>
            {isUploading && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-2"
              >
                <div className="flex justify-between text-sm text-[#666666]">
                  <span>Uploading & processing...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-[#E5E5E5] rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="bg-[#4A3A5C] h-full rounded-full"
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error block */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-700 text-sm">Upload Failed</p>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Info banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700 flex gap-3">
            <span className="text-lg leading-none">ℹ️</span>
            <div>
              <p className="font-medium mb-0.5">All rows will be submitted as <strong>PENDING</strong></p>
              <p>Admin must approve each listing before it becomes visible to buyers.</p>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleSubmit}
            disabled={!file || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Submit for Admin Review
              </>
            )}
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Bulk Upload Listings</h1>
        <p className="text-[#666666]">Upload multiple equipments and parts at once via Excel or CSV</p>
      </motion.div>

      {/* Step Progress */}
      <div className="flex items-center justify-between">
        {STEPS.map((s, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-center flex-1"
          >
            <button
              onClick={() => {
                if (idx <= step && !isUploading) setStep(idx)
              }}
              disabled={idx > step || isUploading}
              className="flex flex-col items-center gap-1 group"
              title={idx > step ? 'Complete previous step first' : `Go to ${s}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition ${
                  idx < step
                    ? 'bg-[#4A3A5C] text-white'
                    : idx === step
                    ? 'bg-[#4A3A5C] text-white ring-4 ring-[#4A3A5C]/20'
                    : 'bg-[#E5E5E5] text-[#999999]'
                }`}
              >
                {idx < step ? '✓' : idx + 1}
              </div>
              <span
                className={`text-[10px] font-medium text-center leading-tight max-w-[70px] ${
                  idx <= step ? 'text-[#4A3A5C]' : 'text-[#999999]'
                }`}
              >
                {s}
              </span>
            </button>
            {idx < STEPS.length - 1 && (
              <div
                className={`flex-1 h-1 mx-3 mb-5 rounded transition ${
                  idx < step ? 'bg-[#4A3A5C]' : 'bg-[#E5E5E5]'
                }`}
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Step Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
          className="bg-white border border-[#E5E5E5] rounded-xl p-8 shadow-sm"
        >
          <h2 className="text-xl font-bold text-[#1A1A1A] mb-1">{steps[step].title}</h2>
          <p className="text-[#666666] text-sm mb-6">{steps[step].description}</p>
          {steps[step].content}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex gap-3">
        <Button
          variant="secondary"
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0 || isUploading}
        >
          Back
        </Button>
        {step < 1 && (
          <Button
            variant="primary"
            onClick={() => setStep(step + 1)}
          >
            Next →
          </Button>
        )}
      </div>
    </div>
  )
}
