
import { Suspense } from "react";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { LoginForm } from "@/components/auth/LoginForm";
// import { login } from "@/app/login/actions";

export default function LoginPage() {
    return (
        <div className="min-h-screen relative flex flex-col">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/login-mosaic-v2.png"
                    alt="Indonesia Mosaic"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-deep-teak/40" />
            </div>

            <Navbar />

            <div className="flex-1 flex items-center justify-center px-4 relative z-10">
                <Suspense fallback={<div className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/20 w-full max-w-md h-[600px] animate-pulse" />}>
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    );
}
