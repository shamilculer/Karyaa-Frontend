import { getVendorByIdAction } from "@/app/actions/admin/vendors";
import VendorDetailsClient from "../../components/VendorDeatailsClient";
import { redirect } from "next/navigation";
import { getAllBundlesAction } from "@/app/actions/admin/bundle";
import { getCategoryDetails } from "@/app/actions/admin/categories";
import { getCategories } from "@/app/actions/categories";

const SingleVendorManagePage = async ({ params }) => {
  const { vendorId } = await params;
  
  const [vendorResult, bundlesResult, categoriesResult, allCategoriesResult] = await Promise.all([
    getVendorByIdAction(vendorId),
    getAllBundlesAction({ limit: 100 }),
    getCategoryDetails(),
    getCategories()
  ]);
  
  if (!vendorResult.success || !vendorResult.data) {
    redirect('/admin/vendor-management');
  }

  // Extract all subcategories from categories
  const allSubcategories = allCategoriesResult.success 
    ? allCategoriesResult.categories.reduce((acc, cat) => {
        return acc.concat(cat.subCategories || []);
      }, [])
    : [];
  
  return (
    <VendorDetailsClient 
      vendorData={vendorResult.data} 
      bundles={bundlesResult.success ? bundlesResult.data : []}
      categories={categoriesResult.success ? categoriesResult.categories : []}
      subcategories={allSubcategories}
    />
  );
}

export default SingleVendorManagePage;