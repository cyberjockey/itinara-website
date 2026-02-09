import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { createClient } from "@/lib/supabase/client";
import { ArrowRight } from "lucide-react";

interface RelatedPostsProps {
    destinationName: string;
    slug: string;
}

export async function RelatedPosts({ destinationName, slug }: RelatedPostsProps) {
    const supabase = createClient();

    // Fetch posts that might be related
    // Simple logic: fetch latest published posts, we can filter for relevance later if we have tags
    // For now, let's just show latest 3 posts as "Travel Guides" to keep it simple and effective for internal linking
    const { data: posts } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(3);

    if (!posts || posts.length === 0) return null;

    return (
        <section className="py-20 bg-white border-t border-[#2C2121]/5">
            <div className="max-w-4xl mx-auto px-6">
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-3xl font-bold text-[#2C2121]">
                        Travel Guides needed for {destinationName}
                    </h2>
                    <Link href="/blog" className="hidden md:flex items-center gap-2 text-[#E35435] font-bold hover:text-[#C13F23] transition-colors">
                        View All Stories <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                            <div className="relative h-48 rounded-xl overflow-hidden mb-4 shadow-sm group-hover:shadow-md transition-all">
                                {post.featured_image ? (
                                    <Image
                                        src={post.featured_image}
                                        alt={post.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-stone-100 flex items-center justify-center text-stone-400">
                                        No Image
                                    </div>
                                )}
                            </div>
                            <div className="text-xs font-bold text-[#E35435] mb-2 uppercase tracking-wide">
                                {format(new Date(post.published_at || post.created_at), 'MMMM d, yyyy')}
                            </div>
                            <h3 className="font-heading font-bold text-lg text-[#2C2121] leading-tight group-hover:text-[#E35435] transition-colors">
                                {post.title}
                            </h3>
                        </Link>
                    ))}
                </div>

                <div className="mt-8 md:hidden text-center">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-[#E35435] font-bold hover:text-[#C13F23] transition-colors">
                        View All Stories <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
