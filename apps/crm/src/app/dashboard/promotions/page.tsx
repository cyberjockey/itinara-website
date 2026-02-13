import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getCarouselItems } from "./actions";
import { PromotionActions } from "./PromotionActions";
export default async function PromotionsPage() {
    const items = await getCarouselItems();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-deep-teak">Promotions</h1>
                    <p className="text-stone-gray">Manage homepage promotional carousel slides.</p>
                </div>
                <Link href="/dashboard/promotions/editor">
                    <Button className="bg-deep-teak text-white hover:bg-terracotta">
                        <Plus className="mr-2 h-4 w-4" />
                        New Slide
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-lg border shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>CTA Link</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Last Modified</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items?.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.order_index}</TableCell>
                                <TableCell>{item.title}</TableCell>
                                <TableCell>
                                    <Badge variant={item.is_active ? "default" : "secondary"}>
                                        {item.is_active ? "Active" : "Inactive"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-stone-500 font-mono text-xs">
                                    {item.cta_link || "-"}
                                </TableCell>
                                <TableCell className="text-stone-500 text-sm">
                                    {new Date(item.created_at).toLocaleString()}
                                </TableCell>
                                <TableCell className="text-stone-500 text-sm">
                                    {new Date(item.updated_at).toLocaleString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    <PromotionActions id={item.id} isActive={item.is_active} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
