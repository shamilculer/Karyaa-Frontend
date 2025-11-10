import VendorsTable from "../components/tables/VendorsTable"

const VendorManagementPage = () => {
    return (
        <div className="h-full dashboard-container space-y-8">
            <div className="w-full">
                <VendorsTable />
            </div>
        </div>
    )
}

export default VendorManagementPage