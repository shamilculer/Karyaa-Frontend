// app/gallery/GalleryContent.jsx
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/utils";
import { getAllGalleryItems } from "@/app/actions/gallery";

export default async function GalleryContent() {
    const galleryData = await getAllGalleryItems({ limit: 30 });
    const items = galleryData.items
    //   if (error) return <p className="text-red-500">{error}</p>;

    if (!items || items.length === 0)
        return <p className="opacity-60">No gallery items found.</p>;

    return (
        <div className="max-w-[1200px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-9">
            {items.map((item) => (
                <div
                    key={item._id}
                    className="relative rounded-xl overflow-hidden shadow-md cursor-pointer group hover:scale-105 transition-all duration-200"
                >
                    <Image
                        src={item.url}
                        alt="gallery"
                        height={300}
                        width={300}
                        className="w-full h-80 object-cover rounded-xl"
                    />

                    {/* Hover vendor info */}
                    <Link
                        href={`/vendors/${item.vendor?.slug}`}
                        className="
        absolute bottom-5 left-5 w-full z-10 flex items-center gap-2
        opacity-0 pointer-events-none translate-y-3
        transition-all duration-300
        group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto
      "
                    >
                        <Avatar className="size-10 rounded-full overflow-hidden">
                            <AvatarImage
                                src={item.vendor?.businessLogo}
                                className="object-cover size-full"
                            />
                            <AvatarFallback className="bg-primary text-white">
                                {getInitials(item.vendor?.businessName)}
                            </AvatarFallback>
                        </Avatar>
                        <h4 className="!text-white text-lg !font-medium">
                            {item.vendor?.businessName}
                        </h4>
                    </Link>

                    <div className="absolute inset-0 group-hover:bg-gradient-to-t from-black/65 to-transparent rounded-xl"></div>
                </div>
            ))}
        </div>
    );
}
