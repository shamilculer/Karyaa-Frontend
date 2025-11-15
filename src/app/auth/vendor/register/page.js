import Image from "next/image";
import VendorMultiStepForm from "../../components/forms/vendor/VendorMultiStepForm";

const CreateAccountPage = () => {
  return (
    <section className="flex h-screen w-screen overflow-hidden !m-0 p-0 fixed inset-0">
      {/* Right section (Image) */}
      <div className="w-3/5 h-full bg-secondary relative max-xl:hidden flex-shrink-0">
        <Image
          fill
          alt="Create Account in Karyaa"
          src="/new-banner-3.jpg"
          className="object-cover"
          priority
        />
      </div>

      {/* Left section (Form) - This is the ONLY scrollable area */}
      <div className="w-full xl:w-2/5 h-full overflow-y-auto flex-shrink-0">
        <div className="px-4 xl:px-10 py-6">
           <VendorMultiStepForm />
        </div>
      </div>
    </section>
  );
};

export default CreateAccountPage;