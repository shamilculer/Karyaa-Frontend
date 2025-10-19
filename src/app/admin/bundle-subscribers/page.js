import OverViewStats from "../components/common/OverviewStatsAdmin"
import Subscribers from "../components/tables/Subscribers"

const BundleSubscribersPage = () => {
    return (
        <div className="h-full dashboard-container space-y-8">
            <OverViewStats />

            <div className="grid grid-cols-3 gap-20">
                {/* ... (Your existing KPI blocks) ... */}
                <div className="bg-white border border-gray-200 p-5">
                    <div>
                        <span className="uppercase text-sidebar-foreground !text-xs tracking-widest" >Total Active Bundles</span>
                        <div className="mt-3 text-3xl flex items-end font-semibold leading-6">5</div>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 p-5">
                    <div>
                        <span className="uppercase text-sidebar-foreground !text-xs tracking-widest" >Most Popular Bundle</span>
                        <div className="mt-3 text-2xl flex items-end font-semibold leading-6">Starter Bundle</div>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 p-5">
                    <div>
                        <span className="uppercase text-sidebar-foreground !text-xs tracking-widest" >Total Active Subscribers</span>
                        <div className="mt-3 text-3xl flex items-end font-semibold leading-6">155</div>
                    </div>
                </div>
            </div>

            <div className='w-full mt-20 space-y-4 mb-16'>
                <Subscribers />
            </div>
        </div>
    )
}

export default BundleSubscribersPage