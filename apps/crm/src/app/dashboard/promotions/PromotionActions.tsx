"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Power } from "lucide-react";
import Link from "next/link";
import { toggleCarouselItemStatus, deleteCarouselItem } from "./actions";
import { useTransition } from "react";
import { toast } from "sonner"; // Assuming sonner is used, or basic alert if not

export function PromotionActions({ id, isActive }: { id: string; isActive: boolean }) {
    const [isPending, startTransition] = useTransition();

    const handleToggleStatus = () => {
        startTransition(async () => {
            try {
                await toggleCarouselItemStatus(id, !isActive);
            } catch (error) {
                console.error("Failed to toggle status", error);
            }
        });
    };

    const handleDelete = () => {
        if (!confirm("Are you sure you want to delete this slide?")) return;

        startTransition(async () => {
            try {
                await deleteCarouselItem(id);
            } catch (error) {
                console.error("Failed to delete item", error);
            }
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <Link href={`/dashboard/promotions/editor?id=${id}`}>
                    <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                    </DropdownMenuItem>
                </Link>
                <DropdownMenuItem
                    onSelect={(e) => {
                        e.preventDefault();
                        handleToggleStatus();
                    }}
                    disabled={isPending}
                >
                    <Power className="mr-2 h-4 w-4" />
                    {isActive ? "Deactivate" : "Activate"}
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="text-red-600"
                    onSelect={(e) => {
                        e.preventDefault();
                        handleDelete();
                    }}
                    disabled={isPending}
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
