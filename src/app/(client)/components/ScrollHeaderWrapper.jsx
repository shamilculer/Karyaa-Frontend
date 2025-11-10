"use client";

import { useEffect, useState } from "react";
import VendorPopupHeader from "./VendorPopupHeader";

const ScrollHeaderWrapper = ({ vendorData, hasPackages, whatsappLink }) => {
    const [showPopupHeader, setShowPopupHeader] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const vendorNav = document.getElementById('vendor-nav');
            if (vendorNav) {
                const vendorNavTop = vendorNav.offsetTop;
                const scrollTop = window.scrollY;

                // Show popup header when scrolled past the vendor nav
                setShowPopupHeader(scrollTop > vendorNavTop);
            }
        };

        // Add scroll event listener
        window.addEventListener('scroll', handleScroll);

        // Cleanup
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <VendorPopupHeader
            vendorData={vendorData}
            hasPackages={hasPackages}
            whatsappLink={whatsappLink}
            showHeader={showPopupHeader}
        />
    );
};

export default ScrollHeaderWrapper;