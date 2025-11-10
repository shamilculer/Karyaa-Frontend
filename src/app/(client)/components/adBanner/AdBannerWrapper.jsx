import { getActiveBanners } from "@/app/actions/adBanner";
import AdBanner from "./Adbanner";

const PLACEMENT_SLOT = "Homepage Carousel";

export default async function AdBannerWrapper() {
  const result = await getActiveBanners(PLACEMENT_SLOT);

  if (!result.success) return null;
  const vendorAds = result.data || [];

  if (vendorAds.length === 0) return null;

  return <AdBanner vendorAds={vendorAds} />;
}
