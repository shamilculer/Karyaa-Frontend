// app/admin/content/page.js
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Edit2, Eye, Calendar, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAllContentAction } from "@/app/actions/admin/pages";
import { toast } from "sonner";

const CMS = () => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Define page metadata
  const pageConfig = {
    "landing-page": {
      name: "Landing Page",
      icon: FileText,
      description: "Hero, features, CTA sections",
      type: "section",
    },
    "contact-page": {
      name: "Contact Page",
      icon: FileText,
      description: "Banner and content sections",
      type: "section",
    },
    "auth-pages": {
      name: "Auth Pages",
      icon: FileText,
      description: "Login and registration pages",
      type: "section",
    },
    "privacy-policy": {
      name: "Privacy Policy",
      icon: FileText,
      description: "Privacy and data protection",
      type: "page",
    },
    "cookie-policy": {
      name: "Cookie Policy",
      icon: FileText,
      description: "Cookie usage information",
      type: "page",
    },
    "terms-and-conditions": {
      name: "Terms and Conditions",
      icon: FileText,
      description: "Terms of service",
      type: "page",
    },
    "faq-page": {
      name: "FAQ Page",
      icon: FileText,
      description: "Customer and vendor FAQs with page title",
      type: "faq",
    },
    "refer-modal": {
      name: "Refer & Earn Modal",
      icon: FileText,
      description: "Refer modal content and background image",
      type: "setting",
    },
    "story-page": {
      name: "Story Page",
      icon: FileText,
      description: "Our Story timeline and banner",
      type: "section",
    },
  };

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    try {
      const result = await getAllContentAction();
      if (result.success) {
        setContents(result.data);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  const getEditUrl = (page) => {
    if (page.key === "landing-page") {
      return `/admin/content-moderation/content/landing-page`;
    } else if (page.key === "contact-page") {
      return `/admin/content-moderation/content/contact-page`;
    } else if (page.key === "auth-pages") {
      return `/admin/content-moderation/content/auth-pages`;
    } else if (page.key === "faq-page") {
      return `/admin/content-moderation/content/faq`;
    } else if (page.key === "refer-modal") {
      return `/admin/content-moderation/content/refer-modal`;
    } else if (page.key === "story-page") {
      return `/admin/content-moderation/content/story-page`;
    } else if (page.type === "page") {
      return `/admin/content-moderation/content/${page.key}`;
    }
    return `/admin/content-moderation/content/edit/${page.key}`;
  };

  const getPreviewUrl = (page) => {
    const previewUrls = {
      "privacy-policy": "/privacy-policy",
      "cookie-policy": "/cookie-policy",
      "terms-and-conditions": "/terms-and-conditions",
      "faq-page": "/faq",
      "landing-page": "/",
      "contact-page": "/contact",
      "story-page": "/story",
    };
    return previewUrls[page.key] || `/${page.key}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Group contents for display
  const displayPages = Object.keys(pageConfig).map((key) => {
    const content = contents.find((c) => c.key === key);
    return {
      key,
      ...pageConfig[key],
      content: content?.content || null,
      updatedAt: content?.updatedAt || null,
      type: content?.type || pageConfig[key].type,
    };
  });

  return (
    <div className="dashboard-container space-y-6 mb-12">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sidebar-foreground font-semibold !text-2xl uppercase tracking-widest">Content Management</span>
          <p className="!text-sm text-gray-500">Manage static pages and content sections</p>
        </div>
        <div className="!text-sm font-medium text-gray-500 bg-gray-100 px-3 rounded-full">
          {displayPages.length} pages
        </div>
      </div>

      <div className="space-y-4">
        {displayPages.map((page) => {
          const Icon = page.icon;
          return (
            <div
              key={page.key}
              className="bg-white rounded-lg p-5 border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 group border border-gray-300"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 text-primary rounded-xl group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-gray-900 !text-lg">{page.name}</h3>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-0 font-medium text-xs px-2 py-0.5 capitalize">
                      {page.type || 'Page'}
                    </Badge>
                  </div>
                  <p className="text-gray-500 !text-sm">{page.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 pl-14 md:pl-0">
                <Button asChild variant="outline" size="sm" disabled={!page.content} className="h-9 border-gray-200 text-gray-700 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50">
                  <Link href={getPreviewUrl(page)} target="_blank" rel="noopener noreferrer">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Link>
                </Button>
                <Button asChild size="sm" className="h-9 bg-gray-900 hover:bg-black text-white shadow-sm px-5">
                  <Link href={getEditUrl(page)}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Content
                  </Link>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CMS;