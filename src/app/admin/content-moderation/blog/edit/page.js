"use client"

import { useState, useEffect, useMemo } from "react"
import { useForm, Controller } from "react-hook-form"
import { useRouter, useSearchParams } from "next/navigation"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
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
    Loader2
} from "lucide-react"
import ControlledFileUpload from "@/components/common/ControlledFileUploads"
import { getBlogPostAsAdmin, editBlogPost } from "@/app/actions/admin/blog"


// Tiptap Editor Toolbar Component
const EditorToolbar = ({ editor }) => {
    if (!editor) return null

    const addLink = () => {
        const url = window.prompt('Enter URL:')
        if (url) {
            editor.chain().focus().setLink({ href: url }).run()
        }
    }

    const addImage = () => {
        const url = window.prompt('Enter image URL:')
        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }

    return (
        <div className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur-sm p-2 flex flex-wrap gap-1 rounded-t-lg shadow-sm">
            {/* Headings */}
            <Button
                type="button"
                size="sm"
                variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'ghost'}
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className="h-8 w-8 p-0"
            >
                <Heading1 className="w-4 h-4" />
            </Button>
            <Button
                type="button"
                size="sm"
                variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'}
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className="h-8 w-8 p-0"
            >
                <Heading2 className="w-4 h-4" />
            </Button>
            <Button
                type="button"
                size="sm"
                variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'ghost'}
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className="h-8 w-8 p-0"
            >
                <Heading3 className="w-4 h-4" />
            </Button>

            <div className="w-px h-8 bg-gray-300 mx-1" />

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

            {/* Alignment */}
            <Button
                type="button"
                size="sm"
                variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'ghost'}
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className="h-8 w-8 p-0"
            >
                <AlignLeft className="w-4 h-4" />
            </Button>
            <Button
                type="button"
                size="sm"
                variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'}
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className="h-8 w-8 p-0"
            >
                <AlignCenter className="w-4 h-4" />
            </Button>
            <Button
                type="button"
                size="sm"
                variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'}
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className="h-8 w-8 p-0"
            >
                <AlignRight className="w-4 h-4" />
            </Button>

            <div className="w-px h-8 bg-gray-300 mx-1" />

            {/* Special */}
            <Button
                type="button"
                size="sm"
                variant={editor.isActive('blockquote') ? 'default' : 'ghost'}
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className="h-8 w-8 p-0"
            >
                <Quote className="w-4 h-4" />
            </Button>
            <Button
                type="button"
                size="sm"
                variant={editor.isActive('codeBlock') ? 'default' : 'ghost'}
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
                variant={editor.isActive('link') ? 'default' : 'ghost'}
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
    )
}

// Rich text editor wrapper (hooks used at top-level of a component)
const RichTextEditor = ({ value, onChange }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({ openOnClick: false }),
            Image,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            TextStyle,
            Color,
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        immediatelyRender: false,
    })

    useEffect(() => {
        if (editor && value !== undefined && editor.getHTML() !== value) {
            editor.commands.setContent(value || '', false)
        }
    }, [editor, value])

    if (!editor) return null

    return (
        <div className="rounded-lg border border-gray-300 bg-white overflow-visible">
            <EditorToolbar editor={editor} />
            <EditorContent
                editor={editor}
                className="prose max-w-none border-0 p-4 min-h-[400px] focus:outline-none"
            />
        </div>
    )
}

// Keywords input wrapper
const KeywordsInput = ({ value = [], onChange }) => {
    const [inputValue, setInputValue] = useState("")
    const keywords = value || []

    const addKeyword = () => {
        const keyword = inputValue.trim().toLowerCase()
        if (keyword && !keywords.includes(keyword) && keywords.length < 10) {
            onChange([...keywords, keyword])
            setInputValue("")
        } else if (keywords.length >= 10) {
            toast.error("Maximum 10 keywords allowed")
        } else if (keywords.includes(keyword)) {
            toast.error("Keyword already added")
        }
    }

    const removeKeyword = (index) => {
        onChange(keywords.filter((_, i) => i !== index))
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            addKeyword()
        }
    }

    return (
        <div className="space-y-3">
            <div className="flex gap-2">
                <Input
                    id="seoKeywords"
                    placeholder="Enter keyword and press Enter"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1"
                />
                <Button
                    type="button"
                    onClick={addKeyword}
                    variant="outline"
                    disabled={keywords.length >= 10}
                >
                    Add
                </Button>
            </div>

            {keywords.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    {keywords.map((keyword, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                        >
                            {keyword}
                            <button
                                type="button"
                                onClick={() => removeKeyword(index)}
                                className="ml-1 hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                            >
                                <svg
                                    className="w-3 h-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </span>
                    ))}
                </div>
            )}

            <p className="text-xs text-gray-500">
                {keywords.length}/10 keywords • Press Enter or click Add to add keywords
            </p>
        </div>
    )
}


const EditBlogPage = () => {
    const router = useRouter()
    const searchParams = useSearchParams()

    // --- Data Fetching State and Logic ---
    const postId = searchParams.get('id') // Get ID from URL query: ?id=...
    const [fetchedData, setFetchedData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Effect to fetch data on component mount or ID change
    useEffect(() => {
        const fetchPostData = async () => {
            if (!postId) {
                setError("No blog post ID found in the URL.")
                setIsLoading(false)
                return
            }

            try {
                // Call the server action to fetch data
                const data = await getBlogPostAsAdmin(postId)
                setFetchedData(data)
                setError(null)
            } catch (err) {
                console.error("Fetch Error:", err)
                setError("Failed to load blog post. It may not exist.")
            } finally {
                setIsLoading(false)
            }
        }

        fetchPostData()
    }, [postId])

    // --- Form Logic: useMemo to ensure useForm only runs once data is ready ---
    const defaultValues = useMemo(() => ({
        title: fetchedData?.title || "",
        slug: fetchedData?.slug || "",
        coverImage: fetchedData?.coverImage || "",
        content: fetchedData?.content || "",
        ctaText: fetchedData?.ctaText || "Contact Us",
        ctaLink: fetchedData?.ctaLink || "/contact",
        metaTitle: fetchedData?.metaTitle || "",
        metaDescription: fetchedData?.metaDescription || "",
        seoKeywords: fetchedData?.seoKeywords || [],
    }), [fetchedData])

    // Initialize useForm only after data is fetched
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues,
        // Reset the form when defaultValues changes (i.e., when data is fetched)
        values: defaultValues,
    })

    const title = watch("title")

    // Auto-generate slug from title
    const handleTitleChange = (e) => {
        const newTitle = e.target.value
        const slug = newTitle
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "")
        setValue("slug", slug)
    }

    const onSubmit = async (data) => {
        if (!postId) {
            toast.error("Blog Post ID is missing. Cannot update.")
            return
        }

        if (!data.content || data.content === "<p></p>") {
            toast.error("Content is required")
            return
        }

        setIsSubmitting(true)

        try {
            // Auto-include the current blog status from fetched data
            const result = await editBlogPost(postId, {
                ...data,
                status: fetchedData?.status || "draft"
            })

            if (!result.success) {
                toast.error(result.message || "Failed to update blog post")
                return
            }

            toast.success(result.message)
        } catch (error) {
            console.error("Error updating blog:", error)
            toast.error("An error occurred while updating the blog post")
        } finally {
            setIsSubmitting(false)
        }
    }

    // --- Conditional Rendering for Loading/Error ---
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[50vh] flex-col">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="mt-2 text-gray-600">Loading blog post data...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-10">
                <h1 className="text-2xl font-bold text-red-600">Data Error</h1>
                <p className="text-gray-600 mt-2">{error}</p>
                <Button onClick={() => router.back()} className="mt-4">
                    Go Back
                </Button>
            </div>
        )
    }

    // Main Form Render (only runs if data is loaded)
    return (
        <div className="dashboard-container">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="border rounded-full"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="!text-2xl !tracking-wide !text-primary/80 font-bold">
                            Edit Blog Post: {fetchedData?.title}
                        </h1>
                        <p className="!text-sm text-gray-500">Modify and update existing content</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="uppercase">Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title">
                                Title <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="title"
                                placeholder="Enter blog title"
                                {...register("title", {
                                    required: "Title is required",
                                    maxLength: {
                                        value: 150,
                                        message: "Title cannot exceed 150 characters",
                                    },
                                })}
                                onChange={(e) => {
                                    register("title").onChange(e)
                                    handleTitleChange(e)
                                }}
                            />
                            {errors.title && (
                                <p className="text-red-500 text-sm">{errors.title.message}</p>
                            )}
                        </div>

                        {/* Slug */}
                        <div className="space-y-2">
                            <Label htmlFor="slug">
                                Slug <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="slug"
                                placeholder="auto-generated-slug"
                                {...register("slug", {
                                    required: "Slug is required",
                                })}
                            />
                            {errors.slug && (
                                <p className="text-red-500 text-sm">{errors.slug.message}</p>
                            )}
                            <p className="!text-xs text-gray-500">
                                URL-friendly version of the title (auto-generated)
                            </p>
                        </div>

                        {/* Cover Image */}
                        <div className="space-y-2">
                            <Label>
                                Cover Image <span className="text-red-500">*</span>
                            </Label>
                            <ControlledFileUpload
                                control={control}
                                name="coverImage"
                                label="Upload Cover Image"
                                errors={errors}
                                allowedMimeType={["image/jpeg", "image/png", "image/webp"]}
                                folderPath="blogs/covers"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Content */}
                <Card>
                    <CardHeader>
                        <CardTitle className="uppercase">Content</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Controller
                                name="content"
                                control={control}
                                rules={{ required: "Content is required" }}
                                render={({ field }) => (
                                    <RichTextEditor value={field.value} onChange={field.onChange} />
                                )}
                            />
                            {errors.content && (
                                <p className="text-red-500 text-sm">{errors.content.message}</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Call to Action */}
                <Card>
                    <CardHeader>
                        <CardTitle>Call to Action</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="ctaText">CTA Text</Label>
                                <Input
                                    id="ctaText"
                                    placeholder="Contact Us"
                                    {...register("ctaText", {
                                        maxLength: {
                                            value: 50,
                                            message: "CTA text cannot exceed 50 characters",
                                        },
                                    })}
                                />
                                {errors.ctaText && (
                                    <p className="text-red-500 text-sm">{errors.ctaText.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ctaLink">CTA Link</Label>
                                <Input
                                    id="ctaLink"
                                    placeholder="/contact"
                                    {...register("ctaLink")}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* SEO Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle>SEO Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="metaTitle">Meta Title</Label>
                            <Input
                                id="metaTitle"
                                placeholder="SEO-optimized title"
                                {...register("metaTitle", {
                                    maxLength: {
                                        value: 60,
                                        message: "Meta title cannot exceed 60 characters",
                                    },
                                })}
                            />
                            {errors.metaTitle && (
                                <p className="text-red-500 text-sm">{errors.metaTitle.message}</p>
                            )}
                            <p className="text-xs text-gray-500">
                                {watch("metaTitle")?.length || 0}/60 characters
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="metaDescription">Meta Description</Label>
                            <Textarea
                                id="metaDescription"
                                placeholder="Brief description for search engines"
                                rows={3}
                                {...register("metaDescription", {
                                    maxLength: {
                                        value: 160,
                                        message: "Meta description cannot exceed 160 characters",
                                    },
                                })}
                            />
                            {errors.metaDescription && (
                                <p className="text-red-500 text-sm">
                                    {errors.metaDescription.message}
                                </p>
                            )}
                            <p className="text-xs text-gray-500">
                                {watch("metaDescription")?.length || 0}/160 characters
                            </p>
                        </div>

                        {/* SEO Keywords */}
                        <div className="space-y-2">
                            <Label htmlFor="seoKeywords">SEO Keywords</Label>
                            <Controller
                                name="seoKeywords"
                                control={control}
                                render={({ field }) => (
                                    <KeywordsInput value={field.value} onChange={field.onChange} />
                                )}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex bg-body items-center justify-end gap-4 sticky bottom-0 py-4 border-t border-t-gray-300">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="min-w-[120px]"
                    >
                        {isSubmitting ? (
                            "Updating..."
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </form>

            {/* Tiptap Editor Styles */}
            <style jsx global>{`
                .ProseMirror { outline: none; }
                .ProseMirror p { margin: 0.75rem 0; }
                .ProseMirror h1 { font-size: 2rem; font-weight: bold; margin: 1rem 0; }
                .ProseMirror h2 { font-size: 1.5rem; font-weight: bold; margin: 0.875rem 0; }
                .ProseMirror h3 { font-size: 1.25rem; font-weight: bold; margin: 0.75rem 0; }
                .ProseMirror ul, .ProseMirror ol { padding-left: 1.5rem; margin: 0.75rem 0; }
                .ProseMirror blockquote { border-left: 4px solid #e5e7eb; padding-left: 1rem; color: #6b7280; margin: 1rem 0; }
                .ProseMirror code { background-color: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem; font-family: monospace; }
                .ProseMirror pre { background-color: #1f2937; color: #f9fafb; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin: 1rem 0; }
                .ProseMirror pre code { background: none; color: inherit; padding: 0; }
                .ProseMirror img { max-width: 100%; height: auto; border-radius: 0.5rem; margin: 1rem 0; }
                .ProseMirror a { color: #3b82f6; text-decoration: underline; }
            `}</style>
        </div>
    )
}

export default EditBlogPage