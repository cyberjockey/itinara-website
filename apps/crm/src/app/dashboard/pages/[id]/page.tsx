import { getStaticPage } from "@/app/dashboard/pages/actions";
import { PageEditor } from "@/components/pages/PageEditor";
import { notFound } from "next/navigation";

export default async function EditPagePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const page = await getStaticPage(id);

    if (!page) {
        notFound();
    }

    return <PageEditor initialPage={page} />;
}
