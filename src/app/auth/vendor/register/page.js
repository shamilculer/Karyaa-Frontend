import Image from "next/image";
import VendorMultiStepForm from "../../components/forms/vendor/VendorMultiStepForm";

const CreateAccountPage = () => {
  return (
    <section className="flex h-screen overflow-hidden !my-0">
      {/* Left section (Form) */}
      <div className="w-full xl:w-2/5 h-screen overflow-y-auto px-4 xl:px-10 py-12">
        <div>
          <VendorMultiStepForm />
        </div>
      </div>

      {/* Right section (Image) */}
      <div className="w-3/5 h-screen bg-secondary relative max-xl:hidden">
        <Image
          fill
          alt="Create Account in Karyaa"
          src="/new-banner-3.jpg"
          className="object-cover"
          priority
        />
      </div>
    </section>
  );
};

export default CreateAccountPage;