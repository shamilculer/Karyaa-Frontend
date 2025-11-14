import React from 'react'
import ReferralsTable from '../components/tables/ReferralsTable'

const RefferalsManagementPage = () => {
  return (
    <div className='dashboard-container mb-12'>
      <span className='text-sidebar-foreground font-semibold text-2xl uppercase tracking-widest'>Referral Management</span>
      <ReferralsTable />
    </div>
  )
}

export default RefferalsManagementPage
