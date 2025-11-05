"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import PackageToolbar from "../components/PackageToolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { getVendorPackages } from "@/app/actions/packages";
import { getVendorFromToken } from "../utils/getVendor";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import DeletePackageModal from "../components/DeletePackageModal";
import EditPackageModal from "../components/EditPackageModal";
import ViewPackageModal from "../components/ViewPackageModal";

/* -------------------------------------------
   Main Page
------------------------------------------- */
export default function PackagesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [packages, setPackages] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPackages() {
      try {
        const { vendor } = await getVendorFromToken();
        const { data } = await getVendorPackages(vendor.id);
        setPackages(data);
      } catch (err) {
        console.error("Error fetching packages:", err);
      } finally {
        setLoading(false);
      }
    }

    loadPackages();
  }, []);

  return (
    <div className="dashboard-container space-y-8 mb-16">
      <PackageToolbar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {loading ? (
        <PackagesSkeleton />
      ) : (
        <PackageList packages={packages} searchTerm={searchTerm} />
      )}
    </div>
  );
}

/* -------------------------------------------
   Package List (Client)
------------------------------------------- */
function PackageList({ packages, searchTerm }) {

  if (!packages?.length) {
    return (
      <p className="text-gray-500 text-sm">
        No packages found. Create your first one!
      </p>
    );
  }

  // normalize input
  const term = searchTerm.toLowerCase().trim();

  const filtered = packages.filter((pkg) => {
    const inName = pkg.name.toLowerCase().includes(term);
    const inSub = pkg.subheading?.toLowerCase().includes(term);
    const inServices = pkg.services?.some((s) =>
      s.name.toLowerCase().includes(term)
    );
    const inIncludes = pkg.includes?.some((i) =>
      i.toLowerCase().includes(term)
    );

    return inName || inSub || inServices || inIncludes;
  });

  if (!filtered.length) {
    return (
      <p className="text-gray-500 text-sm">
        No packages match <span className="font-semibold">"{searchTerm}"</span>
      </p>
    );
  }

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {filtered.map((pkg) => (
        <PackageCard key={pkg._id} pkg={pkg} />
      ))}
    </div>
  );
}

/* -------------------------------------------
   Single Package Card
------------------------------------------- */
function PackageCard({ pkg }) {
  return (
    <Card className="min-h-[570px] p-3 border-gray-300 shadow-none gap-2 relative">
      <CardHeader className="p-0">
        <Image
          src={pkg.coverImage}
          width={300}
          height={300}
          alt={pkg.name}
          className="w-full object-cover rounded-lg h-56"
        />
      </CardHeader>

      <CardContent className="p-0">
        <div className="flex flex-wrap gap-2">
          {pkg.services?.slice(0, 3).map((service) => (
            <Badge
              key={service._id}
              className="text-xs rounded-full bg-gray-200 text-gray-600"
            >
              {service.name}
            </Badge>
          ))}

          {pkg.services && pkg.services.length > 3 && (
            <Badge className="text-xs rounded-full bg-gray-200 text-gray-600">
              & {pkg.services.length - 3} more
            </Badge>
          )}
        </div>

        <h3 className="!text-[20px] mt-5 leading-5 line-clamp-1">{pkg.name}</h3>
        <span className="leading-0 !text-sm">{pkg.subheading}</span>

        <div className="my-3">
          <p className="!text-sm !font-medium font-heading text-gray-700 mb-2">
            This package includes:
          </p>

          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 pl-4">
            {pkg.includes?.slice(0, 5).map((item, index) => (
              <li key={index} className="truncate">{item}</li>
            ))}

            {pkg.includes?.length > 5 && (
              <li className="list-none pl-4 text-gray-400">....</li>
            )}
          </ul>
        </div>
      </CardContent>

      <CardFooter className="w-[90%] absolute bottom-0 border-t pt-3 pb-3 border-t-gray-300 flex items-center justify-end gap-6">
        <ViewPackageModal packageData={pkg} />
        <EditPackageModal packageData={pkg} />
        <DeletePackageModal packageId={pkg._id} packageName={pkg.name} />
      </CardFooter>
    </Card>
  );
}

/* -------------------------------------------
   Suspense Skeleton Loader
------------------------------------------- */
function PackagesSkeleton() {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="p-4 px-6 border border-gray-200 rounded-lg">
          <Skeleton className="h-4 w-24 mb-4" />
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-4 w-2/3 mb-2" />
          <Skeleton className="h-8 w-20 mt-4" />
        </div>
      ))}
    </div>
  );
}
