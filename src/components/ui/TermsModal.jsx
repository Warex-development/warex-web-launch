import LegalModal from './LegalModal'

export default function TermsModal({ isOpen, onClose, onAccept }) {
  return (
    <LegalModal
      isOpen={isOpen}
      onClose={onClose}
      title="Terms & Conditions"
      onAccept={onAccept}
      acceptLabel="Accept"
    >
      <div className="space-y-4 text-gray-700">
        <section>
          <h3 className="text-lg font-semibold text-white mb-2">Platform Overview</h3>
          <p className="text-slate-300">
            WareX is a B2B intermediary platform that connects industrial parts buyers and sellers. We facilitate connections while maintaining strict anonymity and confidentiality protocols.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-white mb-2">Buyer Responsibilities</h3>
          <p className="text-gray-700 mb-2">
            Final verification of goods is buyer responsibility. Buyers must:
          </p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Conduct thorough inspection before finalizing transactions</li>
            <li>Request samples or specifications as needed</li>
            <li>Verify product quality and condition independently</li>
            <li>Report any discrepancies immediately</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-white mb-2">Listing & Content Standards</h3>
          <ul className="space-y-2 list-disc list-inside">
            <li>Fake listings are strictly prohibited</li>
            <li>All product information must be accurate and verifiable</li>
            <li>VAT information must be genuine and valid</li>
            <li>Misleading descriptions or images may result in suspension</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-white mb-2">Membership & Fees</h3>
          <ul className="space-y-2 list-disc list-inside">
            <li>Membership fees are subject to WareX policy and subject to change</li>
            <li>Different membership tiers provide different benefits</li>
            <li>Fees are non-refundable unless stated otherwise</li>
            <li>WareX reserves the right to modify pricing</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-white mb-2">Account Termination</h3>
          <p className="text-slate-300">
            Fraudulent use, violation of terms, or illegal activities may cause immediate account termination. WareX reserves the right to suspend or ban users at its discretion.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-white mb-2">Policy Updates</h3>
          <p className="text-slate-300">
            Platform rules may update over time. We will notify users of significant changes. Continued use of the platform constitutes acceptance of updated terms.
          </p>
        </section>

        <div className="bg-purple-100 border border-purple-300 rounded-lg p-4 mt-6">
          <p className="text-sm text-purple-700">
            <span className="font-semibold">✓ Confirmation:</span> By clicking "Accept", you agree to comply with all WareX Terms & Conditions.
          </p>
        </div>
      </div>
    </LegalModal>
  )
}
