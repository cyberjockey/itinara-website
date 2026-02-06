"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Bell, Check, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string | null;
    link: string | null;
    read: boolean;
    created_at: string;
}

export function NotificationBell({ variant = "header" }: { variant?: "header" | "sidebar" }) {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    // Fetch notifications
    const fetchNotifications = async () => {
        try {
            const res = await fetch("/api/notifications?limit=10");
            const data = await res.json();
            setNotifications(data.notifications || []);
            setUnreadCount(data.unreadCount || 0);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchNotifications();
    }, []);

    // Subscribe to real-time notifications
    useEffect(() => {
        const channel = supabase
            .channel("user-notifications")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "notifications"
                },
                (payload) => {
                    const newNotif = payload.new as Notification;
                    setNotifications(prev => [newNotif, ...prev].slice(0, 10));
                    setUnreadCount(prev => prev + 1);
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "notifications"
                },
                (payload) => {
                    const updated = payload.new as Notification;
                    setNotifications(prev =>
                        prev.map(n => n.id === updated.id ? updated : n)
                    );
                    if (updated.read) {
                        setUnreadCount(prev => Math.max(0, prev - 1));
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase]);

    // Mark notification as read
    const markAsRead = async (id: string) => {
        try {
            await fetch(`/api/notifications/${id}/read`, { method: "POST" });
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Failed to mark as read:", error);
        }
    };

    // Mark notification as unread
    const markAsUnread = async (id: string) => {
        try {
            await fetch(`/api/notifications/${id}/unread`, { method: "POST" });
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, read: false } : n)
            );
            setUnreadCount(prev => prev + 1);
        } catch (error) {
            console.error("Failed to mark as unread:", error);
        }
    };

    // Mark all as read
    const markAllAsRead = async () => {
        try {
            await fetch("/api/notifications", { method: "POST" });
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error("Failed to mark all as read:", error);
        }
    };

    return (
        <div className="relative">
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-stone-gray/10 transition-colors"
            >
                <Bell className="w-5 h-5 text-stone-gray" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-5 h-5 bg-terracotta text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Panel */}
                    <div className={`absolute bg-white rounded-xl shadow-2xl border border-stone-gray/10 z-50 max-h-[500px] flex flex-col w-96
                        ${variant === 'sidebar'
                            ? 'top-0 left-full ml-4'
                            : 'top-full right-0 mt-2'
                        }
                    `}>
                        {/* Header */}
                        <div className="p-4 border-b border-stone-gray/10 flex items-center justify-between">
                            <h3 className="font-bold text-deep-teak">Notifications</h3>
                            <div className="flex items-center gap-2">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-xs text-ocean-turquoise hover:underline"
                                    >
                                        Mark all read
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 hover:bg-stone-gray/10 rounded-full"
                                >
                                    <X className="w-4 h-4 text-stone-gray" />
                                </button>
                            </div>
                        </div>

                        {/* Notifications List */}
                        <div className="flex-1 overflow-y-auto">
                            {loading ? (
                                <div className="p-8 text-center text-stone-gray text-sm">
                                    Loading...
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="p-8 text-center text-stone-gray text-sm">
                                    No notifications yet
                                </div>
                            ) : (
                                <div className="divide-y divide-stone-gray/10">
                                    {notifications.map((notif) => (
                                        <NotificationItem
                                            key={notif.id}
                                            notification={notif}
                                            onMarkAsRead={markAsRead}
                                            onMarkAsUnread={markAsUnread}
                                            onClose={() => setIsOpen(false)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

function NotificationItem({
    notification,
    onMarkAsRead,
    onMarkAsUnread,
    onClose
}: {
    notification: Notification;
    onMarkAsRead: (id: string) => void;
    onMarkAsUnread: (id: string) => void;
    onClose: () => void;
}) {
    const handleClick = () => {
        if (!notification.read) {
            onMarkAsRead(notification.id);
        }
        onClose();
    };

    const content = (
        <div
            className={`p-4 hover:bg-stone-gray/5 transition-colors cursor-pointer group ${!notification.read ? "bg-ocean-turquoise/5" : ""
                }`}
            onClick={handleClick}
        >
            <div className="flex items-start gap-3">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <p className="font-medium text-deep-teak text-sm">
                            {notification.title}
                        </p>
                        {!notification.read && (
                            <div className="w-2 h-2 bg-ocean-turquoise rounded-full" />
                        )}
                    </div>
                    {notification.message && (
                        <p className="text-xs text-stone-gray mt-1 line-clamp-2">
                            {notification.message}
                        </p>
                    )}
                    <p className="text-xs text-stone-gray/60 mt-1">
                        {formatDistanceToNow(new Date(notification.created_at), {
                            addSuffix: true
                        })}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {!notification.read ? (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onMarkAsRead(notification.id);
                            }}
                            className="p-1 hover:bg-ocean-turquoise/10 rounded-full text-ocean-turquoise"
                            title="Mark as read"
                        >
                            <Check className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onMarkAsUnread(notification.id);
                            }}
                            className="p-1 hover:bg-stone-gray/10 rounded-full text-stone-gray"
                            title="Mark as unread"
                        >
                            <div className="w-2.5 h-2.5 rounded-full border-2 border-current" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    if (notification.link) {
        return <Link href={notification.link}>{content}</Link>;
    }

    return content;
}
