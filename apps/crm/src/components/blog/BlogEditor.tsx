'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import rehypeRaw from 'rehype-raw';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
    Save, ArrowLeft, Image as ImageIcon, Globe, Loader2,
    Bold, Italic, Link as LinkIcon, List, Quote, Code, Heading1, Heading2,
    AlignLeft, AlignCenter, AlignRight
} from 'lucide-react';
import Link from 'next/link';
import CloudinaryImageUpload from '@/components/ui/CloudinaryImageUpload';

type Post = {
    id?: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    featured_image: string;
    status: 'draft' | 'published' | 'archived';
    meta_title: string;
    meta_description: string;
    published_at?: string;
};

export default function BlogEditor({ initialPost }: { initialPost?: Post }) {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const [post, setPost] = useState<Post>(initialPost || {
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        featured_image: '',
        status: 'draft',
        meta_title: '',
        meta_description: '',
    });

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        if (!initialPost || !post.slug) {
            setPost(prev => ({ ...prev, title: newTitle, slug: generateSlug(newTitle) }));
        } else {
            setPost(prev => ({ ...prev, title: newTitle }));
        }
    };

    const insertMarkdown = (prefix: string, suffix: string = '') => {
        if (!textareaRef.current) return;

        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;
        const text = post.content;
        const before = text.substring(0, start);
        const selection = text.substring(start, end);
        const after = text.substring(end);

        const newContent = `${before}${prefix}${selection}${suffix}${after}`;
        setPost({ ...post, content: newContent });

        // Restore focus and cursor position
        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
                textareaRef.current.setSelectionRange(
                    start + prefix.length,
                    end + prefix.length
                );
            }
        }, 0);
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            const postData = {
                ...post,
                author_id: user?.id,
                updated_at: new Date().toISOString(),
                ...(post.status === 'published' && !post.published_at ? { published_at: new Date().toISOString() } : {})
            };

            if (initialPost?.id) {
                const { error } = await supabase
                    .from('posts')
                    .update(postData)
                    .eq('id', initialPost.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('posts')
                    .insert([postData]);
                if (error) throw error;
            }

            router.push('/dashboard/blog');
            router.refresh();
        } catch (error) {
            console.error('Error saving post:', error);
            alert('Failed to save post.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto pb-20">
            {/* Header */}
            <header className="fixed top-0 right-0 left-0 md:left-64 z-10 bg-white border-b border-gray-200 px-4 md:px-8 py-4 flex items-center justify-between transition-all duration-300">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/blog" className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-xl font-bold text-gray-900 line-clamp-1">
                        {initialPost ? 'Edit Article' : 'New Article'}
                    </h1>
                    <span className={`hidden sm:inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize border
                        ${post.status === 'published' ? 'bg-green-50 text-green-700 border-green-200' :
                            post.status === 'draft' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                'bg-gray-50 text-gray-700 border-gray-200'}`}>
                        {post.status}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={post.status}
                        onChange={(e) => setPost({ ...post, status: e.target.value as 'draft' | 'published' | 'archived' })}
                        className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                    </select>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 md:px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm whitespace-nowrap"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Changes
                    </button>
                </div>
            </header>

            <div className="mt-20 grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left Column: Content */}
                <div className="xl:col-span-2 space-y-6">
                    {/* Title & Slug */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Article Title</label>
                            <input
                                type="text"
                                value={post.title || ''}
                                onChange={handleTitleChange}
                                className="w-full px-4 py-2 text-lg font-bold text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:font-normal placeholder:text-gray-900"
                                placeholder="Enter article title..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Slug (URL)</label>
                            <div className="flex items-center">
                                <span className="bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg px-3 py-2 text-gray-500 text-sm">
                                    /blog/
                                </span>
                                <input
                                    type="text"
                                    value={post.slug || ''}
                                    onChange={(e) => setPost({ ...post, slug: e.target.value })}
                                    className="flex-1 px-4 py-2 text-gray-900 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-mono placeholder:text-gray-900 w-full min-w-0"
                                    placeholder="post-url-slug"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Editor */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[750px] flex flex-col">
                        <div className="border-b border-gray-200 px-4 py-2 flex items-center justify-between bg-gray-50">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setActiveTab('write')}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'write' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                    Write
                                </button>
                                <button
                                    onClick={() => setActiveTab('preview')}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'preview' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                    Preview
                                </button>
                            </div>

                            {activeTab === 'write' && (
                                <div className="flex items-center gap-1 border-l pl-4 border-gray-300">
                                    <button onClick={() => insertMarkdown('**', '**')} className="p-1.5 rounded hover:bg-gray-200 text-gray-600" title="Bold"><Bold className="w-4 h-4" /></button>
                                    <button onClick={() => insertMarkdown('*', '*')} className="p-1.5 rounded hover:bg-gray-200 text-gray-600" title="Italic"><Italic className="w-4 h-4" /></button>
                                    <button onClick={() => insertMarkdown('# ')} className="p-1.5 rounded hover:bg-gray-200 text-gray-600" title="Heading 1"><Heading1 className="w-4 h-4" /></button>
                                    <button onClick={() => insertMarkdown('## ')} className="p-1.5 rounded hover:bg-gray-200 text-gray-600" title="Heading 2"><Heading2 className="w-4 h-4" /></button>
                                    <button onClick={() => insertMarkdown('> ')} className="p-1.5 rounded hover:bg-gray-200 text-gray-600" title="Quote"><Quote className="w-4 h-4" /></button>
                                    <button onClick={() => insertMarkdown('```\n', '\n```')} className="p-1.5 rounded hover:bg-gray-200 text-gray-600" title="Code"><Code className="w-4 h-4" /></button>
                                    <button onClick={() => insertMarkdown('[', '](url)')} className="p-1.5 rounded hover:bg-gray-200 text-gray-600" title="Link"><LinkIcon className="w-4 h-4" /></button>
                                    <button onClick={() => insertMarkdown('- ')} className="p-1.5 rounded hover:bg-gray-200 text-gray-600" title="List"><List className="w-4 h-4" /></button>
                                    <div className="w-px h-4 bg-gray-300 mx-1" />
                                    <button onClick={() => insertMarkdown('<div style="text-align: left">\n', '\n</div>')} className="p-1.5 rounded hover:bg-gray-200 text-gray-600" title="Align Left"><AlignLeft className="w-4 h-4" /></button>
                                    <button onClick={() => insertMarkdown('<div style="text-align: center">\n', '\n</div>')} className="p-1.5 rounded hover:bg-gray-200 text-gray-600" title="Align Center"><AlignCenter className="w-4 h-4" /></button>
                                    <button onClick={() => insertMarkdown('<div style="text-align: right">\n', '\n</div>')} className="p-1.5 rounded hover:bg-gray-200 text-gray-600" title="Align Right"><AlignRight className="w-4 h-4" /></button>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 relative">
                            {activeTab === 'write' ? (
                                <textarea
                                    ref={textareaRef}
                                    value={post.content || ''}
                                    onChange={(e) => setPost({ ...post, content: e.target.value })}
                                    className="w-full h-full p-6 resize-none focus:outline-none font-mono text-sm text-gray-900 leading-relaxed placeholder:text-gray-900"
                                    placeholder="Write your story here... (Markdown supported)"
                                />
                            ) : (
                                <div className="prose prose-blue max-w-none p-8 overflow-y-auto h-full">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                                        {post.content}
                                    </ReactMarkdown>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Meta & Settings */}
                <div className="space-y-6">
                    {/* Featured Image */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <ImageIcon className="w-4 h-4" />
                            Featured Image
                        </h3>
                        <div className="space-y-4">
                            {post.featured_image && (
                                <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200">
                                    <img src={post.featured_image} alt="Featured" className="w-full h-full object-cover" />
                                    <button
                                        onClick={() => setPost({ ...post, featured_image: '' })}
                                        className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm"
                                    >
                                        <div className="w-4 h-4 text-xs font-bold flex items-center justify-center">✕</div>
                                    </button>
                                </div>
                            )}
                            <CloudinaryImageUpload
                                onUpload={(urls) => setPost({ ...post, featured_image: urls[0] || '' })}
                                maxFiles={1}
                            />
                        </div>
                    </div>

                    {/* Excerpt */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <label className="block text-sm font-bold text-gray-900 mb-2">Excerpt</label>
                        <textarea
                            value={post.excerpt || ''}
                            onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-900 placeholder:text-gray-900"
                            placeholder="Short summary for cards and search results..."
                        />
                    </div>

                    {/* SEO Settings */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            SEO Metadata
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Meta Title</label>
                                <input
                                    type="text"
                                    value={post.meta_title || ''}
                                    onChange={(e) => setPost({ ...post, meta_title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-900 placeholder:text-gray-900"
                                    placeholder={post.title || "Meta Title"}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Meta Description</label>
                                <textarea
                                    value={post.meta_description || ''}
                                    onChange={(e) => setPost({ ...post, meta_description: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-900 placeholder:text-gray-900"
                                    placeholder={post.excerpt || "Meta Description"}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
