import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { getLatestPosts } from "@/actions/get-latest-posts";
import { ArrowRight } from "lucide-react";

export async function LatestBlog() {
    const posts = await getLatestPosts(3);

    if (posts.length === 0) return null;

    return (
        <div className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="max-w-2xl">
                        <span className="text-terracotta font-bold uppercase tracking-widest text-sm mb-2 block">
                            Journal
                        </span>
                        <h2 className="text-4xl md:text-5xl font-heading font-bold text-deep-teak">
                            Stories from the Archipelago
                        </h2>
                    </div>

                    <Link
                        href="/blog"
                        className="group flex items-center gap-2 text-deep-teak font-bold hover:text-terracotta transition-colors"
                    >
                        View All Articles
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <Link
                            key={post.id}
                            href={`/blog/${post.slug}`}
                            className="group flex flex-col h-full hover:-translate-y-2 transition-transform duration-300"
                        >
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 mb-6">
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
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                            </div>

                            <div className="flex flex-col flex-1">
                                <div className="flex items-center gap-3 text-sm text-stone-gray/80 mb-3">
                                    <span>{format(new Date(post.published_at), 'MMMM d, yyyy')}</span>
                                    {post.author?.full_name && (
                                        <>
                                            <span className="w-1 h-1 rounded-full bg-stone-gray/40" />
                                            <span>by {post.author.full_name}</span>
                                        </>
                                    )}
                                </div>

                                <h3 className="text-xl font-bold text-deep-teak mb-3 leading-snug group-hover:text-terracotta transition-colors line-clamp-2">
                                    {post.title}
                                </h3>

                                <p className="text-stone-gray leading-relaxed line-clamp-3 mb-6">
                                    {post.excerpt}
                                </p>

                                <div className="mt-auto flex items-center text-sm font-bold text-deep-teak group-hover:text-terracotta transition-colors">
                                    Read Story
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
