import Image from "next/image";
import VendorMultiStepForm from "../../components/forms/vendor/VendorMultiStepForm";

export const metadata = {
  title: "Partner Registration | Karyaa",
  description: "Join Karyaa as a vendor and grow your event business.",
};

const CreateAccountPage = () => {
  return (
    <section className="flex h-screen w-screen overflow-hidden !m-0 p-0 fixed inset-0">
      {/* Right section (Image) */}
      <div className="w-3/5 h-full bg-secondary relative max-lg:hidden flex-shrink-0">
        <Image
          fill
          alt="Create Account in Karyaa"
          src="/new-banner-3.jpg"
          className="object-cover"
          priority
        />
      </div>

      {/* Left section (Form) - This is the ONLY scrollable area */}
      <div id="vendor-register-scroll-container" className="w-full lg:w-2/5 h-full overflow-y-auto flex-shrink-0">
        <div className="px-4 lg:px-10 py-6">
          <VendorMultiStepForm />
        </div>
      </div>
    </section>
  );
};

export default CreateAccountPage;