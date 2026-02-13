"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save, ArrowLeft, Eye } from "lucide-react";
import { createCarouselItem, getCarouselItem, updateCarouselItem } from "../actions";
import { toast } from "sonner";
import Link from "next/link"; // Correct import for Link

export default function PromotionEditorPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        html_content: '<div class="promo-slide">\n  <h1>New Promotion</h1>\n  <p>Description here...</p>\n</div>',
        css_content: '.promo-slide {\n  padding: 40px;\n  text-align: center;\n  background: #f0f0f0;\n}',
        cta_link: "",
        order_index: 0,
        is_active: true
    });

    useEffect(() => {
        if (id) {
            setIsLoading(true);
            getCarouselItem(id)
                .then(data => {
                    if (data) {
                        setFormData({
                            title: data.title,
                            html_content: data.html_content,
                            css_content: data.css_content || "",
                            cta_link: data.cta_link || "",
                            order_index: data.order_index || 0,
                            is_active: data.is_active
                        });
                    }
                })
                .catch(err => toast.error("Failed to load promotion"))
                .finally(() => setIsLoading(false));
        }
    }, [id]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (id) {
                await updateCarouselItem(id, formData);
                toast.success("Promotion updated successfully");
            } else {
                await createCarouselItem(formData);
                toast.success("Promotion created successfully");
                router.push("/dashboard/promotions");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to save promotion");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
            <div className="flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" asChild>
                        <Link href="/dashboard/promotions">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold text-deep-teak">
                        {id ? "Edit Promotion" : "New Promotion"}
                    </h1>
                </div>
                <Button onClick={handleSave} disabled={isSaving} className="bg-deep-teak text-white">
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Changes
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
                {/* Editor Column */}
                <div className="space-y-6 overflow-y-auto pr-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Internal Title</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. CNY 2026 Main Banner"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="order">Order Index</Label>
                                    <Input
                                        id="order"
                                        type="number"
                                        value={formData.order_index}
                                        onChange={e => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="link">CTA Link (Optional)</Label>
                                    <Input
                                        id="link"
                                        value={formData.cta_link}
                                        onChange={e => setFormData({ ...formData, cta_link: e.target.value })}
                                        placeholder="/cny"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Switch
                                    id="active"
                                    checked={formData.is_active}
                                    onCheckedChange={checked => setFormData({ ...formData, is_active: checked })}
                                />
                                <Label htmlFor="active">Active</Label>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="flex-1 flex flex-col">
                        <CardHeader>
                            <CardTitle>Code Editor</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 flex-1 flex flex-col">
                            <div className="space-y-2 flex-1">
                                <Label htmlFor="html">HTML Content</Label>
                                <Textarea
                                    id="html"
                                    className="font-mono text-xs h-64 resize-y"
                                    value={formData.html_content}
                                    onChange={e => setFormData({ ...formData, html_content: e.target.value })}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Use Tailwind classes or custom classes defined below.
                                </p>
                            </div>
                            <div className="space-y-2 flex-1">
                                <Label htmlFor="css">Custom CSS</Label>
                                <Textarea
                                    id="css"
                                    className="font-mono text-xs h-48 resize-y"
                                    value={formData.css_content}
                                    onChange={e => setFormData({ ...formData, css_content: e.target.value })}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Scoped styles for this slide.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Preview Column */}
                <div className="flex flex-col h-full border rounded-xl overflow-hidden bg-gray-100 shadow-inner">
                    <div className="bg-white border-b p-3 flex items-center justify-between">
                        <span className="text-sm font-medium flex items-center gap-2">
                            <Eye className="w-4 h-4" /> Live Preview
                        </span>
                        <span className="text-xs text-stone-400">Updates in real-time</span>
                    </div>
                    <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
                        <div className="w-full max-w-5xl bg-white shadow-xl rounded-lg overflow-hidden relative">
                            {/* Style Injection */}
                            <style dangerouslySetInnerHTML={{ __html: formData.css_content }} />
                            {/* HTML Injection */}
                            <div dangerouslySetInnerHTML={{ __html: formData.html_content }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
