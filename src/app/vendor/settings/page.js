import OverViewStats from '../components/common/OverViewStats'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Eye, LogOut, UserPen } from 'lucide-react'

const VendorSettingsPage = () => {
    return (
        <div className="h-full dashboard-container space-y-8">
            <OverViewStats />

            <div className='w-full bg-white flex flex-col gap-7 p-16 border border-gray-200'>
                <div className='w-full flex-between gap-48 pb-10 border-b border-gray-300'>
                    <div className='flex items-center gap-4'>
                        <Avatar className="size-28" >
                            <AvatarImage src="/vendor/vendor-2.png" />
                            <AvatarFallback >VNR</AvatarFallback>
                        </Avatar>

                        <div>
                            <h3>Elegant Event Decor</h3>
                            <p className='!text-sm text-gray-500'>Transforming spaces into breathtaking scenes, blending elegance and creativity to make your celebration truly unforgettable.</p>
                        </div>
                    </div>

                    <div className='flex-center gap-4'>
                       <Button asChild><Link href="settings/edit-profile"><Eye className='w-5' /> Preview Profile</Link></Button>
                        <Button asChild><Link href="settings/edit-profile"><UserPen className='w-5' /> Edit Profile</Link></Button>
                    </div>
                </div>

                <div className='w-full flex-between gap-5 p-6'>
                    <div>
                        <h3>Log Out</h3>
                        <p className='text-sm text-gray-400'>Lorem ipsum dolor sit amet, consect adipiscing elit, sed do sit amet.</p>
                    </div>

                    <div>
                        <Button ><LogOut /> Logout</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VendorSettingsPage