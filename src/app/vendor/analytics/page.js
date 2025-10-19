import EnquiryOverTime from '../components/charts/EnquiryOverTime'
import InquiriesByEventType from '../components/charts/InquiriesByEventType'
import InquiriesByLocation from '../components/charts/InquiriesByLocation'
import LeadSource from '../components/charts/LeadSource'
import ProfileViewsOverTime from '../components/charts/ProfileViewsOverTime'
import VisitAndEnquiries from '../components/charts/VisitAndEnquiries'
import OverViewStats from '../components/common/OverViewStats'
import PackageEnquiry from '../components/PackageEnquiry'
import LeadsTable from '../components/tables/LeadsTable'

const VendorAnalyticsPage = () => {
    return (
        <div className="h-full dashboard-container space-y-8">
            <OverViewStats />
            <div className='w-full space-y-5 mb-20'>

                <div>
                    <h3 className='!text-2xl uppercase !font-medium'>Profile Performance Insights</h3>
                </div>

                <div className="w-full flex gap-6">
                    <div className="w-2/6">
                        <LeadSource />
                    </div>

                    <div className="w-4/6">
                        <ProfileViewsOverTime />
                    </div>
                </div>

                <div className='w-full'>
                    <VisitAndEnquiries />
                </div>

            </div>

            <div className='w-full space-y-5'>
                <div>
                    <h3 className='!text-2xl uppercase !font-medium'>Enquiry Trends & Insights</h3>
                </div>

                <div className='space-y-4'>
                    <h4 className="uppercase !text-sidebar-foreground !font-medium !tracking-widest">
                        Latest Enquiries
                    </h4>
                    <LeadsTable controls={false} />
                </div>

                <div className="flex gap-6">
                    <div className="w-1/2">
                        <EnquiryOverTime />
                    </div>

                    <div className="w-1/2">
                        <InquiriesByEventType />
                    </div>
                </div>
                <div className="flex gap-6">
                    <div className="w-4/6">
                        <InquiriesByLocation />
                    </div>

                    <div className="w-2/6">
                        <PackageEnquiry />
                    </div>
                </div>
            </div>

{/* 
            <div className='w-full space-y-5'>
                <div>
                    <h3 className='!text-2xl uppercase !font-medium'>Review Insights</h3>
                </div>
            </div> */}
        </div>
    )
}

export default VendorAnalyticsPage