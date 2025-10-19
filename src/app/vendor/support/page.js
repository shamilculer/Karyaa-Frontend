import OverViewStats from "../components/common/OverViewStats"
import {
    Accordion,
    AccordionItem,
    AccordionContent,
    AccordionTrigger
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import Link from "next/link"


const SUpportPage = () => {
    return (
        <div className="h-full dashboard-container space-y-8">
            <OverViewStats />

            <div className='w-full bg-white flex flex-col gap-6 p-10 border border-gray-200'>
                <h3 className="pb-5 border-b border-b-gray-300">Frequently Asked Questions</h3>

                <div className="w-full">
                    <Accordion
                        type="single"
                        collapsible
                        className="w-full"
                        defaultValue="item-1"
                    >
                        <AccordionItem value="item-1" className="border-b border-gray-300">
                            <AccordionTrigger className="max-md:!text-lg">How do I find the right vendor for my event?</AccordionTrigger>
                            <AccordionContent className="flex flex-col gap-4 text-balance">
                                <p>Use our advanced search to filter vendors by category, location, price range, rating, and availability. You can also sort results by popularity, price, or newest listings.</p>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2" className="border-b border-gray-300">
                            <AccordionTrigger className="max-md:!text-lg">Can I contact vendors directly through the platform?</AccordionTrigger>
                            <AccordionContent className="flex flex-col gap-4 text-balance">
                                <p>Yes. Each vendor profile has a built-in contact form or direct chat option so you can communicate without sharing personal details upfront.</p>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3" className=" border-b border-gray-300">
                            <AccordionTrigger className="max-md:!text-lg">Are the vendors verified?</AccordionTrigger>
                            <AccordionContent className="flex flex-col gap-4 text-balance">
                                <p>We perform an approval process for every vendor before they go live. Look for the Verified Badge on profiles for added trust.</p>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4" className=" border-b border-gray-300">
                            <AccordionTrigger className="max-md:!text-lg">Can I contact vendors directly through the platform?</AccordionTrigger>
                            <AccordionContent className="flex flex-col gap-4 text-balance">
                                <p>Yes. Each vendor profile has a built-in contact form or direct chat option so you can communicate without sharing personal details upfront.</p>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-5" className="border-b border-gray-300">
                            <AccordionTrigger className="max-md:!text-lg">Can I save vendors I’m interested in for later?</AccordionTrigger>
                            <AccordionContent className="flex flex-col gap-4 text-balance">
                                <p>Absolutely. Click the heart icon on any vendor profile to add them to your favorites for quick access later.</p>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>

            <div className='w-full bg-white flex flex-col gap-6 p-10 border border-gray-200'>
                <h3 className="pb-5 border-b border-b-gray-300">Support</h3>
                <div className="space-y-10">
                    <div className="w-full">
                        <div className="flex-between gap-8">
                            <div>
                                <h3 className="!font-normal">Customer Care</h3>
                                <p className="!text-sm text-gray-400">Lorem ipsum dolor sit amet, consect adipiscing elit, sed do sit amet.</p>
                            </div>

                            <div className="flex-center gap-5">
                                <Button >Raise a Ticket</Button>
                                <Button >Contact Us</Button>
                            </div>
                        </div>
                    </div>

                    <div className="w-full">
                        <div className="flex-between gap-8">
                            <div>
                                <h3 className="!font-normal">Privacy Ploicy</h3>
                                <p className="!text-sm text-gray-400">Lorem ipsum dolor sit amet, consect adipiscing elit, sed do sit amet.</p>
                            </div>

                            <div>
                                <Button asChild><Link href="/privacy-policy">View Our Privacy Ploicy</Link></Button>
                            </div>
                        </div>
                    </div>

                    <div className="w-full">
                        <div className="flex-between gap-8">
                            <div>
                                <h3 className="!font-normal">Terms and Conditions</h3>
                                <p className="!text-sm text-gray-400">Lorem ipsum dolor sit amet, consect adipiscing elit, sed do sit amet.</p>
                            </div>

                            <div>
                                <Button asChild><Link href="/privacy-policy">View Our Terms and Condition</Link></Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SUpportPage