import { Suspense } from 'react';
import VendorsList, { VendorListSkeleton } from './VendorsList';

/**
 * VendorsListWrapper
 * * This Server Component acts as the Suspension Boundary.
 * It renders the loading state (VendorListSkeleton) immediately 
 * while the child VendorsList component fetches data on the server.
 */
const VendorsListWrapper = ({ showControls, filters, isSubPage }) => {
    
    return (
        <div className="relative w-full">
            <Suspense fallback={<VendorListSkeleton />}>
                <VendorsList 
                    showControls={showControls} 
                    filters={filters} 
                    isSubPage={isSubPage}
                />
            </Suspense>
        </div>
    );
};

export default VendorsListWrapper;