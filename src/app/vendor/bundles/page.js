import { AlertCircle } from "lucide-react";
import { getAllActiveBundles } from "@/app/actions/vendor/bundles";
import BundleList from "../components/sections/BundleList";

export const dynamic = 'force-dynamic'

const VendorBundlePage = async () => {
  const bundlesResponse = await getAllActiveBundles();

  if (bundlesResponse.error) {
    // Error State
    return (
      <div className="dashboard-container mb-10">
        <header className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Choose Your Vendor Package</h1>
        </header>
        <div className="text-center py-10 bg-red-50 border border-red-300 rounded-xl">
          <AlertCircle className="w-10 h-10 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-800">Error Loading Bundles</h2>
          <p className="text-red-700 mt-2">{bundlesResponse.error}</p>
        </div>
      </div>
    );
  }

  // Success State (Pass data to Client Component)
  return (
    <div className="dashboard-container mb-12">
      <BundleList bundles={bundlesResponse.bundles} />
    </div>
  );
}

export default VendorBundlePage;
