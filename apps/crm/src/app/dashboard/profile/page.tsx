"use client";

import { useActionState, useEffect, useState } from "react";
import { getProfile, updateProfile } from "./actions";
import { Loader2, User, Save } from "lucide-react";
import CloudinaryImageUpload from "@/components/ui/CloudinaryImageUpload";
import Image from "next/image";

export default function ProfilePage() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProfile().then(data => {
            setProfile(data);
            setLoading(false);
            if (data?.avatar_url) setAvatarUrl(data.avatar_url);
        });
    }, []);

    const [state, formAction, isPending] = useActionState(updateProfile, { message: "" });
    const [avatarUrl, setAvatarUrl] = useState("");

    if (loading) return <div className="p-12 text-center text-gray-400">Loading profile...</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-500 text-sm mt-1">Manage your public guide profile details.</p>
            </header>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <form action={formAction} className="p-8 space-y-8">
                    {state?.message && (
                        <div className={`text-sm p-4 rounded-lg ${state.message.includes("success") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                            {state.message}
                        </div>
                    )}

                    {/* Avatar Section */}
                    <div className="flex items-start gap-6">
                        <div className="shrink-0">
                            <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-white shadow-sm overflow-hidden relative">
                                {avatarUrl ? (
                                    <Image src={avatarUrl} alt="Avatar" fill className="object-cover" />
                                ) : (
                                    <User className="w-8 h-8 text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                )}
                            </div>
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
                            <input type="hidden" name="avatar_url" value={avatarUrl} />
                            <CloudinaryImageUpload
                                onUpload={(urls) => setAvatarUrl(urls[0])}
                                maxFiles={1}
                                folder="itinara/profiles"
                                label="Change Photo"
                            />
                            <p className="text-xs text-gray-500 mt-2">Recommended size: 500x500px.</p>
                        </div>
                    </div>

                    <div className="space-y-4 border-t border-gray-100 pt-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                name="full_name"
                                type="text"
                                defaultValue={profile?.full_name || ""}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                            <textarea
                                name="guide_bio"
                                rows={4}
                                defaultValue={profile?.guide_bio || ""}
                                placeholder="Tell travelers about yourself..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <p className="text-xs text-gray-500 mt-1">This will be displayed on your trip pages.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expertise (comma separated)</label>
                            <input
                                name="guide_expertise"
                                type="text"
                                defaultValue={profile?.guide_expertise?.join(", ") || ""}
                                placeholder="e.g. History, Food, Hiking"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
