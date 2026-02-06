"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Markdown } from 'tiptap-markdown';
import { Bold, Italic, Strikethrough, Heading1, Heading2, Heading3, List, Quote, Code, Link as LinkIcon, Undo, Redo } from 'lucide-react';
import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

interface MarkdownEditorProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
}

export const MarkdownEditor = forwardRef<HTMLTextAreaElement, MarkdownEditorProps>(
    ({ className, defaultValue, value, ...props }, ref) => {
        // Hidden textarea ref to maintain form compatibility and allow AI updates
        const hiddenTextareaRef = useRef<HTMLTextAreaElement>(null);

        // Forward the internal ref to the parent if provided, pointing to the hidden textarea
        useImperativeHandle(ref, () => hiddenTextareaRef.current as HTMLTextAreaElement);

        const initialContent = defaultValue?.toString() || value?.toString() || "";

        const editor = useEditor({
            immediatelyRender: false,
            extensions: [
                StarterKit,
                Link.configure({
                    openOnClick: false,
                    HTMLAttributes: {
                        class: 'text-blue-600 underline cursor-pointer',
                    },
                }),
                Markdown.configure({
                    html: false, // Default: false
                    transformPastedText: true,
                    transformCopiedText: true,
                    breaks: true, // Treat newlines as hard breaks
                })
            ],
            content: "", // Initialize empty, load content via useEffect to ensure Markdown parsing handles breaks
            editorProps: {
                attributes: {
                    class: 'prose prose-sm max-w-none p-4 min-h-[300px] outline-none prose-p:my-4 prose-headings:mt-6 prose-headings:mb-3 prose-li:my-1 text-black',
                },
            },
            onUpdate: ({ editor }) => {
                // Sync editor content to hidden textarea
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const markdown = (editor.storage as any).markdown.getMarkdown();
                if (hiddenTextareaRef.current && hiddenTextareaRef.current.value !== markdown) {
                    hiddenTextareaRef.current.value = markdown;
                    hiddenTextareaRef.current.dispatchEvent(new Event('input', { bubbles: true }));
                }
            },
        });

        const ensureMarkdownBreaks = (text: string) => {
            if (!text) return "";
            // Force every single newline into a double newline (Paragraph)
            // This is the most consistent way to handle "merged line" complaints in Markdown editors
            return text
                .replace(/\r\n/g, '\n')
                .split('\n')
                .join('\n\n')
                .replace(/\n\n\n+/g, '\n\n')
                .trim();
        };

        // Handle hydration and external updates
        const isFirstLoad = useRef(true);
        useEffect(() => {
            if (!editor) return;

            // Initial Hydration from defaultValue/value
            if (isFirstLoad.current && initialContent) {
                editor.commands.setContent(ensureMarkdownBreaks(initialContent), { emitUpdate: false });
                isFirstLoad.current = false;
            }
        }, [editor, initialContent]);

        // Listen for external updates to the hidden textarea (e.g. from AI generator)
        useEffect(() => {
            const textarea = hiddenTextareaRef.current;
            if (!textarea || !editor) return;

            const handleExternalInput = () => {
                // Only update if content is different to avoid cursor jumping loops
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const currentMarkdown = (editor.storage as any).markdown.getMarkdown();
                if (textarea.value !== currentMarkdown) {
                    const processed = ensureMarkdownBreaks(textarea.value);
                    editor.commands.setContent(processed, { emitUpdate: false });
                }
            };

            // Attach listener
            textarea.addEventListener('input', handleExternalInput);
            return () => textarea.removeEventListener('input', handleExternalInput);
        }, [editor]);

        // Propagation of controlled value prop (if used)
        useEffect(() => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (editor && value && value !== (editor.storage as any).markdown.getMarkdown()) {
                editor.commands.setContent(ensureMarkdownBreaks(value.toString()), { emitUpdate: false });
            }
        }, [value, editor]);


        if (!editor) {
            return null; // or a loader
        }

        const toggleBold = () => editor.chain().focus().toggleBold().run();
        const toggleItalic = () => editor.chain().focus().toggleItalic().run();
        const toggleStrike = () => editor.chain().focus().toggleStrike().run();
        const toggleH1 = () => editor.chain().focus().toggleHeading({ level: 1 }).run();
        const toggleH2 = () => editor.chain().focus().toggleHeading({ level: 2 }).run();
        const toggleH3 = () => editor.chain().focus().toggleHeading({ level: 3 }).run();
        const toggleList = () => editor.chain().focus().toggleBulletList().run();
        const toggleQuote = () => editor.chain().focus().toggleBlockquote().run();
        const toggleCode = () => editor.chain().focus().toggleCodeBlock().run();

        // Simple link prompt
        const setLink = () => {
            const previousUrl = editor.getAttributes('link').href;
            const url = window.prompt('URL', previousUrl);
            if (url === null) return; // cancelled
            if (url === '') {
                editor.chain().focus().extendMarkRange('link').unsetLink().run();
                return;
            }
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        };

        return (
            <div className={`border border-gray-300 rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#2C5F88] transition-all flex flex-col ${className || ""}`}>

                {/* Toolbar */}
                <div className="flex items-center gap-1 p-2 flex-wrap border-b border-gray-200 bg-gray-50 shrink-0">
                    <ToolbarBtn onClick={toggleBold} isActive={editor.isActive('bold')} icon={Bold} title="Bold" />
                    <ToolbarBtn onClick={toggleItalic} isActive={editor.isActive('italic')} icon={Italic} title="Italic" />
                    <ToolbarBtn onClick={toggleStrike} isActive={editor.isActive('strike')} icon={Strikethrough} title="Strikethrough" />
                    <div className="w-px h-4 bg-gray-300 mx-1" />
                    <ToolbarBtn onClick={toggleH1} isActive={editor.isActive('heading', { level: 1 })} icon={Heading1} title="Heading 1" />
                    <ToolbarBtn onClick={toggleH2} isActive={editor.isActive('heading', { level: 2 })} icon={Heading2} title="Heading 2" />
                    <ToolbarBtn onClick={toggleH3} isActive={editor.isActive('heading', { level: 3 })} icon={Heading3} title="Heading 3" />
                    <ToolbarBtn onClick={toggleList} isActive={editor.isActive('bulletList')} icon={List} title="List" />
                    <ToolbarBtn onClick={toggleQuote} isActive={editor.isActive('blockquote')} icon={Quote} title="Quote" />
                    <ToolbarBtn onClick={toggleCode} isActive={editor.isActive('codeBlock')} icon={Code} title="Code Block" />
                    <div className="w-px h-4 bg-gray-300 mx-1" />
                    <ToolbarBtn onClick={setLink} isActive={editor.isActive('link')} icon={LinkIcon} title="Link" />
                    {/* undo/redo */}
                    <div className="ml-auto flex items-center gap-1">
                        <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} icon={Undo} title="Undo" />
                        <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} icon={Redo} title="Redo" />
                    </div>
                </div>

                {/* Editor Content */}
                <div className="grow min-h-[300px] cursor-text bg-white text-black" onClick={() => editor.chain().focus().run()}>
                    <EditorContent editor={editor} className="h-full" />
                </div>

                {/* Hidden Textarea for Form Submission & Sync */}
                <textarea
                    {...props}
                    ref={hiddenTextareaRef}
                    style={{ display: 'none' }} // truly hidden, but present in DOM
                    defaultValue={initialContent}
                />
            </div>
        );
    }
);

MarkdownEditor.displayName = "MarkdownEditor";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ToolbarBtn({ onClick, icon: Icon, title, isActive }: { onClick: () => void, icon: any, title: string, isActive?: boolean }) {
    return (
        <button
            type="button"
            onClick={(e) => { e.preventDefault(); onClick(); }}
            className={`p-1.5 rounded-md transition-colors ${isActive
                ? "bg-gray-200 text-gray-900"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                }`}
            title={title}
        >
            <Icon className="w-4 h-4" />
        </button>
    );
}
