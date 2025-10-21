import { VendorsCard } from "./VendorsList";
import { Carousel } from "@/components/ui/carousel";
import { getActiveVendors } from "@/app/actions/vendors";

const VendorsCarousel = async ({ filter = {} }) => {

    const resultVendors = await getActiveVendors(filter);
    const vendors = resultVendors.data || [];

    const isAuthenticated = true;

    return (
        <Carousel
            slidesPerView={1}
            spaceBetween={60}
            autoplay={true}
            withNavigation={true}
            withPagination={true}
            breakpoints={{
                640: { // Example breakpoint for small screens
                    slidesPerView: 2,
                },
                1024: { // Matches the original request's desktop breakpoint
                    slidesPerView: 3,
                }
            }}
            className="!pb-10" // Add some padding for the navigation/pagination
        >
            {vendors.map((vendor) => (
                <VendorsCard key={vendor._id}
                    vendor={vendor}
                    isAuthenticated={isAuthenticated} 
                />
            ))}
        </Carousel>
    );

}

export default VendorsCarousel;