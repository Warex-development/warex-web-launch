import LegalModal from './LegalModal'

export default function NDAModal({ isOpen, onClose, onAccept }) {
  return (
    <LegalModal
      isOpen={isOpen}
      onClose={onClose}
      title="Non-Disclosure Agreement"
      onAccept={onAccept}
      acceptLabel="I Understand"
    >
      <div className="space-y-4 text-slate-300">
        <section>
          <h3 className="text-lg font-semibold text-white mb-2">Confidentiality Obligations</h3>
          <ul className="space-y-2 list-disc list-inside">
            <li>Buyer and seller identities remain confidential</li>
            <li>Contact details cannot be shared outside WareXhub</li>
            <li>Users cannot bypass WareXhub for direct transactions</li>
            <li>Pricing, sourcing, and trade information is confidential</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-white mb-2">Consequences of Violation</h3>
          <p className="text-slate-300">
            Violation of this Non-Disclosure Agreement may lead to immediate account suspension, legal action, and permanent ban from the WareXhub platform.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-white mb-2">Platform Protection</h3>
          <p className="text-slate-300">
            WareXhub monitors transactions to ensure compliance. Any attempts to circumvent the platform or expose confidential information will be detected and penalized accordingly.
          </p>
        </section>

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mt-6">
          <p className="text-sm text-[#4A3A5C]">
            <span className="font-semibold">⚠ Important:</span> By clicking "I Understand", you acknowledge that you have read and agree to be bound by this NDA.
          </p>
        </div>
      </div>
    </LegalModal>
  )
}
