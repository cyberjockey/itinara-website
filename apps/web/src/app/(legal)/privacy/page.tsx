export default function PrivacyPage() {
    return (
        <article className="prose prose-stone lg:prose-lg max-w-none">
            <h1>Privacy Policy</h1>
            <p className="text-sm text-stone-gray mb-8">Last updated: {new Date().toLocaleDateString()}</p>

            <h3>1. Information We Collect</h3>
            <p>We may collect the following information:</p>
            <ul>
                <li>Email address</li>
                <li>Payment-related information (processed securely by third-party payment providers)</li>
                <li>Basic usage data to improve our services</li>
            </ul>

            <h3>2. How We Use Your Information</h3>
            <p>Your information is used to:</p>
            <ul>
                <li>Process purchases and deliver digital products</li>
                <li>Communicate important updates related to your purchase</li>
                <li>Improve website and app performance</li>
            </ul>

            <h3>3. Data Protection</h3>
            <p>
                We do not sell or rent personal data. All payments are handled by secure third-party payment processors. Reasonable measures are taken to protect user data.
            </p>

            <h3>4. Cookies</h3>
            <p>
                ITINARA may use cookies or similar technologies to enhance user experience and analyze website performance.
            </p>

            <h3>5. Third-Party Services</h3>
            <p>
                We may include links to third-party websites or booking platforms. ITINARA is not responsible for the privacy practices of external sites.
            </p>

            <h3>6. Your Rights</h3>
            <p>
                Users may request access, correction, or deletion of their personal data by contacting us.
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
