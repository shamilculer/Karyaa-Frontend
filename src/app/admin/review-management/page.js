import OverViewStats from "../components/common/OverviewStatsAdmin"
import ReviewStatsWrapper from "../components/ReviewStatsWrapper"
import ReviewDataTable from "../components/tables/ReviewDataTable"

const ReviewManagementPage = () => {
  return (
    <div className="h-full dashboard-container space-y-8">
        <OverViewStats />

        <ReviewStatsWrapper />


        <ReviewDataTable />
    </div>
  )
}

export default ReviewManagementPage