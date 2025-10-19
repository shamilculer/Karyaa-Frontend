import VendorsTable from "../components/tables/VendorsTable"
import VendorOverviewStats from "../components/VendorOverviewStats"

const VendorManagementPage = () => {
    return (
        <div className="h-full dashboard-container space-y-8">
            <VendorOverviewStats />

            <div className="w-full">
                <VendorsTable />
            </div>
        </div>
    )
}

export default VendorManagementPage