import { getActiveBanners } from "@/app/actions/public/adBanner";
import Image from "next/image";
import Link from "next/link";
import PageTitleSlider from "./PageTitleSlider";

async function PageTitle({ imgUrl, videoUrl, mediaType, title, tagline, placement }) {
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
                <section className="!m-0 relative w-full overflow-hidden">
                    <PageTitleSlider banners={banners} defaultTitle={title} defaultTagline={tagline} />
                </section>
            );
        }

        // If single banner, show static image/video
        const bannerToShow = banners[0];
        const destinationLink =
            bannerToShow.isVendorSpecific && bannerToShow.vendorSlug
                ? `/vendors/${bannerToShow.vendorSlug}`
                : bannerToShow.customUrl;

        // Determine title and tagline to show
        const displayTitle = bannerToShow.title || title;
        const displayTagline = bannerToShow.tagline || tagline;
        const showOverlay = (bannerToShow.showOverlay !== false) && !!(displayTitle || displayTagline);
        const isAuto = bannerToShow.displayMode === 'auto';
        const isVideo = bannerToShow.mediaType === 'video';

        const Wrapper = destinationLink ? Link : "div";
        const wrapperProps = destinationLink ? { href: destinationLink } : {};

        return (
            <section className={`!m-0 relative w-full ${isAuto ? '' : 'h-64 md:h-[400px]'}`}>
                <Wrapper {...wrapperProps} className={isAuto ? "block w-full" : "absolute inset-0 w-full h-full"}>
                    {isVideo ? (
                        // Video rendering
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="metadata"
                            poster={bannerToShow.imageUrl}
                            className={isAuto ? "w-full h-auto" : "w-full h-full object-cover"}
                        >
                            <source src={`${bannerToShow.videoUrl}#t=0.01`} type="video/mp4" />
                            {/* Fallback to image if video fails */}
                            {isAuto ? (
                                <Image
                                    src={bannerToShow.imageUrl}
                                    alt={bannerToShow.name || displayTitle || "Banner"}
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    className="w-full h-auto"
                                />
                            ) : (
                                <Image
                                    src={bannerToShow.imageUrl}
                                    alt={bannerToShow.name || displayTitle || "Banner"}
                                    fill
                                    className="object-cover"
                                />
                            )}
                        </video>
                    ) : (
                        // Image rendering
                        <>
                            {/* Desktop Image */}
                            {isAuto ? (
                                <Image
                                    src={bannerToShow.imageUrl}
                                    alt={bannerToShow.name || displayTitle || "Banner"}
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    className={`w-full h-auto ${bannerToShow.mobileImageUrl ? "hidden md:block" : ""}`}
                                    priority
                                />
                            ) : (
                                <Image
                                    src={bannerToShow.imageUrl}
                                    alt={bannerToShow.name || displayTitle || "Banner"}
                                    fill
                                    className={`object-cover ${bannerToShow.mobileImageUrl ? "hidden md:block" : ""}`}
                                    priority
                                    sizes="100vw"
                                />
                            )}
                            {/* Mobile Image (if available) */}
                            {bannerToShow.mobileImageUrl && (
                                isAuto ? (
                                    <Image
                                        src={bannerToShow.mobileImageUrl}
                                        alt={bannerToShow.name || displayTitle || "Banner"}
                                        width={0}
                                        height={0}
                                        sizes="100vw"
                                        className="w-full h-auto md:hidden"
                                        priority
                                    />
                                ) : (
                                    <Image
                                        src={bannerToShow.mobileImageUrl}
                                        alt={bannerToShow.name || displayTitle || "Banner"}
                                        fill
                                        className="object-cover md:hidden"
                                        priority
                                        sizes="100vw"
                                    />
                                )
                            )}
                        </>
                    )}
                </Wrapper>

                {/* Conditional Overlay */}
                {showOverlay && (
                    <>
                        <div className="absolute inset-0 bg-black opacity-30 w-full h-full pointer-events-none"></div>
                        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                            <div className="text-white text-center px-4">
                                {displayTitle && (bannerToShow.showTitle !== false) && <h1 className="!text-white !text-4xl lg:!text-[55px]">{displayTitle}</h1>}
                                {displayTagline && (
                                    <p className="mt-2 !text-sm max-md:text-xs">{displayTagline}</p>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </section>
        );
    }

    // Fallback to default background image/video if no banner
    return (
        <section className={`!m-0 relative w-full h-64 md:h-[400px]`}>
            <div className="absolute inset-0 w-full h-full">
                {videoUrl ? (
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        poster={imgUrl}
                        className="w-full h-full object-cover"
                    >
                        <source src={`${videoUrl}#t=0.01`} type="video/mp4" />
                        {/* Fallback to image if video fails or while loading */}
                        <Image
                            src={imgUrl || "/new-banner-3.jpg"}
                            alt={title || "Banner"}
                            fill
                            className="object-cover"
                            priority
                            sizes="100vw"
                        />
                    </video>
                ) : (
                    <Image
                        src={imgUrl || "/new-banner-3.jpg"}
                        alt={title || "Banner"}
                        fill
                        className="object-cover"
                        priority
                        sizes="100vw"
                    />
                )}
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black opacity-50 w-full h-full pointer-events-none"></div>

            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <div className="text-white text-center px-4">
                    <h1 className="!text-white !text-4xl lg:!text-[55px] font-bold">{title}</h1>
                    {tagline && (
                        <p className="mt-2 text-sm md:text-base max-w-2xl mx-auto opacity-90">{tagline}</p>
                    )}
                </div>
            </div>
        </section>
    );
}

export default PageTitle;
