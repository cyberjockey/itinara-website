"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
    ArrowLeft,
    Send,
    User,
    MapPin,
    Calendar,
    CheckCircle2,
    XCircle,
    Loader2,
    MessageCircle,
    Paperclip,
    Image as ImageIcon,
    FileText,
    X,
    Check
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

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

interface Tourist {
    id: string;
    full_name: string;
    avatar_url?: string;
    email?: string;
}

interface Trip {
    id: string;
    title: string;
    destination: string;
    start_date?: string;
    end_date?: string;
    status: string;
}

interface Conversation {
    id: string;
    status: "active" | "closed" | "archived";
    tourist: Tourist;
    trip: Trip;
}

interface ConversationDetailClientProps {
    conversation: Conversation;
    initialMessages: Message[];
    guideId: string;
}

export function ConversationDetailClient({
    conversation,
    initialMessages,
    guideId
}: ConversationDetailClientProps) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [newMessage, setNewMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [convStatus, setConvStatus] = useState(conversation.status);
    const [statusLoading, setStatusLoading] = useState(false);

    const [uploading, setUploading] = useState(false);
    const [attachment, setAttachment] = useState<{ url: string; type: string; filename: string } | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();

    const { tourist, trip } = conversation;

    // Subscribe to real-time messages
    useEffect(() => {
        const channel = supabase
            .channel(`guide-conv-${conversation.id}`)
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

                    // Play sound if message is from tourist (incoming)
                    if (newMsg.sender_role === 'tourist') {
                        try {
                            const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZGbXRhIBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbqWEzMzft9/h0XmFzg6vL0qWEbGlm4vH0sHJedISrzM6lhmxpZODw8q+CbmNj2e7uynhjamva7/CzenN0cdju77R6bnZ02e/wtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7vtHpyc3PY7u+0enNzdNjv8LR6cnNz2O7v");
                            audio.volume = 0.5;
                            audio.play().catch(e => console.log("Audio play failed (user interaction needed first)", e));
                        } catch (e) { console.error(e); }
                    }

                    setMessages(prev => {
                        if (prev.some(m => m.id === newMsg.id)) return prev;
                        return [...prev, newMsg];
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [conversation.id, supabase]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Handle File Drop / Select
    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            // Use the CRM upload route
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
                url: data.url,
                type,
                filename: file.name
            });
        } catch (err) {
            console.error("Upload error:", err);
            // Maybe show toast error here
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const clearAttachment = () => setAttachment(null);

    // Send message
    const handleSend = async () => {
        if ((!newMessage.trim() && !attachment) || sending || uploading) return;

        setSending(true);
        try {
            const { data, error } = await supabase
                .from("guide_messages")
                .insert({
                    conversation_id: conversation.id,
                    sender_id: guideId,
                    sender_role: "guide",

                    content: newMessage.trim(),
                    attachment_url: attachment?.url,
                    attachment_type: attachment?.type,
                    attachment_filename: attachment?.filename
                })
                .select()
                .single();

            if (error) throw error;

            // Add message optimistically
            if (data) {
                setMessages(prev => {
                    if (prev.some(m => m.id === data.id)) return prev;
                    return [...prev, data];
                });
            }

            setNewMessage("");
            setAttachment(null);
        } catch (err) {
            console.error("Failed to send:", err);
        } finally {
            setSending(false);
        }
    };

    // Update conversation status
    const handleStatusChange = async (newStatus: "active" | "closed") => {
        setStatusLoading(true);
        try {
            const { error } = await supabase
                .from("guide_conversations")
                .update({ status: newStatus })
                .eq("id", conversation.id);

            if (!error) {
                setConvStatus(newStatus);
            }
        } catch (err) {
            console.error("Failed to update status:", err);
        } finally {
            setStatusLoading(false);
        }
    };

    return (
        <div className="h-[calc(100vh-65px)] bg-gray-50 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-5xl mx-auto px-6 py-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard/guide-inbox"
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>

                        {/* Tourist Info */}
                        <div className="flex items-center gap-3 flex-1">
                            {tourist.avatar_url ? (
                                <img
                                    src={tourist.avatar_url}
                                    onError={(e) => {
                                        e.currentTarget.src = '/logo.svg';
                                        e.currentTarget.onerror = null;
                                    }}
                                    alt={tourist.full_name}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                                    <img src="/logo.svg" alt="Logo" className="w-full h-full object-cover opacity-50" />
                                </div>
                            )}
                            <div>
                                <h2 className="font-bold text-gray-900">{tourist.full_name || "Unknown Traveler"}</h2>
                                <p className="text-sm text-gray-500">{tourist.email}</p>
                            </div>
                        </div>

                        {/* Status Toggle */}
                        <div className="flex items-center gap-2">
                            {convStatus === "active" ? (
                                <button
                                    onClick={() => handleStatusChange("closed")}
                                    disabled={statusLoading}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm disabled:opacity-50"
                                >
                                    {statusLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                                    Close Conversation
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleStatusChange("active")}
                                    disabled={statusLoading}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm disabled:opacity-50"
                                >
                                    {statusLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                    Reopen Conversation
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex max-w-5xl mx-auto w-full">
                {/* Messages Area */}
                <div className="flex-1 flex flex-col bg-white border-x">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {messages.length === 0 ? (
                            <div className="text-center py-12">
                                <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">No messages yet</p>
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender_role === "guide" ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`max-w-[70%] ${msg.sender_role === "guide" ? "order-2" : ""}`}>
                                        <div className={`rounded-2xl px-4 py-3 ${msg.sender_role === "guide"
                                            ? "bg-teal-500 text-white rounded-br-md"
                                            : "bg-gray-100 text-gray-900 rounded-bl-md"
                                            }`}>
                                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                            {msg.attachment_url && (
                                                <div className="mt-2">
                                                    {msg.attachment_type === 'image' ? (
                                                        <img
                                                            src={msg.attachment_url}
                                                            alt="Attachment"
                                                            className="max-w-full rounded-lg border border-black/10 mt-1 cursor-pointer hover:opacity-95 bg-black/5"
                                                            onClick={() => window.open(msg.attachment_url, '_blank')}
                                                            style={{ maxHeight: '200px' }}
                                                        />
                                                    ) : (
                                                        <a
                                                            href={msg.attachment_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className={`flex items-center gap-2 p-2 rounded-lg mt-1 border transition-colors ${msg.sender_role === "guide"
                                                                ? "bg-white/20 border-white/20 hover:bg-white/30"
                                                                : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                                                                }`}
                                                        >
                                                            <FileText className="w-4 h-4" />
                                                            <span className="text-xs truncate max-w-[150px] underline">
                                                                {msg.attachment_filename || "Attachment"}
                                                            </span>
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <div className={`flex items-center gap-1 mt-1 ${msg.sender_role === "guide" ? "justify-end" : ""}`}>
                                            <span className="text-xs text-gray-400">
                                                {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                                            </span>
                                            {msg.sender_role === "guide" && (
                                                msg.read_at ? (
                                                    <CheckCircle2 className="w-3 h-3 text-teal-500" />
                                                ) : (
                                                    <Check className="w-3 h-3 text-gray-300" />
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="border-t p-4 bg-white">
                        {/* Attachment Preview */}
                        {attachment && (
                            <div className="mb-3 flex items-center gap-3 bg-gray-50 p-2 rounded-lg relative animate-in slide-in-from-bottom-2 border border-gray-100">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200 text-gray-400">
                                    {attachment.type === 'image' ? <ImageIcon className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate text-gray-700">{attachment.filename}</p>
                                    <p className="text-xs text-gray-400">Ready to send</p>
                                </div>
                                <button
                                    onClick={clearAttachment}
                                    className="p-1 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}
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
                                disabled={uploading || sending || convStatus === "closed"}
                                className="p-3 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-colors disabled:opacity-50 h-[50px] flex items-center justify-center border border-transparent hover:border-teal-200"
                                title="Attach file"
                            >
                                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Paperclip className="w-5 h-5" />}
                            </button>
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder={convStatus === "closed" ? "Reopen conversation to reply..." : "Type your reply..."}
                                disabled={sending || convStatus === "closed"}
                                className="flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                            />
                            <button
                                type="submit"
                                disabled={(!newMessage.trim() && !attachment) || sending || convStatus === "closed" || uploading}
                                className="px-6 py-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 h-[50px]"
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

                {/* Trip Sidebar */}
                <div className="w-80 bg-white border-r p-6 hidden lg:block">
                    <h3 className="font-bold text-gray-900 mb-4">Trip Details</h3>

                    {trip ? (
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-gray-500 uppercase mb-1">Trip Name</p>
                                <p className="font-medium text-gray-900">{trip.title}</p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500 uppercase mb-1">Destination</p>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    <p className="font-medium text-gray-900">{trip.destination}</p>
                                </div>
                            </div>

                            {trip.start_date && (
                                <div>
                                    <p className="text-xs text-gray-500 uppercase mb-1">Dates</p>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <p className="font-medium text-gray-900">
                                            {format(new Date(trip.start_date), "MMM d")}
                                            {trip.end_date && ` - ${format(new Date(trip.end_date), "MMM d, yyyy")}`}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div>
                                <p className="text-xs text-gray-500 uppercase mb-1">Status</p>
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${trip.status === "active"
                                    ? "bg-green-100 text-green-700"
                                    : trip.status === "completed"
                                        ? "bg-gray-100 text-gray-600"
                                        : "bg-yellow-100 text-yellow-700"
                                    }`}>
                                    {trip.status === "active" && <CheckCircle2 className="w-3 h-3" />}
                                    {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="text-gray-500 text-sm italic">
                            Trip details are unavailable. The trip may have been deleted.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
