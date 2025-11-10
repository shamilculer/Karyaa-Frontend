"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { updateBrandDetailsAction } from "@/app/actions/admin/brand";
import { getBrandDetailsAction } from "@/app/actions/brand";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

// Icons
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Link,
  Plus,
  X,
  Phone,
  Save,
} from "lucide-react";

const socialPlatforms = [
  { id: "facebook", name: "Facebook", icon: Facebook, color: "text-blue-600" },
  { id: "instagram", name: "Instagram", icon: Instagram, color: "text-pink-600" },
  { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "text-blue-700" },
  { id: "twitter", name: "Twitter", icon: Twitter, color: "text-gray-900" },
  { id: "youtube", name: "YouTube", icon: Youtube, color: "text-red-600" },
  { id: "website", name: "Custom Link", icon: Link, color: "text-gray-500" },
];

export default function ContactManagementPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [branding, setBranding] = useState({
    primaryPhone: "",
    mainEmail: "",
    supportEmail: "",
    location: "",
    socialLinks: [],
  });

  const [newSocialLink, setNewSocialLink] = useState({
    platform: "facebook",
    url: "",
  });

  useEffect(() => {
    async function fetchData() {
      const res = await getBrandDetailsAction("admin");

      if (res?.error) {
        toast.error(res.error);
        setLoading(false);
        return;
      }

      if (res?.data) {
        setBranding(res.data);
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  const handleAddSocialLink = () => {
    if (!newSocialLink.url.trim()) return;

    setBranding({
      ...branding,
      socialLinks: [...branding.socialLinks, newSocialLink],
    });

    setNewSocialLink({ platform: "facebook", url: "" });
    toast.success("Link added locally!");
  };

  const handleRemoveSocialLink = (index) => {
    setBranding({
      ...branding,
      socialLinks: branding.socialLinks.filter((_, i) => i !== index),
    });
    toast.success("Link removed locally!");
  };

  // ✅ Save to server with button loading state
  const handleSave = async () => {
    if (saving) return; // prevent spam

    setSaving(true);

    const res = await updateBrandDetailsAction(branding);

    if (res?.error) {
      toast.error(res.error);
      setSaving(false);
      return;
    }

    toast.success("Brand details updated!");
    router.refresh();
    setSaving(false);
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="dashboard-container space-y-5 mb-14">

      <div className="flex-between gap-16">
        <h3 className="uppercase text-primary/40 !tracking-wider">Contact Details</h3>

        <Button
          className="flex items-center gap-2"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/40 border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save All Changes
            </>
          )}
        </Button>
      </div>

      <Card className="bg-white border-0 py-10 px-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 !text-xl uppercase">
            <Phone className="w-5 h-5" /> Contact Information
          </CardTitle>
          <CardDescription>
            Manage contact details visible on the website.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid md:grid-cols-2 gap-y-7 gap-x-20">
          <div>
            <Label>Primary Phone Number</Label>
            <Input
              value={branding.primaryPhone}
              onChange={(e) =>
                setBranding({ ...branding, primaryPhone: e.target.value })
              }
              placeholder="+971 50 123 4567"
              className="border-gray-300"
            />
          </div>

          <div>
            <Label>Main Email Address</Label>
            <Input
              value={branding.mainEmail}
              onChange={(e) =>
                setBranding({ ...branding, mainEmail: e.target.value })
              }
              placeholder="info@example.com"
              className="border-gray-300"
            />
          </div>

          <div>
            <Label>Support Email Address</Label>
            <Input
              value={branding.supportEmail}
              onChange={(e) =>
                setBranding({ ...branding, supportEmail: e.target.value })
              }
              placeholder="support@example.com"
              className="border-gray-300"
            />
          </div>

          <div>
            <Label>Location / Address</Label>
            <Input
              value={branding.location}
              onChange={(e) =>
                setBranding({ ...branding, location: e.target.value })
              }
              placeholder="Dubai, UAE"
              className="border-gray-300"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-0 py-10 px-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Link className="w-5 h-5" /> Social Media Links
          </CardTitle>
          <CardDescription>
            Configure social platform links displayed publicly.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4 items-end">
            <div>
              <Label>Platform</Label>
              <Select
                value={newSocialLink.platform}
                onValueChange={(val) =>
                  setNewSocialLink({ ...newSocialLink, platform: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose platform" />
                </SelectTrigger>
                <SelectContent>
                  {socialPlatforms.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-1 md:col-span-2">
              <Label>Full URL</Label>
              <Input
                value={newSocialLink.url}
                onChange={(e) =>
                  setNewSocialLink({ ...newSocialLink, url: e.target.value })
                }
                placeholder="https://facebook.com/yourpage"
              />
            </div>

            <Button className="w-fit" onClick={handleAddSocialLink} disabled={saving}>
              <Plus className="w-4 h-4 mr-1" /> Add Link
            </Button>
          </div>

          <Separator />

          <div className="space-y-3">
            <p className="text-sm font-medium">
              Configured Links ({branding.socialLinks.length})
            </p>

            {branding.socialLinks.length === 0 && (
              <p className="text-muted-foreground text-sm">No links added yet.</p>
            )}

            {branding.socialLinks.map((link, index) => {
              const platform = socialPlatforms.find((p) => p.id === link.platform);
              const Icon = platform?.icon || Link;

              return (
                <div
                  key={index}
                  className="flex justify-between items-center rounded border p-3"
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${platform?.color}`} />
                    <div>
                      <p className="font-medium capitalize">{link.platform}</p>
                      <a
                        href={link.url}
                        className="text-sm text-blue-600 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.url}
                      </a>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveSocialLink(index)}
                    disabled={saving}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
