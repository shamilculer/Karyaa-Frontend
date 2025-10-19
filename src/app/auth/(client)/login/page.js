import Image from "next/image";
import UserLoginForm from "../../components/forms/UserLoginForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const CreateAccountPage = () => {
  return (
    <section className="flex !my-0">
      <div className="w-2/3 min-h-screen bg-secondary relative">
        <Image
          fill
          alt="Create Account in Karyaa"
          src="/new-banner-3.jpg"
          className="h-full object-cover"
        />
      </div>

      <div className="w-1/3 min-h-screen flex flex-col justify-center px-10">

       <div>
         <Image
           width={150}
           height={50}
           alt="Karyaa Logo"
           src="/logo.svg"
           className="mb-10 w-32"
         />
       </div>
    
        <div>
          <h1 className="!text-xl !capitalize !font-semibold mb-2">
            Cood to see you back!
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
            <Link href="/auth/register">Login as a Vendor</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CreateAccountPage;
