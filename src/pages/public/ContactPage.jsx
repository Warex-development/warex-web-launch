import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FormField, TextInput, TextArea, Button } from '../../components/ui/FormComponents'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      await new Promise(r => setTimeout(r, 1500))
      toast.success('Message sent! We\'ll get back to you within 24 hours.')
      reset()
    } catch (error) {
      toast.error('Failed to send message')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'support@warexhub.np', href: 'mailto:support@warexhub.np' },
    { icon: Phone, label: 'Phone', value: '+977-1-5555-0001', href: 'tel:+97715555001' },
    { icon: MapPin, label: 'Address', value: 'Lalitpur, Nepal' },
    { icon: Clock, label: 'Hours', value: 'Mon-Fri, 9 AM - 6 PM NPT' },
  ]

  return (
    <div className="space-y-20">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <h1 className="text-5xl font-bold text-[#1A1A1A] mb-6">Contact Us</h1>
        <p className="text-xl text-[#333333] max-w-2xl mx-auto">
          Have questions? We're here to help. Reach out to our team anytime.
        </p>
      </motion.div>

      {/* Contact Info + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <h2 className="text-2xl font-bold text-[#1A1A1A]">Get in Touch</h2>

          <div className="space-y-6">
            {contactInfo.map((info, idx) => {
              const Icon = info.icon
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0">
                    <Icon className="w-6 h-6 text-[#4A3A5C] mt-1" />
                  </div>
                  <div>
                    <p className="text-[#333333] text-sm">{info.label}</p>
                    {info.href ? (
                      <a href={info.href} className="text-[#1A1A1A] font-semibold hover:text-[#4A3A5C] transition">
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-[#1A1A1A] font-semibold">{info.value}</p>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Support Channels */}
          <div className="bg-[#F3F1F7] border border-[#E5E5E5] rounded-lg p-6">
            <h3 className="text-lg font-bold text-[#1A1A1A] mb-4">Other Ways to Connect</h3>
            <ul className="space-y-3 text-[#333333] text-sm">
              <li>• Live chat support on dashboard (9 AM - 6 PM NPT)</li>
              <li>• Email support with 24-hour response time</li>
              <li>• Dedicated account manager for Enterprise members</li>
              <li>• Monthly webinars and training sessions</li>
            </ul>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white border border-[#E5E5E5] rounded-xl p-8"
        >
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Send us a Message</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField label="Full Name" required error={errors.name?.message}>
              <TextInput
                placeholder="Your name"
                {...register('name', { required: 'Name is required' })}
              />
            </FormField>

            <FormField label="Email" required error={errors.email?.message}>
              <TextInput
                type="email"
                placeholder="you@company.com"
                {...register('email', { required: 'Email is required' })}
              />
            </FormField>

            <FormField label="Company" error={errors.company?.message}>
              <TextInput
                placeholder="Your company name"
                {...register('company')}
              />
            </FormField>

            <FormField label="Subject" required error={errors.subject?.message}>
              <TextInput
                placeholder="What is this about?"
                {...register('subject', { required: 'Subject is required' })}
              />
            </FormField>

            <FormField label="Message" required error={errors.message?.message}>
              <TextArea
                placeholder="Tell us how we can help..."
                rows={5}
                {...register('message', { required: 'Message is required' })}
              />
            </FormField>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              loading={isSubmitting}
              type="submit"
            >
              Send Message
            </Button>

            <p className="text-xs text-[#666666] text-center">
              We typically respond within 24 hours
            </p>
          </form>
        </motion.div>
      </div>

      {/* FAQ Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold text-white mb-12 text-center">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {[
            { q: 'What is WareXhub?', a: 'WareXhub is a confidential B2B platform for sourcing industrial equipments and parts in Nepal with full anonymity and admin-backed verification.' },
            { q: 'How do I join?', a: 'Sign up on our registration page with your company details. We review and approve new members within 24-48 hours.' },
            { q: 'Is there a membership fee?', a: 'Yes, we offer flexible plans starting at NPR 2,999/month. Choose based on your listing and transaction needs.' },
            { q: 'How confidential is the platform?', a: 'Complete anonymity. Buyers never see seller details and vice versa. All communication is through our system using codes only.' },
          ].map((faq, idx) => (
            <motion.details
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="group bg-white border border-[#E5E5E5] rounded-lg overflow-hidden cursor-pointer"
            >
              <summary className="flex items-center justify-between p-6 text-[#1A1A1A] font-semibold hover:bg-[#F3F1F7] transition">
                <span>{faq.q}</span>
                <span className="group-open:rotate-180 transition">▼</span>
              </summary>
              <div className="px-6 pb-4 text-[#333333] border-t border-[#E5E5E5] pt-4">
                {faq.a}
              </div>
            </motion.details>
          ))}
        </div>
      </motion.section>
    </div>
  )
}
