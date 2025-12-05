import { getVendorByIdAction } from "@/app/actions/admin/vendors";
import VendorDetailsClient from "../../components/sections/VendorDeatailsClient";
import { redirect } from "next/navigation";
import { getAllBundlesAction } from "@/app/actions/admin/bundle";
import { getCategoryDetails } from "@/app/actions/admin/categories";
import { getCategories } from "@/app/actions/public/categories";

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

  // Extract all subcategories from categories and ensure parentCategory is attached
  const allSubcategories = allCategoriesResult.success
    ? allCategoriesResult.categories.reduce((acc, cat) => {
      // Attach parent category ID to each subcategory for filtering
      const subs = (cat.subCategories || []).map(sub => ({
        ...sub,
        parentCategory: cat._id
      }));
      return acc.concat(subs);
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