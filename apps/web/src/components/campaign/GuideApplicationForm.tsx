"use client";

import { useState } from "react";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { submitGuideApplication } from "@/app/actions/campaign";

export function GuideApplicationForm() {
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (formData: FormData) => {
        setStatus("submitting");
        setErrorMessage("");

        try {
            const result = await submitGuideApplication(formData);
            if (result.success) {
                setStatus("success");
            }
        } catch (error: any) {
            console.error("Application error:", error);
            setStatus("error");
            setErrorMessage(error.message || "Failed to submit application");
        }
    };

    if (status === "success") {
        return (
            <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                <div className="flex justify-center mb-4">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Application Received!</h3>
                <p className="text-gray-600">
                    Thank you for applying to be an Itinara Local Guide.
                    Our team will review your portfolio and get back to you via email within 3-5 business days.
                </p>
            </div>
        );
    }

    return (
        <form action={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            {status === "error" && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                    <p>{errorMessage}</p>
                </div>
            )}

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">Full Name</label>
                <input
                    name="fullName"
                    type="text"
                    required
                    placeholder="e.g. Sarah Tan"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">Email Address</label>
                <input
                    name="email"
                    type="email"
                    required
                    placeholder="e.g. sarah@example.com"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">Portfolio URL / Social Media</label>
                <input
                    name="portfolioUrl"
                    type="url"
                    placeholder="e.g. instagram.com/sarahtravels or linkedin.com/in/sarah"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
                <p className="text-xs text-gray-500">Share a link where we can see your travel content or photography.</p>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">Why do you want to be a guide?</label>
                <textarea
                    name="experience"
                    required
                    rows={4}
                    placeholder="Tell us about your local knowledge and experience creating itineraries..."
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                />
            </div>

            <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {status === "submitting" ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting...
                    </>
                ) : (
                    "Submit Application"
                )}
            </button>
        </form>
    );
}
