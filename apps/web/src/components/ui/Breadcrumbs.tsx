import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbsProps {
    items: {
        label: string;
        href: string;
    }[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.label,
            "item": `https://itinaravacation.com${item.href}`
        }))
    };

    return (
        <nav aria-label="Breadcrumb" className="text-sm font-medium text-stone-gray mb-6">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ol className="flex items-center space-x-2">
                <li>
                    <Link href="/" className="hover:text-deep-teak transition-colors flex items-center">
                        <Home className="w-4 h-4" />
                        <span className="sr-only">Home</span>
                    </Link>
                </li>
                {items.map((item, index) => (
                    <li key={item.href} className="flex items-center space-x-2">
                        <ChevronRight className="w-4 h-4 text-stone-gray/40" />
                        {index === items.length - 1 ? (
                            <span className="text-deep-teak font-bold truncate max-w-[200px] md:max-w-xs block" title={item.label}>
                                {item.label}
                            </span>
                        ) : (
                            <Link href={item.href} className="hover:text-deep-teak transition-colors">
                                {item.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
