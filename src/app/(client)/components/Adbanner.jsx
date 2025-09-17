import Image from "next/image";
import Link from "next/link";

import { Carousel } from "@/components/ui/carousel";

const vendorAds = [
  { id: 1, img: "/ads/ad-banner-2.webp", alt: "Wedding background" },
  { id: 2, img: "/ads/ad-banner-4.webp", alt: "Floral decoration ad" },
  { id: 3, img: "/ads/ad-banner-3.webp", alt: "Photography ad" },
];

const Adbanner = () => {
  return (
    <Carousel
      slidesPerView={1}
      spaceBetween={0}
      loop={true}
      autoplay
      className="overflow-hidden"
      navigationInside={true}
    >
      {vendorAds.map((ad) => (
            <Link href="#" key={ad.id}>
              <Image
                src={ad.img}
                alt={ad.alt}
                width={1300}
                height={500}
                className="w-full object-cover"
              />
            </Link>
        ))}
    </Carousel>
  );
};

export default Adbanner;
