import OverViewStats from '../components/common/OverviewStatsAdmin'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { LogOut, UserPen } from 'lucide-react'
import { getAdminFromToken } from '../utils/getAdminFromToken'
import { getInitials } from '@/utils'
import LogoutAlertModal from '../components/LogoutAlertModal'

const AdminSettingsPage = async () => {

    const { admin } = await getAdminFromToken();

    return (
        <div className="h-full dashboard-container space-y-8">
            <OverViewStats />

            <div className='w-full bg-white flex flex-col gap-7 p-16 border border-gray-200'>
                <div className='w-full flex-between gap-48 pb-10 border-b border-gray-300'>
                    <div className='flex items-center gap-4'>
                        <Avatar className="size-24 border border-gray-200" >
                            <AvatarImage src={admin?.profileImage} />
                            <AvatarFallback >{getInitials(admin?.fullName || admin?.username)}</AvatarFallback>
                        </Avatar>

                        <div>
                            <h3>{admin?.fullName || admin?.username}</h3>
                            <p className='!text-sm text-gray-500'>Administrator</p>
                        </div>
                    </div>

                    <div className='flex-center gap-4'>
                        <Button asChild><Link href="settings/edit-profile"><UserPen className='w-5' /> Edit Profile</Link></Button>
                    </div>
                </div>

                <div className='w-full flex-between gap-5 p-6'>
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

export default AdminSettingsPage