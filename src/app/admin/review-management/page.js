import ReviewStatsWrapper from "../components/sections/ReviewStatsWrapper"
import ReviewDataTable from "../components/tables/ReviewDataTable"

const ReviewManagementPage = () => {
  return (
    <div className="mb-10 dashboard-container space-y-8">
        <ReviewStatsWrapper />


        <ReviewDataTable />
    </div>
  )
}

export default ReviewManagementPage
