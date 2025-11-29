import { VendorsCard } from "./vendorsList/VendorsList";
import { Carousel } from "@/components/ui/carousel";
import { getActiveVendors } from "@/app/actions/public/vendors";
import { checkAuthStatus } from "@/app/actions/user/user";

const VendorsCarousel = async ({ filter = {}, currentVendor }) => {

    const resultVendors = await getActiveVendors(filter);
    let vendors = resultVendors.data || []; // Use 'let' so we can reassign

    const authStatus = await checkAuthStatus();
    const isAuthenticated = authStatus.isAuthenticated;


    if(currentVendor){
        vendors = vendors.filter(vendor => vendor._id !== currentVendor);
    }

    return (
        <Carousel
            slidesPerView={1}
            spaceBetween={60}
            autoplay={true}
            withNavigation={true}
            withPagination={true}
            navigationPosition="top-right"
            breakpoints={{
                640: { // Example breakpoint for small screens
                    slidesPerView: 2,
                },
                1024: { // Matches the original request's desktop breakpoint
                    slidesPerView: 3,
                }
            }}
            className="!pb-10 max-md:!mt-10" // Add some padding for the navigation/pagination
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