import { getLandingPage } from "@/app/dashboard/landing-pages/actions";
import { LandingPageEditor } from "@/components/landing-pages/LandingPageEditor";
import { notFound } from "next/navigation";

export default async function EditLandingPagePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const page = await getLandingPage(id);

    if (!page) {
        notFound();
    }

    return <LandingPageEditor initialPage={page} />;
}
