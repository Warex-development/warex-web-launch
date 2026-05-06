import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { FormField, TextInput, TextArea, Select, Button } from '../../components/ui/FormComponents'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { CheckCircle2, Upload, Loader2 } from 'lucide-react'
import { CONDITIONS, APPLICATION_TYPES, ETA_OPTIONS } from '../../data/constants'
import { createListing, getCategories, updateListing } from '../../services/listingsService'
import { uploadListingImage } from '../../services/uploadService'
import { X } from 'lucide-react'

export default function AddListingPage() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [listingId, setListingId] = useState(null)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoadingCats, setIsLoadingCats] = useState(true)
  const [duplicateInfo, setDuplicateInfo] = useState(null)

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await getCategories()
        const fetchedCats = data.categories || []
        const sortedCategories = [
          ...fetchedCats.filter(c => !c.name.toLowerCase().includes('other')),
          ...fetchedCats.filter(c => c.name.toLowerCase().includes('other'))
        ]
        setCategories(sortedCategories)
      } catch (error) {
        toast.error('Failed to load categories')
      } finally {
        setIsLoadingCats(false)
      }
    }
    fetchCats()
  }, [])

  const [selectedVideo, setSelectedVideo] = useState(null)
  const [videoPreview, setVideoPreview] = useState(null)

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    if (selectedFiles.length + files.length > 4) {
      toast.error('Maximum 4 images allowed')
      return
    }

    const newFiles = [...selectedFiles, ...files]
    setSelectedFiles(newFiles)

    const newPreviews = files.map(file => URL.createObjectURL(file))
    setPreviews([...previews, ...newPreviews])
  }

  const removeImage = (index) => {
    const newFiles = [...selectedFiles]
    newFiles.splice(index, 1)
    setSelectedFiles(newFiles)

    const newPreviews = [...previews]
    URL.revokeObjectURL(newPreviews[index])
    newPreviews.splice(index, 1)
    setPreviews(newPreviews)
  }

  const handleVideoChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    if (file.size > 50 * 1024 * 1024) {
      toast.error('Maximum video size is 50MB')
      return
    }

    setSelectedVideo(file)
    setVideoPreview(URL.createObjectURL(file))
  }

  const removeVideo = () => {
    setSelectedVideo(null)
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview)
      setVideoPreview(null)
    }
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    setUploadProgress('Creating listing...')
    try {
      // 1. Create Listing
      const result = await createListing({
        name: data.itemName,
        description: data.description,
        make: data.make,
        oem: data.oem,
        manufacturer: data.make,
        condition: data.condition,
        year: parseInt(data.year),
        seller_bid_price: parseFloat(data.bidPrice),
        category_id: data.category,
        application: data.application || [],
        eta: data.eta || '3–5 Days',
        availability: 'In Stock'
        // Note: video_url is updated later
      })
      
      const realListingId = result.listing.id
      const reqId = result.listing.request_id
      setListingId(reqId)

      // 2. Upload Images
      const imageUrls = []
      if (selectedFiles.length > 0) {
        setUploadProgress(`Uploading images (0/${selectedFiles.length})...`)
        for (let i = 0; i < selectedFiles.length; i++) {
          setUploadProgress(`Uploading images (${i + 1}/${selectedFiles.length})...`)
          const uploadResult = await uploadListingImage(selectedFiles[i], realListingId)
          imageUrls.push(uploadResult.url)
        }

        // 3. Update Listing with Image URLs
        setUploadProgress('Finalizing images...')
        await updateListing(realListingId, { images: imageUrls })
      }

      // 4. Upload Video
      if (selectedVideo) {
        setUploadProgress('Uploading video...')
        const formData = new FormData()
        formData.append('video', selectedVideo)
        formData.append('listingId', realListingId)

        const videoRes = await fetch(`${import.meta.env.VITE_API_URL}/api/uploads/listing-video`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('warex_token') || useAuthStore.getState().token}` // or from context
          },
          body: formData
        })

        if (!videoRes.ok) {
          throw new Error('Failed to upload video')
        }
        
        const videoData = await videoRes.json()
        await updateListing(realListingId, { video_url: videoData.url })
      }
      
      toast.success(`✅ Listing ${reqId} submitted for review!`)

      reset()
      setSelectedFiles([])
      setPreviews([])
      removeVideo()
      setSubmitted(true)
    } catch (error) {
      if (error.duplicate) {
        const statusLabel = error.existing_status === 'approved' ? '✅ already live on WareX' : '⏳ already in the review queue'
        toast(
          <div>
            <p className="font-semibold text-amber-800">Duplicate Listing Detected</p>
            <p className="text-sm text-amber-700 mt-1">{error.message}</p>
            {error.existing_request_id && (
              <p className="text-xs text-amber-600 mt-1 font-mono">{error.existing_request_id} is {statusLabel}</p>
            )}
          </div>,
          { icon: '⚠️', style: { background: '#fffbeb', color: '#92400e', border: '1px solid #fcd34d' }, duration: 6000 }
        )
      } else {
        toast.error(error.message || 'Failed to add listing')
      }
    } finally {
      setIsSubmitting(false)
      setUploadProgress('')
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <motion.div
          animate={{ scale: [0.5, 1.1, 1] }}
          transition={{ duration: 0.5 }}
        >
          <CheckCircle2 className="w-16 h-16 text-[#4A3A5C] mx-auto mb-4" />
        </motion.div>
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">Item Submitted for Review!</h2>
        <p className="text-[#666666] mb-2">Your item <span className="text-[#4A3A5C] font-mono font-bold">{listingId}</span> has been submitted</p>
        <p className="text-[#999999] text-sm max-w-md mb-6">
          Status: Pending Review
          <br/>
          Admin will approve within 24-48 hours
        </p>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => window.location.href = '/dashboard/inventory'}>
            View My Inventory
          </Button>
          <Button variant="primary" onClick={() => setSubmitted(false)}>
            Add Another Listing
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Add New Listing</h1>
        <p className="text-[#666666]">List your equipments and parts inventory</p>
      </motion.div>

      <div className="bg-white border border-[#E5E5E5] rounded-xl p-8 hover:shadow-md transition">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Item Information */}
          <div>
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">Item Information</h3>
            <div className="space-y-6">
              <FormField label="Item Name" required error={errors.itemName?.message}>
                <TextInput
                  placeholder="e.g., Deep Groove Ball Bearing"
                  {...register('itemName', { required: 'Item name is required' })}
                />
              </FormField>

              <FormField label="Description" required error={errors.description?.message}>
                <TextArea
                  placeholder="Detailed description including specifications, condition, and any defects or repairs..."
                  rows={4}
                  {...register('description', { required: 'Description is required' })}
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Make/Brand" required error={errors.make?.message}>
                  <TextInput
                    placeholder="e.g., SKF, Siemens, ABB"
                    {...register('make', { required: 'Make/Brand is required' })}
                  />
                </FormField>

                <FormField label="OEM Part Number" required error={errors.oem?.message}>
                  <TextInput
                    placeholder="e.g., SKF-6205-2RS1"
                    {...register('oem', { required: 'OEM number is required' })}
                  />
                </FormField>
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div>
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">Specifications</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField label="Category" error={errors.category?.message}>
                  {isLoadingCats ? (
                    <div className="h-11 flex items-center px-3 bg-[#F9F9FB] border border-[#E5E5E5] rounded-lg">
                      <Loader2 className="w-4 h-4 animate-spin text-[#999999] mr-2" />
                      <span className="text-sm text-[#999999]">Loading categories...</span>
                    </div>
                  ) : (
                    <Select
                      options={[
                        { value: '', label: 'Select category (optional)' },
                        ...categories.map(c => ({ value: c.id, label: c.name }))
                      ]}
                      {...register('category')}
                    />
                  )}
                </FormField>

                <FormField label="Condition" required error={errors.condition?.message}>
                  <Select
                    options={[
                      { value: '', label: 'Select condition' },
                      ...CONDITIONS.map(c => ({ value: c, label: c }))
                    ]}
                    {...register('condition', { required: 'Condition is required' })}
                  />
                </FormField>

                <FormField label="Year of Manufacture (Optional)" error={errors.year?.message}>
                  <TextInput
                    type="number"
                    placeholder="2024"
                    {...register('year')}
                  />
                </FormField>
              </div>

              <FormField label="Application Tags" required>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-[#F9F9FB] rounded-lg border border-[#E5E5E5]">
                  {APPLICATION_TYPES.map(app => (
                    <label key={app} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value={app}
                        {...register('application')}
                        className="w-4 h-4 accent-[#4A3A5C] rounded"
                      />
                      <span className="text-xs text-[#333333]">{app}</span>
                    </label>
                  ))}
                </div>
              </FormField>
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">Pricing & ETA</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Selling Price (NPR)" required error={errors.bidPrice?.message}>
                  <TextInput
                    type="number"
                    placeholder="e.g. 185000"
                    {...register('bidPrice', { required: 'Price is required' })}
                  />
                  <p className="text-xs text-[#666666] mt-1">Enter your expected selling price</p>
                </FormField>

                <FormField label="Estimated ETA">
                  <Select
                    options={ETA_OPTIONS.map(o => ({ value: o, label: o }))}
                    {...register('eta')}
                  />
                </FormField>
              </div>

            </div>
          </div>

          {/* Images */}
          <div>
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">Images</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
              {previews.map((preview, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-[#E5E5E5] group">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {selectedFiles.length < 4 && (
                <label className="border-2 border-dashed border-[#E5E5E5] rounded-lg aspect-square flex flex-col items-center justify-center hover:border-[#4A3A5C] transition cursor-pointer bg-[#F9F9FB]">
                  <Upload className="w-6 h-6 text-[#999999] mb-1" />
                  <span className="text-[10px] text-[#999999]">Add Image</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    className="hidden" 
                    onChange={handleFileChange}
                  />
                </label>
              )}
            </div>
            {selectedFiles.length === 0 && (
              <p className="text-sm text-[#999999] text-center italic mb-6">At least one image is recommended for better visibility.</p>
            )}

            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4 mt-6">Product Video (Optional)</h3>
            <div className="max-w-xs">
              {videoPreview ? (
                <div className="relative rounded-lg overflow-hidden border border-[#E5E5E5] group">
                  <video src={videoPreview} controls className="w-full aspect-video bg-black" />
                  <button
                    type="button"
                    onClick={removeVideo}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-[#E5E5E5] rounded-lg h-32 flex flex-col items-center justify-center hover:border-[#4A3A5C] transition cursor-pointer bg-[#F9F9FB] w-full">
                  <Upload className="w-6 h-6 text-[#999999] mb-1" />
                  <span className="text-xs text-[#999999] mb-1">Add Video (Max 50MB)</span>
                  <span className="text-[10px] text-[#999999]">MP4, MOV, AVI</span>
                  <input 
                    type="file" 
                    accept="video/mp4,video/mov,video/avi" 
                    className="hidden" 
                    onChange={handleVideoChange}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Remarks */}
          <div>
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">Additional Information</h3>
            <FormField label="Remarks (Optional)">
              <TextArea
                placeholder="Any additional notes, warranty information, shipping details..."
                rows={3}
                {...register('remarks')}
              />
            </FormField>
          </div>

          {/* Compliance */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
            <p className="text-sm text-[#666666]">
              <span className="font-medium text-amber-600">Note:</span> Your listing will be reviewed by our admin team within 24-48 hours. Ensure all information is accurate and complete to avoid rejection.
            </p>
          </div>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            loading={isSubmitting}
            type="submit"
          >
            {isSubmitting ? uploadProgress || 'Submitting...' : 'Submit for Review'}
          </Button>
        </form>
      </div>
    </div>
  )
}
