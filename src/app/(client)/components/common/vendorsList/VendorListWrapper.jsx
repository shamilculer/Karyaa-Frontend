import { Suspense } from 'react';
import VendorsList, { VendorListSkeleton } from './VendorsList';
import VendorErrorBoundary from './VendorErrorBoundary';

const VendorsListWrapper = ({ showControls, filters, isSubPage, source }) => {

    return (
        <div className="relative w-full">
            <VendorErrorBoundary>
                <Suspense fallback={<VendorListSkeleton />}>
                    <VendorsList
                        showControls={showControls}
                        filters={filters}
                        isSubPage={isSubPage}
                        source={source}
                    />
                </Suspense>
            </VendorErrorBoundary>
        </div>
    );
};

export default VendorsListWrapper;