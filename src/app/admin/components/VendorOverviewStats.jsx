import Image from "next/image"

const VendorOverviewStats = () => {
    return (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-[#FAFAFB] p-5 min-w-1/4 rounded-2xl border border-gray-200 flex-between">
                <div>
                    <span className="uppercase text-sidebar-foreground text-[11px]">Total Active Vendors</span>
                    <div className="mt-1.5 text-3xl flex items-end leading-6">450 </div>
                </div>

                <div className="bg-primary size-12 rounded-2xl flex-center">
                    <Image src="/dashicons/vendors.svg" width={34} height={34} alt="Leads" />
                </div>
            </div>

            <div className="bg-[#FAFAFB] p-5 min-w-1/4 rounded-2xl border border-gray-200 flex-between">
                <div>
                    <span className="uppercase text-sidebar-foreground text-[11px]">Vendors Pending Approval</span>
                    <div className="mt-1.5 text-3xl flex items-end leading-6">55</div>
                </div>

                <div className="bg-primary size-12 rounded-2xl flex-center">
                    <Image src="/dashicons/users.svg" width={34} height={34} alt="Leads" />
                </div>
            </div>

            <div className="bg-[#FAFAFB] p-5 min-w-1/4 rounded-2xl border border-gray-200 flex-between">
                <div>
                    <span className="uppercase text-sidebar-foreground text-[11px]">Karyaa Recomends</span>
                    <div className="mt-1.5 text-3xl flex items-end leading-6">40
                        {/* <span className="text-lg ml-1.5 text-dashboard-green flex-center leading-0.5">+0 <ChevronsUp className="size-4" /></span> */}
                    </div>
                </div>

                <div className="bg-primary size-12 rounded-2xl flex-center">
                    <Image src="/dashicons/enquiries.svg" width={34} height={34} alt="Leads" />
                </div>
            </div>

            <div className="bg-[#FAFAFB] p-5 min-w-1/4 rounded-2xl border border-gray-200 flex-between">
                <div>
                    <span className="uppercase text-sidebar-foreground text-[11px]">Deactivated Vendors</span>
                    <div className="mt-1.5 text-3xl flex items-end leading-6">14</div>
                </div>

                <div className="bg-primary size-12 rounded-2xl flex-center">
                    <Image src="/dashicons/ads.svg" width={34} height={34} alt="Leads" />
                </div>
            </div>

        </div>
    )
}

export default VendorOverviewStats