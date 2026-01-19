import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
    title: "Travel Blog | Itinara",
    description: "Discover travel tips, hidden gems, and local stories from Indonesia.",
};

async function getPublishedPosts() {
    const supabase = await createClient();
    const { data: posts } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

    return posts || [];
}

export default async function BlogIndexPage() {
    const posts = await getPublishedPosts();

    return (
        <div className="min-h-screen bg-stone-50">
            <Navbar />

            <main className="pt-24 pb-20">
                {/* Hero */}
                <div className="max-w-7xl mx-auto px-4 md:px-6 mb-16 text-center">
                    <h1 className="text-4xl md:text-6xl font-heading font-bold text-deep-teak mb-6">
                        Travel Stories
                    </h1>
                    <p className="text-xl text-stone-gray max-w-2xl mx-auto leading-relaxed">
                        Inspiration, guides, and tales from the archipelago. Curated by locals, written for explorers.
                    </p>
                </div>

                {/* Grid */}
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    {posts.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map((post) => (
                                <Link
                                    key={post.id}
                                    href={`/blog/${post.slug}`}
                                    className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-stone-gray/10"
                                >
                                    <div className="relative h-64 overflow-hidden bg-gray-100">
                                        {post.featured_image ? (
                                            <Image
                                                src={post.featured_image}
                                                alt={post.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                No Image
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                    </div>

                                    <div className="p-8 flex flex-col flex-1">
                                        <div className="text-xs font-bold text-terracotta mb-3 uppercase tracking-wider">
                                            {format(new Date(post.published_at || post.created_at), 'MMMM d, yyyy')}
                                        </div>

                                        <h2 className="text-2xl font-bold text-deep-teak mb-3 group-hover:text-terracotta transition-colors line-clamp-2">
                                            {post.title}
                                        </h2>

                                        <p className="text-stone-gray/80 leading-relaxed mb-6 line-clamp-3">
                                            {post.excerpt}
                                        </p>

                                        <div className="mt-auto pt-6 border-t border-dashed border-gray-100 flex items-center text-sm font-bold text-deep-teak group-hover:tracking-wide transition-all">
                                            Read Article <span className="ml-2 text-terracotta">→</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-stone-gray/20">
                            <p className="text-xl text-stone-gray font-medium">No stories published yet.</p>
                            <p className="text-stone-gray/60 mt-2">Check back soon for new adventures!</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
