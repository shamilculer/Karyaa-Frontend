import { Suspense } from "react"
import EnquiryOverTime from "../components/charts/EnquiryOverTime"
import LeadSource from "../components/charts/LeadSource"
import ReviewInsights from "../components/sections/ReviewInsights"
import VisitAndEnquiries from "../components/charts/VisitAndEnquiries"
import LeadsTable from "../components/tables/LeadsTable"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

const VendorDashboardPage = () => {
  return (
    <div className="dashboard-container space-y-8">
      <div className="w-full flex max-lg:flex-col gap-6">
        <div className="w-full lg:w-4/6">
          <EnquiryOverTime />
        </div>

        <div className="w-full lg:w-2/6">
          <LeadSource />
        </div>
      </div>

      <div className="flex max-lg:flex-col gap-6">
        <div className="w-full lg:w-2/5">
          <ReviewInsights />
        </div>

        <div className="w-full lg:w-3/5">
          <VisitAndEnquiries />
        </div>
      </div>


      <div className="w-full my-16">
        <div className="w-full flex-between mb-5">
          <div>
            <h4 className="uppercase text-sidebar-foreground text-xl !font-body !font-normal !tracking-widest">
              Leads
            </h4>
            <span className="text-xs">View and Manage Leads</span>
          </div>

          <Button asChild variant="outline" className="max-md:!px-3 max-md:py-1 max-md:h-auto" >
            <Link href="/vendor/leads">Manage Leads</Link>
          </Button>
        </div>
        <Suspense fallback={<div>Loading leads...</div>}>
          <LeadsTable />
        </Suspense>
      </div>

      <div className="w-full space-y-5">
        <div className="w-full flex-between">
          <h4 className="uppercase text-sidebar-foreground text-xl !font-body !font-normal !tracking-widest">
            Gallery
          </h4>

          <Button asChild variant="outline" className="max-md:!px-3 max-md:py-1 max-md:h-auto" >
            <Link href="/vendor/gallery">Manage Gallery</Link>
          </Button>
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 w-full place-items-center gap-5" >
          <Image src="/why-us.jpg" className="h-72 object-cover rounded-2xl border border-gray-300" width={300} height={300} alt="Gallery" />
          <Image src="/banner-2.jpg" className="h-72 object-cover rounded-2xl border border-gray-300" width={300} height={300} alt="Gallery" />
          <Image src="/blog-2.webp" className="h-72 object-cover rounded-2xl border border-gray-300" width={300} height={300} alt="Gallery" />
          <Image src="/banner-1.avif" className="h-72 object-cover rounded-2xl border border-gray-300" width={300} height={300} alt="Gallery" />
          <Image src="/new-banner-1.jpg" className="h-72 object-cover rounded-2xl border border-gray-300" width={300} height={300} alt="Gallery" />
        </div>
      </div>
    </div>
  )
}

export default VendorDashboardPage
