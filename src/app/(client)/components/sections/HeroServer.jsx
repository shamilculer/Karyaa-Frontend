import React from "react";
import Hero from "./Hero";
import { getActiveBanners } from "@/app/actions/public/adBanner";

export default async function HeroServer() {
  try {
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
    // 1. If < 6 banners, fill with defaults
    // 2. If >= 6 banners, show ONLY banners
    const shouldMergeDefaults = bannerImages.length < 6;

    const finalData = {
      images: bannerImages,
      shouldMergeDefaults
    };

    return <Hero data={finalData} />;
  } catch (err) {
    console.error("[HeroServer] error:", err);
    return <Hero />;
  }
}
