"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
    MessageCircle,
    User,
    MapPin,
    Calendar,
    CheckCircle2,
    XCircle,
    Search,
    Filter,
    Inbox
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

interface Conversation {
    id: string;
    status: "active" | "closed" | "archived";
    created_at: string;
    last_message_at: string;
    tourist: {
        id: string;
        full_name: string;
        avatar_url?: string;
        email?: string;
    };
    trip: {
        id: string;
        title: string;
        destination: string;
        start_date?: string;
        end_date?: string;
        status: string;
    };
    latestMessage?: {
        content: string;
        sender_role: "tourist" | "guide";
        created_at: string;
        attachment_url?: string;
        attachment_type?: string;
    };
    unreadCount: number;
}

interface GuideInboxClientProps {
    conversations: Conversation[];
    guideId: string;
}

export function GuideInboxClient({ conversations: initialConversations, guideId }: GuideInboxClientProps) {
    const [conversations, setConversations] = useState(initialConversations);
    const [filter, setFilter] = useState<"all" | "active" | "closed">("all");
    const [search, setSearch] = useState("");
    const supabase = createClient();

    // Realtime updates
    useEffect(() => {
        const channel = supabase
            .channel('guide-inbox-tracking')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'guide_messages'
                },
                (payload) => {
                    const newMsg = payload.new;
                    setConversations(prev => prev.map(conv => {
                        if (conv.id === newMsg.conversation_id) {
                            const isUnread = newMsg.sender_role === 'tourist' && !newMsg.read_at;
                            return {
                                ...conv,
                                last_message_at: newMsg.created_at,
                                unreadCount: conv.unreadCount + (isUnread ? 1 : 0),
                                latestMessage: {
                                    content: newMsg.content,
                                    sender_role: newMsg.sender_role,
                                    created_at: newMsg.created_at,
                                    attachment_url: newMsg.attachment_url,
                                    attachment_type: newMsg.attachment_type
                                }
                            };
                        }
                        return conv;
                    }).sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase]);

    const filteredConversations = conversations.filter(conv => {
        // Status filter
        if (filter === "active" && conv.status !== "active") return false;
        if (filter === "closed" && conv.status !== "closed") return false;

        // Search filter
        if (search) {
            const searchLower = search.toLowerCase();
            return (
                conv.tourist.full_name?.toLowerCase().includes(searchLower) ||
                conv.trip.title?.toLowerCase().includes(searchLower) ||
                conv.trip.destination?.toLowerCase().includes(searchLower)
            );
        }

        return true;
    });

    const activeCount = conversations.filter(c => c.status === "active").length;
    const closedCount = conversations.filter(c => c.status === "closed").length;
    const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Guide Inbox</h1>
                            <p className="text-gray-500 mt-1">Manage conversations with travelers</p>
                        </div>
                        {totalUnread > 0 && (
                            <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                                {totalUnread} unread message{totalUnread > 1 ? "s" : ""}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-6">
                {/* Filters & Search */}
                <div className="bg-white rounded-xl border p-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by traveler, trip, or destination..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilter("all")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === "all"
                                    ? "bg-teal-500 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                All ({conversations.length})
                            </button>
                            <button
                                onClick={() => setFilter("active")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === "active"
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                Active ({activeCount})
                            </button>
                            <button
                                onClick={() => setFilter("closed")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === "closed"
                                    ? "bg-gray-500 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                Closed ({closedCount})
                            </button>
                        </div>
                    </div>
                </div>

                {/* Conversations List */}
                {filteredConversations.length === 0 ? (
                    <div className="bg-white rounded-xl border p-12 text-center">
                        <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">No conversations yet</h3>
                        <p className="text-gray-500">
                            When travelers message you about their trips, they&apos;ll appear here.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredConversations.map((conv) => (
                            <ConversationCard key={conv.id} conversation={conv} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function ConversationCard({ conversation }: { conversation: Conversation }) {
    const { tourist, trip, latestMessage, unreadCount, status } = conversation;

    return (
        <Link
            href={`/dashboard/guide-inbox/${conversation.id}`}
            className={`block bg-white rounded-xl border p-5 hover:shadow-md transition-shadow ${unreadCount > 0 ? "border-teal-200 bg-teal-50/30" : ""
                }`}
        >
            <div className="flex items-start gap-4">
                {/* Avatar */}
                {tourist.avatar_url ? (
                    <img
                        src={tourist.avatar_url}
                        alt={tourist.full_name}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-400" />
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-900">{tourist.full_name || "Unknown Traveler"}</h3>
                            {unreadCount > 0 && (
                                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                    {unreadCount} new
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {status === "active" ? (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Active
                                </span>
                            ) : (
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full flex items-center gap-1">
                                    <XCircle className="w-3 h-3" />
                                    Closed
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Trip Info */}
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                        {trip ? (
                            <>
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {trip.destination || "Unknown Location"}
                                </span>
                                <span>•</span>
                                <span className="truncate">{trip.title || "Untitled Trip"}</span>
                                {trip.start_date && (
                                    <>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {format(new Date(trip.start_date), "MMM d, yyyy")}
                                        </span>
                                    </>
                                )}
                            </>
                        ) : (
                            <span className="italic">Trip details unavailable</span>
                        )}
                    </div>

                    {/* Latest Message */}
                    {latestMessage && (
                        <div className="mt-2 flex items-center gap-2">
                            <span className={`text-sm ${unreadCount > 0 ? "font-medium text-gray-900" : "text-gray-600"}`}>
                                {latestMessage.sender_role === "guide" && (
                                    <span className="text-teal-600">You: </span>
                                )}
                                {latestMessage.content ? (
                                    <span className="line-clamp-1">{latestMessage.content}</span>
                                ) : latestMessage.attachment_url ? (
                                    <span className="flex items-center gap-1 italic text-gray-500">
                                        {latestMessage.attachment_type === 'image' ? (
                                            <>📷 Image</>
                                        ) : (
                                            <>📎 Attachment</>
                                        )}
                                    </span>
                                ) : (
                                    <span className="italic">message</span>
                                )}
                            </span>
                            <span className="text-xs text-gray-400 flex-shrink-0">
                                {formatDistanceToNow(new Date(latestMessage.created_at), { addSuffix: true })}
                            </span>
                        </div>
                    )}
                </div>

                {/* Arrow */}
                <div className="text-gray-400">
                    <MessageCircle className="w-5 h-5" />
                </div>
            </div>
        </Link>
    );
}
