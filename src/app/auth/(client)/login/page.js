import Image from "next/image";
import UserLoginForm from "../../components/forms/UserLoginForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getContentByKeyAction } from "@/app/actions/admin/pages";

export const metadata = {
  title: "Login | Karyaa",
  description: "Login to your Karyaa account to access your event planning tools.",
};

const UserLoginPage = async () => {
  // Fetch dynamic content
  let content = {
    backgroundImage: "/new-banner-10.jpg",
    heading: "Good to see you back!",
    tagline: ""
  };

  try {
    const result = await getContentByKeyAction("auth-user-login");
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
    <section className="flex h-screen w-screen overflow-hidden !m-0 p-0 fixed inset-0">
      <div className="w-2/3 h-full bg-secondary relative max-lg:hidden">
        <Image
          fill
          alt="Login to Karyaa"
          src={content.backgroundImage}
          className="h-full object-cover"
        />
      </div>
      <div className="w-full bg-body lg:w-1/3 h-full overflow-y-auto max-xl:z-10 py-5">
        <div className="flex flex-col justify-center min-h-full px-5 sm:px-10">
          <div className="max-lg:flex flex-col items-center justify-center">
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
                {content.heading}
              </h1>
              {content.tagline && (
                <div
                  className="!text-sm text-gray-600 mb-4 max-lg:text-center prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: content.tagline }}
                />
              )}
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
      </div>
    </section>
  );
};

export default UserLoginPage;

