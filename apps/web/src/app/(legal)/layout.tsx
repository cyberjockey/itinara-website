
export default function LegalLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-warm-white">
            <main className="max-w-3xl mx-auto px-6 py-24">
                {children}
            </main>
        </div>
    )
}
