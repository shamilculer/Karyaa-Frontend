"use client"

import { useState, useEffect } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { User, Mail, Phone, Lock, Loader2, Edit, Camera } from 'lucide-react'
import { updateAdminProfileAction, updateAdminPasswordAction } from '@/app/actions/admin/admin'
import { getInitials } from '@/utils'
import { CldUploadWidget } from 'next-cloudinary'
import { useAdminStore } from '@/store/adminStore'
import LogoutAlertModal from '../components/LogoutAlertModal'

const AdminSettingsClient = ({ admin: initialAdmin }) => {
    // Use admin from store for reactive updates, fallback to initialAdmin
    const { admin, updateAdmin } = useAdminStore()

    // Profile form state
    const [profileData, setProfileData] = useState({
        username: (admin || initialAdmin)?.username || (admin || initialAdmin)?.fullName || '',
        email: (admin || initialAdmin)?.email || '',
        phoneNumber: (admin || initialAdmin)?.phoneNumber || '',
        profileImage: (admin || initialAdmin)?.profileImage || '',
    })
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
    const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)

    // Password form state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    })
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)

    // Sync profileData with admin store changes
    useEffect(() => {
        const currentAdmin = admin || initialAdmin
        if (currentAdmin) {
            setProfileData({
                username: currentAdmin.username || currentAdmin.fullName || '',
                email: currentAdmin.email || '',
                phoneNumber: currentAdmin.phoneNumber || '',
                profileImage: currentAdmin.profileImage || '',
            })
        }
    }, [admin, initialAdmin])

    // Handle profile picture upload
    const handleProfileImageUpload = async (result) => {
        if (result.event === 'success') {
            const imageUrl = result.info.secure_url
            setProfileData({ ...profileData, profileImage: imageUrl })

            // Auto-save profile image
            setIsUpdatingProfile(true)
            try {
                const updateResult = await updateAdminProfileAction({ profileImage: imageUrl })
                if (updateResult.success) {
                    // Update Zustand store
                    updateAdmin({
                        profileImage: imageUrl
                    })
                    toast.success('Profile picture updated successfully')
                } else {
                    toast.error(updateResult.message)
                }
            } catch (error) {
                toast.error('Failed to update profile picture')
            } finally {
                setIsUpdatingProfile(false)
            }
        }
    }

    // Handle profile update
    const handleProfileUpdate = async (e) => {
        e.preventDefault()
        setIsUpdatingProfile(true)

        try {
            const result = await updateAdminProfileAction({
                username: profileData.username,
                email: profileData.email,
                phoneNumber: profileData.phoneNumber,
            })

            if (result.success) {
                // Update local state with returned data
                if (result.admin) {
                    setProfileData({
                        username: result.admin.username || result.admin.fullName,
                        email: result.admin.email,
                        phoneNumber: result.admin.phoneNumber || '',
                        profileImage: result.admin.profileImage || profileData.profileImage,
                    })

                    // Update Zustand store with returned data
                    updateAdmin({
                        username: result.admin.username || result.admin.fullName,
                        fullName: result.admin.fullName || result.admin.username,
                        email: result.admin.email,
                        phoneNumber: result.admin.phoneNumber,
                        profileImage: result.admin.profileImage,
                    })
                }

                toast.success(result.message)
                setIsProfileDialogOpen(false)
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            toast.error('An error occurred while updating profile')
        } finally {
            setIsUpdatingProfile(false)
        }
    }

    // Handle password update
    const handlePasswordUpdate = async (e) => {
        e.preventDefault()

        // Validation
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New password and confirm password do not match')
            return
        }

        if (passwordData.newPassword.length < 6) {
            toast.error('New password must be at least 6 characters long')
            return
        }

        setIsUpdatingPassword(true)

        try {
            const result = await updateAdminPasswordAction({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            })

            if (result.success) {
                toast.success(result.message)
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                })
                setIsPasswordDialogOpen(false)
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            toast.error('An error occurred while updating password')
        } finally {
            setIsUpdatingPassword(false)
        }
    }

    return (
        <div className="dashboard-container space-y-6">
            {/* Header Section with Profile Picture */}
            <Card>
                <CardContent className="pt-6 flex items-center justify-between gap-10">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* Profile Picture with Upload */}
                        <div className="relative group">
                            <Avatar className="size-32 border-4 border-primary/20">
                                <AvatarImage src={(admin || initialAdmin)?.profileImage || profileData.profileImage || ''} alt={(admin || initialAdmin)?.username || (admin || initialAdmin)?.fullName || 'Admin'} />
                                <AvatarFallback className="text-3xl font-semibold bg-primary/10 text-primary">
                                    {getInitials((admin || initialAdmin)?.username || (admin || initialAdmin)?.fullName || 'Admin')}
                                </AvatarFallback>
                            </Avatar>

                            {/* Upload Button Overlay */}
                            <CldUploadWidget
                                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                                onSuccess={handleProfileImageUpload}
                                options={{
                                    folder: 'admin/profiles',
                                    maxFiles: 1,
                                    clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
                                    maxFileSize: 5000000, // 5MB
                                }}
                            >
                                {({ open }) => (
                                    <button
                                        type="button"
                                        onClick={() => open()}
                                        className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer"
                                        disabled={isUpdatingProfile}
                                    >
                                        {isUpdatingProfile ? (
                                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                                        ) : (
                                            <Camera className="w-8 h-8 text-white" />
                                        )}
                                    </button>
                                )}
                            </CldUploadWidget>
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-3xl font-bold text-gray-900">{(admin || initialAdmin)?.username || (admin || initialAdmin)?.fullName || 'Administrator'}</h2>
                            <p className="text-sm text-gray-500 mt-1">{(admin || initialAdmin)?.email || ''}</p>
                        </div>
                    </div>

                    <LogoutAlertModal />
                </CardContent>
            </Card>

            {/* Settings Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Edit Profile Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 uppercase">
                            <User className="w-5 h-5 text-primary" />
                            Profile Information
                        </CardTitle>
                        <CardDescription className="!text-sm text-gray-500">
                            Manage your personal details and contact information
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 mb-4">
                            <div className="flex items-center gap-3 text-sm">
                                <User className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">Name:</span>
                                <span className="font-medium">{(admin || initialAdmin)?.username || (admin || initialAdmin)?.fullName || 'Not set'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">Email:</span>
                                <span className="font-medium">{(admin || initialAdmin)?.email || 'Not set'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">Phone:</span>
                                <span className="font-medium">{(admin || initialAdmin)?.phoneNumber || 'Not set'}</span>
                            </div>
                        </div>

                        <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="w-full">
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Profile
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle>Edit Profile Information</DialogTitle>
                                    <DialogDescription>
                                        Update your personal details below
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleProfileUpdate} className="space-y-4 mt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="username">Full Name *</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="username"
                                                type="text"
                                                placeholder="Enter your full name"
                                                value={profileData.username}
                                                onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address *</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="Enter your email"
                                                value={profileData.email}
                                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phoneNumber">Phone Number</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="phoneNumber"
                                                type="tel"
                                                placeholder="Enter your phone number"
                                                value={profileData.phoneNumber}
                                                onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setIsProfileDialogOpen(false)}
                                            className="flex-1"
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={isUpdatingProfile} className="flex-1">
                                            {isUpdatingProfile ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                'Save Changes'
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>

                {/* Change Password Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 uppercase">
                            <Lock className="w-5 h-5 text-primary" />
                            Security Settings
                        </CardTitle>
                        <CardDescription className="!text-sm text-gray-500">
                            Update your password to keep your account secure
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 mb-4">
                            <div className="flex items-center gap-3 text-sm">
                                <Lock className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">Password:</span>
                                <span className="font-medium">••••••••</span>
                            </div>
                            <p className="text-xs text-gray-500">
                                Last updated: {new Date((admin || initialAdmin)?.updatedAt || Date.now()).toLocaleDateString()}
                            </p>
                        </div>

                        <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="w-full">
                                    <Lock className="w-4 h-4 mr-2" />
                                    Change Password
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle>Change Password</DialogTitle>
                                    <DialogDescription>
                                        Enter your current password and choose a new one
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handlePasswordUpdate} className="space-y-4 mt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="currentPassword">Current Password *</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="currentPassword"
                                                type="password"
                                                placeholder="Enter current password"
                                                value={passwordData.currentPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword">New Password *</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="newPassword"
                                                type="password"
                                                placeholder="Enter new password (min 6 characters)"
                                                value={passwordData.newPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                className="pl-10"
                                                required
                                                minLength={6}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm New Password *</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="confirmPassword"
                                                type="password"
                                                placeholder="Confirm new password"
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                className="pl-10"
                                                required
                                                minLength={6}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                setIsPasswordDialogOpen(false)
                                                setPasswordData({
                                                    currentPassword: '',
                                                    newPassword: '',
                                                    confirmPassword: '',
                                                })
                                            }}
                                            className="flex-1"
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={isUpdatingPassword} className="flex-1">
                                            {isUpdatingPassword ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Updating...
                                                </>
                                            ) : (
                                                'Update Password'
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default AdminSettingsClient
