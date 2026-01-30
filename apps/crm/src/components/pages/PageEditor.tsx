'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createStaticPage, updateStaticPage, type StaticPage } from '@/app/dashboard/pages/actions';
import rehypeRaw from 'rehype-raw';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import {
    Save, ArrowLeft, Globe, Loader2,
    Bold, Italic, Link as LinkIcon, List, Quote, Code, Heading1, Heading2
} from 'lucide-react';
import Link from 'next/link';

export function PageEditor({ initialPage }: { initialPage?: StaticPage }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const [page, setPage] = useState<Omit<StaticPage, 'id' | 'created_at' | 'updated_at'>>(initialPage || {
        title: '',
        slug: '',
        content: '',
        meta_title: '',
        meta_description: '',
        is_published: false,
    });

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        if (!initialPage || !page.slug) {
            setPage(prev => ({ ...prev, title: newTitle, slug: generateSlug(newTitle) }));
        } else {
            setPage(prev => ({ ...prev, title: newTitle }));
        }
    };

    const insertMarkdown = (prefix: string, suffix: string = '') => {
        if (!textareaRef.current) return;

        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;
        const text = page.content || '';
        const before = text.substring(0, start);
        const selection = text.substring(start, end);
        const after = text.substring(end);

        const newContent = `${before}${prefix}${selection}${suffix}${after}`;
        setPage({ ...page, content: newContent });

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
            const formData = new FormData();
            formData.set('slug', page.slug);
            formData.set('title', page.title);
            formData.set('content', page.content || '');
            formData.set('meta_title', page.meta_title || '');
            formData.set('meta_description', page.meta_description || '');
            formData.set('is_published', page.is_published ? 'true' : 'false');

            if (initialPage?.id) {
                await updateStaticPage(initialPage.id, formData);
            } else {
                await createStaticPage(formData);
            }
            // Redirect handled in server actions
        } catch (error) {
            console.error('Error saving page:', error);
            alert('Failed to save page.');
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto pb-20">
            {/* Header */}
            <header className="fixed top-0 right-0 left-0 md:left-64 z-10 bg-white border-b border-gray-200 px-4 md:px-8 py-4 flex items-center justify-between transition-all duration-300">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/pages" className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-xl font-bold text-gray-900 line-clamp-1">
                        {initialPage ? 'Edit Page' : 'New Page'}
                    </h1>
                    <span className={`hidden sm:inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize border
                        ${page.is_published ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                        {page.is_published ? 'Published' : 'Draft'}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={page.is_published}
                            onChange={(e) => setPage({ ...page, is_published: e.target.checked })}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Publish</span>
                    </label>
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
                            <input
                                type="text"
                                value={page.title || ''}
                                onChange={handleTitleChange}
                                className="w-full px-4 py-2 text-lg font-bold text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:font-normal placeholder:text-gray-400"
                                placeholder="Enter page title..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Slug (URL)</label>
                            <div className="flex items-center">
                                <span className="bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg px-3 py-2 text-gray-500 text-sm">
                                    /p/
                                </span>
                                <input
                                    type="text"
                                    value={page.slug || ''}
                                    onChange={(e) => setPage({ ...page, slug: e.target.value })}
                                    className="flex-1 px-4 py-2 text-gray-900 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-mono placeholder:text-gray-400 w-full min-w-0"
                                    placeholder="page-url-slug"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Editor */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-[calc(100vh-160px)] min-h-[500px] flex flex-col">
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
                                </div>
                            )}
                        </div>

                        <div className="flex-1 relative">
                            {activeTab === 'write' ? (
                                <textarea
                                    ref={textareaRef}
                                    value={page.content || ''}
                                    onChange={(e) => setPage({ ...page, content: e.target.value })}
                                    className="w-full h-full p-6 resize-none focus:outline-none font-mono text-sm text-gray-900 leading-relaxed placeholder:text-gray-400"
                                    placeholder="Write your page content here... (Markdown supported)"
                                />
                            ) : (
                                <div className="prose prose-blue max-w-none p-8 overflow-y-auto h-full">
                                    <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} rehypePlugins={[rehypeRaw]}>
                                        {page.content || ''}
                                    </ReactMarkdown>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: SEO Settings */}
                <div className="space-y-6">
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
                                    value={page.meta_title || ''}
                                    onChange={(e) => setPage({ ...page, meta_title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-900 placeholder:text-gray-400"
                                    placeholder={page.title || "Meta Title"}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Meta Description</label>
                                <textarea
                                    value={page.meta_description || ''}
                                    onChange={(e) => setPage({ ...page, meta_description: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-900 placeholder:text-gray-400"
                                    placeholder="Meta Description for search engines"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
