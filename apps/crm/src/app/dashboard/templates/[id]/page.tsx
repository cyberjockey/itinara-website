import { getTemplate, publishTemplate, unpublishTemplate } from "@/app/dashboard/templates/actions";
import { TemplateEditor } from "@/components/templates/TemplateEditor";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";

export default async function TemplateEditorPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const template = await getTemplate(id);

    if (!template) {
        redirect("/dashboard/templates");
    }

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col">
            <header className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/templates" className="inline-flex items-center text-gray-500 hover:text-gray-900 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back
                    </Link>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            {template.title}
                            <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                                {template.status}
                            </span>
                        </h2>
                        <p className="text-gray-500 text-xs">
                            {template.duration_days} Days • {template.destinations?.name}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {template.status === 'draft' ? (
                        <form action={async () => {
                            "use server";
                            await publishTemplate(template.id);
                        }}>
                            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
                                Publish Template
                            </button>
                        </form>
                    ) : (
                        <form action={async () => {
                            "use server";
                            await unpublishTemplate(template.id);
                        }}>
                            <button className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors shadow-sm">
                                Unpublish (Revert to Draft)
                            </button>
                        </form>
                    )}
                </div>
            </header>

            <TemplateEditor template={template} />
        </div>
    )
}
