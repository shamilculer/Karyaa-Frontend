import { getActiveBanners } from "@/app/actions/public/adBanner";
import PageTitle from "./PageTitle";

export default async function PageTitleWrapper({ imgUrl, title, tagline, placement }) {
    let bannerData = null;

    // Try to fetch placement-specific banner if placement is provided
    if (placement) {
        const result = await getActiveBanners(placement);
        if (result.success && result.data && result.data.length > 0) {
            bannerData = result.data[0];
        }
    }

    return (
        <PageTitle
            imgUrl={imgUrl}
            title={title}
            tagline={tagline}
            placement={placement}
            bannerData={bannerData}
        />
    );
}
