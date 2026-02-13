import Link from 'next/link';
import Image from 'next/image';
import { Mail, MessageCircle } from 'lucide-react';

export function Footer() {
    const destinations = [
        { name: 'Bali', href: '/destinations/bali' },
        { name: 'Jakarta', href: '/destinations/jakarta' },
        { name: 'Yogyakarta', href: '/destinations/yogyakarta' },
        { name: 'West Java', href: '/destinations/west-java' },
        { name: 'Central Java', href: '/destinations/central-java' },
        { name: 'Lombok', href: '/destinations/lombok' },
    ];

    const legal = [
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Disclaimer', href: '/disclaimer' },
    ];

    return (
        <footer className="bg-deep-teak text-warm-white py-16 border-t border-white/10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-12 mb-12">
                    {/* Brand Column */}
                    <div>
                        <Link href="/" className="flex items-center gap-3 mb-6 group">
                            <div className="relative w-20 h-20 overflow-hidden rounded-full border-2 border-white/20 group-hover:border-terracotta/50 transition-colors">
                                <Image
                                    src="/logo.png"
                                    alt="ITINARA Logo"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <span className="text-2xl font-heading font-bold">ITINARA</span>
                        </Link>
                        <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                            Curated itineraries for the independent traveler.
                            Experience Indonesia with intention, freedom, and depth.
                        </p>
                        <div className="mt-6 flex items-center gap-4">
                            <span className="text-white/40 text-xs uppercase tracking-wider font-semibold">Supported by</span>
                            <div className="relative w-24 h-12">
                                <Image
                                    src="/images/wonderful-indonesia-logo.png"
                                    alt="Wonderful Indonesia"
                                    fill
                                    className="object-contain opacity-80 hover:opacity-100 transition-opacity"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Destinations Column */}
                    <div>
                        <h4 className="font-bold mb-4 text-sunrise-gold">Destinations</h4>
                        <ul className="space-y-2 text-sm text-white/70">
                            {destinations.map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="hover:text-white transition-colors">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div>
                        <h4 className="font-bold mb-4 text-sunrise-gold">Company</h4>
                        <ul className="space-y-2 text-sm text-white/70">
                            <li><Link href="/#about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="/#community" className="hover:text-white transition-colors">Community</Link></li>
                            <li><Link href="/#itineraries" className="hover:text-white transition-colors">How it Works</Link></li>
                        </ul>
                    </div>

                    {/* Legal Column */}
                    <div>
                        <h4 className="font-bold mb-4 text-sunrise-gold">Legal</h4>
                        <ul className="space-y-2 text-sm text-white/70">
                            {legal.map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="hover:text-white transition-colors">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div>
                        <h4 className="font-bold mb-4 text-sunrise-gold">Contact Us</h4>
                        <ul className="space-y-4 text-sm text-white/70">
                            <li>
                                <a
                                    href="https://wa.me/6281297362851"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-start gap-3 hover:text-white transition-colors group"
                                >
                                    <MessageCircle className="w-5 h-5 mt-0.5 text-terracotta group-hover:text-sunrise-gold transition-colors" />
                                    <span className="flex-1">
                                        <span className="block text-xs text-white/40 mb-0.5">WhatsApp</span>
                                        +62 812 9736 2851
                                    </span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="mailto:contact@itinaravacation.com"
                                    className="flex items-start gap-3 hover:text-white transition-colors group"
                                >
                                    <Mail className="w-5 h-5 mt-0.5 text-terracotta group-hover:text-sunrise-gold transition-colors" />
                                    <span className="flex-1">
                                        <span className="block text-xs text-white/40 mb-0.5">Email</span>
                                        contact@itinaravacation.com
                                    </span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
                    <p>© {new Date().getFullYear()} ITINARA. All rights reserved.</p>
                    <div className="flex gap-6">
                        {/* Social placeholders could go here */}
                        <span>Designed for travelers, by travelers.</span>
                    </div>
                </div>
            </div>
        </footer >
    );
}
