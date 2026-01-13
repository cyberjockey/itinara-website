export default function DisclaimerPage() {
    return (
        <article className="prose prose-stone max-w-none text-stone-800">
            <h1 className="text-3xl font-bold font-heading text-deep-teak mb-8">Disclaimer</h1>

            <section className="mb-8">
                <p className="text-lg leading-relaxed mb-6 text-stone-800">
                    The information and itineraries provided by ITINARA are intended as <strong>general travel guidance only</strong>.
                </p>
                <p className="mb-6 text-stone-800">
                    Travel conditions, accessibility, safety, pricing, and availability of attractions may change at any time. ITINARA does not guarantee outcomes, experiences, or conditions described in the itineraries.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold text-deep-teak mb-4">Acknowledgment</h2>
                <p className="mb-4 text-stone-800">Users acknowledge that:</p>
                <ul className="list-disc pl-5 space-y-2 text-stone-800">
                    <li>Travel decisions are made at their own discretion</li>
                    <li>ITINARA is not responsible for personal injury, loss, delays, cancellations, or changes during travel</li>
                    <li>Optional booking links are provided solely for convenience</li>
                </ul>
            </section>

            <section className="mb-8">
                <div className="p-6 bg-terracotta/5 rounded-2xl border border-terracotta/10">
                    <p className="font-medium text-deep-teak">
                        By using ITINARA, users agree to travel responsibly and independently.
                    </p>
                </div>
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
