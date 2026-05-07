import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Shield, ArrowRight, Building, User, Mail, Phone, CheckCircle, AlertCircle, FileText, Globe, Lock } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAppStore } from '../../store/appStore'
import NDAModal from '../../components/ui/NDAModal'
import TermsModal from '../../components/ui/TermsModal'
import { uploadVatDocument } from '../../services/uploadService'
import { useAuthStore } from '../../store/authStore'
import { Upload, X, Loader2 } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL

const COUNTRY_PHONE_CODES = {
  'Nepal': '+977',
  'India': '+91',
  'Bangladesh': '+880',
  'Bhutan': '+975',
  'China': '+86',
  'UAE': '+971',
  'Other': ''
}

const COUNTRIES = ['Nepal', 'India', 'Bangladesh', 'Bhutan', 'China', 'UAE', 'Other']

const INDUSTRIES = [
  'Beverages', 'Brewery', 'Dairy', 'Steel',
  'Hydro/Power', 'Plywood', 'Hospitality',
  'Construction', 'Agro-Processing',
  'Printing & Packaging', 'Chemicals & Pharma',
  'Logistics', 'Other'
]

export default function RegisterPage() {
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm()
  // const { addRegistration } = useAppStore()
  const navigate = useNavigate()
  const [submitted, setSubmitted] = useState(false)
  const [showNDAModal, setShowNDAModal] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [vatFile, setVatFile] = useState(null)
  const [vatFileName, setVatFileName] = useState('')
  const [uploadingVat, setUploadingVat] = useState(false)
  const [vatUploaded, setVatUploaded] = useState(false)
  const setToken = useAuthStore(state => state.setToken)
  const nda = watch('nda')
  const terms = watch('terms')
  const selectedCountry = watch('country')
  const phoneInput = watch('phone')
  const selectedIndustry = watch('industry')
  const [statsData, setStatsData] = useState(null)
  
  const [ndaRead, setNdaRead] = useState(false)
  const [termsRead, setTermsRead] = useState(false)

  useEffect(() => {
    fetch(`${API_URL}/api/stats/homepage`)
      .then(r => r.ok ? r.json() : null)
      .catch(() => null)
      .then(data => { if (data) setStatsData(data) })
  }, [])
  
  // Auto-set phone country code when country changes
  useEffect(() => {
    if (selectedCountry && COUNTRY_PHONE_CODES[selectedCountry]) {
      const code = COUNTRY_PHONE_CODES[selectedCountry]
      // If phone doesn't already start with the code, prepend it
      if (code && !phoneInput?.startsWith(code)) {
        setValue('phone', code)
      }
    }
  }, [selectedCountry, setValue, phoneInput])

  const handleVatFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size exceeds 10MB')
        return
      }
      setVatFile(file)
      setVatFileName(file.name)
    }
  }

  const onSubmit = async (data) => {
    if (!data.nda) {
      toast.error('You must agree to the NDA to proceed')
      return
    }
    if (!data.terms) {
      toast.error('You must agree to the Terms & Conditions to proceed')
      return
    }
    
    try {
      // Map form data to API payload
      const payload = {
        first_name: data.firstName,
        last_name: data.lastName,
        company_name: data.company,
        vat_number: data.vat || null,
        email: data.email,
        country: data.country,
        mobile: data.phone,
        industry: data.industry,
        password: data.password,
        agreed_nda: data.nda,
        agreed_terms: data.terms
      }

      console.log('📝 [REGISTER] Sending to API:', payload)

      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      if (!response.ok) {
        console.log(`⚠️  [REGISTER] API Error: ${result.message}`)
        toast.error(result.message || 'Registration failed')
        return
      }

      console.log('✅ [REGISTER] Successfully registered:', result.user)
      
      // If VAT file selected, upload it
      if (vatFile && result.token) {
        setUploadingVat(true)
        try {
          // Temporarily set token in store so uploadService can use it
          setToken(result.token)
          await uploadVatDocument(vatFile)
          setVatUploaded(true)
          toast.success('VAT Document uploaded successfully!')
        } catch (uploadError) {
          console.error('❌ [REGISTER] VAT Upload error:', uploadError)
          toast.error('Registration successful, but VAT document upload failed.')
        } finally {
          setUploadingVat(false)
        }
      }
      
      setSubmitted(true)
      toast.success('Application submitted! Admin will review within 24 hours.')
      
      // Redirect to login after 3 seconds to give time for VAT upload feedback
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (error) {
      console.error('❌ [REGISTER] Error:', error)
      toast.error(error.message || 'Connection failed. Check if backend is running.')
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-[#1a1625] text-white p-12 relative overflow-hidden">
        <div className="absolute inset-0 noise-bg opacity-20" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#4A3A5C]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-[#4A3A5C] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">W</span>
            </div>
            <span className="text-2xl font-bold text-white">WareXhub</span>
          </Link>
        </div>
        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl font-bold text-white">Join Nepal's Premier Industrial Equipments &amp; Parts Network</h2>
          <div className="space-y-4">
            {[
              'Admin-vetted membership — no spam sellers',
              'Complete buyer & seller anonymity',
              `Access to ${statsData ? statsData.partsListed.toLocaleString() : '--'}+ verified equipment & part listings`,
              'Priority matching within 24 hours',
            ].map((point, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="flex items-center gap-3"
              >
                <CheckCircle className="w-5 h-5 text-[#4A3A5C] shrink-0" />
                <span className="text-[#a89ec9]">{point}</span>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="relative z-10 flex items-center gap-2 text-[#a89ec9] text-sm">
          <Shield className="w-4 h-4 text-[#4A3A5C]" />
          <span>All accounts manually verified by WareXhub team</span>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-[#4A3A5C] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <span className="text-xl font-bold text-[#1A1A1A]">WareXhub</span>
          </div>

          {!submitted ? (
            <>
              <h2 className="text-3xl font-bold text-[#1A1A1A] mb-1">Request Access</h2>
              <p className="text-[#333333] mb-8">Complete your details. Our team will verify and activate your account within 24 hours.</p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* 1. First Name */}
                <div>
                  <label className="input-label">First Name <span className="text-red-500">*</span></label>
                  <input {...register('firstName', { required: 'First name required' })} className="input-field" placeholder="Rohit" />
                  {errors.firstName && <p className="text-[#4A3A5C] text-xs mt-1">{errors.firstName.message}</p>}
                </div>

                {/* 2. Last Name */}
                <div>
                  <label className="input-label">Last Name <span className="text-red-500">*</span></label>
                  <input {...register('lastName', { required: 'Last name required' })} className="input-field" placeholder="Karmakar" />
                  {errors.lastName && <p className="text-[#4A3A5C] text-xs mt-1">{errors.lastName.message}</p>}
                </div>

                {/* 3. Company Name */}
                <div>
                  <label className="input-label">Company Name <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input {...register('company', { required: 'Company name required' })} className="input-field pl-10" placeholder="Himalayan Industries Pvt. Ltd." />
                  </div>
                  {errors.company && <p className="text-[#4A3A5C] text-xs mt-1">{errors.company.message}</p>}
                </div>

                {/* 4. VAT Number */}
                <div>
                  <label className="input-label">VAT Number <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input {...register('vat', { 
                      required: 'VAT number is required',
                      pattern: {
                        value: /^\d{9}$/,
                        message: 'VAT number must be exactly 9 digits'
                      }
                    })} className="input-field pl-10" placeholder="e.g. 123456789" />
                  </div>
                  {errors.vat && <p className="text-[#4A3A5C] text-xs mt-1">{errors.vat.message}</p>}
                </div>

                {/* 4B. VAT Document Upload */}
                <div>
                  <label className="input-label">Upload VAT Document (Optional)</label>
                  <div className={`relative border-2 border-dashed rounded-lg p-3 transition ${vatFile ? 'border-[#4A3A5C] bg-[#F3F1F7]' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input 
                      type="file" 
                      accept=".pdf,.jpg,.png" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleVatFileChange}
                    />
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${vatFile ? 'bg-[#4A3A5C] text-white' : 'bg-gray-100 text-gray-400'}`}>
                        <Upload className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700 truncate">
                          {vatFileName || 'Choose PDF or Image...'}
                        </p>
                        <p className="text-xs text-gray-500">Max 10MB</p>
                      </div>
                      {vatFile && (
                        <button 
                          type="button" 
                          onClick={(e) => { e.stopPropagation(); setVatFile(null); setVatFileName(''); }}
                          className="p-1 hover:bg-gray-200 rounded-full"
                        >
                          <X className="w-4 h-4 text-gray-500" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* 5. Email Address */}
                <div>
                  <label className="input-label">Email Address <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input {...register('email', { required: 'Email required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })} type="email" className="input-field pl-10" placeholder="you@company.com" />
                  </div>
                  {errors.email && <p className="text-[#4A3A5C] text-xs mt-1">{errors.email.message}</p>}
                </div>

                {/* 5B. Country */}
                <div>
                  <label className="input-label">Country <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select {...register('country', { required: 'Please select a country' })} className="input-field pl-10">
                      <option value="">Select your country...</option>
                      {COUNTRIES.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                  {errors.country && <p className="text-[#4A3A5C] text-xs mt-1">{errors.country.message}</p>}
                </div>

                {/* 6. Phone Number */}
                <div>
                  <label className="input-label">Phone Number <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      {...register('phone', { required: 'Phone required', pattern: { value: /^\+\d+/, message: 'Phone must include country code' } })} 
                      className="input-field pl-10" 
                      placeholder={selectedCountry ? `${COUNTRY_PHONE_CODES[selectedCountry]}-98XXXXXXXX` : "+977-98XXXXXXXX"}
                    />
                  </div>
                  {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
                </div>

                {/* 7. Industry */}
                <div>
                  <label className="input-label">Industry <span className="text-red-500">*</span></label>
                  <select {...register('industry', { required: 'Please select an industry' })} className="input-field">
                    <option value="">Select your industry...</option>
                    {INDUSTRIES.map(i => (
                      <option key={i} value={i}>{i}</option>
                    ))}
                  </select>
                  {errors.industry && <p className="text-red-400 text-xs mt-1">{errors.industry.message}</p>}
                  
                  {selectedIndustry === 'Other' && (
                    <textarea
                      {...register('industryOther', {
                        required: 'Please specify your industry'
                      })}
                      placeholder="Please specify your industry..."
                      className="input-field mt-2"
                      rows={2}
                    />
                  )}
                  {errors.industryOther && <p className="text-red-400 text-xs mt-1">{errors.industryOther.message}</p>}
                </div>

                {/* 8. Password */}
                <div>
                  <label className="input-label">Password <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input {...register('password', { required: 'Password required', minLength: { value: 8, message: 'Password must be at least 8 characters' } })} type="password" className="input-field pl-10" placeholder="Minimum 8 characters" />
                  </div>
                  {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
                </div>

                {/* 9. NDA Checkbox (MANDATORY) */}
                <div className="bg-[#F3F1F7] border border-[#4A3A5C]/20 rounded-lg p-4">
                  <label className={`flex items-start gap-3 ${ndaRead ? 'cursor-pointer' : 'cursor-not-allowed opacity-80'}`}>
                    <input
                      {...register('nda', { required: 'You must agree to the NDA' })}
                      type="checkbox"
                      disabled={!ndaRead}
                      onClick={(e) => {
                        if (!ndaRead) {
                          e.preventDefault();
                          setShowNDAModal(true);
                        }
                      }}
                      className="w-5 h-5 mt-0.5 accent-[#4A3A5C] cursor-pointer"
                    />
                    <div className="flex-1">
                      <p className="text-[#1A1A1A] font-medium">
                        I agree to the{' '}
                        <button
                          type="button"
                          onClick={() => setShowNDAModal(true)}
                          className="text-[#4A3A5C] hover:text-[#574B66] font-semibold underline transition-colors"
                        >
                          Non-Disclosure Agreement
                        </button>
                      </p>
                      <p className="text-[#333333] text-xs mt-1">Keep seller and buyer identities confidential and comply with WareXhub NDA terms.</p>
                    </div>
                  </label>
                  {errors.nda && <p className="text-red-400 text-xs mt-3">{errors.nda.message}</p>}
                </div>

                {/* 10. Terms & Conditions Checkbox (MANDATORY) */}
                <div className="bg-[#F3F1F7] border border-[#4A3A5C]/20 rounded-lg p-4">
                  <label className={`flex items-start gap-3 ${termsRead ? 'cursor-pointer' : 'cursor-not-allowed opacity-80'}`}>
                    <input
                      {...register('terms', { required: 'You must agree to the Terms & Conditions' })}
                      type="checkbox"
                      disabled={!termsRead}
                      onClick={(e) => {
                        if (!termsRead) {
                          e.preventDefault();
                          setShowTermsModal(true);
                        }
                      }}
                      className="w-5 h-5 mt-0.5 accent-[#4A3A5C] cursor-pointer"
                    />
                    <div className="flex-1">
                      <p className="text-[#1A1A1A] font-medium">
                        I agree to the{' '}
                        <button
                          type="button"
                          onClick={() => setShowTermsModal(true)}
                          className="text-[#4A3A5C] hover:text-[#574B66] font-semibold underline transition-colors"
                        >
                          Terms & Conditions
                        </button>
                      </p>
                      <p className="text-[#333333] text-xs mt-1">Read and agree to WareXhub Terms of Service, Privacy Policy, and all applicable rules.</p>
                    </div>
                  </label>
                  {errors.terms && <p className="text-red-400 text-xs mt-3">{errors.terms.message}</p>}
                </div>

                <button type="submit" disabled={isSubmitting || !nda || !terms} className="btn-primary w-full justify-center py-3 text-base">
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{uploadingVat ? 'Uploading Document...' : 'Submitting...'}</span>
                    </div>
                  ) : (
                    <>Submit Application <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>

              <p className="text-center text-[#333333] text-sm mt-6">
                Already have an account?{' '}
                <Link to="/login" className="text-[#4A3A5C] hover:text-[#574B66] font-semibold">Sign In</Link>
              </p>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F3F1F7] border border-[#4A3A5C]/20 mb-6 mx-auto"
              >
                <CheckCircle className="w-8 h-8 text-[#4A3A5C]" />
              </motion.div>
              <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2">Application Pending</h3>
              <p className="text-[#333333] mb-6">Your registration has been submitted successfully. Our team will review and contact you within 24 hours.</p>
              <div className="bg-[#F3F1F7] border border-[#4A3A5C]/20 rounded-lg p-4 mb-6">
                <p className="text-[#4A3A5C] text-sm"><span className="font-semibold">Status:</span> Awaiting Admin Approval</p>
                {vatUploaded && <p className="text-green-600 text-xs mt-1 font-medium">✓ VAT Document Uploaded</p>}
                <p className="text-[#333333] text-xs mt-2">Check your email for updates. Once approved, you can sign in with your VAT number.</p>
              </div>
              <Link
                to="/"
                className="inline-block bg-[#4A3A5C] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#574B66] transition"
              >
                Back to Home
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* NDA Modal */}
      <NDAModal
        isOpen={showNDAModal}
        onClose={() => setShowNDAModal(false)}
        onAccept={() => {
          setNdaRead(true);
          setValue('nda', true, { shouldValidate: true });
        }}
      />

      {/* Terms Modal */}
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={() => {
          setTermsRead(true);
          setValue('terms', true, { shouldValidate: true });
        }}
      />
    </div>
  )
}
