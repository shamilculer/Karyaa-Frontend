"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Eye, EyeOff, Lock, KeyRound, ShieldCheck } from "lucide-react"
import { updateVendorPassword } from "@/app/actions/vendor/password"
import { toast } from "sonner"

const ChangePasswordSection = () => {
    const [open, setOpen] = useState(false)
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error("All fields are required")
            return
        }

        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match")
            return
        }

        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long")
            return
        }

        setIsLoading(true)

        try {
            const result = await updateVendorPassword(currentPassword, newPassword)

            if (result.success) {
                toast.success(result.message || "Password updated successfully")
                // Reset form and close modal
                setCurrentPassword("")
                setNewPassword("")
                setConfirmPassword("")
                setOpen(false)
            } else {
                toast.error(result.message || "Failed to update password")
            }
        } catch (error) {
            toast.error("An unexpected error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='w-full flex-between max-lg:flex-col max-lg:!items-start gap-5 lg:p-6 border-t border-gray-300 pt-10'>
            <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-50 rounded-lg">
                    <ShieldCheck className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Password & Security</h3>
                    <p className='!text-sm text-gray-500'>Keep your account secure by updating your password regularly</p>
                </div>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" className="gap-2">
                        <KeyRound className="w-4 h-4" />
                        Change Password
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <Lock className="w-5 h-5 text-indigo-600" />
                            Change Password
                        </DialogTitle>
                        <DialogDescription className="!text-xs text-gray-500">
                            Enter your current password and choose a new secure password
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-5 mt-4">
                        {/* Current Password */}
                        <div className="space-y-0">
                            <Label htmlFor="currentPassword" className="text-sm font-medium">
                                Current Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="currentPassword"
                                    type={showCurrentPassword ? "text" : "password"}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="Enter current password"
                                    className="pr-10"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-0"
                                >
                                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </Button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div className="space-y-0">
                            <Label htmlFor="newPassword" className="text-sm font-medium">
                                New Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="newPassword"
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    className="pr-10"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-0"
                                >
                                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </Button>
                            </div>
                            <p className="!text-xs text-gray-500">Must be at least 6 characters long</p>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-0">
                            <Label htmlFor="confirmPassword" className="text-sm font-medium">
                                Confirm New Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    className="pr-10"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-0"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </Button>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                                className="flex-1"
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1"
                            >
                                <Lock className="w-4 h-4 mr-2" />
                                {isLoading ? "Updating..." : "Update Password"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ChangePasswordSection
