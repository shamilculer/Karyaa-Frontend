"use client";

import Image from "next/image";
import Link from "next/link";
import { Carousel } from "@/components/ui/carousel";

export default function AdBanner({ vendorAds }) {
  return (
    <Carousel
      slidesPerView={1}
      spaceBetween={0}
      loop
      autoplay
      className="overflow-hidden"
      navigationInside
    >
      {vendorAds.map((ad) => {
        const destinationLink =
          ad.isVendorSpecific && ad.vendorSlug
            ? `/vendors/${ad.vendorSlug}`
            : ad.customUrl || "#";

        return (
          <Link href={destinationLink} key={ad._id}>
            <Image
              src={ad.imageUrl}
              alt={ad.name ?? "Vendor Advertisement"}
              width={1300}
              height={500}
              className="w-full object-cover"
            />
          </Link>
        );
      })}
    </Carousel>
  );
}
