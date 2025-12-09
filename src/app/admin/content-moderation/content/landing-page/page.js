"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, Loader2, Eye, ImageIcon, Type, List, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useS3Upload } from "@/hooks/useS3Upload";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getContentByKeyAction, upsertContentAction, saveLandingPageAction } from "@/app/actions/admin/pages";
import SimpleTiptapEditor from "@/components/admin/SimpleTiptapEditor";

const sections = [
  {
    key: "hero-section",
    label: "Hero Section",
    description: "Main banner with headline and description",
    fields: [
      {
        name: "heading",
        label: "Heading",
        type: "textarea",
        placeholder: "Your Perfect Event Starts Here.\nPlan. Connect. Celebrate.",
        description: "Press Enter to create a new line in your heading"
      },
      { name: "description", label: "Description", type: "richtext", placeholder: "Plan your next celebration in the perfect venue..." },
    ]
  },
  {
    key: "why-choose-us",
    label: "Why Choose Us",
    description: "Highlight your unique value proposition",
    fields: [
      { name: "heading", label: "Heading", type: "textarea", placeholder: "Why thousands trust us" },
      { name: "description", label: "Description", type: "richtext", placeholder: "Explain what makes you special..." },
      { name: "image", label: "Feature Image", type: "image" },
      { name: "cta_text", label: "CTA Button Text", type: "text", placeholder: "Get Started" },
      { name: "cta_link", label: "CTA Button Link", type: "text", placeholder: "/vendors" }
    ]
  },
  {
    key: "how-it-works",
    label: "How It Works",
    description: "Step-by-step guide for your users",
    fields: [
      { name: "heading", label: "Heading", type: "textarea", placeholder: "Plan Your Event in 3 Easy Steps" },
      { name: "description", label: "Description", type: "richtext", placeholder: "Describe the process..." },
      { name: "image", label: "Process Image", type: "image" }
    ]
  },
  {
    key: "testimonials",
    label: "Testimonials",
    description: "Customer reviews and feedback",
    fields: [
      { name: "heading", label: "Section Heading", type: "textarea", placeholder: "WHAT PEOPLE SAY ABOUT US" },
      { name: "testimonials", label: "Testimonials", type: "testimonial-list" }
    ]
  },
  {
    key: "cta-sections",
    label: "Call to Action Sections",
    description: "Final conversion sections",
    fields: [
      { name: "cta1_heading", label: "CTA 1 - Heading", type: "textarea", placeholder: "LIST YOUR SERVICES AND GET DISCOVERED" },
      { name: "cta1_button_text", label: "CTA 1 - Button Text", type: "text", placeholder: "Join As a Vendor" },
      { name: "cta1_button_link", label: "CTA 1 - Button Link", type: "text", placeholder: "/auth/vendor/register" },
      { name: "cta1_image", label: "CTA 1 - Image", type: "image" },
      { name: "cta2_heading", label: "CTA 2 - Heading", type: "textarea", placeholder: "LET THE WORLD KNOW OUR VENDORS" },
      { name: "cta2_button_text", label: "CTA 2 - Button Text", type: "text", placeholder: "Refer & Earn" },
      { name: "cta2_button_link", label: "CTA 2 - Button Link", type: "text", placeholder: "Leave empty to open Refer & Earn modal", description: "Leave empty to open Refer & Earn modal" },
      { name: "cta2_image", label: "CTA 2 - Image", type: "image" }
    ]
  }
];

const ImageUploadField = ({ value, onChange, maxImages = 1, label, sectionKey, fieldName }) => {
  const images = Array.isArray(value) ? value : (value ? [value] : []);
  const isMultiple = maxImages > 1;
  const { uploadFile, uploading } = useS3Upload();
  const [localUploading, setLocalUploading] = useState(false);
  const fileInputRef = React.useRef(null);

  const removeImage = (index) => {
    if (isMultiple) {
      onChange(images.filter((_, i) => i !== index));
    } else {
      onChange("");
    }
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setLocalUploading(true);
    const uploadedUrls = [];

    try {
      for (const file of files) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error(`Skipping invalid file: ${file.name}`);
          continue;
        }

        // Validate file size
        const maxSize = sectionKey === 'testimonial' ? 2097152 : 10485760; // 2MB for testimonials, 10MB for others
        if (file.size > maxSize) {
          toast.error(`${file.name} is too large. Max size is ${maxSize / (1024 * 1024)}MB`);
          continue;
        }

        try {
          const result = await uploadFile(file, {
            role: 'admin',
            folder: `admin/landing-page/${sectionKey}`,
            isPublic: false
          });

          if (result?.url) {
            uploadedUrls.push(result.url);
          }
        } catch (err) {
          console.error(`Failed to upload ${file.name}:`, err);
          toast.error(`Failed to upload ${file.name}`);
        }
      }

      if (uploadedUrls.length > 0) {
        if (isMultiple) {
          const newImages = [...images, ...uploadedUrls].slice(0, maxImages);
          onChange(newImages);
          toast.success(`${uploadedUrls.length} image(s) uploaded successfully!`);
        } else {
          onChange(uploadedUrls[0]);
          toast.success("Image uploaded successfully!");
        }
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload images");
    } finally {
      setLocalUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-3">
      <Label>{label}</Label>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className={`grid ${isMultiple ? 'grid-cols-5' : 'grid-cols-1'} gap-3`}>
          {images.map((img, idx) => (
            <div key={idx} className="relative group aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
              <Image
                src={img}
                alt={`Upload ${idx + 1}`}
                className="w-full h-full object-cover"
                width={200}
                height={200}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  size="icon"
                  variant="destructive"
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {(!isMultiple || images.length < maxImages) && (
        <>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            multiple={isMultiple}
            onChange={handleFileSelect}
            disabled={localUploading || uploading}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={localUploading || uploading}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-700 bg-gray-50 hover:bg-gray-100 disabled:opacity-50 transition duration-150 flex items-center justify-center gap-2"
          >
            {localUploading || uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                <span>
                  {isMultiple
                    ? `Upload Images (${images.length}/${maxImages})`
                    : "Upload Image"
                  }
                </span>
              </>
            )}
          </button>
        </>
      )}
    </div>
  );
};

const TestimonialListField = ({ value, onChange }) => {
  const testimonials = Array.isArray(value) ? value : [];

  const addTestimonial = () => {
    onChange([...testimonials, { name: "", text: "", image: "", rating: 5 }]);
  };

  const updateTestimonial = (index, field, val) => {
    const updated = [...testimonials];
    updated[index][field] = val;
    onChange(updated);
  };

  const removeTestimonial = (index) => {
    onChange(testimonials.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Testimonials</Label>
        <Button size="sm" onClick={addTestimonial}>
          + Add Testimonial
        </Button>
      </div>

      {testimonials.map((testimonial, idx) => (
        <Card key={idx} className="bg-[#fafafa] !p-5">
          <CardHeader className="!pb-0 border-b border-gray-300 px-0">
            <div className="flex justify-between items-center">
              <CardTitle className="!text-sm uppercase">Testimonial {idx + 1}</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeTestimonial(idx)}
                className="h-8 w-8 border rounded-full border-red-500 text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 p-0">
            {/* Grid layout for name and rating */}
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor={`testimonial-name-${idx}`}>Customer Name</Label>
                <Input
                  id={`testimonial-name-${idx}`}
                  placeholder="Customer Name"
                  value={testimonial.name}
                  onChange={(e) => updateTestimonial(idx, "name", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`testimonial-rating-${idx}`}>Rating</Label>
                <Select
                  value={testimonial.rating.toString()}
                  onValueChange={(val) => updateTestimonial(idx, "rating", parseInt(val))}
                >
                  <SelectTrigger className="!h-11" id={`testimonial-rating-${idx}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 4, 3, 2, 1].map(num => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} Stars
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Testimonial text */}
            <div className="space-y-2">
              <Label htmlFor={`testimonial-text-${idx}`}>Testimonial Text</Label>
              <Textarea
                id={`testimonial-text-${idx}`}
                placeholder="Testimonial text..."
                value={testimonial.text}
                onChange={(e) => updateTestimonial(idx, "text", e.target.value)}
                className="h-20 resize-none"
              />
            </div>

            {/* Customer photo with smaller preview */}
            <div className="space-y-2">
              <Label>Customer Photo</Label>
              {testimonial.image ? (
                <div className="flex items-start gap-3">
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200 flex-shrink-0">
                    <Image
                      src={testimonial.image}
                      alt="Customer"
                      className="w-full h-full object-cover"
                      width={96}
                      height={96}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => updateTestimonial(idx, "image", "")}
                      className="h-8"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Remove Photo
                    </Button>
                  </div>
                </div>
              ) : (
                <ImageUploadField
                  value={testimonial.image}
                  onChange={(val) => updateTestimonial(idx, "image", val)}
                  label=""
                  sectionKey="testimonial"
                  fieldName={`image_${idx}`}
                />
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {testimonials.length === 0 && (
        <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
          No testimonials yet. Click "Add Testimonial" to get started.
        </div>
      )}
    </div>
  );
};

const LandingPageEditor = () => {
  const router = useRouter();
  const [content, setContent] = useState({});
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("hero-section");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    try {
      const promises = sections.map(section =>
        getContentByKeyAction(section.key)
      );

      const results = await Promise.all(promises);
      const contentMap = {};

      results.forEach((result, index) => {
        if (result.success && result.data?.content) {
          const parsedContent = typeof result.data.content === 'string'
            ? JSON.parse(result.data.content)
            : result.data.content;
          contentMap[sections[index].key] = parsedContent;
        }
      });

      setContent(contentMap);
    } catch (error) {
      console.error("Error loading content:", error);
      toast.error("Failed to load landing page content");
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (sectionKey, fieldName, value) => {
    setContent(prev => ({
      ...prev,
      [sectionKey]: {
        ...(prev[sectionKey] || {}),
        [fieldName]: value
      }
    }));
  };

  const handleSaveSection = async (sectionKey) => {
    setSaving(true);
    try {
      const sectionContent = content[sectionKey];
      if (!sectionContent) {
        toast.error("No content to save");
        return;
      }

      const result = await upsertContentAction(sectionKey, {
        type: "section",
        content: JSON.stringify(sectionContent)
      });

      if (result.success) {
        toast.success(`${sections.find(s => s.key === sectionKey)?.label} saved successfully!`);
      } else {
        toast.error(result.message || "Failed to save section");
      }
    } catch (error) {
      console.error("Error saving section:", error);
      toast.error("Failed to save section");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const result = await saveLandingPageAction(content);

      if (result.success) {
        toast.success("All sections saved successfully!");
      } else {
        toast.error(result.message || "Failed to save all sections");
      }
    } catch (error) {
      console.error("Error saving all sections:", error);
      toast.error("Failed to save all sections");
    } finally {
      setSaving(false);
    }
  };

  const renderField = (section, field) => {
    const value = content[section.key]?.[field.name] || "";

    switch (field.type) {
      case "text":
        return (
          <div className="space-y-2">
            <Label htmlFor={`${section.key}-${field.name}`}>{field.label}</Label>
            <Input
              id={`${section.key}-${field.name}`}
              type="text"
              value={value}
              onChange={(e) => handleFieldChange(section.key, field.name, e.target.value)}
              placeholder={field.placeholder}
            />
          </div>
        );

      case "textarea":
        return (
          <div className="space-y-2">
            <Label htmlFor={`${section.key}-${field.name}`}>{field.label}</Label>
            <Textarea
              id={`${section.key}-${field.name}`}
              value={value}
              onChange={(e) => handleFieldChange(section.key, field.name, e.target.value)}
              placeholder={field.placeholder}
              className={`${field.name.includes('heading') ? 'h-20' : 'h-32'} resize-none`}
            />
            {field.description && (
              <p className="!text-xs text-gray-600">{field.description}</p>
            )}
          </div>
        );

      case "image":
        return (
          <ImageUploadField
            value={value}
            onChange={(val) => handleFieldChange(section.key, field.name, val)}
            label={field.label}
            sectionKey={section.key}
            fieldName={field.name}
          />
        );

      case "images":
        return (
          <ImageUploadField
            value={value}
            onChange={(val) => handleFieldChange(section.key, field.name, val)}
            maxImages={field.maxImages || 5}
            label={field.label}
            sectionKey={section.key}
            fieldName={field.name}
          />
        );

      case "testimonial-list":
        return (
          <TestimonialListField
            value={value}
            onChange={(val) => handleFieldChange(section.key, field.name, val)}
          />
        );

      case "richtext":
        return (
          <div className="space-y-2">
            <Label htmlFor={`${section.key}-${field.name}`}>{field.label}</Label>
            <SimpleTiptapEditor
              value={value}
              onChange={(val) => handleFieldChange(section.key, field.name, val)}
              placeholder={field.placeholder}
            />
            {field.description && (
              <p className="!text-xs text-gray-600">{field.description}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container !pt-0 bg-gray-50 ">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky left-0 top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="!rounded-full bg-gray-300"
                onClick={() => router.push("/admin/content-moderation/content")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <span className="!text-xl uppercase font-bold font-heading text-gray-900">Landing Page Editor</span>
                <p className="!text-sm text-gray-500">Customize your landing page content</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open("/", "_blank")}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button onClick={handleSaveAll} disabled={saving} >
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                {saving ? "Saving..." : "Save All"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-12 items-start gap-6 pt-10">
          {/* Sidebar Navigation */}
          <div className="col-span-4">
            <Card className="sticky top-24 py-3">
              <CardContent className="p-2">
                <nav className="space-y-4">
                  {sections.map((section) => (
                    <Button
                      key={section.key}
                      variant={activeSection === section.key ? "default" : "ghost"}
                      className="w-full justify-start rounded-lg h-auto min-h-14 py-3"
                      onClick={() => setActiveSection(section.key)}
                    >
                      <div className="flex items-center gap-3 w-full">
                        {section.key === "hero-section" && <ImageIcon className="h-4 w-4 shrink-0" />}
                        {section.key === "testimonials" && <List className="h-4 w-4 shrink-0" />}
                        {!["hero-section", "testimonials"].includes(section.key) && <Type className="h-4 w-4 shrink-0" />}
                        <div className="text-left flex-1">
                          <div className="text-sm font-medium whitespace-normal break-words">{section.label}</div>
                          <div className="text-xs text-muted-foreground whitespace-normal break-words">{section.description}</div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="col-span-8">
            {sections.map((section) => (
              <div
                key={section.key}
                className={activeSection === section.key ? "block" : "hidden"}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>{section.label}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {section.fields.map((field, idx) => (
                      <div key={idx}>
                        {renderField(section, field)}
                      </div>
                    ))}

                    <div className="pt-6 border-t flex justify-end">
                      <Button
                        onClick={() => handleSaveSection(section.key)}
                        disabled={saving}
                      >
                        {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                        Save {section.label}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPageEditor;