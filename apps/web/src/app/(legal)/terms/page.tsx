export default function TermsPage() {
    return (
        <article className="prose prose-stone lg:prose-lg max-w-none">
            <h1>Terms & Conditions</h1>
            <p className="text-sm text-stone-gray mb-8">Last updated: {new Date().toLocaleDateString()}</p>

            <h3>1. About ITINARA</h3>
            <p>
                ITINARA is a digital platform that provides <strong>paid, downloadable travel itineraries and destination information</strong> for self-guided travel in Indonesia. ITINARA does <strong>not</strong> operate as a travel agency and does <strong>not</strong> provide tours, transportation, accommodation, or booking services.
            </p>

            <h3>2. Use of Our Products</h3>
            <p>
                All itineraries and content provided by ITINARA are for <strong>informational and personal use only</strong>. Travelers are responsible for making their own travel decisions, bookings, and arrangements.
            </p>

            <h3>3. Payments & Access</h3>
            <ul>
                <li>All prices are listed in USD unless stated otherwise.</li>
                <li>Upon successful payment, users will receive access to the purchased digital itinerary.</li>
                <li>As this is a digital product, <strong>all sales are final</strong> unless otherwise required by applicable law.</li>
            </ul>

            <h3>4. Accuracy of Information</h3>
            <p>
                While we strive to keep information accurate and up to date, travel conditions may change due to weather, local regulations, operational hours, or other factors beyond our control.
            </p>

            <h3>5. Intellectual Property</h3>
            <p>
                All content, itineraries, text, and visuals on ITINARA are the intellectual property of ITINARA and may not be copied, redistributed, or resold without written permission.
            </p>

            <h3>6. Limitation of Liability</h3>
            <p>
                ITINARA shall not be held liable for any loss, injury, delay, cancellation, or inconvenience arising from the use of information provided on this platform.
            </p>

            <h3>7. Changes to Terms</h3>
            <p>
                ITINARA reserves the right to update these Terms & Conditions at any time. Continued use of the platform indicates acceptance of the updated terms.
            </p>

            <hr className="my-12 border-stone-gray/20" />

            <h2>Contact</h2>
            <p>
                For questions regarding these policies, please contact:<br />
                <strong>Email:</strong> <a href="mailto:hello@itinara.com">hello@itinara.com</a>
            </p>
        </article>
    );
}
