"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Download, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";

interface PdfViewerModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    pdfUrl: string; // Placeholder for now, can be a real URL later
}

export function PdfViewerModal({ isOpen, onClose, title, pdfUrl }: PdfViewerModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-deep-teak/60 backdrop-blur-sm z-50 transition-opacity"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 pointer-events-none"
                    >
                        <div className="bg-warm-white w-full h-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl flex flex-col pointer-events-auto border border-white/20 relative">
                            {/* Header */}
                            <div className="h-16 bg-deep-teak text-white flex items-center justify-between px-6 shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/10 rounded-lg">
                                        <FileText className="w-5 h-5 text-sunrise-gold" />
                                    </div>
                                    <h3 className="font-heading font-bold text-lg tracking-wide">{title}</h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <a
                                        href={pdfUrl}
                                        download
                                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
                                        title="Download PDF"
                                    >
                                        <Download className="w-5 h-5" />
                                    </a>
                                    <button
                                        onClick={onClose}
                                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white ml-2"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            {/* Content - Real PDF Viewer */}
                            <div className="flex-1 bg-stone-100 relative overflow-hidden flex flex-col items-center justify-center p-0">
                                <iframe
                                    src={pdfUrl}
                                    className="w-full h-full border-none"
                                    title={title}
                                />
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
