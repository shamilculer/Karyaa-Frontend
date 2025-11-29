import VendorAcquisitionOverTime from "../../components/charts/VendorAqquisitionTrend"
import TopPerformingVendors from "../../components/common/TopPerformingVendors"
import VendorStatusSummary from "../../components/common/VendorStatusSummary"
import ReviewStatsWrapper from "../../components/sections/ReviewStatsWrapper"
import VendorsByCategoryChart from "@/app/vendor/components/charts/VendorCategoryDistribution"

const VendorAnalyticsPage = () => {
    return (
        <div className="mb-5 dashboard-container space-y-14 mb-10">
            <div className="space-y-4">
                <span className="text-xl font-semibold text-sidebar-foreground uppercase tracking-widest block">Vendor Analytics</span>
                <div className="w-full flex gap-10">
                    <div className="w-3/5">
                        <VendorAcquisitionOverTime />
                    </div>

                    <div className="w-2/5">
                        <VendorStatusSummary />
                    </div>
                </div>

                <div className="w-full grid grid-cols-2 gap-10">
                    <TopPerformingVendors />

                    <VendorsByCategoryChart />
                </div>

                <div className="w-full">
                    <ReviewStatsWrapper />
                </div>
            </div>

        </div>
    )
}

export default VendorAnalyticsPage