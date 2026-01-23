"use client";

import { Bold, Italic, Link, List, Heading3, Quote } from "lucide-react";
import { RefObject } from "react";

interface MarkdownToolbarProps {
    textareaRef: RefObject<HTMLTextAreaElement | null>;
}

export function MarkdownToolbar({ textareaRef }: MarkdownToolbarProps) {

    const insertText = (before: string, after: string = "") => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const beforeText = text.substring(0, start);
        const selectedText = text.substring(start, end);
        const afterText = text.substring(end);

        const newText = `${beforeText}${before}${selectedText}${after}${afterText}`;

        // Update value safely (for uncontrolled inputs mainly, but triggers events)
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
        nativeInputValueSetter?.call(textarea, newText);

        textarea.dispatchEvent(new Event('input', { bubbles: true }));

        textarea.focus();
        textarea.setSelectionRange(start + before.length, end + before.length);
    };

    return (
        <div className="flex items-center gap-1 p-2 bg-gray-50 border border-t-0 border-gray-300 rounded-b-lg border-x-gray-300 -mt-[1px] relative z-10 w-full">
            {/* Toolbar items */}
            <button
                type="button"
                onClick={() => insertText("**", "**")}
                className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-md transition-colors"
                title="Bold"
            >
                <Bold className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => insertText("*", "*")}
                className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-md transition-colors"
                title="Italic"
            >
                <Italic className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-gray-300 mx-1" />
            <button
                type="button"
                onClick={() => insertText("### ")}
                className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-md transition-colors"
                title="Heading"
            >
                <Heading3 className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => insertText("- ")}
                className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-md transition-colors"
                title="List"
            >
                <List className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => insertText("> ")}
                className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-md transition-colors"
                title="Quote"
            >
                <Quote className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-gray-300 mx-1" />
            <button
                type="button"
                onClick={() => insertText("[", "](url)")}
                className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-md transition-colors"
                title="Link"
            >
                <Link className="w-4 h-4" />
            </button>
        </div>
    );
}
