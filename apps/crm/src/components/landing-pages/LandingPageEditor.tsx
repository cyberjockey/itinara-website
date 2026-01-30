'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    createLandingPage, updateLandingPage,
    type LandingPage, type PageBlock, type HeroBlock, type FeaturesBlock, type CTABlock, type RichtextBlock
} from '@/app/dashboard/landing-pages/actions';
import {
    Save, ArrowLeft, Loader2, Plus, Trash2, GripVertical,
    Image as ImageIcon, Type, LayoutGrid, MousePointerClick, FileText, Globe,
    ChevronDown, ChevronUp
} from 'lucide-react';
import Link from 'next/link';
import CloudinaryImageUpload from '@/components/ui/CloudinaryImageUpload';

const BLOCK_TYPES = [
    { type: 'hero', label: 'Hero Section', icon: ImageIcon, description: 'Large banner with title and CTA' },
    { type: 'features', label: 'Features Grid', icon: LayoutGrid, description: 'Grid of feature cards' },
    { type: 'cta', label: 'Call to Action', icon: MousePointerClick, description: 'Conversion focused section' },
    { type: 'richtext', label: 'Rich Text', icon: FileText, description: 'Markdown content block' },
] as const;

function createDefaultBlock(type: string): PageBlock {
    switch (type) {
        case 'hero':
            return { type: 'hero', data: { title: 'Your Headline Here', subtitle: '', backgroundImage: '', ctaText: 'Get Started', ctaUrl: '#' } };
        case 'features':
            return { type: 'features', data: { title: 'Features', items: [{ icon: '✨', title: 'Feature 1', description: 'Description here' }] } };
        case 'cta':
            return { type: 'cta', data: { title: 'Ready to Get Started?', description: '', buttonText: 'Sign Up Now', buttonUrl: '#', backgroundColor: '#4f46e5' } };
        case 'richtext':
            return { type: 'richtext', data: { content: '## Your Content Here\n\nStart writing...' } };
        default:
            return { type: 'richtext', data: { content: '' } };
    }
}

export function LandingPageEditor({ initialPage }: { initialPage?: LandingPage }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [expandedBlocks, setExpandedBlocks] = useState<Set<number>>(new Set([0]));

    const [page, setPage] = useState<{
        slug: string;
        title: string;
        content: PageBlock[];
        meta_title: string;
        meta_description: string;
        status: 'draft' | 'published' | 'archived';
    }>(initialPage ? {
        slug: initialPage.slug,
        title: initialPage.title,
        content: initialPage.content || [],
        meta_title: initialPage.meta_title || '',
        meta_description: initialPage.meta_description || '',
        status: initialPage.status,
    } : {
        slug: '',
        title: '',
        content: [],
        meta_title: '',
        meta_description: '',
        status: 'draft',
    });

    const generateSlug = (title: string) => {
        return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        if (!initialPage || !page.slug) {
            setPage(prev => ({ ...prev, title: newTitle, slug: generateSlug(newTitle) }));
        } else {
            setPage(prev => ({ ...prev, title: newTitle }));
        }
    };

    const addBlock = (type: string) => {
        const newBlock = createDefaultBlock(type);
        const newIndex = page.content.length;
        setPage(prev => ({ ...prev, content: [...prev.content, newBlock] }));
        setExpandedBlocks(prev => new Set([...prev, newIndex]));
    };

    const removeBlock = (index: number) => {
        setPage(prev => ({
            ...prev,
            content: prev.content.filter((_, i) => i !== index)
        }));
    };

    const updateBlock = (index: number, newData: PageBlock['data']) => {
        setPage(prev => ({
            ...prev,
            content: prev.content.map((block, i) =>
                i === index ? { ...block, data: newData } as PageBlock : block
            )
        }));
    };

    const moveBlock = (index: number, direction: 'up' | 'down') => {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= page.content.length) return;

        const newContent = [...page.content];
        [newContent[index], newContent[newIndex]] = [newContent[newIndex], newContent[index]];
        setPage(prev => ({ ...prev, content: newContent }));
    };

    const toggleExpand = (index: number) => {
        setExpandedBlocks(prev => {
            const next = new Set(prev);
            if (next.has(index)) next.delete(index);
            else next.add(index);
            return next;
        });
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            if (initialPage?.id) {
                await updateLandingPage(initialPage.id, page);
            } else {
                await createLandingPage(page);
            }
        } catch (error) {
            console.error('Error saving landing page:', error);
            alert('Failed to save landing page.');
            setLoading(false);
        }
    };

    const renderBlockEditor = (block: PageBlock, index: number) => {
        const isExpanded = expandedBlocks.has(index);

        return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-b border-gray-200">
                    <GripVertical className="w-4 h-4 text-gray-400 cursor-grab" />
                    <div className="flex-1">
                        <span className="text-sm font-medium text-gray-700 capitalize">{block.type}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <button onClick={() => moveBlock(index, 'up')} disabled={index === 0} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30" title="Move up">
                            <ChevronUp className="w-4 h-4" />
                        </button>
                        <button onClick={() => moveBlock(index, 'down')} disabled={index === page.content.length - 1} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30" title="Move down">
                            <ChevronDown className="w-4 h-4" />
                        </button>
                        <button onClick={() => toggleExpand(index)} className="p-1 hover:bg-gray-200 rounded">
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        <button onClick={() => removeBlock(index)} className="p-1 hover:bg-red-100 text-red-600 rounded" title="Remove block">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {isExpanded && (
                    <div className="p-4 space-y-4">
                        {block.type === 'hero' && (
                            <>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={(block as HeroBlock).data.title}
                                        onChange={(e) => updateBlock(index, { ...(block as HeroBlock).data, title: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Subtitle</label>
                                    <input
                                        type="text"
                                        value={(block as HeroBlock).data.subtitle || ''}
                                        onChange={(e) => updateBlock(index, { ...(block as HeroBlock).data, subtitle: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Background Image</label>
                                    <CloudinaryImageUpload
                                        onUpload={(urls) => updateBlock(index, { ...(block as HeroBlock).data, backgroundImage: urls[0] || '' })}
                                        defaultValue={(block as HeroBlock).data.backgroundImage ? [(block as HeroBlock).data.backgroundImage!] : []}
                                        maxFiles={1}
                                        folder="itinara/landing-pages"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">CTA Button Text</label>
                                        <input
                                            type="text"
                                            value={(block as HeroBlock).data.ctaText || ''}
                                            onChange={(e) => updateBlock(index, { ...(block as HeroBlock).data, ctaText: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">CTA Button URL</label>
                                        <input
                                            type="text"
                                            value={(block as HeroBlock).data.ctaUrl || ''}
                                            onChange={(e) => updateBlock(index, { ...(block as HeroBlock).data, ctaUrl: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {block.type === 'cta' && (
                            <>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={(block as CTABlock).data.title}
                                        onChange={(e) => updateBlock(index, { ...(block as CTABlock).data, title: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        value={(block as CTABlock).data.description || ''}
                                        onChange={(e) => updateBlock(index, { ...(block as CTABlock).data, description: e.target.value })}
                                        rows={2}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Button Text</label>
                                        <input
                                            type="text"
                                            value={(block as CTABlock).data.buttonText}
                                            onChange={(e) => updateBlock(index, { ...(block as CTABlock).data, buttonText: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Button URL</label>
                                        <input
                                            type="text"
                                            value={(block as CTABlock).data.buttonUrl}
                                            onChange={(e) => updateBlock(index, { ...(block as CTABlock).data, buttonUrl: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Background Color</label>
                                    <input
                                        type="color"
                                        value={(block as CTABlock).data.backgroundColor || '#4f46e5'}
                                        onChange={(e) => updateBlock(index, { ...(block as CTABlock).data, backgroundColor: e.target.value })}
                                        className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
                                    />
                                </div>
                            </>
                        )}

                        {block.type === 'richtext' && (
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Content (Markdown)</label>
                                <textarea
                                    value={(block as RichtextBlock).data.content}
                                    onChange={(e) => updateBlock(index, { ...(block as RichtextBlock).data, content: e.target.value })}
                                    rows={8}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                                    placeholder="Write your content here..."
                                />
                            </div>
                        )}

                        {block.type === 'features' && (
                            <>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Section Title</label>
                                    <input
                                        type="text"
                                        value={(block as FeaturesBlock).data.title || ''}
                                        onChange={(e) => updateBlock(index, { ...(block as FeaturesBlock).data, title: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="block text-xs font-medium text-gray-700">Feature Items</label>
                                    {(block as FeaturesBlock).data.items.map((item, itemIndex) => (
                                        <div key={itemIndex} className="p-3 bg-gray-50 rounded-lg space-y-2">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={item.icon || ''}
                                                    onChange={(e) => {
                                                        const newItems = [...(block as FeaturesBlock).data.items];
                                                        newItems[itemIndex] = { ...newItems[itemIndex], icon: e.target.value };
                                                        updateBlock(index, { ...(block as FeaturesBlock).data, items: newItems });
                                                    }}
                                                    placeholder="Icon (emoji)"
                                                    className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                                                />
                                                <input
                                                    type="text"
                                                    value={item.title}
                                                    onChange={(e) => {
                                                        const newItems = [...(block as FeaturesBlock).data.items];
                                                        newItems[itemIndex] = { ...newItems[itemIndex], title: e.target.value };
                                                        updateBlock(index, { ...(block as FeaturesBlock).data, items: newItems });
                                                    }}
                                                    placeholder="Title"
                                                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                                                />
                                                <button
                                                    onClick={() => {
                                                        const newItems = (block as FeaturesBlock).data.items.filter((_, i) => i !== itemIndex);
                                                        updateBlock(index, { ...(block as FeaturesBlock).data, items: newItems });
                                                    }}
                                                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <textarea
                                                value={item.description}
                                                onChange={(e) => {
                                                    const newItems = [...(block as FeaturesBlock).data.items];
                                                    newItems[itemIndex] = { ...newItems[itemIndex], description: e.target.value };
                                                    updateBlock(index, { ...(block as FeaturesBlock).data, items: newItems });
                                                }}
                                                placeholder="Description"
                                                rows={2}
                                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                            />
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => {
                                            const newItems = [...(block as FeaturesBlock).data.items, { icon: '⭐', title: '', description: '' }];
                                            updateBlock(index, { ...(block as FeaturesBlock).data, items: newItems });
                                        }}
                                        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                                    >
                                        <Plus className="w-3 h-3" /> Add Feature
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            {/* Header */}
            <header className="fixed top-0 right-0 left-0 md:left-64 z-10 bg-white border-b border-gray-200 px-4 md:px-8 py-4 flex items-center justify-between transition-all duration-300">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/landing-pages" className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-xl font-bold text-gray-900 line-clamp-1">
                        {initialPage ? 'Edit Landing Page' : 'New Landing Page'}
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={page.status}
                        onChange={(e) => setPage({ ...page, status: e.target.value as 'draft' | 'published' | 'archived' })}
                        className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700"
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                    </select>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 md:px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save
                    </button>
                </div>
            </header>

            <div className="mt-20 space-y-6">
                {/* Title & Slug */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
                        <input
                            type="text"
                            value={page.title}
                            onChange={handleTitleChange}
                            className="w-full px-4 py-2 text-lg font-bold text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g., Summer Sale 2026"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Slug (URL)</label>
                            <div className="flex items-center">
                                <span className="bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg px-3 py-2 text-gray-500 text-sm">/promotion/</span>
                                <input
                                    type="text"
                                    value={page.slug}
                                    onChange={(e) => setPage({ ...page, slug: e.target.value })}
                                    className="flex-1 px-3 py-2 text-gray-900 border border-gray-300 rounded-r-lg text-sm font-mono"
                                    placeholder="summer-sale-2026"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Meta Title</label>
                            <input
                                type="text"
                                value={page.meta_title}
                                onChange={(e) => setPage({ ...page, meta_title: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                placeholder="SEO title"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Meta Description</label>
                        <textarea
                            value={page.meta_description}
                            onChange={(e) => setPage({ ...page, meta_description: e.target.value })}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="SEO description"
                        />
                    </div>
                </div>

                {/* Blocks */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-gray-900">Page Blocks</h2>

                    {page.content.map((block, index) => renderBlockEditor(block, index))}

                    {/* Add Block */}
                    <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6">
                        <p className="text-sm text-gray-500 text-center mb-4">Add a new section to your page</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {BLOCK_TYPES.map((blockType) => (
                                <button
                                    key={blockType.type}
                                    onClick={() => addBlock(blockType.type)}
                                    className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-sm transition-all"
                                >
                                    <blockType.icon className="w-6 h-6 text-gray-600" />
                                    <span className="text-xs font-medium text-gray-700">{blockType.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
