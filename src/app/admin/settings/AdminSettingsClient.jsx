"use client"

import { useState, useEffect, useRef } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { User, Mail, Phone, Lock, Loader2, Edit, Camera } from 'lucide-react'
import { updateAdminProfileAction, updateAdminPasswordAction } from '@/app/actions/admin/admin'
import { getInitials, formatDate } from '@/utils'
import { useAdminStore } from '@/store/adminStore'
import LogoutAlertModal from "../components/modals/shared/LogoutAlertModal"
import { useS3Upload } from '@/hooks/useS3Upload'

const AdminSettingsClient = ({ admin: initialAdmin }) => {
    // Use admin from store for reactive updates, fallback to initialAdmin
    const { admin, updateAdmin } = useAdminStore()
    const { uploadFile, uploading: isUploadingS3 } = useS3Upload()
    const fileInputRef = useRef(null)

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
    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            const result = await uploadFile(file, {
                folder: 'admin/profiles',
                role: 'admin'
            })

            if (result?.url) {
                const imageUrl = result.url
                setProfileData(prev => ({ ...prev, profileImage: imageUrl }))

                // Auto-save profile image
                setIsUpdatingProfile(true)
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
                setIsUpdatingProfile(false)
            }
        } catch (error) {
            console.error(error)
            toast.error('Failed to upload profile picture')
        } finally {
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
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
                            <div className="absolute -bottom-2 -right-2">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/jpeg,image/png,image/webp,image/jpg"
                                    onChange={handleFileSelect}
                                    disabled={isUpdatingProfile || isUploadingS3}
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-10 h-10 bg-primary rounded-full flex items-center justify-center border-2 border-white shadow-md hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isUpdatingProfile || isUploadingS3}
                                >
                                    {isUpdatingProfile || isUploadingS3 ? (
                                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                                    ) : (
                                        <Camera className="w-5 h-5 text-white" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-3xl font-bold text-gray-900">{(admin || initialAdmin)?.username || (admin || initialAdmin)?.fullName || 'Administrator'}</h2>
                            <p className="text-sm text-gray-500 mt-1">{(admin || initialAdmin)?.email || ''}</p>
                        </div>

                        <LogoutAlertModal />
                    </div>
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
                                Last updated: {formatDate((admin || initialAdmin)?.updatedAt || Date.now())}
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
