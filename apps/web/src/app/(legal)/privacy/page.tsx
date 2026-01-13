export default function PrivacyPage() {
    return (
        <article className="prose prose-stone max-w-none text-stone-800">
            <h1 className="text-3xl font-bold font-heading text-deep-teak mb-8">Privacy Policy</h1>
            <p className="text-sm text-stone-600 mb-8">Last updated: January 2026</p>

            <section className="mb-8">
                <h2 className="text-xl font-bold text-deep-teak mb-4">1. Information We Collect</h2>
                <p className="mb-4 text-stone-800">We may collect the following information:</p>
                <ul className="list-disc pl-5 space-y-2 text-stone-800">
                    <li>Email address</li>
                    <li>Payment-related information (processed securely by third-party payment providers)</li>
                    <li>Basic usage data to improve our services</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold text-deep-teak mb-4">2. How We Use Your Information</h2>
                <p className="mb-4 text-stone-800">Your information is used to:</p>
                <ul className="list-disc pl-5 space-y-2 text-stone-800">
                    <li>Process purchases and deliver digital products</li>
                    <li>Communicate important updates related to your purchase</li>
                    <li>Improve website and app performance</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold text-deep-teak mb-4">3. Data Protection</h2>
                <p className="text-stone-800">
                    We do not sell or rent personal data. All payments are handled by secure third-party payment processors. Reasonable measures are taken to protect user data.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold text-deep-teak mb-4">4. Cookies</h2>
                <p className="text-stone-800">
                    ITINARA may use cookies or similar technologies to enhance user experience and analyze website performance.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold text-deep-teak mb-4">5. Third-Party Services</h2>
                <p className="text-stone-800">
                    We may include links to third-party websites or booking platforms. ITINARA is not responsible for the privacy practices of external sites.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold text-deep-teak mb-4">6. Your Rights</h2>
                <p className="text-stone-800">
                    Users may request access, correction, or deletion of their personal data by contacting us.
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
