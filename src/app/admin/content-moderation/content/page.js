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
    };
    return previewUrls[page.key] || `/${page.key}`;
  };

  const getStatusBadge = (content) => {
    if (
      !content.content ||
      (typeof content.content === "string" && !content.content.trim()) ||
      (Array.isArray(content.content) && content.content.length === 0)
    ) {
      return <Badge variant="destructive">Draft</Badge>;
    }
    return <Badge className="bg-green-500">Published</Badge>;
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
    <div className="dashboard-container space-y-8 mb-12">
      <div className="flex items-center justify-between">
        <span className="text-sidebar-foreground font-semibold text-2xl uppercase tracking-widest">
          Content Management
        </span>
        <div className="text-sm text-muted-foreground">
          {displayPages.length} total pages
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayPages.map((page) => {
          const Icon = page.icon;
          return (
            <Card
              key={page.key}
              className="hover:shadow-lg transition-shadow space-y-0"
            >
              <CardHeader className="pb-1">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{page.name}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {page.description}
                      </CardDescription>
                    </div>
                  </div>
                  {/* {getStatusBadge(page)} */}
                </div>
              </CardHeader>

              {/* <CardContent className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {page.updatedAt
                      ? `Modified ${new Date(
                          page.updatedAt
                        ).toLocaleDateString()}`
                      : "Not created yet"}
                  </span>
                </div>
              </CardContent> */}

              <CardFooter className="flex gap-2 pt-1">
                <Button asChild className="flex-1" size="sm">
                  <Link href={getEditUrl(page)}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  disabled={!page.content}
                >
                  <Link
                    href={getPreviewUrl(page)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CMS;