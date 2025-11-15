// This page uses server actions that read cookies; force dynamic to avoid static prerender errors.
export const dynamic = 'force-dynamic';

import { Mail, MapPin, PhoneCall } from "lucide-react"
import Link from "next/link"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import ContactForm from "../components/ContactForm"
import { getBrandDetailsAction } from "@/app/actions/brand"
import PageTitle from "../components/common/PageTitle";


const ContactPage = async () => {
    const details = await getBrandDetailsAction()
    const contactInfo = details?.data

    return (
        <div className="min-h-screen">
            <PageTitle imgUrl="/banner-1.avif" title="Contact Us" tagline="Have a question, need support, or want to partner with us? Let’s talk." />

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


            {/* <section className="container">
                <div className="text-center">
                    <h6 className="uppercase !font-medium">FAQ</h6>
                    <h2 className="uppercase">Everything You Need to know</h2>
                </div>

                <div className="max-w-4xl mx-auto mt-10">
                    <Accordion
                        type="single"
                        collapsible
                        className="w-full"
                        defaultValue="item-1"
                    >
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="max-md:!text-lg">How do I find the right vendor for my event?</AccordionTrigger>
                            <AccordionContent className="flex flex-col gap-4 text-balance">
                                <p>Use our advanced search to filter vendors by category, location, price range, rating, and availability. You can also sort results by popularity, price, or newest listings.</p>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger className="max-md:!text-lg">Can I contact vendors directly through the platform?</AccordionTrigger>
                            <AccordionContent className="flex flex-col gap-4 text-balance">
                                <p>Yes. Each vendor profile has a built-in contact form or direct chat option so you can communicate without sharing personal details upfront.</p>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger className="max-md:!text-lg">Are the vendors verified?</AccordionTrigger>
                            <AccordionContent className="flex flex-col gap-4 text-balance">
                                <p>We perform an approval process for every vendor before they go live. Look for the Verified Badge on profiles for added trust.</p>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4">
                            <AccordionTrigger className="max-md:!text-lg">Can I contact vendors directly through the platform?</AccordionTrigger>
                            <AccordionContent className="flex flex-col gap-4 text-balance">
                                <p>Yes. Each vendor profile has a built-in contact form or direct chat option so you can communicate without sharing personal details upfront.</p>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-5">
                            <AccordionTrigger className="max-md:!text-lg">Can I save vendors I’m interested in for later?</AccordionTrigger>
                            <AccordionContent className="flex flex-col gap-4 text-balance">
                                <p>Absolutely. Click the heart icon on any vendor profile to add them to your favorites for quick access later.</p>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </section> */}
        </div>
    )
}

export default ContactPage