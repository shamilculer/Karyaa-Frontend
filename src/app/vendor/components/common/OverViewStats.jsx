"use client"
import { useEffect, useState } from "react"
import { ChevronsDown, ChevronsUp, Loader2 } from "lucide-react"
import Image from "next/image"
import { getOverviewStats } from "@/app/actions/vendor/analytics"

const OverViewStats = () => {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const result = await getOverviewStats()
                if (result.success) {
                    setStats(result.data)
                }
            } catch (error) {
                console.error("Failed to fetch overview stats", error)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [])

    const renderTrend = (current, previous) => {
        const diff = current - previous
        const isPositive = diff >= 0
        const Icon = isPositive ? ChevronsUp : ChevronsDown
        const colorClass = isPositive ? "text-dashboard-green" : "text-red-500"

        return (
            <span className={`text-lg ml-1.5 ${colorClass} flex-center leading-0.5`}>
                {isPositive ? "+" : ""}{diff} <Icon className="size-4" />
            </span>
        )
    }

    if (loading) {
        return (
            <div className="w-full h-[100px] flex items-center justify-center bg-[#FAFAFB] rounded-2xl border border-gray-200">
                <Loader2 className="animate-spin text-gray-400" />
            </div>
        )
    }

    const data = stats || {
        enquiries: { current: 0, previous: 0 },
        views: { current: 0, previous: 0 },
        whatsapp: { current: 0, previous: 0 },
        reviews: { current: 0, previous: 0 }
    }

    const currentMonthName = new Date().toLocaleString('default', { month: 'long' })

    return (
        <div className="w-full flex max-xl:overflow-x-scroll max-lg:w-screen gap-8 pb-2 max-xl:pr-5">
            <div className="bg-[#FAFAFB] p-5 w-1/4 min-w-[283px] rounded-2xl border border-gray-200 flex-between">
                <div>
                    <span className="uppercase text-sidebar-foreground text-[11px]">Total Enquiries ({currentMonthName})</span>
                    <div className="mt-1.5 text-3xl flex items-end leading-6">
                        {data.enquiries.current}
                        <div className="flex items-center ml-1.5">
                            {renderTrend(data.enquiries.current, data.enquiries.previous)}
                            <span className="text-[10px] text-gray-400 font-normal leading-none mt-0.5">vs last month</span>
                        </div>
                    </div>
                </div>

                <div className="bg-primary size-12 rounded-2xl flex-center">
                    <Image src="/dashicons/leads.svg" width={34} height={34} alt="Leads" />
                </div>
            </div>

            <div className="bg-[#FAFAFB] p-5 w-1/4 min-w-[283px] rounded-2xl border border-gray-200 flex-between">
                <div>
                    <span className="uppercase text-sidebar-foreground text-[11px]">Profile Visits ({currentMonthName})</span>
                    <div className="mt-1.5 text-3xl flex items-end leading-6">
                        {data.views.current}
                        <div className="flex items-center ml-1.5">
                            {renderTrend(data.views.current, data.views.previous)}
                            <span className="text-[10px] text-gray-400 font-normal leading-none mt-0.5">vs last month</span>
                        </div>
                    </div>
                </div>

                <div className="bg-primary size-12 rounded-2xl flex-center">
                    <Image src="/dashicons/profile-view.svg" width={34} height={34} alt="Views" />
                </div>
            </div>

            <div className="bg-[#FAFAFB] p-5 w-1/4 min-w-[283px] rounded-2xl border border-gray-200 flex-between">
                <div>
                    <span className="uppercase text-sidebar-foreground text-[11px]">WhatsApp Clicks ({currentMonthName})</span>
                    <div className="mt-1.5 text-3xl flex items-end leading-6">
                        {data.whatsapp.current}
                        <div className="flex items-center ml-1.5">
                            {renderTrend(data.whatsapp.current, data.whatsapp.previous)}
                            <span className="text-[10px] text-gray-400 font-normal leading-none mt-0.5">vs last month</span>
                        </div>
                    </div>
                </div>

                <div className="bg-primary size-12 rounded-2xl flex-center">
                    <Image src="/dashicons/whatsapp-clicks.svg" width={34} height={34} alt="WhatsApp" />
                </div>
            </div>

            <div className="bg-[#FAFAFB] p-5 w-1/4 min-w-[283px] rounded-2xl border border-gray-200 flex-between">
                <div>
                    <span className="uppercase text-sidebar-foreground text-[11px]">Reviews Received ({currentMonthName})</span>
                    <div className="mt-1.5 text-3xl flex items-end leading-6">
                        {data.reviews.current}
                        <div className="flex items-center ml-1.5">
                            {renderTrend(data.reviews.current, data.reviews.previous)}
                            <span className="text-[10px] text-gray-400 font-normal leading-none mt-0.5">vs last month</span>
                        </div>
                    </div>
                </div>

                <div className="bg-primary size-12 rounded-2xl flex-center">
                    <Image src="/dashicons/reviews.svg" width={34} height={34} alt="Reviews" />
                </div>
            </div>
        </div>
    )
}

export default OverViewStats
