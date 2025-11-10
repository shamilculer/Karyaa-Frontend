import { getVendorGalleryItems } from "@/app/actions/gallery";
import VendorGallery from "./VendorGallery";

export default async function VendorGalleryWrapper({ vendorId }) {
  const data = await getVendorGalleryItems(vendorId);
  const items = data?.items

  return <VendorGallery images={items} />;
}
