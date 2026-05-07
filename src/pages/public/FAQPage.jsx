import { motion } from 'framer-motion'
import { HelpCircle } from 'lucide-react'
import { useState } from 'react'

const FAQS = [
  {
    category: 'Getting Started',
    questions: [
      {
        q: 'How do I create an account on WareXhub?',
        a: 'Visit the registration page, enter your company details, and submit. Our admin team verifies and approves within 24-48 hours. Once approved, you can log in and start buying or selling.'
      },
      {
        q: 'What documents are required for registration?',
        a: 'Basic company information (name, registration number, industry). For sellers, we may request business license copies. All information is kept completely confidential.'
      },
      {
        q: 'Is there a trial period?',
        a: 'We offer a 7-day money-back guarantee. If not satisfied with any plan, contact support within 7 days for a full refund.'
      },
    ]
  },
  {
    category: 'Buying & Searching',
    questions: [
      {
        q: 'How do I search for equipments and parts?',
        a: 'Use the search bar and filters in the Buyer dashboard. Search by item name, OEM number, brand, or category. Our smart search also corrects typos in OEM numbers.'
      },
      {
        q: 'Why can\'t I see seller information?',
        a: 'Seller identity is completely hidden for confidentiality. You only see the part details, price range, and ETA. Communication happens through quotes and requests via our system.'
      },
      {
        q: 'How does the quote system work?',
        a: 'Create a request with your specifications and urgency. Available sellers get notified and send quotes. You review, negotiate, and accept. All confidentially.'
      },
      {
        q: 'What is the price range shown to buyers?',
        a: 'Buyers see a range calculated as: (Seller\'s Bid × 0.95) to (Seller\'s Bid × 1.30). This ensures transparency while protecting seller pricing strategies.'
      },
    ]
  },
  {
    category: 'Selling & Listings',
    questions: [
      {
        q: 'How do I add my inventory?',
        a: 'Go to "Add Listing" in your seller dashboard. Fill item details (name, OEM, condition, price, etc.). Submit for admin review. It goes LIVE within 24-48 hours if approved.'
      },
      {
        q: 'What if my listing is rejected?',
        a: 'The admin provides a reason code (CR-01 to CR-08). You\'ll see this in "Pending Reviews" with the admin\'s note. Correct and resubmit.'
      },
      {
        q: 'Can I bulk upload listings?',
        a: 'Yes! Use our Bulk Upload wizard. Download the CSV template, populate it, and upload. We\'ll process up to 200 items and flag any errors for correction.'
      },
      {
        q: 'How is my bid price shown to buyers?',
        a: 'Buyers never see your exact bid. They see a calculated range: (Your bid × 0.95) to (Your bid × 1.30). This keeps your pricing strategy confidential.'
      },
    ]
  },
  {
    category: 'Confidentiality & Security',
    questions: [
      {
        q: 'Is my business information safe on WareXhub?',
        a: 'Absolutely. All data is encrypted end-to-end. Your business name, location, and strategy never appear on the platform. You\'re identified only by codes (WX-S-001, etc.).'
      },
      {
        q: 'How does WareXhub maintain anonymity?',
        a: 'Buyer and seller identities are stored securely. Only our admin team sees real details. Trades happen using codes only. No direct contact is exposed.'
      },
      {
        q: 'Can I communicate directly with buyers/sellers?',
        a: 'All communication happens through our platform\'s messaging system using codes. Direct contact details are never shared unless both parties agree post-deal.'
      },
      {
        q: 'What about payment confidentiality?',
        a: 'Payments are processed through secure, verified channels. Transaction details show only order ID and amount—no business details are exposed.'
      },
    ]
  },
  {
    category: 'Pricing & Plans',
    questions: [
      {
        q: 'What are the membership plans?',
        a: 'Three tiers: Basic (NPR 2,999, 5 listings), Pro (NPR 4,999, 50 listings), and Enterprise (NPR 9,999, unlimited). Each includes different support levels.'
      },
      {
        q: 'Can I upgrade or downgrade anytime?',
        a: 'Yes! Changes take effect immediately. Your account will be adjusted proportionally for the remaining period.'
      },
      {
        q: 'Is there a commission on deals?',
        a: 'Yes, we charge 15% commission on successful deals. This ensures quality and trust in the ecosystem.'
      },
      {
        q: 'Are there hidden fees?',
        a: 'No hidden fees. You only pay: (1) Monthly membership fee, (2) 15% commission on completed deals. Everything else is included.'
      },
    ]
  },
  {
    category: 'Deals & Fulfillment',
    questions: [
      {
        q: 'What happens after I accept a quote?',
        a: 'A deal is created. The seller ships the item, and you verify receipt. Once confirmed, the commission is processed and the deal is marked complete.'
      },
      {
        q: 'What does "ETA" mean?',
        a: 'Estimated Time to Arrival—how quickly the item ships. Options: Same Day, 24 Hours, 48 Hours, or 3-5 Days. No location data is shared.'
      },
      {
        q: 'What if there\'s a dispute?',
        a: 'Our admin team mediates. Contact support with details. We review both sides and make a fair decision. The WareXhub guarantee protects both parties.'
      },
      {
        q: 'Can I return items?',
        a: 'Return policies are negotiated directly between you and the seller post-purchase. WareXhub facilitates communication through codes only.'
      },
    ]
  },
  {
    category: 'Admin & Verification',
    questions: [
      {
        q: 'Why does every listing go through admin review?',
        a: 'We ensure quality and compliance. Sellers provide complete specs; our team verifies OEM numbers, pricing, and descriptions before listing goes LIVE.'
      },
      {
        q: 'How long is the review process?',
        a: 'Typically 24-48 hours. Pro and Enterprise members get priority review (6 hours and 1 hour, respectively).'
      },
      {
        q: 'What happens if a seller lists fake or incorrect items?',
        a: 'Serious violations result in account suspension or ban. We maintain data integrity to protect all platform members.'
      },
    ]
  },
]

export default function FAQPage() {
  const [expanded, setExpanded] = useState({})

  const toggleExpand = (id) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  return (
    <div className="space-y-20">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <HelpCircle className="w-16 h-16 text-[#4A3A5C] mx-auto mb-6" />
        <h1 className="text-5xl font-bold text-[#1A1A1A] mb-6">Frequently Asked Questions</h1>
        <p className="text-xl text-[#333333] max-w-2xl mx-auto">
          Find answers to common questions about WareXhub. If you need more help, <a href="/contact" className="text-[#4A3A5C] hover:text-[#574B66] font-semibold">contact us</a>.
        </p>
      </motion.div>

      {/* FAQ Sections */}
      <div className="space-y-12">
        {FAQS.map((section, sIdx) => (
          <motion.section
            key={sIdx}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">{section.category}</h2>
            <div className="space-y-4">
              {section.questions.map((faq, qIdx) => {
                const id = `${sIdx}-${qIdx}`
                const isExpanded = expanded[id]

                return (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: qIdx * 0.05 }}
                    className="bg-[#F8F8FA] border border-[#E5E5E5] rounded-lg overflow-hidden hover:border-[#4A3A5C]/30 transition"
                  >
                    <button
                      onClick={() => toggleExpand(id)}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-[#F3F1F7] transition"
                    >
                      <h3 className="font-semibold text-[#1A1A1A] pr-8">{faq.q}</h3>
                      <motion.span
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-[#4A3A5C] flex-shrink-0"
                      >
                        ▼
                      </motion.span>
                    </button>

                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: isExpanded ? 'auto' : 0,
                        opacity: isExpanded ? 1 : 0
                      }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 border-t border-[#E5E5E5] pt-4 text-[#333333] leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  </motion.div>
                )
              })}
            </div>
          </motion.section>
        ))}
      </div>

      {/* Still Have Questions CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-[#4A3A5C]/10 to-[#574B66]/10 border border-[#4A3A5C]/20 rounded-2xl p-12 text-center"
      >
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">Still have questions?</h2>
        <p className="text-[#333333] mb-8">
          Our support team is here to help. Reach out anytime!
        </p>
        <a
          href="/contact"
          className="inline-block bg-[#4A3A5C] hover:bg-[#574B66] text-white px-8 py-3 rounded-lg font-semibold transition"
        >
          Contact Support
        </a>
      </motion.div>
    </div>
  )
}
