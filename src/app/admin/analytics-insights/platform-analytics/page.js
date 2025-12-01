"use client"

import React, { useState, useEffect } from 'react'
import { Users, Mail, TrendingUp, Activity } from 'lucide-react'
import UserGrowthChart from '../../components/charts/UserGrowthChart'
import LeadMetricsChart from '../../components/charts/LeadMetricsChart'
import VendorDistributionChart from '../../components/charts/VendorDistributionChart'
import VendorStatusChart from '../../components/charts/VendorStatusChart'
import EngagementMetricsChart from '../../components/charts/EngagementMetricsChart'
import { getOverviewStats } from '@/app/actions/admin/platformAnalytics'

const PlatformAnalyticsPage = () => {
    const [stats, setStats] = useState({
        totalUsers: { count: 0, change: 0 },
        totalVendors: { count: 0, change: 0 },
        totalLeads: { count: 0, change: 0 },
        totalReviews: { count: 0, change: 0 },
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await getOverviewStats('1M')
                if (response.success && response.data) {
                    setStats(response.data)
                }
            } catch (error) {
                console.error("Error fetching stats:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [])

    const summaryCards = [
        {
            title: "Total Users",
            value: loading ? "..." : stats.totalUsers.count.toLocaleString(),
            change: loading ? "..." : `${stats.totalUsers.change >= 0 ? '+' : ''}${stats.totalUsers.change.toFixed(1)}%`,
            isPositive: stats.totalUsers.change >= 0,
            icon: Users,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "Total Leads",
            value: loading ? "..." : stats.totalLeads.count.toLocaleString(),
            change: loading ? "..." : `${stats.totalLeads.change >= 0 ? '+' : ''}${stats.totalLeads.change.toFixed(1)}%`,
            isPositive: stats.totalLeads.change >= 0,
            icon: Mail,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
        },
        {
            title: "Active Vendors",
            value: loading ? "..." : stats.totalVendors.count.toLocaleString(),
            change: loading ? "..." : `${stats.totalVendors.change >= 0 ? '+' : ''}${stats.totalVendors.change.toFixed(1)}%`,
            isPositive: stats.totalVendors.change >= 0,
            icon: TrendingUp,
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            title: "Total Reviews",
            value: loading ? "..." : stats.totalReviews.count.toLocaleString(),
            change: loading ? "..." : `${stats.totalReviews.change >= 0 ? '+' : ''}${stats.totalReviews.change.toFixed(1)}%`,
            isPositive: stats.totalReviews.change >= 0,
            icon: Activity,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
        },
    ];

    return (
        <div className="p-6 space-y-6">
            {/* Page Header */}
            <div className="mb-6">
                <span className="text-xl font-semibold text-sidebar-foreground uppercase tracking-widest block">Platform Analytics</span>
                <p className="text-gray-500 !text-sm">Track and monitor key platform metrics and performance</p>
            </div>

            {/* Summary Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {summaryCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="!text-xs text-gray-500 font-medium">{stat.title}</p>
                                    <p className="!text-lg font-bold text-gray-900 mt-1">{stat.value}</p>
                                    <div className="flex items-center mt-2">
                                        <span className={`text-sm font-medium ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                            {stat.change}
                                        </span>
                                        <span className="text-xs text-gray-500 ml-2">vs last period</span>
                                    </div>
                                </div>
                                <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                                    <Icon className="h-6 w-6" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Growth Chart */}
                <div className="lg:col-span-2">
                    <UserGrowthChart />
                </div>

                {/* Lead Metrics Chart */}
                <div>
                    <LeadMetricsChart />
                </div>

                {/* Engagement Metrics Chart */}
                <div>
                    <EngagementMetricsChart />
                </div>

                {/* Vendor Distribution Chart */}
                <div>
                    <VendorDistributionChart />
                </div>

                {/* Vendor Status Chart */}
                <div>
                    <VendorStatusChart />
                </div>

            </div>
        </div>
    );
};

export default PlatformAnalyticsPage;