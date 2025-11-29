// app/admin/content/pages/[slug]/page.js
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  ArrowLeft,
  Save,
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
  Loader2,
  Eye,
} from "lucide-react";
import { getContentByKeyAction } from "@/app/actions/public/content";
import { upsertContentAction } from "@/app/actions/admin/pages";

// Tiptap Editor Toolbar Component
const EditorToolbar = ({ editor }) => {
  if (!editor) return null;

  const addLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    // ✅ FIX: Added sticky, top-0, z-10 for sticky behavior
    <div className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 p-2 flex flex-wrap gap-1 rounded-t-lg">
      {/* Headings */}
      <Button
        type="button"
        size="sm"
        variant={
          editor.isActive("heading", { level: 1 }) ? "default" : "ghost"
        }
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
        className="h-8 w-8 p-0"
      >
        <Heading1 className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant={
          editor.isActive("heading", { level: 2 }) ? "default" : "ghost"
        }
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
        className="h-8 w-8 p-0"
      >
        <Heading2 className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant={
          editor.isActive("heading", { level: 3 }) ? "default" : "ghost"
        }
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
        className="h-8 w-8 p-0"
      >
        <Heading3 className="w-4 h-4" />
      </Button>

      <div className="w-px h-8 bg-gray-300 mx-1" />

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
        variant={
          editor.isActive({ textAlign: "center" }) ? "default" : "ghost"
        }
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

const PolicyPageEditor = () => {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState(""); // Holds content for saving

  const pageNames = {
    "privacy-policy": "Privacy Policy",
    "cookie-policy": "Cookie Policy",
    "terms-and-conditions": "Terms and Conditions",
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      Color,
    ],
    // ❌ Fix: Removed content: content to prevent scroll snapping issue
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    immediatelyRender: false,
  });

  // ✅ Fix: Only load content when editor is ready
  useEffect(() => {
    if (editor) {
      loadContent();
    }
  }, [slug, editor]);

  const loadContent = async () => {
    setLoading(true);
    try {
      const result = await getContentByKeyAction(slug);
      if (result.success && result.data) {
        const initialContent = result.data.content || "";
        setContent(initialContent);

        // 💡 Explicitly set content on the editor after fetch
        if (editor) {
          editor.commands.setContent(initialContent);
        }
      }
    } catch (error) {
      toast.error("Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content.trim() || content === "<p></p>") {
      toast.error("Content cannot be empty");
      return;
    }

    setSaving(true);
    try {
      const result = await upsertContentAction(slug, {
        type: "page",
        content: content,
      });

      if (result.success) {
        toast.success("Content saved successfully!");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to save content");
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    const previewUrls = {
      "privacy-policy": "/privacy-policy",
      "cookie-policy": "/cookie-policy",
      "terms-and-conditions": "/terms-and-conditions",
    };
    const url = previewUrls[slug];
    if (url) {
      window.open(url, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="dashboard-container mb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/admin/content-moderation/content")}
            className="border rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="!text-2xl uppercase !tracking-wide !text-primary/80 font-bold">
              {pageNames[slug]}
            </h1>
            <p className="!text-sm text-gray-500">
              Edit your {pageNames[slug]?.toLowerCase()} content
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Editor */}
      <Card>
        <CardHeader>
          <CardTitle className="uppercase">Content Editor</CardTitle>
        </CardHeader>
        <CardContent>
          {/* ✅ FIX: Removed 'overflow-hidden' to allow sticky positioning to work. */}
          <div className="border border-gray-300 rounded-lg bg-white">
            <EditorToolbar editor={editor} />
            <EditorContent
              editor={editor}
              className="prose max-w-none border-0 p-4 min-h-[500px] focus:outline-none"
            />
          </div>
        </CardContent>
      </Card>

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
    </div>
  );
};

export default PolicyPageEditor;