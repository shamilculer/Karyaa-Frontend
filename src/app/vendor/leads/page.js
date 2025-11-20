import { Suspense } from "react"
import LeadsTable from '../components/tables/LeadsTable'

const LeadsPage = () => {
  return (
    <div className="mb-12 dashboard-container space-y-8">        
        <div className='mb-16'>
            <Suspense fallback={<div>Loading leads...</div>}>
              <LeadsTable />
            </Suspense>
        </div>
    </div>
  )
}

export default LeadsPage