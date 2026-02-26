"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { Button } from "@/components/ui/button";
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    List,
    ListOrdered,
    Quote,
    Code,
    Undo,
    Redo,
    Link2,
    Image as ImageIcon,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Heading1,
    Heading2,
    Heading3,
} from "lucide-react";

const EditorToolbar = ({ editor, disableHeadings }) => {
    if (!editor) return null;

    const addLink = () => {
        const url = window.prompt("Enter URL:");
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    const addImage = () => {
        const url = window.prompt("Enter image URL:");
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    return (
        <div className="border-b bg-gray-50 p-2 flex flex-wrap gap-1 rounded-t-lg">
            {/* Headings */}
            {!disableHeadings && (
                <>
                    <Button
                        type="button"
                        size="sm"
                        variant={editor.isActive("heading", { level: 1 }) ? "default" : "ghost"}
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className="h-8 w-8 p-0"
                    >
                        <Heading1 className="w-4 h-4" />
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        variant={editor.isActive("heading", { level: 2 }) ? "default" : "ghost"}
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className="h-8 w-8 p-0"
                    >
                        <Heading2 className="w-4 h-4" />
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        variant={editor.isActive("heading", { level: 3 }) ? "default" : "ghost"}
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        className="h-8 w-8 p-0"
                    >
                        <Heading3 className="w-4 h-4" />
                    </Button>

                    <div className="w-px h-8 bg-gray-300 mx-1" />
                </>
            )}

            {/* Text Formatting */}
            <Button
                type="button"
                size="sm"
                variant={editor.isActive("bold") ? "default" : "ghost"}
                onClick={() => editor.chain().focus().toggleBold().run()}
                className="h-8 w-8 p-0"
            >
                <Bold className="w-4 h-4" />
            </Button>
            <Button
                type="button"
                size="sm"
                variant={editor.isActive("italic") ? "default" : "ghost"}
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className="h-8 w-8 p-0"
            >
                <Italic className="w-4 h-4" />
            </Button>
            <Button
                type="button"
                size="sm"
                variant={editor.isActive("underline") ? "default" : "ghost"}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className="h-8 w-8 p-0"
            >
                <UnderlineIcon className="w-4 h-4" />
            </Button>

            <div className="w-px h-8 bg-gray-300 mx-1" />

            {/* Lists */}
            <Button
                type="button"
                size="sm"
                variant={editor.isActive("bulletList") ? "default" : "ghost"}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className="h-8 w-8 p-0"
            >
                <List className="w-4 h-4" />
            </Button>
            <Button
                type="button"
                size="sm"
                variant={editor.isActive("orderedList") ? "default" : "ghost"}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className="h-8 w-8 p-0"
            >
                <ListOrdered className="w-4 h-4" />
            </Button>

            <div className="w-px h-8 bg-gray-300 mx-1" />

            {/* Alignment */}
            <Button
                type="button"
                size="sm"
                variant={editor.isActive({ textAlign: "left" }) ? "default" : "ghost"}
                onClick={() => editor.chain().focus().setTextAlign("left").run()}
                className="h-8 w-8 p-0"
            >
                <AlignLeft className="w-4 h-4" />
            </Button>
            <Button
                type="button"
                size="sm"
                variant={editor.isActive({ textAlign: "center" }) ? "default" : "ghost"}
                onClick={() => editor.chain().focus().setTextAlign("center").run()}
                className="h-8 w-8 p-0"
            >
                <AlignCenter className="w-4 h-4" />
            </Button>
            <Button
                type="button"
                size="sm"
                variant={editor.isActive({ textAlign: "right" }) ? "default" : "ghost"}
                onClick={() => editor.chain().focus().setTextAlign("right").run()}
                className="h-8 w-8 p-0"
            >
                <AlignRight className="w-4 h-4" />
            </Button>

            <div className="w-px h-8 bg-gray-300 mx-1" />

            {/* Special */}
            <Button
                type="button"
                size="sm"
                variant={editor.isActive("blockquote") ? "default" : "ghost"}
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className="h-8 w-8 p-0"
            >
                <Quote className="w-4 h-4" />
            </Button>
            <Button
                type="button"
                size="sm"
                variant={editor.isActive("codeBlock") ? "default" : "ghost"}
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className="h-8 w-8 p-0"
            >
                <Code className="w-4 h-4" />
            </Button>

            <div className="w-px h-8 bg-gray-300 mx-1" />

            {/* Link & Image */}
            <Button
                type="button"
                size="sm"
                variant={editor.isActive("link") ? "default" : "ghost"}
                onClick={addLink}
                className="h-8 w-8 p-0"
            >
                <Link2 className="w-4 h-4" />
            </Button>
            <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={addImage}
                className="h-8 w-8 p-0"
            >
                <ImageIcon className="w-4 h-4" />
            </Button>

            <div className="w-px h-8 bg-gray-300 mx-1" />

            {/* Undo/Redo */}
            <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                className="h-8 w-8 p-0"
            >
                <Undo className="w-4 h-4" />
            </Button>
            <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                className="h-8 w-8 p-0"
            >
                <Redo className="w-4 h-4" />
            </Button>
        </div>
    );
};

export default function RichTextEditor({ value, onChange, minHeight = "200px", disableHeadings = false }) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: disableHeadings ? false : undefined,
            }),
            Underline,
            Link.configure({ openOnClick: false }),
            Image,
            TextAlign.configure({ types: disableHeadings ? ["paragraph"] : ["heading", "paragraph"] }),
            TextStyle,
            Color,
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        immediatelyRender: false,
    });

    useEffect(() => {
        if (editor && value !== undefined && editor.getHTML() !== value) {
            editor.commands.setContent(value || "", false);
        }
    }, [editor, value]);

    if (!editor) return null;

    return (
        <>
            <div className="rounded-lg border border-gray-300 overflow-hidden bg-white">
                <EditorToolbar editor={editor} disableHeadings={disableHeadings} />
                <EditorContent
                    editor={editor}
                    className="prose max-w-none border-0 p-4 focus:outline-none"
                    style={{ minHeight }}
                />
            </div>

            {/* Tiptap Editor Styles */}
            <style jsx global>{`
        .ProseMirror {
          outline: none;
        }
        .ProseMirror p {
          margin: 0.75rem 0;
        }
        .ProseMirror h1 {
          font-size: 2rem;
          font-weight: bold;
          margin: 1rem 0;
        }
        .ProseMirror h2 {
          font-size: 1.5rem;
          font-weight: bold;
          margin: 0.875rem 0;
        }
        .ProseMirror h3 {
          font-size: 1.25rem;
          font-weight: bold;
          margin: 0.75rem 0;
        }
        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 1.5rem;
          margin: 0.75rem 0;
        }
        .ProseMirror blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1rem;
          color: #6b7280;
          margin: 1rem 0;
        }
        .ProseMirror code {
          background-color: #f3f4f6;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-family: monospace;
        }
        .ProseMirror pre {
          background-color: #1f2937;
          color: #f9fafb;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1rem 0;
        }
        .ProseMirror pre code {
          background: none;
          color: inherit;
          padding: 0;
        }
        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1rem 0;
        }
        .ProseMirror a {
          color: #3b82f6;
          text-decoration: underline;
        }
      `}</style>
        </>
    );
}
