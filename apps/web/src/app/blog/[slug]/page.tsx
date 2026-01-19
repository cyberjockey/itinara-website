import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, User, Calendar, Clock } from "lucide-react";
import { notFound } from "next/navigation";
import { ShareButtons } from "@/components/blog/ShareButtons";

// Dynamic Metadata Generation
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const supabase = await createClient();
    const { slug } = await params;

    const { data: post } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

    return {
        title: post?.meta_title || post?.title || "Blog Post",
        description: post?.meta_description || post?.excerpt || "Read this article on Itinara.",
        openGraph: {
            images: post?.featured_image ? [post.featured_image] : [],
        },
    };
}

// Fetch Post
async function getPost(slug: string) {
    const supabase = await createClient();
    console.log('Fetching post for slug:', slug);
    const { data: post, error } = await supabase
        .from('posts')
        .select(`
            *
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

    if (error) console.error('Supabase error:', error);
    if (!post) console.log('Post not found for slug:', slug);

    return { post, error };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const { post, error } = await getPost(slug);

    if (!post) {
        return (
            <div className="min-h-screen pt-32 px-6 bg-white text-center">
                <Navbar />
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-3xl font-bold text-red-600 mb-4">Debug: Post Not Found</h1>
                    <div className="bg-gray-100 p-6 rounded-lg text-left font-mono text-sm overflow-auto">
                        <p className="mb-2"><strong>Slug searched:</strong> "{slug}"</p>
                        <p className="mb-2"><strong>Status Check:</strong> 'published'</p>
                        {error ? (
                            <div>
                                <p className="text-red-600 font-bold">Supabase Error:</p>
                                <pre>{JSON.stringify(error, null, 2)}</pre>
                            </div>
                        ) : (
                            <p className="text-orange-600">No error returned, but getPost returned null data. This means the query returned 0 rows.</p>
                        )}
                    </div>
                    <div className="mt-8">
                        <Link href="/blog" className="text-blue-600 hover:underline">Return to Blog Index</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="pt-24 pb-20">
                {/* Back Button */}
                <div className="max-w-4xl mx-auto px-6 mb-8">
                    <Link href="/blog" className="inline-flex items-center text-sm font-bold text-stone-gray hover:text-deep-teak transition-colors group">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Stories
                    </Link>
                </div>

                {/* Article Header */}
                <article className="max-w-4xl mx-auto px-6">
                    <div className="mb-8">
                        <div className="flex items-center gap-4 text-xs font-bold text-terracotta uppercase tracking-wider mb-4">
                            <span>Travel Guide</span>
                            <span className="w-1 h-1 rounded-full bg-stone-300" />
                            <span>{Math.ceil(post.content.split(' ').length / 200)} min read</span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-heading font-bold text-deep-teak leading-tight mb-8">
                            {post.title}
                        </h1>

                        <div className="flex items-center justify-between border-y border-stone-gray/10 py-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-lg">
                                    {(post.author?.email?.[0] || 'A').toUpperCase()}
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-deep-teak">
                                        {post.author?.email?.split('@')[0] || 'Itinara Team'}
                                    </div>
                                    <div className="text-xs text-stone-gray/60">
                                        Author
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-bold text-deep-teak">
                                    {format(new Date(post.published_at || post.created_at), 'MMMM d, yyyy')}
                                </div>
                                <div className="text-xs text-stone-gray/60">
                                    Published
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Featured Image */}
                    {post.featured_image && (
                        <div className="mb-12 relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl">
                            <Image
                                src={post.featured_image}
                                alt={post.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div className="prose prose-lg max-w-none text-black prose-headings:text-black prose-p:text-black prose-li:text-black prose-strong:text-black prose-a:text-terracotta prose-img:rounded-xl [&>*]:text-black">
                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[require('rehype-raw')]}>
                            {post.content.replace(/\\n/g, '\n')}
                        </ReactMarkdown>
                    </div>

                    {/* Share / Footer */}
                    <div className="mt-16 pt-8 border-t border-stone-gray/10 text-center">
                        <ShareButtons title={post.title} slug={post.slug} />
                    </div>
                </article>
            </main>

            <Footer />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'BlogPosting',
                        headline: post.title,
                        image: post.featured_image ? [post.featured_image] : [],
                        datePublished: post.published_at || post.created_at,
                        dateModified: post.updated_at || post.created_at,
                        author: [{
                            '@type': 'Person',
                            name: post.author?.email?.split('@')[0] || 'Itinara Team',
                            url: 'https://itinaravacation.com'
                        }],
                        publisher: {
                            '@type': 'Organization',
                            name: 'Itinara',
                            logo: {
                                '@type': 'ImageObject',
                                url: 'https://itinaravacation.com/logo.png'
                            }
                        },
                        description: post.excerpt || post.meta_description || post.content.substring(0, 150),
                    })
                }}
            />
        </div>
    );
}
