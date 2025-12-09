"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    List,
    ListOrdered,
    Link2,
    Undo,
    Redo
} from 'lucide-react';

const EditorToolbar = ({ editor }) => {
    if (!editor) return null;

    const addLink = () => {
        const url = window.prompt('Enter URL:');
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    return (
        <div className="sticky z-40 w-full border-b bg-white/95 backdrop-blur-sm p-2 flex flex-wrap gap-1 rounded-t-lg shadow-sm" style={{ top: '80px' }}>
            {/* Text Formatting */}
            <Button
                type="button"
                size="sm"
                variant={editor.isActive('bold') ? 'default' : 'ghost'}
                onClick={() => editor.chain().focus().toggleBold().run()}
                className="h-8 w-8 p-0"
            >
                <Bold className="w-4 h-4" />
            </Button>
            <Button
                type="button"
                size="sm"
                variant={editor.isActive('italic') ? 'default' : 'ghost'}
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className="h-8 w-8 p-0"
            >
                <Italic className="w-4 h-4" />
            </Button>
            <Button
                type="button"
                size="sm"
                variant={editor.isActive('underline') ? 'default' : 'ghost'}
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
                variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className="h-8 w-8 p-0"
            >
                <List className="w-4 h-4" />
            </Button>
            <Button
                type="button"
                size="sm"
                variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className="h-8 w-8 p-0"
            >
                <ListOrdered className="w-4 h-4" />
            </Button>

            <div className="w-px h-8 bg-gray-300 mx-1" />

            {/* Link */}
            <Button
                type="button"
                size="sm"
                variant={editor.isActive('link') ? 'default' : 'ghost'}
                onClick={addLink}
                className="h-8 w-8 p-0"
            >
                <Link2 className="w-4 h-4" />
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

const SimpleTiptapEditor = ({ value, onChange, placeholder = "Enter description..." }) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: false,      // Disable headings
                hardBreak: true,
                paragraph: true,
                bulletList: true,
                orderedList: true,
                listItem: true,
                bold: true,
                italic: true,
                strike: false,       // Disable strikethrough
                code: false,         // Disable inline code
                codeBlock: false,    // Disable code blocks
                blockquote: false,   // Disable blockquotes
                horizontalRule: false // Disable horizontal rules
            }),
            Underline,
            Link.configure({ openOnClick: false })
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none focus:outline-none min-h-[150px] p-4'
            }
        }
    });

    useEffect(() => {
        if (editor && value !== undefined && editor.getHTML() !== value) {
            editor.commands.setContent(value || '', false);
        }
    }, [editor, value]);

    if (!editor) return null;

    return (
        <div className="rounded-lg border border-gray-300 bg-white overflow-visible">
            <EditorToolbar editor={editor} />
            <EditorContent editor={editor} />

            {/* Editor Styles */}
            <style jsx global>{`
        .ProseMirror {
          outline: none;
          min-height: 150px;
        }
        .ProseMirror p {
          margin: 0.5rem 0;
          min-height: 1.5em;
        }
        .ProseMirror p:empty::before {
          content: '';
          display: inline-block;
        }
        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 1.5rem;
          margin: 0.75rem 0;
          list-style-position: outside;
        }
        .ProseMirror ul {
          list-style-type: disc;
        }
        .ProseMirror ol {
          list-style-type: decimal;
        }
        .ProseMirror li {
          margin: 0.25rem 0;
        }
        .ProseMirror a {
          color: #3b82f6;
          text-decoration: underline;
        }
        .ProseMirror strong {
          font-weight: 600;
        }
        .ProseMirror em {
          font-style: italic;
        }
        .ProseMirror u {
          text-decoration: underline;
        }
      `}</style>
        </div>
    );
};

export default SimpleTiptapEditor;
