import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';
import type { Metadata } from 'next';

type StaticPage = {
    id: string;
    slug: string;
    title: string;
    content: string | null;
    meta_title: string | null;
    meta_description: string | null;
    is_published: boolean;
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: page } = await supabase
        .from("static_pages")
        .select("title, meta_title, meta_description")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();

    if (!page) {
        return { title: 'Page Not Found' };
    }

    return {
        title: page.meta_title || page.title,
        description: page.meta_description || undefined,
    };
}

export default async function StaticPageRoute({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: page, error } = await supabase
        .from("static_pages")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();

    if (error || !page) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-warm-sand">
            <div className="max-w-4xl mx-auto px-4 py-16">
                <article className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                    <h1 className="text-3xl md:text-4xl font-bold font-heading text-deep-teak mb-8">
                        {page.title}
                    </h1>
                    <div className="prose prose-stone max-w-none text-stone-800">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkBreaks]}
                            rehypePlugins={[rehypeRaw]}
                        >
                            {page.content || ''}
                        </ReactMarkdown>
                    </div>
                </article>
            </div>
        </div>
    );
}
