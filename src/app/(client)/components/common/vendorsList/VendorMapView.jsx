"use client"
import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { BadgeCheckIcon, MapPin, Plus } from "lucide-react"
import StarRating from "../../features/reviews/StarRating"
import { getInitials } from "@/utils"

const MapContainer = dynamic(
    () => import('react-leaflet').then((mod) => mod.MapContainer),
    { ssr: false }
);
const TileLayer = dynamic(
    () => import('react-leaflet').then((mod) => mod.TileLayer),
    { ssr: false }
);
const Marker = dynamic(
    () => import('react-leaflet').then((mod) => mod.Marker),
    { ssr: false }
);
const Popup = dynamic(
    () => import('react-leaflet').then((mod) => mod.Popup),
    { ssr: false }
);

// Helper: generate consistent avatar BG color
function getBgColor(name) {
    const colors = [
        "bg-red-500",
        "bg-blue-500",
        "bg-green-500",
        "bg-yellow-500",
        "bg-purple-500",
        "bg-pink-500",
        "bg-indigo-500",
        "bg-teal-500",
    ];
    const hash = name
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
}

// Map Vendor Card Component (optimized for popup)
const MapVendorCard = ({ vendor, isAuthenticated, isInitialSaved }) => {
    const initials = getInitials(vendor.businessName);
    const bgColor = getBgColor(vendor.businessName);
    const vendorId = vendor._id || vendor.id;

    return (
        <div className="w-[240px] xl:w-[320px] rounded overflow-hidden bg-white">
            <div className="relative group">
                {vendor.isRecommended && (
                    <Badge className="absolute top-3 left-3 z-10 bg-white text-primary font-semibold text-sm flex items-center gap-1">
                        <BadgeCheckIcon className="w-5 h-5" />
                        Recommended
                    </Badge>
                )}

                {/* <VendorSaveButton
                    vendorId={vendorId}
                    isInitialSaved={isInitialSaved}
                /> */}

                <div className='h-4'></div>
            </div>

            <div className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                    <Avatar className="size-9 xl:size-12 rounded-full border border-gray-300 flex-shrink-0">
                        <AvatarImage
                            className="object-cover rounded-full"
                            src={vendor.businessLogo}
                            alt={vendor.businessName}
                        />
                        <AvatarFallback
                            className={`${bgColor} text-white font-bold flex items-center justify-center`}
                        >
                            {initials}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                        <h3 className="!text-sm sm:!text-lg font-semibold text-[#232536] font-heading truncate">
                            {vendor.businessName}
                        </h3>
                        <div className="flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3 text-gray-500 flex-shrink-0" />
                            <span className="!text-xs text-gray-600 truncate">
                                {vendor.address.city}, UAE
                            </span>
                        </div>
                    </div>

                    {/* <VendorShareButton
                        businessName={vendor.businessName}
                        slug={vendor.slug}
                    /> */}
                </div>

                <div className="flex items-center justify-between">
                    <StarRating rating={vendor.averageRating} />

                    <p className="!text-xs font-medium text-primary !m-0">
                        From <span className="font-bold">AED {vendor.pricingStartingFrom}</span>
                    </p>
                </div>

                <div className="flex gap-2 pt-2">
                    <Button asChild className="flex-1" size="sm">
                        <Link className='!text-white' href={`/vendors/${vendor.slug}`}>Know More</Link>
                    </Button>

                    <Button asChild variant="outline" size="sm">
                        <Link href={`/compare?vendors=${vendor.slug}`}>
                            <Plus className="w-4 h-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
};

const VendorsMapView = ({ vendors, isAuthenticated, savedVendorIds = [] }) => {
    const [mounted, setMounted] = useState(false);
    const [activePopup, setActivePopup] = useState(null); // Track only one active popup
    const [L, setL] = useState(null);
    const popupTimeoutRef = useRef(null);
    const markersRef = useRef({});

    useEffect(() => {
        // Import Leaflet and CSS only on client side
        Promise.all([
            import('leaflet'),
            import('leaflet/dist/leaflet.css')
        ]).then(([leaflet]) => {
            const L = leaflet.default;

            // Fix for default marker icon in React-Leaflet
            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            });

            setL(L);
            setMounted(true);
        });
    }, []);

    // Close all popups except the active one
    const closeAllPopupsExcept = (vendorId) => {
        Object.keys(markersRef.current).forEach(id => {
            if (id !== vendorId && markersRef.current[id]) {
                markersRef.current[id].closePopup();
            }
        });
    };

    useEffect(() => {
        if (!mounted) return;

        // Handle hover events from vendor cards
        const handleOpenMapPopup = (e) => {
            const vendorId = e.detail;

            // Clear any pending timeout
            if (popupTimeoutRef.current) {
                clearTimeout(popupTimeoutRef.current);
            }

            // Close all other popups
            closeAllPopupsExcept(vendorId);

            // Open the new popup
            if (markersRef.current[vendorId]) {
                markersRef.current[vendorId].openPopup();
                setActivePopup(vendorId);
            }
        };

        const handleCloseMapPopup = () => {
            // Close all popups
            Object.keys(markersRef.current).forEach(vendorId => {
                if (markersRef.current[vendorId]) {
                    markersRef.current[vendorId].closePopup();
                }
            });
            setActivePopup(null);
        };

        window.addEventListener('openMapPopup', handleOpenMapPopup);
        window.addEventListener('closeMapPopup', handleCloseMapPopup);

        return () => {
            window.removeEventListener('openMapPopup', handleOpenMapPopup);
            window.removeEventListener('closeMapPopup', handleCloseMapPopup);
        };
    }, [mounted]);

    const createCustomIcon = (vendor) => {
        if (!L) return null;

        const bgColor = vendor.isRecommended ? '#10b981' : '#6366f1';
        const borderColor = vendor.isRecommended ? '#059669' : '#4f46e5';
        const initials = getInitials(vendor.businessName);
        const avatarBgColor = getBgColor(vendor.businessName);

        // Convert Tailwind color classes to hex
        const colorMap = {
            'bg-red-500': '#ef4444',
            'bg-blue-500': '#3b82f6',
            'bg-green-500': '#22c55e',
            'bg-yellow-500': '#eab308',
            'bg-purple-500': '#a855f7',
            'bg-pink-500': '#ec4899',
            'bg-indigo-500': '#6366f1',
            'bg-teal-500': '#14b8a6',
        };
        const fallbackColor = colorMap[avatarBgColor] || '#6366f1';

        return L.divIcon({
            className: 'custom-marker',
            html: `
          <div style="position: relative;">
            <svg width="50" height="60" viewBox="0 0 50 60" xmlns="http://www.w3.org/2000/svg">
              <!-- Shadow -->
              <ellipse cx="25" cy="56" rx="10" ry="4" fill="rgba(0,0,0,0.2)"/>
              
              <!-- Pin shape -->
              <path d="M25 2C15.611 2 8 9.611 8 19c0 10.356 17 35 17 35s17-24.644 17-35c0-9.389-7.611-17-17-17z" 
                    fill="${bgColor}" 
                    stroke="${borderColor}" 
                    stroke-width="2.5"/>
              
              <!-- White circle background for logo -->
              <circle cx="25" cy="19" r="10" fill="white"/>
              
              <!-- Clip path for circular logo -->
              <defs>
                <clipPath id="circleClip-${vendor._id}">
                  <circle cx="25" cy="19" r="8.5"/>
                </clipPath>
              </defs>
              
              ${vendor.businessLogo
                    ? `<!-- Vendor logo -->
                   <image 
                     href="${vendor.businessLogo}" 
                     x="16.5" 
                     y="10.5" 
                     width="17" 
                     height="17" 
                     clip-path="url(#circleClip-${vendor._id})"
                     preserveAspectRatio="xMidYMid slice"
                   />`
                    : `<!-- Fallback initials -->
                   <circle cx="25" cy="19" r="8.5" fill="${fallbackColor}"/>
                   <text 
                     x="25" 
                     y="19" 
                     text-anchor="middle" 
                     dominant-baseline="central" 
                     fill="white" 
                     font-size="10" 
                     font-weight="bold"
                     font-family="Arial, sans-serif"
                   >${initials}</text>`
                }
              
              ${vendor.isRecommended
                    ? `<!-- Recommended badge -->
                   <circle cx="38" cy="10" r="8" fill="#10b981" stroke="white" stroke-width="2"/>
                   <path d="M35 10l2 2 4-4" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
                    : ''
                }
            </svg>
          </div>
        `,
            iconSize: [50, 60],
            iconAnchor: [25, 60],
            popupAnchor: [0, -60],
        });
    };

    const handleMarkerMouseOver = (vendorId, marker) => {
        if (popupTimeoutRef.current) {
            clearTimeout(popupTimeoutRef.current);
        }

        // Close all other popups
        closeAllPopupsExcept(vendorId);

        // Open this popup
        setActivePopup(vendorId);
        marker.openPopup();
    };

    const handleMarkerMouseOut = (vendorId, marker) => {
        popupTimeoutRef.current = setTimeout(() => {
            if (activePopup === vendorId) {
                setActivePopup(null);
                marker.closePopup();
            }
        }, 200);
    };

    const handlePopupMouseOver = (vendorId) => {
        if (popupTimeoutRef.current) {
            clearTimeout(popupTimeoutRef.current);
        }
    };

    const handlePopupMouseOut = (vendorId) => {
        popupTimeoutRef.current = setTimeout(() => {
            if (activePopup === vendorId) {
                setActivePopup(null);
                if (markersRef.current[vendorId]) {
                    markersRef.current[vendorId].closePopup();
                }
            }
        }, 200);
    };

    const handleMarkerClick = (vendorId, marker) => {
        if (activePopup === vendorId) {
            setActivePopup(null);
            marker.closePopup();
        } else {
            // Close all other popups
            closeAllPopupsExcept(vendorId);

            setActivePopup(vendorId);
            marker.openPopup();
        }
    };

    // Filter vendors with valid coordinates
    const vendorsWithCoords = vendors.filter(
        (vendor) =>
            vendor?.address?.coordinates?.latitude &&
            vendor?.address?.coordinates?.longitude
    );

    // Calculate map center (average of all coordinates)
    const getMapCenter = () => {
        if (vendorsWithCoords.length === 0) {
            return [25.2048, 55.2708]; // Default to Dubai
        }

        const avgLat =
            vendorsWithCoords.reduce(
                (sum, v) => sum + parseFloat(v.address.coordinates.latitude),
                0
            ) / vendorsWithCoords.length;

        const avgLng =
            vendorsWithCoords.reduce(
                (sum, v) => sum + parseFloat(v.address.coordinates.longitude),
                0
            ) / vendorsWithCoords.length;

        return [avgLat, avgLng];
    };

    if (!mounted || !L) {
        return (
            <div className="w-full h-full bg-gray-100 rounded-xl flex items-center justify-center">
                <p className="text-gray-500">Loading map...</p>
            </div>
        );
    }

    if (vendorsWithCoords.length === 0) {
        return (
            <div className="w-full h-full bg-gray-50 rounded-xl flex flex-col items-center justify-center">
                <MapPin className="w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No Vendors with Location Data
                </h3>
                <p className="text-gray-500">
                    None of the vendors in this list have location coordinates available.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full h-full rounded-xl overflow-hidden border border-gray-200">
            <MapContainer
                center={getMapCenter()}
                zoom={11}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://api.maptiler.com/maps/outdoor/{z}/{x}/{y}.png?key=4AimfOIlvkYoDLhuWsb9"
                    subdomains="abcd"
                    maxZoom={20}
                />

                {vendorsWithCoords.map((vendor) => {
                    const lat = parseFloat(vendor.address.coordinates.latitude);
                    const lng = parseFloat(vendor.address.coordinates.longitude);

                    return (
                        <Marker
                            key={vendor._id}
                            position={[lat, lng]}
                            icon={createCustomIcon(vendor)}
                            ref={(ref) => {
                                if (ref) {
                                    markersRef.current[vendor._id] = ref;
                                }
                            }}
                            eventHandlers={{
                                mouseover: (e) => handleMarkerMouseOver(vendor._id, e.target),
                                mouseout: (e) => handleMarkerMouseOut(vendor._id, e.target),
                                click: (e) => handleMarkerClick(vendor._id, e.target),
                            }}
                        >
                            <Popup
                                closeButton={true}
                                autoClose={false}
                                closeOnClick={false}
                                className="vendor-card-popup"
                                maxWidth={340}
                                minWidth={340}
                                onClose={() => {
                                    if (activePopup === vendor._id) {
                                        setActivePopup(null);
                                    }
                                }}
                            >
                                <div
                                    onMouseEnter={() => handlePopupMouseOver(vendor._id)}
                                    onMouseLeave={() => handlePopupMouseOut(vendor._id)}
                                >
                                    <MapVendorCard
                                        vendor={vendor}
                                        isAuthenticated={isAuthenticated}
                                        isInitialSaved={savedVendorIds.includes(vendor._id)}
                                    />
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
};

export default VendorsMapView;