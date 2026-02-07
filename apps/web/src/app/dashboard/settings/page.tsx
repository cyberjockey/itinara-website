import { PurchaseHistory } from "@/components/dashboard/PurchaseHistory";
import { SettingsForm } from "@/components/dashboard/SettingsForm";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
    return (
        <div className="max-w-3xl mx-auto space-y-12">
            <section>
                <header className="mb-8">
                    <h1 className="text-3xl font-heading font-bold text-deep-teak mb-2">Account Settings</h1>
                    <p className="text-stone-gray">Manage your profile and preferences.</p>
                </header>

                <div className="bg-white rounded-3xl p-8 border border-stone-gray/10 shadow-sm">
                    <SettingsForm />
                </div>
            </section>

            <section>
                <header className="mb-6">
                    <h2 className="text-2xl font-heading font-bold text-deep-teak mb-2">Purchase History</h2>
                    <p className="text-stone-gray">View your past transactions and credit purchases.</p>
                </header>

                <div className="bg-white rounded-3xl p-8 border border-stone-gray/10 shadow-sm">
                    <PurchaseHistory />
                </div>
            </section>
        </div>
    );
}
