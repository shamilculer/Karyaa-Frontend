"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import Link from 'next/link';
import { MapPin, Star, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon for vendors
const createCustomIcon = (isRecommended) => {
  const bgColor = isRecommended ? '#10b981' : '#6366f1';
  const borderColor = isRecommended ? '#059669' : '#4f46e5';
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="position: relative;">
        <svg width="40" height="50" viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="20" cy="47" rx="8" ry="3" fill="rgba(0,0,0,0.2)"/>
          
          <path d="M20 0C11.716 0 5 6.716 5 15c0 8.284 15 30 15 30s15-21.716 15-30c0-8.284-6.716-15-15-15z" 
                fill="${bgColor}" 
                stroke="${borderColor}" 
                stroke-width="2"/>
          
          <circle cx="20" cy="15" r="6" fill="white"/>
          
          ${isRecommended 
            ? `<path d="M17 15l2 2 4-4" stroke="${bgColor}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
            : `<path d="M20 11l1.545 3.13 3.455.503-2.5 2.437.59 3.43L20 18.885 16.91 20.5l.59-3.43-2.5-2.437 3.455-.503L20 11z" 
                     fill="${bgColor}"/>`
          }
        </svg>
      </div>
    `,
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -50],
  });
};

const VendorsMapView = ({ vendors }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted) {
    return (
      <div className="w-full h-[600px] bg-gray-100 rounded-xl flex items-center justify-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  if (vendorsWithCoords.length === 0) {
    return (
      <div className="w-full h-[600px] bg-gray-50 rounded-xl flex flex-col items-center justify-center">
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
    <div className="w-full h-[600px] rounded-xl overflow-hidden border border-gray-200">
      <MapContainer
        center={getMapCenter()}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          // ✅ Switched to CartoDB Voyager for full color, modern design, and English labels
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
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
              icon={createCustomIcon(vendor.isRecommended)}
            >
              <Popup maxWidth={300} className="custom-popup">
                <div className="p-2">
                  <h3 className="font-bold text-lg mb-2 text-gray-800">
                    {vendor.businessName}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {vendor.address.city}, UAE
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-semibold text-gray-700">
                      {vendor.averageRating}/5
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">
                    Starting from{' '}
                    <span className="font-bold text-primary">
                      AED {vendor.pricingStartingFrom}
                    </span>
                  </p>

                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                    {vendor.businessDescription}
                  </p>

                  <div className="flex gap-2">
                    <Button asChild size="sm" className="flex-1">
                      <Link href={`/vendors/${vendor.slug}`}>
                        View Details
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
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