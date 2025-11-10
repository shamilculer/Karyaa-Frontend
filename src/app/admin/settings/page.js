import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { getAdminFromToken } from '../utils/getAdminFromToken'
import { getInitials } from '@/utils'
import LogoutAlertModal from '../components/LogoutAlertModal'

const AdminSettingsPage = async () => {

    const { admin } = await getAdminFromToken();

    return (
        <div className="dashboard-container space-y-8">

            <div className='w-full bg-white flex flex-col gap-7 p-16 border border-gray-200'>
                <div className='w-full flex-between gap-48'>
                    <div className='flex items-center gap-4'>
                        <Avatar className="size-24 border border-gray-200" >
                            <AvatarImage src={admin?.profileImage || ''} alt={admin?.fullName || 'Admin'} />
                            <AvatarFallback>{getInitials(admin?.fullName || admin?.username || 'Admin')}</AvatarFallback>
                        </Avatar>

                        <div>
                            <h3>{admin?.fullName || admin?.username || 'Administrator'}</h3>
                            <p className='!text-sm text-gray-500'>{admin.email}</p>
                        </div>
                    </div>

                    <div className='flex-center gap-4'>
                        <LogoutAlertModal />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default AdminSettingsPage