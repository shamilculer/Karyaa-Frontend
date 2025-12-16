import Image from "next/image";
import VendorLoginForm from "../../components/forms/vendor/VendorLoginForm";
import { getContentByKeyAction } from "@/app/actions/admin/pages";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";

export const metadata = {
  title: "Vendor Login | Karyaa",
  description: "Login to your vendor dashboard to manage your services and leads.",
};

const VendorLoginPage = async () => {
  // Fetch dynamic content
  let content = {
    backgroundImage: "/new-banner-10.jpg",
    heading: "Good to see you back Partner!",
    tagline: ""
  };

  try {
    const result = await getContentByKeyAction("auth-vendor-login");
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
      <div className="max-lg:!hidden w-2/3 h-full bg-secondary relative">
        <Image
          fill
          alt="Vendor Login to Karyaa"
          src={content.backgroundImage}
          className="h-full object-cover"
        />
      </div>

      <div className="w-full lg:w-1/3 h-full overflow-y-auto">
        <div className="flex flex-col justify-center min-h-full px-4 sm:px-10 py-10">
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
              {content.heading}
            </h1>
            {content.tagline && (
              <div
                className="!text-sm text-gray-600 mb-4 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: content.tagline }}
              />
            )}
            <VendorLoginForm />
          </div>

          {/* <div className="flex-center gap-5 mt-5">
            <div className="w-2/5 h-0 border-t border-gray-400"></div>
            <span className="text-sm text-gray-500">OR</span>
            <div className="w-2/5 h-0 border-t border-gray-400"></div>
          </div>

          <div className="mt-5">
            <Button asChild variant="outline" className="w-full">
              <Link href="/auth/vendor/register">Login as a Vendor</Link>
            </Button>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default VendorLoginPage;
