import React from "react";
import Hero from "./Hero";
import { getActiveBanners } from "@/app/actions/public/adBanner";
import { getPublicContentByKeyAction } from "@/app/actions/public/pages";

export default async function HeroServer() {
  try {
    // Fetch Ad Banners and Hero Content in parallel
    const [bannerResult, contentResult] = await Promise.all([
      getActiveBanners("Hero Section"),
      getPublicContentByKeyAction("hero-section")
    ]);

    let bannerImages = [];

    if (bannerResult.success && bannerResult.data?.length > 0) {
      bannerImages = bannerResult.data.map(b => ({
        src: b.imageUrl,
        link: b.isVendorSpecific && b.vendorSlug
          ? `/vendors/${b.vendorSlug}`
          : b.customUrl
      }));
    }

    // Parse hero content if available
    let heroContent = {};

    if (contentResult.success && contentResult.data?.content) {
      heroContent = typeof contentResult.data.content === 'string'
        ? JSON.parse(contentResult.data.content)
        : contentResult.data.content;
    }

    // Logic: 
    // 1. If < 6 banners, fill with defaults
    // 2. If >= 6 banners, show ONLY banners
    const shouldMergeDefaults = bannerImages.length < 6;

    const finalData = {
      images: bannerImages,
      shouldMergeDefaults,
      heading: heroContent.heading,
      description: heroContent.description
    };

    return <Hero data={finalData} />;
  } catch (err) {
    console.error("[HeroServer] error:", err);
    return <Hero />;
  }
}
