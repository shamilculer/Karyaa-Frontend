"use client";
import Link from "next/link"

const VendorPopupHeader = ({
    showHeader = false,
    hasPackages,
}) => {
    // Helper to get initials (similar to the main page)

    return (
        <div className={`w-full lg:w-[93.2%] mx-auto flex items-center z-55 pt-2 bg-white border border-t-0 border-r-0 border-gray-300 fixed top-16 lg:top-20 left-0 transition-transform duration-300 ease-in-out ${showHeader ? 'translate-y-0' : '-translate-y-[100%]'
                }`}>
            <div className="container">
                <div className=" px-0 sm:px-6 md:px-10"> {/* Added responsive padding */}
                    {/* Navigation links - Adjusted font size for responsiveness */}
                    <div className="flex items-center gap-4 sm:gap-10 overflow-x-auto whitespace-nowrap scrollbar-hide">
                        <Link href="#about" className="py-2 px-1 text-xs sm:text-base font-medium uppercase tracking-widest border-b-2 border-transparent hover:border-primary transition-colors">About</Link>
                        <Link href="#services" className="py-2 px-1 text-xs sm:text-base font-medium uppercase tracking-widest border-b-2 border-transparent hover:border-primary transition-colors">Services</Link>
                        <Link href="#pricing" className="py-2 px-1 text-xs sm:text-base font-medium uppercase tracking-widest border-b-2 border-transparent hover:border-primary transition-colors">Pricing</Link>
                        <Link href="#reviews" className="py-2 px-1 text-xs sm:text-base font-medium uppercase tracking-widest border-b-2 border-transparent hover:border-primary transition-colors">Reviews</Link>
                        {hasPackages && (
                            <Link href="#packages" className="py-2 px-1 text-xs sm:text-base font-medium uppercase tracking-widest border-b-2 border-transparent hover:border-primary transition-colors">Packages</Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VendorPopupHeader