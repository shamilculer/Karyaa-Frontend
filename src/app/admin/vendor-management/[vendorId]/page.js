import { getVendorByIdAction } from "@/app/actions/admin/vendors";
import VendorDetailsClient from "../../components/VendorDeatailsClient";
import { redirect } from "next/navigation";

const SingleVendorManagePage = async ({ params }) => {
  const { vendorId } = await params;
  
  const result = await getVendorByIdAction(vendorId);
  
  if (!result.success || !result.data) {
    redirect('/admin/vendors');
  }
  
  return <VendorDetailsClient vendorData={result.data} />;
}

export default SingleVendorManagePage;