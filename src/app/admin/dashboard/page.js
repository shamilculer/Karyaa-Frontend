import React from 'react'
import OverViewStats from '../components/common/OverviewStatsAdmin'

const AdminDashboard = () => {
    return (
        <div className="h-full dashboard-container space-y-8">
            <OverViewStats />
        </div>
    )
}

export default AdminDashboard