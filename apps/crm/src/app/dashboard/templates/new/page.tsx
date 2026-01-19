import { TemplateBasicInfoForm } from "@/components/templates/TemplateBasicInfoForm";
import { getDestinations } from "@/app/dashboard/destinations/actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewTemplatePage() {
    // Fetch destinations for the dropdown
    const destinations = await getDestinations();

    return (
        <div>
            <header className="mb-8">
                <Link href="/dashboard/templates" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-4 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Templates
                </Link>
                <h2 className="text-2xl font-bold text-gray-900">Create New Trip Template</h2>
                <p className="text-gray-500 text-sm mt-1">Start by defining the basics of your trip.</p>
            </header>

            <TemplateBasicInfoForm destinations={destinations || []} />
        </div>
    )
}
