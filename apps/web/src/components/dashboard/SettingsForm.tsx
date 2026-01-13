"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateProfile } from "@/app/dashboard/settings/actions";
import { User, Save, Globe, Loader2 } from "lucide-react";

export function SettingsForm() {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState("");

    // Form State
    const [fullName, setFullName] = useState("");
    const [website, setWebsite] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        async function fetchProfile() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setEmail(user.email || "");
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (profile) {
                    setFullName(profile.full_name || "");
                    setWebsite(profile.website || "");
                    setAvatarUrl(profile.avatar_url || "");
                }
            }
            setLoading(false);
        }
        fetchProfile();
    }, [supabase]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdating(true);
        setMessage("");

        const formData = new FormData();
        formData.append("fullName", fullName);
        formData.append("website", website);
        formData.append("avatarUrl", avatarUrl);

        const result = await updateProfile(formData);

        if (result.message === "success") {
            setMessage("Profile updated successfully!");
        } else {
            setMessage(result.message);
        }
        setUpdating(false);
    };

    if (loading) {
        return <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-terracotta" /></div>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 rounded-full bg-stone-gray/10 flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
                    {avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                        <User className="w-10 h-10 text-stone-gray/50" />
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-stone-gray mb-1">Avatar URL</label>
                    <input
                        type="url"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        placeholder="https://example.com/photo.jpg"
                        className="w-full max-w-md px-4 py-2 rounded-xl border border-stone-gray/20 focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none text-sm"
                    />
                    <p className="text-xs text-stone-gray/50 mt-1">Paste a link to your profile photo.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-deep-teak mb-2">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-gray/50" />
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-gray/20 focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none transition-all"
                            placeholder="Your Name"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-deep-teak mb-2">Website</label>
                    <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-gray/50" />
                        <input
                            type="url"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-gray/20 focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none transition-all"
                            placeholder="https://yourwebsite.com"
                        />
                    </div>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-deep-teak mb-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        disabled
                        className="w-full px-4 py-3 rounded-xl border border-stone-gray/10 bg-stone-gray/5 text-stone-gray cursor-not-allowed"
                    />
                    <p className="text-xs text-stone-gray/50 mt-1">Email cannot be changed.</p>
                </div>
            </div>

            <div className="pt-6 border-t border-stone-gray/10 flex items-center justify-between">
                <p className={`text-sm font-medium ${message.includes("success") ? "text-green-600" : "text-red-500"}`}>
                    {message}
                </p>
                <button
                    type="submit"
                    disabled={updating}
                    className="flex items-center gap-2 px-6 py-3 bg-terracotta text-white font-bold rounded-xl hover:bg-deep-teak transition-colors disabled:opacity-70"
                >
                    {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Save Changes
                </button>
            </div>
        </form>
    );
}
