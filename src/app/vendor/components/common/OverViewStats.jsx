import { ChevronsDown, ChevronsUp } from "lucide-react"
import Image from "next/image"

const OverViewStats = () => {
    return (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-[#FAFAFB] p-5 min-w-1/4 rounded-2xl border border-gray-200 flex-between">
                <div>
                    <span className="uppercase text-sidebar-foreground text-[11px]">Total Enquiries This MOnth</span>
                    <div className="mt-1.5 text-3xl flex items-end leading-6">400<span className="text-lg ml-1.5 text-dashboard-green flex-center leading-0.5">+55 <ChevronsUp className="size-4" /></span></div>
                </div>

                <div className="bg-primary size-12 rounded-2xl flex-center">
                    <Image src="/dashicons/leads.svg" width={34} height={34} alt="Leads" />
                </div>
            </div>

            <div className="bg-[#FAFAFB] p-5 min-w-1/4 rounded-2xl border border-gray-200 flex-between">
                <div>
                    <span className="uppercase text-sidebar-foreground text-[11px]">Total Profile Visits This MOnth</span>
                    <div className="mt-1.5 text-3xl flex items-end leading-6">765<span className="text-lg ml-1.5 text-dashboard-green flex-center leading-0.5">+255 <ChevronsUp className="size-4" /></span></div>
                </div>

                <div className="bg-primary size-12 rounded-2xl flex-center">
                    <Image src="/dashicons/profile-view.svg" width={34} height={34} alt="Leads" />
                </div>
            </div>

            <div className="bg-[#FAFAFB] p-5 min-w-1/4 rounded-2xl border border-gray-200 flex-between">
                <div>
                    <span className="uppercase text-sidebar-foreground text-[11px]">WhatsApp Clicks This MOnth</span>
                    <div className="mt-1.5 text-3xl flex items-end leading-6">40<span className="text-lg ml-1.5 text-dashboard-green flex-center leading-0.5">+0 <ChevronsUp className="size-4" /></span></div>
                </div>

                <div className="bg-primary size-12 rounded-2xl flex-center">
                    <Image src="/dashicons/whatsapp-clicks.svg" width={34} height={34} alt="Leads" />
                </div>
            </div>

            <div className="bg-[#FAFAFB] p-5 min-w-1/4 rounded-2xl border border-gray-200 flex-between">
                <div>
                    <span className="uppercase text-sidebar-foreground text-[11px]">New Reviews Recieved</span>
                    <div className="mt-1.5 text-3xl flex items-end leading-6">15<span className="text-lg ml-1.5 text-red-500 flex-center leading-0.5">-5 <ChevronsDown className="size-4" /></span></div>
                </div>

                <div className="bg-primary size-12 rounded-2xl flex-center">
                    <Image src="/dashicons/reviews.svg" width={34} height={34} alt="Leads" />
                </div>
            </div>
        </div>
    )
}

export default OverViewStats
