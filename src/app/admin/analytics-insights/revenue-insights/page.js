"use client"

import React, { useState, useEffect } from 'react'
import { Coins, Users, TrendingUp, Activity } from 'lucide-react'
import TotalRevenueChart from '../../components/charts/TotalRevenueChart'
import RevenueByBundleChart from '../../components/charts/RevenueByBundleChart'
import BundlePerformanceChart from '../../components/charts/BundlePerformanceChart'
import { getTotalRevenue } from '@/app/actions/admin/revenueAnalytics'

const RevenueInsightsPage = () => {
    const [stats, setStats] = useState({
        totalRevenue: { value: 0, change: 0 },
        activeSubscriptions: { value: 0, change: 0 },
        newSubscriptions: { value: 0, change: 0 },
        arpu: { value: 0 },
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await getTotalRevenue('1M')
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
            title: "Total Revenue",
            value: loading ? "..." : `AED ${stats.totalRevenue.value.toLocaleString()}`,
            change: loading ? "..." : `${stats.totalRevenue.change >= 0 ? '+' : ''}${stats.totalRevenue.change.toFixed(1)}%`,
            isPositive: stats.totalRevenue.change >= 0,
            icon: Coins,
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            title: "Active Subscriptions",
            value: loading ? "..." : stats.activeSubscriptions.value.toLocaleString(),
            change: loading ? "..." : `${stats.activeSubscriptions.change >= 0 ? '+' : ''}${stats.activeSubscriptions.change.toFixed(1)}%`,
            isPositive: stats.activeSubscriptions.change >= 0,
            icon: Users,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "New Subscriptions",
            value: loading ? "..." : stats.newSubscriptions.value.toLocaleString(),
            change: loading ? "..." : `${stats.newSubscriptions.change >= 0 ? '+' : ''}${stats.newSubscriptions.change.toFixed(1)}%`,
            isPositive: stats.newSubscriptions.change >= 0,
            icon: TrendingUp,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
        },
        {
            title: "Average Revenue Per Vendor",
            value: loading ? "..." : `AED ${stats.arpu.value.toLocaleString()}`,
            change: "Per active vendor",
            isPositive: true,
            icon: Activity,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
        },
    ];

    return (
        <div className="p-6 space-y-6">
            {/* Page Header */}
            <div className="mb-6">
                <span className="text-xl font-semibold text-sidebar-foreground uppercase tracking-widest block">Revenue Insights</span>
                <p className="text-gray-500 !text-sm">Track bundle subscriptions and revenue performance</p>
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
                                        {stat.title !== "Average Revenue Per Vendor" && (
                                            <span className="text-xs text-gray-500 ml-2">vs last period</span>
                                        )}
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
                {/* Total Revenue Chart */}
                <div className="lg:col-span-2">
                    <TotalRevenueChart />
                </div>

                {/* Revenue by Bundle Chart */}
                <div>
                    <RevenueByBundleChart />
                </div>

                {/* Bundle Performance Chart */}
                <div>
                    <BundlePerformanceChart />
                </div>
            </div>
        </div>
    );
};

export default RevenueInsightsPage;