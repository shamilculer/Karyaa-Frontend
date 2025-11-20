"use client"
import { AlertCircle, Check} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useVendorStore } from '@/store/vendorStore';
import { sendBundleEnquiryAction } from '@/app/actions/vendor/bundles';
import { toast } from 'sonner';

/**
 * Renders a single Bundle Card based on the provided UI image.
 */
const BundleCard = ({ bundle, selectedId }) => {
    const isSelected = selectedId === bundle._id;
    const isAddOn = bundle.isAddon;
    const hasMaxVendors = bundle.maxVendors > 0

    const getHeaderStyling = () => {
        if (isAddOn) return 'bg-indigo-600 text-white';
        return 'bg-green-600 text-white';
    };

    const getCardBorder = () => {
        if (isSelected) return 'ring-2 ring-blue-500 shadow-xl';
        return 'border border-gray-200 hover:shadow-md';
    };

    const onEnquirySend = async (bundleId) => {
        try {
            const enquiryResponse = await sendBundleEnquiryAction(bundleId);

            if(!enquiryResponse.success){
                console.log(enquiryResponse)
                toast.error(enquiryResponse.message || "Something went wrong! Please try again.");
                return
            }

            toast.success(enquiryResponse.message || "Enquiry sent successfully! We will reach out to you shortly")
        } catch (error) {
            toast.error("Something went wrong! Please try again.");
        }
    }


    // Format duration display - Monthly pricing for Add-ons
    // const durationUnit = bundle.duration?.unit || 'months';
    // const durationValue = bundle.duration?.value || 1;
    // const priceDisplay = isAddOn
    //     ? `AED ${bundle.price}/month`
    //     : `AED ${bundle.price} / ${durationValue} ${durationUnit}`;

    return (
        <Card className={cn("relative flex flex-col h-full transition-all duration-300 pt-0 overflow-hidden rounded-3xl gap-0", getCardBorder())}>

            {/* Dynamic Header Badge (Only shows Launch Offer or Add-ons) */}
            {(hasMaxVendors || isAddOn) && (
                <div className={cn(
                    "w-full px-3 py-3 font-semibold shadow-md text-center z-10",
                    getHeaderStyling()
                )}>
                    {hasMaxVendors ? `First ${bundle.maxVendors} Vendors` : 'Add-ons'}
                </div>
            )}

            <CardHeader className={`mt-4 text-center pb-4 ${isAddOn || hasMaxVendors ? "pt-3" : "pt-5"}`}>
                <CardTitle className="!text-3xl font-heading">
                    {bundle.name}
                </CardTitle>
            </CardHeader>

            <CardContent className="flex-grow space-y-3 mb-6">
                {bundle.features && bundle.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-2">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                        <p className="text-sm text-gray-600">{feature}</p>
                    </div>
                ))}
            </CardContent>

            <CardFooter className="flex flex-col mt-auto pt-4 border-t border-gray-100">
                <p className="!text-3xl font-heading font-bold mb-4 text-center">
                    AED {bundle.price}<span className='!text-xl'>/Month</span>
                </p>
                <Button
                    className="w-full !text-base"
                    disabled={isSelected}
                    onClick={() => onEnquirySend(bundle._id)}
                >
                    {isSelected ? (
                        <>
                            <Check className="w-5 h-5 mr-2" />
                            Selected
                        </>
                    ) : 'Know More'}
                </Button>
            </CardFooter>
        </Card>
    );
};

const BundleList = ({ bundles }) => {
    const { vendor } = useVendorStore();

    const selectedBundleId = vendor?.bundle

    if (!bundles || bundles.length === 0) {
        return (
            <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <AlertCircle className="w-10 h-10 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-700">No Active Bundles Found</h2>
                <p className="text-gray-500 mt-2">
                    It looks like there are no pricing packages available right now.
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {bundles.map((bundle) => (
                    <BundleCard
                        key={bundle._id}
                        bundle={bundle}
                        selectedId={selectedBundleId}
                    />
                ))}
            </div>

        </>
    );
};

export default BundleList