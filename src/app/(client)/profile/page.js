"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  deleteUserAccount,
} from "@/app/actions/user/user";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  XCircle,
  Edit2,
  Save,
  X,
  Phone,
  Mail,
  MapPin,
  Loader2,
  Lock,
  Shield,
  AlertTriangle,
  Camera,
  Eye,
  EyeOff,
} from "lucide-react";
import { useClientStore } from "@/store/clientStore";
import { CldUploadWidget } from "next-cloudinary";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const { user: storedUser, setUser: setStoredUser } = useClientStore();

  // Profile form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
    reset: resetProfile,
    control,
  } = useForm();

  // Password form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
    reset: resetPassword,
  } = useForm();

  // Delete account form
  const {
    register: registerDelete,
    handleSubmit: handleDeleteSubmit,
    formState: { errors: deleteErrors, isSubmitting: isDeleteSubmitting },
    reset: resetDelete,
  } = useForm();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    const result = await getUserProfile();
    if (result.success) {
      setUser(result.user);
      resetProfile(result.user);
    } else {
      setMessage({ type: "error", text: result.error });
    }
    setLoading(false);
  };

  const onUpdateProfile = async (data) => {
    setMessage({ type: "", text: "" });
    const result = await updateUserProfile(data);

    if (result.success) {
      setUser(result.user);
      setStoredUser({
        _id: result.user._id,
        role: result.user?.role,
        username: result.user?.username,
        emailAddress: result.user?.emailAddress,
        mobileNumber: result.user?.mobileNumber,
        location: result.user?.location,
        profileImage: result.user?.profileImage,
        createdAt: result.user?.createdAt,
        updatedAt: result.user?.updatedAt,
      });
      setIsEditing(false);
      setMessage({ type: "success", text: result.message });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } else {
      setMessage({ type: "error", text: result.error });
    }
  };

  const onChangePassword = async (data) => {
    setMessage({ type: "", text: "" });
    const result = await changePassword(data);

    if (result.success) {
      resetPassword();
      setMessage({ type: "success", text: result.message });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } else {
      setMessage({ type: "error", text: result.error });
    }
  };

  const onDeleteAccount = async (data) => {
    const result = await deleteUserAccount(data.password);

    if (!result.success) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({ type: "success", text: result.message });
      setShowDeleteModal(false);
      setStoredUser(null);

      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    }
  };

  const handleProfileImageUpload = async (result) => {
    if (result.event === 'success') {
      const imageUrl = result.info.secure_url

      // Optimistic update
      setUser(prev => ({ ...prev, profileImage: imageUrl }))

      // Save to backend
      const updateResult = await updateUserProfile({ profileImage: imageUrl })

      if (updateResult.success) {
        setStoredUser({ ...storedUser, profileImage: imageUrl })
        setMessage({ type: "success", text: "Profile picture updated successfully" })
        setTimeout(() => setMessage({ type: "", text: "" }), 3000)
      } else {
        setMessage({ type: "error", text: updateResult.error })
        // Revert on failure
        setUser(prev => ({ ...prev, profileImage: user.profileImage }))
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-sm text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "U"
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="space-y-6">
          {/* Message Alert */}
          {message.text && (
            <Alert
              className={`${message.type === "success"
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
                } shadow-lg`}
            >
              {message.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription
                className={
                  message.type === "success" ? "text-green-800" : "text-red-800"
                }
              >
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          {/* Profile Overview Card */}
          <Card className="border-0 overflow-hidden">
            <CardContent className="relative max-xl:px-0">
              <div className="flex flex-col md:flex-row items-start md:items-end gap-6 px-4">
                <div className="relative group">
                  <Avatar className="size-24 xl:size-32 border-4 border-white shadow-2xl ring-4 ring-indigo-100">
                    <AvatarImage
                      src={user?.profileImage}
                      alt={user?.username}
                    />
                    <AvatarFallback className="text-3xl bg-gradient-to-br from-indigo-400 to-purple-400 text-white font-bold">
                      {getInitials(user?.username)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Upload Button Overlay */}
                  <CldUploadWidget
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                    onSuccess={handleProfileImageUpload}
                    options={{
                      folder: 'client/profiles',
                      maxFiles: 1,
                      clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
                      maxFileSize: 5000000, // 5MB
                    }}
                  >
                    {({ open }) => (
                      <button
                        type="button"
                        onClick={() => open()}
                        className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer z-10"
                      >
                        <Camera className="w-8 h-8 text-white" />
                      </button>
                    )}
                  </CldUploadWidget>
                </div>


                <div className="flex-1 space-y-2">
                  <div>
                    <h2 className="!text-3xl font-bold text-gray-900">
                      {user?.username}
                    </h2>
                    <p className="text-gray-500 !text-sm">
                      Member since {formatDate(user?.createdAt)}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                      <Mail className="h-4 w-4 text-secondary" />
                      <span className="font-medium">{user?.emailAddress}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                      <Phone className="h-4 w-4 text-secondary" />
                      <span className="font-medium">{user?.mobileNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                      <MapPin className="h-4 w-4 text-secondary" />
                      <span className="font-medium">{user?.location}</span>
                    </div>
                  </div>
                </div>

                {!isEditing && (
                  <Button onClick={() => setIsEditing(true)}>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Profile Information Card */}
          <Card className="border-0">
            <CardHeader className="border-b border-b-gray-400">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-200 rounded-lg">
                    <Edit2 className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <CardTitle className="text-base xl:text-xl uppercase">
                      Profile Information
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Update your personal details and contact information
                    </CardDescription>
                  </div>
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        resetProfile(user);
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      onClick={handleProfileSubmit(onUpdateProfile)}
                      disabled={isProfileSubmitting}
                    >
                      {isProfileSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="xl:p-8 space-y-8">


              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="username"
                    className="text-sm xl:text-base font-semibold text-gray-700"
                  >
                    Full Name
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    {...registerProfile("username", {
                      required: "Name is required",
                    })}
                    disabled={!isEditing}
                    className={`h-12 ${!isEditing
                      ? "bg-gray-200 border-gray-200"
                      : "border-indigo-200"
                      }`}
                  />
                  {profileErrors.username && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      {profileErrors.username.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="emailAddress"
                    className="text-sm xl:text-base font-semibold text-gray-700"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="emailAddress"
                    type="email"
                    {...registerProfile("emailAddress", {
                      required: "Email is required",
                    })}
                    disabled={!isEditing}
                    className={`h-12 ${!isEditing
                      ? "bg-gray-200 border-gray-200"
                      : "border-indigo-200"
                      }`}
                  />
                  {profileErrors.emailAddress && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      {profileErrors.emailAddress.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="mobileNumber"
                    className="text-sm xl:text-base font-semibold text-gray-700"
                  >
                    Mobile Number
                  </Label>
                  <Input
                    id="mobileNumber"
                    type="tel"
                    {...registerProfile("mobileNumber", {
                      required: "Mobile number is required",
                    })}
                    disabled={!isEditing}
                    className={`h-12 ${!isEditing
                      ? "bg-gray-200 border-gray-200"
                      : "border-indigo-200"
                      }`}
                  />
                  {profileErrors.mobileNumber && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      {profileErrors.mobileNumber.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="location"
                    className="text-sm xl:text-base font-semibold text-gray-700"
                  >
                    Location
                  </Label>
                  <Input
                    id="location"
                    type="text"
                    {...registerProfile("location", {
                      required: "Location is required",
                    })}
                    disabled={!isEditing}
                    className={`h-12 ${!isEditing
                      ? "bg-gray-200 border-gray-200"
                      : "border-indigo-200"
                      }`}
                  />
                  {profileErrors.location && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      {profileErrors.location.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings Card */}
          <Card className="border-0">
            <CardHeader className="border-b border-b-gray-400">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-200 rounded-lg">
                  <Shield className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <CardTitle className="text-base xl:text-xl uppercase">
                    Security Settings
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Keep your account secure by updating your password regularly
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="xl:p-8 space-y-6">
              <Alert className="bg-blue-50 border-blue-200">
                <Lock className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800 !text-xs xl:!text-sm">
                  Must be at least 6 characters and include uppercase, lowercase, and a number.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="currentPassword"
                    className="text-sm xl:text-base font-semibold text-gray-700"
                  >
                    Current Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      {...registerPassword("currentPassword", {
                        required: "Current password is required",
                      })}
                      placeholder="••••••••"
                      className="h-12 border-indigo-200 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                  {passwordErrors.currentPassword && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      {passwordErrors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="newPassword"
                    className="text-base font-semibold text-gray-700"
                  >
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      {...registerPassword("newPassword", {
                        required: "New password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                      placeholder="••••••••"
                      className="h-12 border-indigo-200 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                  {passwordErrors.newPassword && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      {passwordErrors.newPassword.message}
                    </p>
                  )}
                </div>
              </div>

              <Button
                onClick={handlePasswordSubmit(onChangePassword)}
                disabled={isPasswordSubmitting}
                className="w-full md:w-auto"
              >
                {isPasswordSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating Password...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Update Password
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Danger Zone Card */}
          <Card className="border-0  pt-0 border-l-4 border-l-red-500 overflow-hidden">
            <div className="bg-gradient-to-r from-red-50 to-orange-50">
              <CardHeader className="border-b border-red-100 !pt-5 !pb-4 xl:!py-7 max-xl:!px-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base xl:text-xl uppercase text-red-900">
                      Danger Zone
                    </CardTitle>
                    <CardDescription className="text-red-700 text-xs">
                      Proceed with caution - these actions are irreversible
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </div>
            <CardContent className="xl:p-8">
              <div className="flex xl:items-center justify-between max-xl:flex-col max-xl:gap-6 p-6 bg-red-50 border border-red-100 rounded-lg">
                <div>
                  <h3 className="!text-lg font-semibold text-red-900 mb-1">
                    Delete Account
                  </h3>
                  <p className="!text-sm text-red-700">
                    Permanently remove your account and all associated data
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteModal(true)}
                  className="bg-red-600 hover:bg-red-700 shadow-md"
                  size="lg"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <DialogTitle className="text-center text-2xl font-bold">
              Delete Account?
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              This action is permanent and cannot be reversed. All your data
              will be lost forever.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Alert className="bg-red-50 border-red-200">
              <AlertDescription className="text-red-800 text-sm">
                Please enter your password to confirm this action.
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Label
                htmlFor="deletePassword"
                className="text-base font-semibold"
              >
                Confirm Password
              </Label>
              <Input
                id="deletePassword"
                type="password"
                {...registerDelete("password", {
                  required: "Password is required",
                })}
                placeholder="Enter your password"
                className="h-12"
              />
              {deleteErrors.password && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <XCircle className="h-3 w-3" />
                  {deleteErrors.password.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false);
                resetDelete();
              }}
              className="w-full sm:w-auto h-11"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteSubmit(onDeleteAccount)}
              disabled={isDeleteSubmitting}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 h-11"
            >
              {isDeleteSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Yes, Delete My Account
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
