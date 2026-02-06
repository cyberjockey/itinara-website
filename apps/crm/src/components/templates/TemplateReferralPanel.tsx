"use client";

import { useState, useEffect } from "react";
import { Copy, ExternalLink, TrendingUp, Eye, MousePointer, ShoppingCart, Users } from "lucide-react";
import { generateReferralLink, getReferralAnalytics, getRecentReferralEvents } from "@/app/dashboard/templates/referral-actions";

interface ReferralAnalytics {
    total_views: number;
    total_clicks: number;
    total_purchases: number;
    unique_visitors: number;
    conversion_rate: number;
    ref_code: string | null;
    created_at?: string;
}

interface ReferralEvent {
    id: string;
    event_type: 'view' | 'click' | 'purchase';
    created_at: string;
    metadata: any;
}

export function TemplateReferralPanel({ templateId }: { templateId: string }) {
    const [loading, setLoading] = useState(true);
    const [refUrl, setRefUrl] = useState<string | null>(null);
    const [analytics, setAnalytics] = useState<ReferralAnalytics | null>(null);
    const [recentEvents, setRecentEvents] = useState<ReferralEvent[]>([]);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        loadData();
    }, [templateId]);

    const loadData = async () => {
        setLoading(true);

        // Load referral link
        const linkResult = await generateReferralLink(templateId);
        if (linkResult.success && linkResult.url) {
            setRefUrl(linkResult.url);
        }

        // Load analytics
        const analyticsResult = await getReferralAnalytics(templateId);
        if (analyticsResult.success && analyticsResult.analytics) {
            setAnalytics(analyticsResult.analytics);
        }

        // Load recent events
        const eventsResult = await getRecentReferralEvents(templateId, 10);
        if (eventsResult.success && eventsResult.events) {
            setRecentEvents(eventsResult.events);
        }

        setLoading(false);
    };

    const copyToClipboard = () => {
        if (refUrl) {
            navigator.clipboard.writeText(refUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const shareToSocial = (platform: 'twitter' | 'facebook' | 'whatsapp') => {
        if (!refUrl) return;

        const text = "Check out this amazing travel itinerary template!";
        const urls = {
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(refUrl)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(refUrl)}`,
            whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + refUrl)}`,
        };

        window.open(urls[platform], '_blank', 'width=600,height=400');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Referral Link Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Referral Link</h3>

                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        value={refUrl || ''}
                        readOnly
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
                    />
                    <button
                        onClick={copyToClipboard}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <Copy className="w-4 h-4" />
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => shareToSocial('twitter')}
                        className="flex-1 px-4 py-2 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#1a8cd8] transition-colors text-sm"
                    >
                        Share on Twitter
                    </button>
                    <button
                        onClick={() => shareToSocial('facebook')}
                        className="flex-1 px-4 py-2 bg-[#4267B2] text-white rounded-lg hover:bg-[#365899] transition-colors text-sm"
                    >
                        Share on Facebook
                    </button>
                    <button
                        onClick={() => shareToSocial('whatsapp')}
                        className="flex-1 px-4 py-2 bg-[#25D366] text-white rounded-lg hover:bg-[#20bd5a] transition-colors text-sm"
                    >
                        Share on WhatsApp
                    </button>
                </div>
            </div>

            {/* Analytics Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={<Eye className="w-5 h-5" />}
                    label="Total Views"
                    value={analytics?.total_views || 0}
                    color="blue"
                />
                <StatCard
                    icon={<MousePointer className="w-5 h-5" />}
                    label="Clicks"
                    value={analytics?.total_clicks || 0}
                    color="purple"
                />
                <StatCard
                    icon={<ShoppingCart className="w-5 h-5" />}
                    label="Templates Used"
                    value={analytics?.total_purchases || 0}
                    color="green"
                />
                <StatCard
                    icon={<TrendingUp className="w-5 h-5" />}
                    label="Conversion Rate"
                    value={`${analytics?.conversion_rate || 0}%`}
                    color="orange"
                />
            </div>

            {/* Conversion Funnel */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Funnel</h3>

                <div className="space-y-3">
                    <FunnelStep
                        label="Page Views"
                        count={analytics?.total_views || 0}
                        percentage={100}
                        color="blue"
                    />
                    <FunnelStep
                        label="CTA Clicks"
                        count={analytics?.total_clicks || 0}
                        percentage={analytics?.total_views ? (analytics.total_clicks / analytics.total_views) * 100 : 0}
                        color="purple"
                    />
                    <FunnelStep
                        label="Templates Used"
                        count={analytics?.total_purchases || 0}
                        percentage={analytics?.total_views ? (analytics.total_purchases / analytics.total_views) * 100 : 0}
                        color="green"
                    />
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>

                {recentEvents.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-8">
                        No activity yet. Share your referral link to start tracking!
                    </p>
                ) : (
                    <div className="space-y-2">
                        {recentEvents.map((event) => (
                            <ActivityItem key={event.id} event={event} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number | string; color: string }) {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        purple: 'bg-purple-50 text-purple-600',
        green: 'bg-green-50 text-green-600',
        orange: 'bg-orange-50 text-orange-600',
    }[color];

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className={`inline-flex p-3 rounded-lg ${colorClasses} mb-3`}>
                {icon}
            </div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{label}</div>
        </div>
    );
}

function FunnelStep({ label, count, percentage, color }: { label: string; count: number; percentage: number; color: string }) {
    const colorClasses = {
        blue: 'bg-blue-500',
        purple: 'bg-purple-500',
        green: 'bg-green-500',
    }[color];

    return (
        <div>
            <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{label}</span>
                <span className="text-sm text-gray-500">{count} ({percentage.toFixed(1)}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                    className={`h-2 rounded-full ${colorClasses} transition-all duration-500`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                />
            </div>
        </div>
    );
}

function ActivityItem({ event }: { event: ReferralEvent }) {
    const getEventIcon = (type: string) => {
        switch (type) {
            case 'view': return <Eye className="w-4 h-4 text-blue-500" />;
            case 'click': return <MousePointer className="w-4 h-4 text-purple-500" />;
            case 'purchase': return <ShoppingCart className="w-4 h-4 text-green-500" />;
            default: return null;
        }
    };

    const getEventLabel = (type: string) => {
        switch (type) {
            case 'view': return 'Page viewed';
            case 'click': return 'CTA clicked';
            case 'purchase': return 'Template used';
            default: return type;
        }
    };

    const timeAgo = new Date(event.created_at).toLocaleString();

    return (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex-shrink-0">
                {getEventIcon(event.event_type)}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{getEventLabel(event.event_type)}</p>
                <p className="text-xs text-gray-500">{timeAgo}</p>
            </div>
        </div>
    );
}
