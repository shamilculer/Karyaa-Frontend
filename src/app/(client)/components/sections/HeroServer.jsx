import React from "react";
import Hero from "./Hero";
import { getContentByKeyAction } from "@/app/actions/public/content";
import { getActiveBanners } from "@/app/actions/public/adBanner";

export default async function HeroServer() {
  try {
    // Fetch CMS Content
    const contentResult = await getContentByKeyAction("hero-section");
    let parsedContent = null;

    if (contentResult?.success && contentResult.data?.content) {
      try {
        parsedContent = typeof contentResult.data.content === "string"
          ? JSON.parse(contentResult.data.content)
          : contentResult.data.content;
      } catch (e) {
        console.warn("[HeroServer] failed to parse content", e);
      }
    }

    // Fetch Ad Banners for Hero Section
    const bannerResult = await getActiveBanners("Hero Section");
    let bannerImages = [];

    if (bannerResult.success && bannerResult.data?.length > 0) {
      bannerImages = bannerResult.data.map(b => ({
        src: b.imageUrl,
        link: b.isVendorSpecific && b.vendorSlug
          ? `/vendors/${b.vendorSlug}`
          : b.customUrl || "#"
      }));
    }

    // Logic: 
    // 1. If no banners, use defaults (handled in Hero.jsx if images array is empty/null)
    // 2. If < 3 banners, mix with defaults to reach at least 3
    // 3. If >= 3 banners, show ONLY banners

    let finalImages = [];
    let shouldMergeDefaults = false;

    if (bannerImages.length >= 6) {
      finalImages = bannerImages;
    } else if (bannerImages.length > 0) {
      // Less than 3 banners, need to fill with defaults
      finalImages = bannerImages;
      shouldMergeDefaults = true;
    } else {
      // No banners
      finalImages = [];
    }

    const finalData = {
      ...(parsedContent || {}),
      images: finalImages,
      shouldMergeDefaults
    };

    return <Hero data={finalData} />;
  } catch (err) {
    console.error("[HeroServer] error:", err);
    return <Hero />;
  }
}
