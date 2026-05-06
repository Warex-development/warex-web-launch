import { motion } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: "1. Information We Collect",
      content: [
        "To provide our B2B marketplace services, we collect professional and business-related information including company registration details, VAT/PAN numbers, business addresses, and authorized personnel contact information.",
        "We also collect listing data such as equipment specifications, OEM numbers, and pricing information provided by sellers.",
        "Usage data including IP addresses, browser types, and interaction history with our platform is collected to improve security and user experience."
      ]
    },
    {
      title: "2. How We Use Your Information",
      content: [
        "Your business information is used primarily for account verification and maintaining the integrity of our verified marketplace.",
        "Listing data is used to facilitate matches between buyers and sellers while maintaining strict anonymity.",
        "We use your contact information to provide critical platform updates, deal notifications, and support responses."
      ]
    },
    {
      title: "3. The Anonymity System",
      content: [
        "WareX is built on a 'Confidentiality First' principle. Your company identity is never publicly displayed to other members of the platform.",
        "Identities are replaced with unique WareX codes (e.g., WX-S-001) during the listing, searching, and quoting phases.",
        "Only after a mutual agreement or deal confirmation is reached can business identities be shared, and only through our secure communication channels."
      ]
    },
    {
      title: "4. Data Security",
      content: [
        "We implement industry-standard encryption and security protocols to protect your sensitive business data.",
        "Access to real identities and documentation is restricted to authorized WareX administrative personnel only.",
        "While we strive for absolute security, no platform is 100% immune to risks; we encourage users to maintain secure credentials."
      ]
    },
    {
      title: "5. Third-Party Sharing",
      content: [
        "WareX does not sell, trade, or rent your business information to third-party marketing companies.",
        "We may share data with service providers (e.g., hosting, analytics) who are contractually bound to maintain confidentiality.",
        "Data may be disclosed if required by law or to protect the safety and rights of WareX and its members."
      ]
    },
    {
      title: "6. Changes to This Policy",
      content: [
        "We may update our Privacy Policy from time to time. We will notify you of any significant changes via your registered email or through a platform announcement.",
        "Continued use of the platform after changes constitutes acceptance of the new terms."
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
          <ShieldCheck className="w-10 h-10 text-[#4A3A5C]" />
        </div>
        <h1 className="text-4xl font-bold text-[#1A1A1A] mb-4">Privacy Policy</h1>
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
          If you have questions about our Privacy Policy, please contact our data protection team at 
          <a href="mailto:privacy@warex.com" className="text-[#4A3A5C] font-semibold ml-1">privacy@warex.com</a>
        </p>
      </motion.div>
    </div>
  )
}
