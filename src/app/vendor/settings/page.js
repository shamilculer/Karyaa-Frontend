// Settings pages use server-side token/cookie-based helpers; mark dynamic to avoid static prerender errors.
export const dynamic = 'force-dynamic';

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Eye, UserPen } from 'lucide-react'
import LogoutAlertModal from "../components/modals/shared/LogoutAlertModal"
import { getVendorFromToken } from '../utils/getVendor'
import { getInitials } from '@/utils'
import SubscriptionStatus from "../components/sections/SubscriptionStatus";

const VendorSettingsPage = async () => {

    const { vendor } = await getVendorFromToken();

    return (
        <div className="dashboard-container mb-10 space-y-8">
            <div className='w-full bg-white flex flex-col gap-7 p-5 lg:p-12 border border-gray-200'>
                <div className='w-full flex-between max-lg:flex-col gap-10 lg:gap-48 pb-10 border-b border-gray-300'>
                    <div className='flex items-center max-lg:flex-col gap-4'>
                        <Avatar className="size-28" >
                            <AvatarImage src={vendor?.businessLogo || ''} alt={vendor?.businessName || 'Vendor'} />
                            <AvatarFallback>{getInitials(vendor?.businessName || 'VNR')}</AvatarFallback>
                        </Avatar>

                        <div>
                            <h3 className='max-lg:text-center'>{vendor?.businessName || "Vendor"}</h3>
                            <p className='!text-sm text-gray-500 max-lg:text-center'>{vendor?.tagline || "Vendor Tagline"}</p>
                        </div>
                    </div>

                    <div className='flex-center gap-4'>
                       <Button asChild><Link href={`/vendors/${vendor?.slug || '#'}`}><Eye className='w-5' /> Preview Profile</Link></Button>
                        <Button asChild><Link href="settings/edit-profile"><UserPen className='w-5' /> Edit Profile</Link></Button>
                    </div>
                </div>

                <SubscriptionStatus />

                <div className='w-full flex-between max-lg:flex-col max-lg:!items-start gap-5 lg:p-6'>
                    <div>
                        <h3>Log Out</h3>
                        <p className='text-sm text-gray-400'>Lorem ipsum dolor sit amet, consect adipiscing elit, sed do sit amet.</p>
                    </div>

                    <div>
                        <LogoutAlertModal />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VendorSettingsPage
