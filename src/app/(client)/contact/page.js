export const dynamic = 'force-dynamic';

import { Mail, MapPin, PhoneCall } from "lucide-react"
import Link from "next/link"
import ContactForm from "../components/forms/ContactForm"
import { getBrandDetailsAction } from "@/app/actions/public/brand"
import PageTitle from "../components/common/PageTitle";


const ContactPage = async () => {
    const details = await getBrandDetailsAction()
    const contactInfo = details?.data

    return (
        <div className="min-h-screen">
            <PageTitle placement="Contact" imgUrl="/banner-1.avif" title="Contact Us" tagline="Have a question, need support, or want to partner with us? Let's talk." />

            <section className="container">
                <div className="w-full flex-center max-md:flex-col gap-20">
                    <div className="w-full md:w-1/2 space-y-6 md:space-y-10">
                        <h3 className="uppercase">Contact Us Today for Personalized Support and Assistance</h3>
                        <p className="mr-16">Lorem ipsum dolor sit amet consectetur. Convallis est urna adipiscin fringilla nulla diam lorem non mauris. </p>
                        <div className="space-y-8">
                            <Link href="" className="flex items-center gap-4">
                                <PhoneCall size={25} />
                                <span className="font-medium text-xl">{contactInfo?.primaryPhone}</span>
                            </Link>

                            <Link href="" className="flex items-center gap-4">
                                <Mail size={25} />
                                <span className="font-medium text-xl">{contactInfo?.mainEmail}</span>
                            </Link>


                            <Link href="" className="flex items-center gap-4">
                                <MapPin size={25} />
                                <span className="font-medium text-xl">{contactInfo?.location}</span>
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