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


const ContactPage = async () => {
    const details = await getBrandDetailsAction()
    const contactInfo = details?.data

    return (
        <div className="min-h-screen">

            <section className="!m-0 bg-[url('/banner-1.avif')] bg-cover bg-center h-72 md:h-96 flex-center relative px-4">
                <div className="absolute inset-0 bg-black opacity-50 w-full h-full"></div>
                <div className="relative z-10 text-white text-center">
                    <h1 className="!text-white !text-5xl lg:!text-7xl">Contact Us</h1>
                    <p className="mt-2 max-md:text-xs max-md:mx-6">Have a question, need support, or want to partner with us? Let’s talk.</p>
                </div>
            </section>

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
                                <Mail size={25} />
                                <span className="font-medium text-xl">{contactInfo?.supportEmail}</span>
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

            <div className="container border-t border-gray-400"></div>

            <section className="container">
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
            </section>
        </div>
    )
}

export default ContactPage