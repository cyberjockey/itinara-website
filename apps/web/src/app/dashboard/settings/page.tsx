"use client";

import { useState } from "react";
import { User, Save, Asterisk } from "lucide-react";
import { updateProfile } from "@/app/dashboard/settings/actions";
import { createClient } from "@/lib/supabase/client"; // Use client for initial fetch if needed, or pass prop. Here we'll use a wrapper or just fetch in useEffect.
// Actually, better to make this a Server Component that passes data to a Client Form.
import { SettingsForm } from "@/components/dashboard/SettingsForm";

export default function SettingsPage() {
    return (
        <div className="max-w-3xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-heading font-bold text-deep-teak mb-2">Account Settings</h1>
                <p className="text-stone-gray">Manage your profile and preferences.</p>
            </header>

            <div className="bg-white rounded-3xl p-8 border border-stone-gray/10 shadow-sm">
                <SettingsForm />
            </div>
        </div>
    );
}
