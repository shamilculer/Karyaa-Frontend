import { getActiveBanners } from "@/app/actions/public/adBanner";
import Image from "next/image";
import Link from "next/link";
import PageTitleSlider from "./PageTitleSlider";

async function PageTitle({ imgUrl, title, tagline, placement }) {
    let banners = [];

    // Try to fetch placement-specific banner if placement is provided
    if (placement) {
        const result = await getActiveBanners(placement);
        if (result.success && result.data && result.data.length > 0) {
            banners = result.data;
        }
    }

    // If we have banners
    if (banners.length > 0) {
        // If multiple banners, show slider
        if (banners.length > 1) {
            return (
                <section className="!m-0 relative h-64 md:h-[400px] flex-center px-4 overflow-hidden">
                    <PageTitleSlider banners={banners} defaultTitle={title} defaultTagline={tagline} />
                </section>
            );
        }

        // If single banner, show static image
        const bannerToShow = banners[0];
        const destinationLink =
            bannerToShow.isVendorSpecific && bannerToShow.vendorSlug
                ? `/vendors/${bannerToShow.vendorSlug}`
                : bannerToShow.customUrl || "#";

        // Determine title and tagline to show
        const displayTitle = bannerToShow.title || title;
        const displayTagline = bannerToShow.tagline || tagline;
        const showOverlay = !!(displayTitle || displayTagline);

        return (
            <section className="!m-0 relative h-64 md:h-[400px] flex-center px-4">
                <Link href={destinationLink} className="absolute inset-0 w-full h-full">
                    {/* Desktop Image */}
                    <Image
                        src={bannerToShow.imageUrl}
                        alt={bannerToShow.name || displayTitle || "Banner"}
                        fill
                        className={`object-cover ${bannerToShow.mobileImageUrl ? "hidden md:block" : ""}`}
                        priority
                        sizes="100vw"
                    />
                    {/* Mobile Image (if available) */}
                    {bannerToShow.mobileImageUrl && (
                        <Image
                            src={bannerToShow.mobileImageUrl}
                            alt={bannerToShow.name || displayTitle || "Banner"}
                            fill
                            className="object-cover md:hidden"
                            priority
                            sizes="100vw"
                        />
                    )}
                </Link>

                {/* Conditional Overlay */}
                {showOverlay && (
                    <>
                        <div className="absolute inset-0 bg-black opacity-30 w-full h-full pointer-events-none"></div>
                        <div className="relative z-10 text-white text-center pointer-events-none">
                            {displayTitle && <h1 className="!text-white !text-4xl lg:!text-[55px]">{displayTitle}</h1>}
                            {displayTagline && (
                                <p className="mt-2 !text-sm max-md:text-xs">{displayTagline}</p>
                            )}
                        </div>
                    </>
                )}
            </section>
        );
    }

    // Fallback to default background image if no banner
    return (
        <section
            className="!m-0 bg-cover bg-center h-64 md:h-[400px] flex-center relative px-4"
            style={{ backgroundImage: `url(${imgUrl || "/new-banner-3.jpg"})` }}
        >
            <div className="absolute inset-0 bg-black opacity-50 w-full h-full"></div>
            <div className="relative z-10 text-white text-center">
                <h1 className="!text-white !text-4xl lg:!text-[55px]">{title}</h1>
                {tagline && (
                    <p className="mt-2 !text-sm max-md:text-xs">{tagline}</p>
                )}
            </div>
        </section>
    );
}

export default PageTitle;
