// auth/UserLoginPage.jsx

import Image from "next/image";
import UserLoginForm from "../../components/forms/UserLoginForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const UserLoginPage = () => {
  return (
    <section className="flex !my-0 relative">
      {/* Form Container - Takes 100% width on mobile, 1/3 on xl+ */}
      <div className="w-full bg-body xl:w-1/3 min-h-screen flex flex-col justify-center px-5 sm:px-10 max-xl:z-10">
        {/* Wrapper for mobile centering */}
        <div className="max-xl:flex flex-col items-center justify-center">
          <div>
            {/* Mobile Logo */}

            <Image
              src="../logo.svg"
              alt="Karyaa"
              height={30}
              width={144}
              className="w-28 mb-10"
            />
          </div>

          <div>
            <h1 className="!text-xl !capitalize !font-semibold max-lg:text-center mb-2">
              Good to see you back!
            </h1>
            <UserLoginForm />
          </div>

          <div className="flex-center gap-5 mt-5">
            <div className="w-2/5 h-0 border-t border-gray-400"></div>
            <span className="text-sm text-gray-500">OR</span>
            <div className="w-2/5 h-0 border-t border-gray-400"></div>
          </div>

          <div className="mt-5">
            <Button asChild variant="outline" className="w-full">
              <Link href="/auth/vendor/login">Login as a Vendor</Link>
              {/* Changed link to /auth/vendor/login for consistency */}
            </Button>
          </div>
        </div>
      </div>
      {/* Image Container - Hidden on mobile, takes 2/3 on xl+ */}
      <div className="w-2/3 min-h-screen bg-secondary relative max-xl:hidden">
        <Image
          fill
          alt="Login to Karyaa"
          src="/new-banner-10.jpg"
          className="h-full object-cover"
        />
      </div>
    </section>
  );
};

export default UserLoginPage;
