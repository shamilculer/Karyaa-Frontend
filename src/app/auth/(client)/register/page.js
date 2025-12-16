import Image from "next/image";
import UserCreateForm from "../../components/forms/UserCreateForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getContentByKeyAction } from "@/app/actions/admin/pages";

export const metadata = {
  title: "Sign Up | Karyaa",
  description: "Create your Karyaa account and start planning your event.",
};

const CreateAccountPage = async () => {
  // Fetch dynamic content
  let content = {
    backgroundImage: "/new-banner-3.jpg",
    heading: "Create An Account",
    tagline: ""
  };

  try {
    const result = await getContentByKeyAction("auth-user-register");
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
      <div className="w-2/3 h-full bg-secondary relative max-lg:hidden">
        <Image
          fill
          alt="Create Account in Karyaa"
          src={content.backgroundImage}
          className="h-full object-cover"
        />
      </div>
      <div className="w-full bg-body lg:w-1/3 h-full overflow-y-auto max-xl:z-10">
        <div className="flex flex-col justify-center min-h-full px-5 sm:px-10 max-lg:py-10">
          <div className="max-xl:flex flex-col items-center justify-center">
            <div className="lg:hidden">
              <Image
                src="../logo.svg"
                alt="Karyaa"
                height={30}
                width={144}
                className="w-28 mb-10"
              />
            </div>
            <h1 className="!text-xl !capitalize !font-semibold mb-2">
              {content.heading}
            </h1>
            {content.tagline && (
              <div
                className="!text-sm text-gray-600 mb-4 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: content.tagline }}
              />
            )}
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
      </div>
    </section>
  );
};

export default CreateAccountPage;

