export default function DisclaimerPage() {
    return (
        <article className="prose prose-stone lg:prose-lg max-w-none">
            <h1>Disclaimer</h1>

            <p className="lead text-xl text-deep-teak font-medium mt-8">
                The information and itineraries provided by ITINARA are intended as <strong>general travel guidance only</strong>.
            </p>

            <p>
                Travel conditions, accessibility, safety, pricing, and availability of attractions may change at any time. ITINARA does not guarantee outcomes, experiences, or conditions described in the itineraries.
            </p>

            <div className="bg-stone-gray/5 p-6 rounded-2xl border border-stone-gray/10 my-8">
                <h3 className="mt-0">Acknowledgement</h3>
                <p className="mb-4">Users acknowledge that:</p>
                <ul className="mb-0">
                    <li>Travel decisions are made at their own discretion</li>
                    <li>ITINARA is not responsible for personal injury, loss, delays, cancellations, or changes during travel</li>
                    <li>Optional booking links are provided solely for convenience</li>
                </ul>
            </div>

            <p>
                By using ITINARA, users agree to travel responsibly and independently.
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
