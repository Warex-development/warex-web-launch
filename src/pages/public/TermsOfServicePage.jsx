import { motion } from 'framer-motion'
import { FileText } from 'lucide-react'

export default function TermsOfServicePage() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: [
        "By accessing or using WareX, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using the platform.",
        "WareX reserves the right to modify these terms at any time. We will provide notice of significant changes, and your continued use of the platform constitutes acceptance of updated terms."
      ]
    },
    {
      title: "2. User Registration & Eligibility",
      content: [
        "Users must be legally registered business entities or authorized representatives of such entities. Individual retail consumers are not eligible for membership.",
        "Accurate and truthful information must be provided during registration. WareX reserves the right to suspend or terminate accounts that provide misleading information.",
        "Account access is strictly for the registered entity. Sharing credentials with third parties is prohibited."
      ]
    },
    {
      title: "3. Platform Usage & Anonymity",
      content: [
        "WareX operates as a confidential B2B marketplace. Users agree to respect the anonymity system and not attempt to bypass it to contact other members directly.",
        "Users are prohibited from using the platform for any illegal activities, including but not limited to price-fixing, market manipulation, or listing counterfeit goods.",
        "All communications regarding deals must occur through the WareX platform until a deal is formally accepted."
      ]
    },
    {
      title: "4. Fees & Commissions",
      content: [
        "Membership fees are billed monthly or annually as per the selected plan. Fees are non-refundable except as provided in our 7-day guarantee policy.",
        "A standard commission of 15% is charged on all successful deals facilitated through the platform, unless specified otherwise in a custom Enterprise contract.",
        "Failure to pay fees or commissions may result in account suspension and legal action for recovery."
      ]
    },
    {
      title: "5. Listings & Content",
      content: [
        "Sellers are responsible for the accuracy of their listings. Every listing must pass through an administrative review before going live.",
        "WareX reserves the right to reject, modify, or remove any listing that violates our quality standards or code of conduct.",
        "By posting content on WareX, you grant us a non-exclusive license to use, display, and distribute that content within the platform ecosystem."
      ]
    },
    {
      title: "6. Limitation of Liability",
      content: [
        "WareX is a facilitator of B2B trades. We are not responsible for the quality, safety, or legality of the items listed, nor the truth or accuracy of the listings.",
        "In no event shall WareX or its affiliates be liable for any indirect, incidental, or consequential damages arising from the use of our services.",
        "Users agree to indemnify and hold WareX harmless from any claims, losses, or damages resulting from their violation of these terms."
      ]
    },
    {
      title: "7. Governing Law",
      content: [
        "These terms shall be governed by and construed in accordance with the laws of Nepal, without regard to its conflict of law provisions.",
        "Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts located in Kathmandu, Nepal."
      ]
    }
  ]

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="w-20 h-20 bg-[#4A3A5C]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <FileText className="w-10 h-10 text-[#4A3A5C]" />
        </div>
        <h1 className="text-4xl font-bold text-[#1A1A1A] mb-4">Terms of Service</h1>
        <p className="text-[#666666]">Last Updated: May 2026</p>
      </motion.div>

      <div className="space-y-12">
        {sections.map((section, idx) => (
          <motion.section
            key={idx}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="prose prose-slate max-w-none"
          >
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">{section.title}</h2>
            <div className="space-y-4">
              {section.content.map((p, pIdx) => (
                <p key={pIdx} className="text-[#333333] leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          </motion.section>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-20 p-8 bg-[#F8F8FA] border border-[#E5E5E5] rounded-2xl"
      >
        <p className="text-sm text-[#666666] text-center">
          For any legal inquiries regarding these terms, please contact 
          <a href="mailto:legal@warex.com" className="text-[#4A3A5C] font-semibold ml-1">legal@warex.com</a>
        </p>
      </motion.div>
    </div>
  )
}
