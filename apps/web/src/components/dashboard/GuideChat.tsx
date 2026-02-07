"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import {
    Send,
    MessageCircle,
    Lock,
    User,
    CheckCircle2,
    Loader2,
    MapPin,
    Star,
    Clock,
    Paperclip,
    X,
    FileText,
    Image as ImageIcon,
    Download,
    Award,
    Sparkles,
    ShieldCheck
} from "lucide-react";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { format, formatDistanceToNow } from "date-fns";

interface Guide {
    id: string;
    full_name: string;
    avatar_url?: string;
    guide_bio?: string;
    guide_expertise?: string[];
    guide_verified?: boolean;
    total_trips?: number;
}

interface Message {
    id: string;
    sender_id: string;
    sender_role: "tourist" | "guide";
    content: string;
    created_at: string;
    read_at?: string;
    attachment_url?: string;
    attachment_type?: string;
    attachment_filename?: string;
}

interface Conversation {
    id: string;
    status: "active" | "closed" | "archived";
    guide: Guide;
}

interface GuideChatProps {
    trip: { id: string; trip_type?: string };
    tripStatus: string;
}

export function GuideChat({ trip, tripStatus }: GuideChatProps) {
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [guide, setGuide] = useState<Guide | null>(null);
    const [conversation, setConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [canChat, setCanChat] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [attachment, setAttachment] = useState<{ url: string; type: string; filename: string } | null>(null);
    const [isCurated, setIsCurated] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();

    // Fetch conversation and messages
    const fetchChat = useCallback(async () => {
        try {
            const res = await fetch(`/api/guide-chat?tripId=${trip.id}`);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to fetch chat");
            }

            setGuide(data.guide);
            setConversation(data.conversation);
            setMessages(data.messages || []);
            setCanChat(data.canChat);
            setIsCurated(data.isCurated);
        } catch (err) {
            setError(String(err));
        } finally {
            setLoading(false);
        }
    }, [trip.id]);

    // ... (Hooks unchanged)



    // Initial fetch
    useEffect(() => {
        fetchChat();
    }, [fetchChat]);

    // Subscribe to real-time messages
    useEffect(() => {
        if (!conversation?.id) return;

        const channel = supabase
            .channel(`guide-chat-${conversation.id}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "guide_messages",
                    filter: `conversation_id=eq.${conversation.id}`
                },
                (payload) => {
                    const newMsg = payload.new as Message;
                    // Play sound if message is from guide (incoming)
                    if (newMsg.sender_role === 'guide') {
                        try {
                            const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZGbXRhIBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbqWEzMzft9/h0XmFzg6vL0qWEbGlm4vH0sHJedISrzM6lhmxpZODw8q+CbmNj2e7uynhjamva7/CzenN0cdju77R6bnZ02e/wtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7v");
                            audio.volume = 0.5;
                            audio.play().catch(e => console.log("Audio play failed (user interaction needed first)", e));
                        } catch (e) { console.error(e); }
                    }

                    setMessages((prev: Message[]) => {
                        // Avoid duplicates
                        if (prev.some((m: Message) => m.id === newMsg.id)) return prev;
                        return [...prev, newMsg];
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [conversation?.id, supabase]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Handle file selection
    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/upload/telegram', {
                method: 'POST',
                body: formData
            });

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.json();

            // Determine type
            let type = 'document';
            if (file.type.startsWith('image/')) type = 'image';
            else if (file.type.startsWith('video/')) type = 'video';

            setAttachment({
                url: data.url, // Using public URL from previous fix
                type,
                filename: file.name
            });
        } catch (err) {
            console.error("Upload error:", err);
            setError("Failed to upload file");
        } finally {
            setUploading(false);
            // Clear input
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const clearAttachment = () => setAttachment(null);

    // Send message
    const handleSend = async () => {
        if ((!newMessage.trim() && !attachment) || sending || uploading) return;

        setSending(true);
        try {
            const res = await fetch("/api/guide-chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tripId: trip.id,
                    content: newMessage.trim(),
                    attachment_url: attachment?.url,
                    attachment_type: attachment?.type,
                    attachment_filename: attachment?.filename
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to send");
            }

            // Add message optimistically (real-time will also deliver it)
            if (data.message) {
                setMessages((prev: Message[]) => {
                    if (prev.some((m: Message) => m.id === data.message.id)) return prev;
                    return [...prev, data.message];
                });
            }

            setNewMessage("");
            setAttachment(null);

            // If this was first message, refetch to get conversation
            if (!conversation) {
                fetchChat();
            }
        } catch (err) {
            setError(String(err));
        } finally {
            setSending(false);
        }
    };

    // Not from a curated template (and no existing conversation)
    if (!loading && !guide && !conversation) {
        // Use trip prop to check VIP status directly for immediate feedback
        const isVip = trip.trip_type === 'vip';

        if (!canChat && !isVip) {
            // Not Curated and Not VIP
            return (
                <div className="h-full flex items-center justify-center p-8">
                    <div className="max-w-md text-center">
                        <div className="w-16 h-16 bg-stone-gray/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageCircle className="w-8 h-8 text-stone-gray/50" />
                        </div>
                        <h3 className="text-xl font-bold text-deep-teak mb-2">No Guide Available</h3>
                        <p className="text-stone-gray">
                            This trip isn&apos;t from a curated template. Guide chat is only available for trips that were
                            created from our local guides&apos; curated itineraries.
                        </p>
                    </div>
                </div>
            );
        } else {
            // Curated, but looking for guide details (or guide data load failed)
            // OR Source Template exists, but guide is deleted?
            // Actually, if canChat is true, it means guide is NOT null in route.ts?
            // Wait, route.ts returns canChat: trip.source_template_id !== null && guide !== null.
            // So if guide is null, canChat is FALSE.

            // I need to update my component to receive isCurated from API.
            // But component props don't have isCurated. 
            // Component fetches chat. 
            // Line 89: setCanChat(data.canChat);

            // I need to add state for isCurated.

            return (
                <div className="h-full flex items-center justify-center p-8">
                    <div className="max-w-md text-center">
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <User className="w-8 h-8 text-orange-500" />
                        </div>
                        <h3 className="text-xl font-bold text-deep-teak mb-2">Finding Your Guide</h3>
                        <p className="text-stone-gray">
                            This is a curated trip, but we&apos;re still connecting you with the local guide.
                            Please check back shortly or contact support if this persists.
                        </p>
                    </div>
                </div>
            );
        }
    }

    // Trip not active
    if (tripStatus !== 'active') {
        const isCompleted = tripStatus === 'completed';
        return (
            <div className="h-full flex items-center justify-center p-8">
                <div className="max-w-md text-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isCompleted ? 'bg-rice-paddy-green/10' : 'bg-stone-gray/10'}`}>
                        {isCompleted ? (
                            <CheckCircle2 className="w-8 h-8 text-rice-paddy-green" />
                        ) : (
                            <Lock className="w-8 h-8 text-stone-gray/50" />
                        )}
                    </div>
                    <h3 className="text-xl font-bold text-deep-teak mb-2">
                        {isCompleted ? "Trip Completed" : "Chat Locked"}
                    </h3>
                    <p className="text-stone-gray">
                        {isCompleted
                            ? "Your trip has ended. Thank you for traveling with our local guide!"
                            : "Commit your trip to start chatting with your local guide."
                        }
                    </p>
                </div>
            </div>
        );
    }

    // Not from a curated template (and no existing conversation)
    if (!loading && !guide && !conversation) {
        if (!isCurated) {
            return (
                <div className="h-full flex items-center justify-center p-8">
                    <div className="max-w-md text-center">
                        <div className="w-16 h-16 bg-stone-gray/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageCircle className="w-8 h-8 text-stone-gray/50" />
                        </div>
                        <h3 className="text-xl font-bold text-deep-teak mb-2">No Guide Available</h3>
                        <p className="text-stone-gray">
                            This trip isn&apos;t from a curated template. Guide chat is only available for trips that were
                            created from our local guides&apos; curated itineraries.
                        </p>
                    </div>
                </div>
            );
        }

        // Curated, but looking for guide details (or guide data load failed)
        return (
            <div className="h-full flex items-center justify-center p-8">
                <div className="max-w-md text-center">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-orange-500" />
                    </div>
                    <h3 className="text-xl font-bold text-deep-teak mb-2">Finding Your Guide</h3>
                    <p className="text-stone-gray">
                        This is a curated trip, but we&apos;re still connecting you with the local guide.
                        Please check back shortly or contact support if this persists.
                    </p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-terracotta animate-spin" />
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-warm-white">
            {/* Guide Header */}
            <div className="bg-white border-b border-stone-gray/10 p-4">
                <div className="max-w-3xl mx-auto flex items-center gap-4">
                    <div className="shrink-0">
                        {guide?.avatar_url ? (
                            <UserAvatar
                                avatarUrl={guide.avatar_url}
                                size="md"
                                className="mr-2"
                            />
                        ) : (
                            <div className="w-14 h-14 rounded-full bg-ocean-turquoise/10 flex items-center justify-center overflow-hidden mr-2">
                                <Image src="/logo.png" alt="Logo" width={56} height={56} className="w-full h-full object-cover opacity-50" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-deep-teak text-lg">{guide?.full_name || "Local Guide"}</h3>
                            {/* Badges Row */}
                            <div className="flex items-center gap-1.5">
                                {guide?.guide_verified && (
                                    <span className="bg-ocean-turquoise/10 text-ocean-turquoise text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5 border border-ocean-turquoise/20" title="Verified Guide">
                                        <CheckCircle2 className="w-2.5 h-2.5" />
                                        Verified
                                    </span>
                                )}
                            </div>
                        </div>
                        {guide?.guide_expertise && guide.guide_expertise.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                                {guide?.guide_expertise.slice(0, 3).map((exp: string, i: number) => (
                                    <span key={i} className="text-xs text-stone-gray bg-stone-gray/10 px-2 py-0.5 rounded-full">
                                        {exp}
                                    </span>
                                ))}
                            </div>
                        )}
                        {guide?.guide_bio && (
                            <p className="text-xs text-stone-gray mt-1 line-clamp-1">{guide.guide_bio}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="max-w-3xl mx-auto space-y-4">
                    {messages.length === 0 ? (
                        <div className="text-center py-12">
                            <MessageCircle className="w-12 h-12 text-stone-gray/30 mx-auto mb-3" />
                            <p className="text-stone-gray">
                                Start a conversation with your local guide!
                            </p>
                            <p className="text-xs text-stone-gray/60 mt-1">
                                Ask about local tips, hidden gems, or get help with your itinerary.
                            </p>
                        </div>
                    ) : (
                        messages.map((msg: Message) => (
                            <MessageBubble
                                key={msg.id}
                                message={msg}
                                isOwnMessage={msg.sender_role === "tourist"}
                                guide={guide!}
                            />
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-stone-gray/10 p-4">
                {/* Attachment Preview */}
                {attachment && (
                    <div className="max-w-3xl mx-auto mb-3 flex items-center gap-3 bg-stone-gray/5 p-2 rounded-lg relative animate-in slide-in-from-bottom-2">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-stone-gray/10 text-stone-gray">
                            {attachment.type === 'image' ? <ImageIcon className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{attachment.filename}</p>
                            <p className="text-xs text-stone-gray">Ready to send</p>
                        </div>
                        <button
                            onClick={clearAttachment}
                            className="p-1 hover:bg-stone-gray/10 rounded-full text-stone-gray"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                <div className="max-w-3xl mx-auto">
                    <form
                        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                        className="flex gap-3 items-end"
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading || sending}
                            className="p-3 text-stone-gray hover:text-deep-teak hover:bg-stone-gray/10 rounded-xl transition-colors disabled:opacity-50"
                            title="Attach file"
                        >
                            {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Paperclip className="w-5 h-5" />}
                        </button>
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 px-4 py-3 border border-stone-gray/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-ocean-turquoise/50 focus:border-ocean-turquoise"
                            disabled={sending}
                        />
                        <button
                            type="submit"
                            disabled={(!newMessage.trim() && !attachment) || sending || uploading}
                            className="px-6 py-3 bg-ocean-turquoise text-white rounded-xl hover:bg-ocean-turquoise/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 h-[50px]"
                        >
                            {sending ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                            Send
                        </button>
                    </form>
                </div>
            </div>

            {error && (
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg text-sm">
                    {error}
                </div>
            )}
        </div>
    );
}

function MessageBubble({ message, isOwnMessage, guide }: {
    message: Message;
    isOwnMessage: boolean;
    guide: Guide;
}) {
    return (
        <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] ${isOwnMessage ? 'order-2' : ''}`}>
                <div className={`rounded-2xl px-4 py-3 ${isOwnMessage
                    ? 'bg-teal-600 text-white rounded-br-md shadow-sm'
                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm'
                    }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    {message.attachment_url && (
                        <div className="mt-2">
                            {message.attachment_type === 'image' ? (
                                <Image
                                    src={message.attachment_url}
                                    alt="Attachment"
                                    width={300}
                                    height={200}
                                    className="max-w-full rounded-lg border border-black/10 mt-1 cursor-pointer hover:opacity-95"
                                    onClick={() => window.open(message.attachment_url, '_blank')}
                                    style={{ maxHeight: '200px' }}
                                />
                            ) : (
                                <a
                                    href={message.attachment_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-2 p-2 rounded-lg mt-1 border transition-colors ${isOwnMessage
                                        ? "bg-white/20 border-white/20 hover:bg-white/30"
                                        : "bg-stone-gray/5 border-stone-gray/10 hover:bg-stone-gray/10"
                                        }`}
                                >
                                    <FileText className="w-4 h-4" />
                                    <span className="text-xs truncate max-w-[150px] underline">
                                        {message.attachment_filename || "Attachment"}
                                    </span>
                                </a>
                            )}
                        </div>
                    )}
                </div>
                <div className={`flex items-center gap-1 mt-1 ${isOwnMessage ? 'justify-end' : ''}`}>
                    <span className={`text-xs ${isOwnMessage ? 'text-stone-gray/60' : 'text-stone-gray/60'}`}>
                        {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                    </span>
                    {isOwnMessage && message.read_at && (
                        <CheckCircle2 className="w-3 h-3 text-ocean-turquoise" />
                    )}
                </div>
            </div>
        </div>
    );
}
