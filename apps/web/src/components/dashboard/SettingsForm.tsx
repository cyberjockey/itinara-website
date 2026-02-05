"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { getImageUrl } from "@/lib/utils";
import NextImage from "next/image";
import { updateProfile } from "@/app/dashboard/settings/actions";
import { User, Save, Globe, Loader2 } from "lucide-react";
import { RankBadge } from "@/components/ui/RankBadge";
import { RankProgress } from "@/components/ui/RankProgress";

export function SettingsForm() {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState("");

    // Form State
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [fullName, setFullName] = useState("");
    const [website, setWebsite] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [email, setEmail] = useState("");

    // File Upload State
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Rank State
    const [rankPoints, setRankPoints] = useState(0);
    const [rankTier, setRankTier] = useState("Newcomer");

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
                    setFirstName(profile.first_name || "");
                    setLastName(profile.last_name || "");
                    setPhoneNumber(profile.phone_number || "");
                    setFullName(profile.full_name || "");
                    setWebsite(profile.website || "");
                    setAvatarUrl(profile.avatar_url || "");
                    setRankPoints(profile.rank_points || 0);
                    setRankTier(profile.rank_tier || "Newcomer");
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
        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("phoneNumber", phoneNumber);
        formData.append("website", website);

        if (avatarFile) {
            formData.append("avatarFile", avatarFile);
        }

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
                <div className="w-24 h-24 rounded-full bg-stone-gray/10 flex items-center justify-center overflow-hidden border-2 border-white shadow-md relative group">
                    {(previewUrl || avatarUrl) ? (
                        <NextImage
                            src={getImageUrl(previewUrl || avatarUrl, "/images/placeholder-avatar.png")}
                            alt="Avatar"
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <User className="w-10 h-10 text-stone-gray/50" />
                    )}

                    {/* Overlay for hover effect */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-deep-teak mb-2">Profile Photo</label>
                    <div className="relative">
                        <input
                            type="file"
                            accept="image/png, image/jpeg, image/webp"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    if (file.size > 2 * 1024 * 1024) {
                                        setMessage("Image size must be less than 2MB");
                                        return;
                                    }
                                    setAvatarFile(file);
                                    setPreviewUrl(URL.createObjectURL(file));
                                    setMessage(""); // Clear error if any
                                }
                            }}
                            className="block w-full text-sm text-stone-gray
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-terracotta/10 file:text-terracotta
                                hover:file:bg-terracotta/20
                                cursor-pointer
                            "
                        />
                    </div>
                    <p className="text-xs text-stone-gray/50 mt-2">
                        JPG, PNG or WebP. Max 2MB.
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-deep-teak mb-2">First Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-gray/50" />
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-gray/20 focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none transition-all"
                            placeholder="John"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-deep-teak mb-2">Last Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-gray/50" />
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-gray/20 focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none transition-all"
                            placeholder="Doe"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-deep-teak mb-2">Phone Number</label>
                    <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+62 812 3456 7890"
                        className="w-full px-4 py-3 rounded-xl border border-stone-gray/20 focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none transition-all"
                    />
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

                <div className="md:col-span-2 p-6 bg-gradient-to-br from-terracotta/5 via-deep-teak/5 to-rice-paddy-green/5 rounded-xl border border-terracotta/20">
                    <label className="block text-sm font-bold text-deep-teak mb-4">Your Rank Progress</label>
                    <RankProgress currentTier={rankTier} currentPoints={rankPoints} />
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
