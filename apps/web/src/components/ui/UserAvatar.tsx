
"use client";

import Image from 'next/image';
import { User } from 'lucide-react';

interface UserAvatarProps {
    avatarUrl?: string | null;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export function UserAvatar({ avatarUrl, size = 'md', className = '' }: UserAvatarProps) {
    const sizeClasses = {
        sm: 'w-10 h-10',
        md: 'w-16 h-16',
        lg: 'w-32 h-32',
        xl: 'w-40 h-40'
    };

    return (
        <div className={`relative inline-flex items-center justify-center shrink-0 ${sizeClasses[size]} rounded-full bg-gray-100 overflow-hidden border border-gray-200 ${className}`}>
            {avatarUrl ? (
                <Image
                    src={avatarUrl}
                    alt="Profile"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                    <User className={size === 'lg' || size === 'xl' ? 'w-1/3 h-1/3' : 'w-1/2 h-1/2'} />
                </div>
            )}
        </div>
    );
}
