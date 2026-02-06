import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';
import Link from 'next/link';

type HeroBlock = {
    type: 'hero';
    data: {
        title: string;
        subtitle?: string;
        backgroundImage?: string;
        ctaText?: string;
        ctaUrl?: string;
    };
};

type FeaturesBlock = {
    type: 'features';
    data: {
        title?: string;
        items: Array<{
            icon?: string;
            title: string;
            description: string;
        }>;
    };
};

type CTABlock = {
    type: 'cta';
    data: {
        title: string;
        description?: string;
        buttonText: string;
        buttonUrl: string;
        backgroundColor?: string;
    };
};

type RichtextBlock = {
    type: 'richtext';
    data: {
        content: string;
    };
};

type GalleryBlock = {
    type: 'gallery';
    data: {
        images: string[];
    };
};

type PageBlock = HeroBlock | FeaturesBlock | CTABlock | RichtextBlock | GalleryBlock;

export type LandingPage = {
    id: string;
    slug: string;
    title: string;
    content: PageBlock[];
    meta_title: string | null;
    meta_description: string | null;
    status: string;
};

function HeroSection({ data }: { data: HeroBlock['data'] }) {
    return (
        <section
            className="relative min-h-[60vh] flex items-center justify-center text-center bg-cover bg-center"
            style={{
                backgroundImage: data.backgroundImage ? `url(${data.backgroundImage})` : undefined,
                backgroundColor: data.backgroundImage ? undefined : '#1e293b'
            }}
        >
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-heading">
                    {data.title}
                </h1>
                {data.subtitle && (
                    <p className="text-xl md:text-2xl text-white/90 mb-8">
                        {data.subtitle}
                    </p>
                )}
                {data.ctaText && data.ctaUrl && (
                    <Link
                        href={data.ctaUrl}
                        className="inline-block bg-terracotta hover:bg-terracotta/90 text-white font-semibold px-8 py-4 rounded-full text-lg transition-colors shadow-lg"
                    >
                        {data.ctaText}
                    </Link>
                )}
            </div>
        </section>
    );
}

function FeaturesSection({ data }: { data: FeaturesBlock['data'] }) {
    return (
        <section className="py-20 bg-warm-sand">
            <div className="max-w-6xl mx-auto px-6">
                {data.title && (
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-deep-teak mb-12 font-heading">
                        {data.title}
                    </h2>
                )}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {data.items.map((item, index) => (
                        <div key={index} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
                            {item.icon && (
                                <div className="text-4xl mb-4">{item.icon}</div>
                            )}
                            <h3 className="text-xl font-bold text-deep-teak mb-3">{item.title}</h3>
                            <p className="text-stone-600">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function CTASection({ data }: { data: CTABlock['data'] }) {
    return (
        <section
            className="py-20"
            style={{ backgroundColor: data.backgroundColor || '#4f46e5' }}
        >
            <div className="max-w-4xl mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-heading">
                    {data.title}
                </h2>
                {data.description && (
                    <p className="text-xl text-white/90 mb-8">
                        {data.description}
                    </p>
                )}
                <Link
                    href={data.buttonUrl}
                    className="inline-block bg-white text-deep-teak font-semibold px-8 py-4 rounded-full text-lg hover:bg-white/90 transition-colors shadow-lg"
                >
                    {data.buttonText}
                </Link>
            </div>
        </section>
    );
}

function RichtextSection({ data }: { data: RichtextBlock['data'] }) {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-6">
                <div className="prose prose-lg prose-stone max-w-none">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkBreaks]}
                        rehypePlugins={[rehypeRaw]}
                    >
                        {data.content}
                    </ReactMarkdown>
                </div>
            </div>
        </section>
    );
}

function GallerySection({ data }: { data: GalleryBlock['data'] }) {
    return (
        <section className="py-16 bg-warm-sand">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {data.images.map((image, index) => (
                        <div key={index} className="aspect-square rounded-xl overflow-hidden shadow-md">
                            <img
                                src={image}
                                alt={`Gallery image ${index + 1}`}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function renderBlock(block: PageBlock, index: number) {
    switch (block.type) {
        case 'hero':
            return <HeroSection key={index} data={(block as HeroBlock).data} />;
        case 'features':
            return <FeaturesSection key={index} data={(block as FeaturesBlock).data} />;
        case 'cta':
            return <CTASection key={index} data={(block as CTABlock).data} />;
        case 'richtext':
            return <RichtextSection key={index} data={(block as RichtextBlock).data} />;
        case 'gallery':
            return <GallerySection key={index} data={(block as GalleryBlock).data} />;
        default:
            return null;
    }
}

export function LandingPageRenderer({ page }: { page: LandingPage }) {
    return (
        <main className="min-h-screen">
            {page.content.map((block, index) => renderBlock(block as PageBlock, index))}
        </main>
    );
}
