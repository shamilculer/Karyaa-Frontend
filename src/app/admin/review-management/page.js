import ReviewStatsWrapper from "../components/ReviewStatsWrapper"
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