import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function LegalLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-warm-white flex flex-col">
            <Navbar />
            <main className="flex-grow max-w-3xl mx-auto px-6 py-24">
                {children}
            </main>
            <Footer />
        </div>
    )
}
