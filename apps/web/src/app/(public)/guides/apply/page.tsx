import { Check, Camera, MapPin, Smartphone, Instagram } from "lucide-react";
import Image from "next/image";

export default function GuideApplyPage() {
    return (
        <div className="min-h-screen bg-stone-50 pb-20">
            {/* Hero Section with AI Background */}
            <div className="relative bg-deep-teak text-white pt-32 pb-24 px-4 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/local_guide_promo_bg.png"
                        alt="Indonesia Local Guide"
                        fill
                        className="object-cover opacity-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-deep-teak/30 via-deep-teak/60 to-deep-teak" />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-terracotta-100 text-sm font-bold mb-6 border border-white/20">
                        <span>🎥</span> Join Our Creator Network
                    </div>
                    <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 tracking-tight">
                        Become an Itinara <br /><span className="text-terracotta">Local Guide</span>
                    </h1>
                    <p className="text-xl text-stone-200 max-w-2xl mx-auto font-light">
                        Share your Indonesia travel expertise, get funded for VIP trips, and earn by creating premium itinerary templates for the world.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left Column: Requirements & Benefits */}
                    <div className="lg:col-span-5 space-y-8 mt-10">

                        {/* Requirements Card */}
                        <div className="bg-white p-8 rounded-3xl shadow-xl border border-stone-100">
                            <h3 className="text-2xl font-heading font-bold text-deep-teak mb-6">Who We Are Looking For</h3>
                            <ul className="space-y-4">
                                <li className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-red-600">
                                        <Camera className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-deep-teak">Indonesia Travel Vlogger</h4>
                                        <p className="text-sm text-stone-500">You create engaging video content about Indonesian destinations.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-600">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-deep-teak">Google Local Guide Level 5+</h4>
                                        <p className="text-sm text-stone-500">Proven track record of reviewing and mapping locations.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0 text-purple-600">
                                        <Instagram className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-deep-teak">Active Social Presence</h4>
                                        <p className="text-sm text-stone-500">Minimum 1k followers on Instagram or TikTok with high engagement.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* Benefits Summary */}
                        <div className="bg-deep-teak text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Smartphone className="w-32 h-32" />
                            </div>
                            <h3 className="text-xl font-bold mb-4 relative z-10">Why Join Itinara?</h3>
                            <ul className="space-y-3 relative z-10 text-stone-200">
                                <li className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-terracotta" />
                                    <span>Free VIP Trips (Quota: 10/mo)</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-terracotta" />
                                    <span>Earn Royalties on Templates</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-terracotta" />
                                    <span>Global Audience Exposure</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Column: Google Form */}
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 min-h-[800px] relative">
                            <div className="bg-stone-100 p-4 text-center border-b border-stone-200 text-sm text-stone-500">
                                Application Form
                            </div>
                            <iframe
                                src="https://docs.google.com/forms/d/e/1FAIpQLSfENjDYZG0jtHGM-Xb5jH-ednAbOb5Zaz4FPdwni1hMhDGjaA/viewform?embedded=true"
                                width="100%"
                                height="1401"
                                frameBorder="0"
                                marginHeight={0}
                                marginWidth={0}
                                className="w-full h-full min-h-[800px]"
                            >
                                Loading…
                            </iframe>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
