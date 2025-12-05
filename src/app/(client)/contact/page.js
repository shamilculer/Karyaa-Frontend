export const dynamic = 'force-dynamic';

import { Mail, MapPin, PhoneCall } from "lucide-react"
import Link from "next/link"
import ContactForm from "../components/forms/ContactForm"
import { getContentByKeyAction } from "@/app/actions/public/content"
import PageTitle from "../components/common/PageTitle";
import { getMetaData } from "@/lib/seo";

export async function generateMetadata() {
    return await getMetaData("static", "contact");
}


const ContactPage = async () => {
    // Fetch contact page content
    const contentResult = await getContentByKeyAction("contact-page")
    let pageContent = {
        bannerHeading: "Contact Us",
        bannerTagline: "Have a question, need support, or want to partner with us? Let's talk.",
        contentHeading: "Contact Us Today for Personalized Support and Assistance",
        contentDescription: "Lorem ipsum dolor sit amet consectetur. Convallis est urna adipiscin fringilla nulla diam lorem non mauris.",
        primaryPhone: "+971 XX XXX XXXX",
        mainEmail: "contact@karyaa.com",
        location: "Dubai, UAE"
    }

    // Parse content if it exists
    if (contentResult?.success && contentResult?.data?.content) {
        try {
            const parsedContent = typeof contentResult.data.content === 'string'
                ? JSON.parse(contentResult.data.content)
                : contentResult.data.content;

            pageContent = {
                bannerHeading: parsedContent.bannerHeading || pageContent.bannerHeading,
                bannerTagline: parsedContent.bannerTagline || pageContent.bannerTagline,
                contentHeading: parsedContent.contentHeading || pageContent.contentHeading,
                contentDescription: parsedContent.contentDescription || pageContent.contentDescription,
                primaryPhone: parsedContent.primaryPhone || pageContent.primaryPhone,
                mainEmail: parsedContent.mainEmail || pageContent.mainEmail,
                location: parsedContent.location || pageContent.location
            }
        } catch (error) {
            console.error("Error parsing contact page content:", error);
        }
    }

    return (
        <div className="min-h-screen">
            <PageTitle
                placement="Contact"
                imgUrl="/banner-1.avif"
                title={pageContent.bannerHeading}
                tagline={pageContent.bannerTagline}
            />

            <section className="container">
                <div className="w-full flex-center max-md:flex-col gap-20">
                    <div className="w-full md:w-1/2 space-y-6 md:space-y-10">
                        <h3 className="uppercase">{pageContent.contentHeading}</h3>
                        <p className="mr-16">{pageContent.contentDescription}</p>
                        <div className="space-y-8">
                            <Link href="" className="flex items-center gap-4">
                                <PhoneCall size={25} />
                                <span className="font-medium text-xl">{pageContent.primaryPhone}</span>
                            </Link>

                            <Link href="" className="flex items-center gap-4">
                                <Mail size={25} />
                                <span className="font-medium text-xl">{pageContent.mainEmail}</span>
                            </Link>

                            <Link href="" className="flex items-center gap-4">
                                <MapPin size={25} />
                                <span className="font-medium text-xl">{pageContent.location}</span>
                            </Link>
                        </div>
                    </div>

                    <div className="w-full md:w-1/2">
                        <ContactForm />
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ContactPage