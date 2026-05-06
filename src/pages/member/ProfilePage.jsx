import { useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { uploadAvatar } from '../../services/uploadService'
import { User, Camera, Mail, Phone, Building, Globe, Shield, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { uploadVatDocument } from '../../services/uploadService'

export default function ProfilePage() {
  const { user, token } = useAuthStore()
  const [isUploading, setIsUploading] = useState(false)
  const [isUploadingVat, setIsUploadingVat] = useState(false)
  
  // Local state for user data if we wanted to edit other fields
  // For this task, we focus on avatar upload

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Avatar size must be less than 2MB')
      return
    }

    setIsUploading(true)
    try {
      const result = await uploadAvatar(file)
      
      // Immediately update authStore user object
      useAuthStore.setState((state) => ({
        user: { ...state.user, avatar: result.url }
      }))
      
      toast.success('Avatar updated successfully!')
    } catch (error) {
      toast.error(error.message || 'Failed to upload avatar')
    } finally {
      setIsUploading(false)
    }
  }

  const handleVatChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB')
      return
    }

    setIsUploadingVat(true)
    try {
      const result = await uploadVatDocument(file)
      // Just flag as uploaded in local state or update user if backend returns it
      useAuthStore.setState((state) => ({
        user: { ...state.user, vat_document_path: result.url || result.path || true }
      }))
      toast.success('VAT Document uploaded successfully!')
    } catch (error) {
      toast.error(error.message || 'Failed to upload VAT document')
    } finally {
      setIsUploadingVat(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">My Profile</h1>
        <p className="text-[#666666]">Manage your account settings and preferences</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6">
        {/* Profile Card */}
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-6">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* 1. Profile Picture */}
            <div className="flex flex-col items-center gap-3 w-full md:w-auto">
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#F3F1F7] bg-[#4A3A5C] flex items-center justify-center">
                  {user?.avatar && user.avatar.startsWith('http') ? (
                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-bold text-white">
                      {user?.avatar || (user?.full_name ? user.full_name[0] : 'U')}
                    </span>
                  )}
                </div>
                <label className="absolute bottom-1 right-1 w-10 h-10 bg-[#4A3A5C] text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-[#574B66] transition shadow-lg border-2 border-white">
                  {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} disabled={isUploading} />
                </label>
              </div>
              <div className="text-center">
                <p className="text-[#4A3A5C] font-semibold text-sm">{user?.plan} Member</p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-xs font-medium mt-2">
                  <Shield className="w-3 h-3" />
                  Verified
                </div>
              </div>
            </div>

            {/* Profile Details List */}
            <div className="flex-1 w-full space-y-6">
              {/* 2. VAT Number */}
              <div>
                <label className="text-xs font-bold text-[#999999] uppercase tracking-wider mb-2 block">
                  VAT Number
                </label>
                <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <span className="font-mono font-medium text-gray-700">{user?.vat_number}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Cannot be changed.</p>
              </div>

              {/* 3. Email Address */}
              <div>
                <label className="text-xs font-bold text-[#999999] uppercase tracking-wider mb-2 block">
                  Email Address
                </label>
                <div className="flex items-center gap-3 bg-white border border-[#E5E5E5] rounded-lg px-4 py-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-[#1A1A1A]">{user?.email}</span>
                </div>
              </div>

              {/* 4. Contact Person */}
              <div>
                <label className="text-xs font-bold text-[#999999] uppercase tracking-wider mb-2 block">
                  Contact Person
                </label>
                <div className="flex items-center gap-3 bg-white border border-[#E5E5E5] rounded-lg px-4 py-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-[#1A1A1A]">{user?.full_name}</span>
                </div>
              </div>

              {/* 5. VAT Document */}
              <div>
                <label className="text-xs font-bold text-[#999999] uppercase tracking-wider mb-2 block">
                  VAT Document
                </label>
                <div className="bg-white border border-[#E5E5E5] rounded-lg px-4 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user?.vat_document_path ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-[#1A1A1A]">
                        {user?.vat_document_path ? 'Document Uploaded ✓' : 'No document uploaded'}
                      </p>
                      <p className="text-xs text-gray-500">PDF, JPG, or PNG (Max 10MB)</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="cursor-pointer bg-[#4A3A5C] text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-[#574B66] transition-colors inline-flex items-center gap-2">
                      {isUploadingVat ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
                      ) : (
                        user?.vat_document_path ? 'Replace' : 'Upload VAT Document'
                      )}
                      <input 
                        type="file" 
                        accept=".pdf,.jpg,.png" 
                        className="hidden" 
                        onChange={handleVatChange} 
                        disabled={isUploadingVat} 
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
