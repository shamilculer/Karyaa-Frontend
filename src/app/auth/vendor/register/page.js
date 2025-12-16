import Image from "next/image";
import VendorMultiStepForm from "../../components/forms/vendor/VendorMultiStepForm";
import { getContentByKeyAction } from "@/app/actions/admin/pages";

export const metadata = {
  title: "Partner Registration | Karyaa",
  description: "Join Karyaa as a vendor and grow your event business.",
};

const VendorRegisterPage = async () => {
  // Fetch dynamic content
  let content = {
    backgroundImage: "/new-banner-3.jpg",
    heading: "",
    tagline: ""
  };

  try {
    const result = await getContentByKeyAction("auth-vendor-register");
    if (result.success && result.data?.content) {
      const parsedContent = typeof result.data.content === 'string'
        ? JSON.parse(result.data.content)
        : result.data.content;

      content = {
        backgroundImage: parsedContent.backgroundImage || content.backgroundImage,
        heading: parsedContent.heading || content.heading,
        tagline: parsedContent.tagline || content.tagline
      };
    }
  } catch (error) {
    console.error("Error loading auth page content:", error);
  }

  return (
    <section className="flex h-[100dvh] w-screen overflow-hidden !m-0 p-0 fixed inset-0">
      {/* Right section (Image) */}
      <div className="w-3/5 h-full bg-secondary relative max-lg:hidden flex-shrink-0">
        <Image
          fill
          alt="Create Account in Karyaa"
          src={content.backgroundImage}
          className="object-cover"
          priority
        />
      </div>

      {/* Left section (Form) - This is the ONLY scrollable area */}
      <div id="vendor-register-scroll-container" className="w-full lg:w-2/5 h-full overflow-y-auto flex-shrink-0">
        <div className="px-4 lg:px-10 py-10">
          <VendorMultiStepForm
            customHeading={content.heading}
            customTagline={content.tagline}
          />
        </div>
      </div>
    </section>
  );
};

export default VendorRegisterPage;
