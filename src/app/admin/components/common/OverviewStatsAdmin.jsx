"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { getDashboardOverview } from "@/app/actions/admin/dashboard"

const OverViewStats = () => {
    const [stats, setStats] = useState({
        totalActiveVendors: 0,
        totalRegisteredUsers: 0,
        activeAds: 0,
        totalInquiries: 0,
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await getDashboardOverview()
                if (response.success && response.data) {
                    setStats(response.data)
                }
            } catch (error) {
                console.error("Error fetching overview stats:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [])

    return (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-[#FAFAFB] p-5 min-w-1/4 rounded-2xl border border-gray-200 flex-between">
                <div>
                    <span className="uppercase text-sidebar-foreground text-[11px]">Total Active Vendors</span>
                    <div className="mt-1.5 text-3xl flex items-end leading-6">
                        {loading ? "..." : stats.totalActiveVendors.toLocaleString()}
                    </div>
                </div>

                <div className="bg-primary size-12 rounded-2xl flex-center">
                    <Image src="/dashicons/vendors.svg" width={34} height={34} alt="Vendors" />
                </div>
            </div>

            <div className="bg-[#FAFAFB] p-5 min-w-1/4 rounded-2xl border border-gray-200 flex-between">
                <div>
                    <span className="uppercase text-sidebar-foreground text-[11px]">Total Registered Users</span>
                    <div className="mt-1.5 text-3xl flex items-end leading-6">
                        {loading ? "..." : stats.totalRegisteredUsers.toLocaleString()}
                    </div>
                </div>

                <div className="bg-primary size-12 rounded-2xl flex-center">
                    <Image src="/dashicons/users.svg" width={34} height={34} alt="Users" />
                </div>
            </div>

            <div className="bg-[#FAFAFB] p-5 min-w-1/4 rounded-2xl border border-gray-200 flex-between">
                <div>
                    <span className="uppercase text-sidebar-foreground text-[11px]">Active Ads</span>
                    <div className="mt-1.5 text-3xl flex items-end leading-6">
                        {loading ? "..." : stats.activeAds.toLocaleString()}
                    </div>
                </div>

                <div className="bg-primary size-12 rounded-2xl flex-center">
                    <Image src="/dashicons/ads.svg" width={34} height={34} alt="Ads" />
                </div>
            </div>

            <div className="bg-[#FAFAFB] p-5 min-w-1/4 rounded-2xl border border-gray-200 flex-between">
                <div>
                    <span className="uppercase text-sidebar-foreground text-[11px]">Total inquiries generated</span>
                    <div className="mt-1.5 text-3xl flex items-end leading-6">
                        {loading ? "..." : stats.totalInquiries.toLocaleString()}
                    </div>
                </div>

                <div className="bg-primary size-12 rounded-2xl flex-center">
                    <Image src="/dashicons/enquiries.svg" width={34} height={34} alt="Enquiries" />
                </div>
            </div>

        </div>
    )
}

export default OverViewStats
