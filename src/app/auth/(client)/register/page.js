import Image from "next/image";
import UserCreateForm from "../../components/forms/UserCreateForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const CreateAccountPage = () => {
  return (
    <section className="flex !my-0 relative">
      <div className="w-2/3 min-h-screen bg-secondary relative  max-lg:hidden">
        <Image
          fill
          alt="Create Account in Karyaa"
          src="/new-banner-3.jpg"
          className="h-full object-cover"
        />
      </div>
      <div className="w-full bg-body lg:w-1/3 min-h-screen flex flex-col justify-center px-5 sm:px-10 max-xl:z-10">
        <div className="max-xl:flex flex-col items-center justify-center">
          <div className="xl:hidden">
            <Image
              src="../logo.svg"
              alt="Karyaa"
              height={30}
              width={144}
              className="w-28 mb-10"
            />
          </div>
          <h1 className="!text-xl !capitalize !font-semibold mb-2">
            Create An Account
          </h1>
          <UserCreateForm />
        </div>

        <div className="flex-center gap-5 mt-5">
          <div className="w-2/5 h-0 border-t border-gray-400"></div>
          <span className="text-sm text-gray-500">OR</span>
          <div className="w-2/5 h-0 border-t border-gray-400"></div>
        </div>

        <div className="mt-5">
          <Button asChild variant="outline" className="w-full">
            <Link href="/auth/vendor/register">Signup as Vendor</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CreateAccountPage;
