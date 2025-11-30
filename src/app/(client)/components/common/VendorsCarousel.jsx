import { VendorsCarouselClient } from "./VendorsCarouselClient";
import { getActiveVendors } from "@/app/actions/public/vendors";
import { checkAuthStatus } from "@/app/actions/user/user";

const VendorsCarousel = async ({ filter = {}, currentVendor, sourceType = "other" }) => {

    const resultVendors = await getActiveVendors(filter);
    const vendors = resultVendors.data || [];

    // Skip savedVendors fetch to avoid token refresh during Server Component rendering
    const authStatus = await checkAuthStatus("user", true);
    const isAuthenticated = authStatus.isAuthenticated;

    return (
        <VendorsCarouselClient
            vendors={vendors}
            isAuthenticated={isAuthenticated}
            currentVendor={currentVendor}
            sourceType={sourceType}
        />
    );

}

export default VendorsCarousel;