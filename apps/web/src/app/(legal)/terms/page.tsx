export default function TermsPage() {
    return (
        <article className="prose prose-stone max-w-none text-stone-800">
            <h1 className="text-3xl font-bold font-heading text-deep-teak mb-8">Terms & Conditions</h1>
            <p className="text-sm text-stone-600 mb-8">Last updated: January 2026</p>

            <section className="mb-8">
                <h2 className="text-xl font-bold text-deep-teak mb-4">1. About ITINARA</h2>
                <p className="text-stone-800">
                    ITINARA is a digital platform that provides <strong>paid, downloadable travel itineraries and destination information</strong> for self-guided travel in Indonesia. ITINARA does <strong>not</strong> operate as a travel agency and does <strong>not</strong> provide tours, transportation, accommodation, or booking services.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold text-deep-teak mb-4">2. Use of Our Products</h2>
                <p className="text-stone-800">
                    All itineraries and content provided by ITINARA are for <strong>informational and personal use only</strong>. Travelers are responsible for making their own travel decisions, bookings, and arrangements.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold text-deep-teak mb-4">3. Payments & Access</h2>
                <ul className="list-disc pl-5 space-y-2 text-stone-800">
                    <li>All prices are listed in USD unless stated otherwise.</li>
                    <li>Upon successful payment, users will receive access to the purchased digital itinerary.</li>
                    <li>As this is a digital product, <strong>all sales are final</strong> unless otherwise required by applicable law.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold text-deep-teak mb-4">4. Accuracy of Information</h2>
                <p className="text-stone-800">
                    While we strive to keep information accurate and up to date, travel conditions may change due to weather, local regulations, operational hours, or other factors beyond our control.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold text-deep-teak mb-4">5. Intellectual Property</h2>
                <p>
                    All content, itineraries, text, and visuals on ITINARA are the intellectual property of ITINARA and may not be copied, redistributed, or resold without written permission.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold text-deep-teak mb-4">6. Limitation of Liability</h2>
                <p>
                    ITINARA shall not be held liable for any loss, injury, delay, cancellation, or inconvenience arising from the use of information provided on this platform.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold text-deep-teak mb-4">7. Changes to Terms</h2>
                <p>
                    ITINARA reserves the right to update these Terms & Conditions at any time. Continued use of the platform indicates acceptance of the updated terms.
                </p>
            </section>

            <div className="mt-12 pt-8 border-t border-stone-gray/10">
                <p>
                    For questions regarding these policies, please contact:<br />
                    <strong>Email:</strong> <a href="mailto:hello@itinara.com" className="text-terracotta hover:underline">hello@itinara.com</a>
                </p>
            </div>
        </article>
    );
}
