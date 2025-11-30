import { Suspense } from 'react'
import EnquiryOverTime from '../components/charts/EnquiryOverTime'
import InquiriesByEventType from '../components/charts/InquiriesByEventType'
import InquiriesByLocation from '../components/charts/InquiriesByLocation'
import LeadSource from '../components/charts/LeadSource'
import ProfileViewsOverTime from '../components/charts/ProfileViewsOverTime'
import VisitAndEnquiries from '../components/charts/VisitAndEnquiries'
import PackageEnquiry from "../components/sections/PackageEnquiry"
import LeadsTable from '../components/tables/LeadsTable'
import InterestsByPackage from '../components/charts/InterestsByPackage'

const VendorAnalyticsPage = () => {
    return (
        <div className="dashboard-container space-y-8 mb-10">
            <div className='w-full space-y-5 mb-20'>

                <div>
                    <h3 className='!text-lg lg:!text-2xl uppercase !font-medium'>Profile Performance Insights</h3>
                </div>

                <div className="w-full flex max-lg:flex-col gap-6">
                    <div className="w-full lg:w-2/6">
                        <LeadSource />
                    </div>

                    <div className="w-full lg:w-4/6">
                        <ProfileViewsOverTime />
                    </div>
                </div>

                <div className='w-full'>
                    <VisitAndEnquiries />
                </div>

            </div>

            <div className='w-full space-y-5'>
                <div>
                    <h3 className='!text-lg lg:!text-2xl uppercase !font-medium'>Enquiry Trends & Insights</h3>
                </div>

                <div className='space-y-4'>
                    <h4 className="uppercase !text-sidebar-foreground !font-medium !tracking-widest">
                        Latest Enquiries
                    </h4>
                    <Suspense fallback={<div>Loading leads...</div>}>
                      <LeadsTable controls={false} />
                    </Suspense>
                </div>

                <div className="flex max-lg:flex-col gap-6">
                    <div className="w-full lg:w-1/2">
                        <EnquiryOverTime />
                    </div>

                    <div className="w-full lg:w-1/2">
                        <InquiriesByEventType />
                    </div>
                </div>
                <div className="flex max-lg:flex-col gap-6">
                    <div className="w-full lg:w-4/6">
                        <InquiriesByLocation />
                    </div>

                    <div className="w-full lg:w-2/6">
                        <InterestsByPackage />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VendorAnalyticsPage
