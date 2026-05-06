import { useState } from 'react'

import { useAuthStore } from '../../store/authStore'
import { FormField, TextInput, TextArea, Select, Button } from '../../components/ui/FormComponents'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

export default function RequestQuotePage() {
  const { user, token } = useAuthStore()

  const { register, handleSubmit, formState: { errors }, reset } = useForm()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [requestId, setRequestId] = useState(null)

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const API = import.meta.env.VITE_API_URL
      const res = await fetch(`${API}/api/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          item_name: data.item_name,
          description: data.description,
          urgency: data.urgency,
          quantity: parseInt(data.quantity) || 1,
          oem: data.oem || '',
          make: data.make || '',
          manufacturer: data.manufacturer || '',
        })
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.message || 'Failed to submit request')

      const id = result.request?.request_id || result.request?.id || result.id
      setRequestId(id)
      reset()
      setSubmitted(true)
      toast.success('Request submitted successfully!')
    } catch (error) {
      toast.error(error.message || 'Failed to submit request')
    } finally {
      setIsSubmitting(false)
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
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">Request Submitted!</h2>
        <p className="text-[#666666] mb-6">Your request <span className="text-[#4A3A5C] font-mono font-bold">{requestId}</span> is now in our system.</p>
        <p className="text-[#999999] text-sm max-w-md">
          Our sellers are reviewing your request and will send you quotes within 24 hours. You'll be notified via email and in your dashboard.
        </p>
      </motion.div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Request Quote</h1>
        <p className="text-[#666666]">Tell us what equipments and parts you're looking for</p>
      </div>

      <div className="bg-white border border-[#E5E5E5] rounded-xl p-8 hover:shadow-md transition">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormField label="Item Name" required error={errors.item_name?.message}>
            <TextInput
              placeholder="e.g. Hydraulic Pump, Fuel Injector..."
              {...register('item_name', { required: 'Please enter the item name' })}
            />
          </FormField>

          <FormField label="Description / Specs" required error={errors.description?.message}>
            <TextArea
              placeholder="Describe the part specifications, condition preference, and any other relevant details..."
              rows={4}
              {...register('description', {
                required: 'Please describe what you are looking for'
              })}
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField label="OEM Number">
              <TextInput placeholder="Part number" {...register('oem')} />
            </FormField>
            <FormField label="Make/Brand">
              <TextInput placeholder="e.g. Caterpillar" {...register('make')} />
            </FormField>
            <FormField label="Manufacturer">
              <TextInput placeholder="Manufacturer name" {...register('manufacturer')} />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Urgency Level" required error={errors.urgency?.message}>
              <Select
                options={[
                  { value: 'Normal', label: 'Normal' },
                  { value: 'High', label: 'High' },
                  { value: 'Urgent', label: 'Urgent' },
                ]}
                {...register('urgency', { required: 'Please select urgency' })}
              />
            </FormField>

            <FormField label="Quantity" error={errors.quantity?.message}>
              <TextInput
                type="number"
                placeholder="Quantity needed"
                defaultValue="1"
                {...register('quantity', {
                  min: { value: 1, message: 'Quantity must be at least 1' }
                })}
              />
            </FormField>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-sm text-[#666666]">
            <p className="font-medium text-blue-600 mb-1">Privacy Note</p>
            <p>Your identity remains completely confidential. Sellers will only see your buyer code (<span className="font-mono">{user?.code}</span>) and request details.</p>
          </div>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            loading={isSubmitting}
            type="submit"
          >
            Submit Request
          </Button>
        </form>
      </div>
    </div>
  )
}
