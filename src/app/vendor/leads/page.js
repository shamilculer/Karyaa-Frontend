import React from 'react'
import OverViewStats from '../components/common/OverViewStats'
import LeadsTable from '../components/tables/LeadsTable'

const LeadsPage = () => {
  return (
    <div className="h-full dashboard-container space-y-8">        
        <div className='mb-16'>
            <LeadsTable />
        </div>
    </div>
  )
}

export default LeadsPage