"use client"

import React, { useState } from 'react';
import { toast } from 'sonner';
import {
    Building2,
    User,
    Mail,
    Phone,
    MapPin,
    Globe,
    Calendar,
    Download,
    Star,
    Package,
    Tag,
    CheckCircle2,
    XCircle,
    Clock,
    Award,
    Facebook,
    Instagram,
    Twitter,
    MessageCircle,
    FileText,
    Loader2,
    MoreVertical,
    PlusCircle // Added for adding features
} from 'lucide-react';

import {
    updateVendorStatusAction,
    toggleVendorRecommendedAction,
    activateVendorSubscriptionAction,
    updateVendorFeaturesAction // Imported the new action
} from '@/app/actions/admin/vendors';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// --- DROP-DOWN PLACEHOLDERS (Replace with your actual components) ---
// Assuming you have components like those from shadcn/ui
const DropdownMenu = ({ children }) => <div className="relative inline-block text-left">{children}</div>;
const DropdownMenuTrigger = ({ children }) => <div className="cursor-pointer">{children}</div>;
const DropdownMenuContent = ({ children }) => (
    <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none p-1">{children}</div>
);
const DropdownMenuItem = ({ onClick, children, disabled, className }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
        {children}
    </button>
);
const DropdownMenuSeparator = () => <div className="my-1 h-px bg-gray-200" />;

// Assuming Input and Form components for the new feature field
const Input = ({ value, onChange, placeholder, className, disabled }) => (
    <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 ${className}`}
    />
);
// --------------------------------------------------------------------

const VendorDetailsClient = ({ vendorData }) => {
    const [vendor, setVendor] = useState(vendorData);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // To manage the dropdown state
    const [newCustomFeature, setNewCustomFeature] = useState('');
    const [isFeatureSubmitting, setIsFeatureSubmitting] = useState(false);


    const handleStatusChange = async (newStatus) => {
        setIsDropdownOpen(false);
        setIsUpdating(true);

        // 1. Call the server action
        const result = await updateVendorStatusAction(vendor._id, newStatus);

        if (result.success) {
            // ✅ FIX: Use the full updated 'vendor' object from result.data
            // This object contains BOTH the new vendorStatus and the new subscriptionStatus
            setVendor(result.data);

            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
        setIsUpdating(false);
    };

    const handleToggleRecommended = async () => {
        setIsDropdownOpen(false); // Close dropdown on action
        setIsUpdating(true);
        const result = await toggleVendorRecommendedAction(vendor._id);

        if (result.success) {
            // Assuming result.data contains the updated vendor object with the toggled status
            setVendor(result.data);
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
        setIsUpdating(false);
    };

    const handleActivateSubscription = async () => {
        setIsDropdownOpen(false); // Close dropdown on action
        setIsUpdating(true);
        const result = await activateVendorSubscriptionAction(vendor._id);

        if (result.success) {
            // Assuming result.data contains the updated vendor object with the new subscription status
            setVendor(result.data);
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
        setIsUpdating(false);
    };

    // Handler for adding a new custom feature
    const handleAddCustomFeature = async (e) => {
        e.preventDefault();
        const feature = newCustomFeature.trim();
        if (!feature) {
            toast.error("Feature cannot be empty.");
            return;
        }

        setIsFeatureSubmitting(true);

        // Combine existing custom features with the new one
        const updatedCustomFeatures = [...(vendor.customFeatures || []), feature];

        const result = await updateVendorFeaturesAction(vendor._id, updatedCustomFeatures);

        if (result.success) {
            setVendor({ ...vendor, customFeatures: updatedCustomFeatures });
            setNewCustomFeature(''); // Clear the input field
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }

        setIsFeatureSubmitting(false);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved':
            case 'active':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'rejected':
            case 'expired':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-3">

                {/* Header Section */}
                <div>
                    <div className="p-8">
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Logo */}
                            <div className="relative">
                                <Avatar className="w-36 h-36 rounded-2xl border-4 border-white shadow-xl bg-white">
                                    <AvatarImage className="size-full object-cover" src={vendor.businessLogo || 'https://placehold.co/200x200/6366f1/FFFFFF?text=Logo'} />
                                    <AvatarFallback>{getInitials(vendor?.businessName)}</AvatarFallback>
                                </Avatar>
                                {vendor.isRecommended && (
                                    <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-2 shadow-lg">
                                        <Award className="w-5 h-5 text-white" />
                                    </div>
                                )}
                            </div>

                            {/* Business Info and Actions */}
                            <div className="flex-1 mt-16 md:mt-0">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                                    {/* Business Details */}
                                    <div>
                                        <h1 className="!text-[28px] font-bold text-gray-900">{vendor.businessName}</h1>
                                        {vendor.tagline && <p className="text-gray-600 !text-sm italic mb-1">{vendor.tagline}</p>}
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {vendor.mainCategory?.map((cat, i) => (
                                                <Badge key={i} className="px-2 py-.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                                                    {cat.name}
                                                </Badge>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-4 text-sm">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                <span className="font-semibold">{vendor.averageRating || 0}</span>
                                                <span className="text-gray-500">({vendor.reviewCount || 0} reviews)</span>
                                            </div>
                                            {vendor.pricingStartingFrom > 0 && (
                                                <>
                                                    <span className="text-gray-500">•</span>
                                                    <span className="text-gray-600">Starting from AED {vendor.pricingStartingFrom}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Status Badges and Quick Actions Dropdown */}
                                    <div className="flex items-start gap-4">
                                        <div className="flex flex-col gap-2">
                                            <span className={`px-2 py-1 rounded-lg !text-sm font-semibold border text-center ${getStatusColor(vendor.vendorStatus)}`}>
                                                {vendor.vendorStatus === 'approved' && <CheckCircle2 className="w-4 h-4 inline mr-2" />}
                                                {vendor.vendorStatus === 'pending' && <Clock className="w-4 h-4 inline mr-2" />}
                                                {vendor.vendorStatus === 'rejected' && <XCircle className="w-4 h-4 inline mr-2" />}
                                                {vendor.vendorStatus?.toUpperCase()}
                                            </span>
                                            <span className={`px-4 py-2 rounded-lg text-sm font-semibold border text-center ${getStatusColor(vendor.subscriptionStatus)}`}>
                                                Subscription: {vendor.subscriptionStatus?.toUpperCase()}
                                            </span>

                                            {vendor.createdAt && (
                                                <div className="flex items-center gap-2 mt-4 text-gray-600">
                                                    <Calendar className="w-5 h-5" />
                                                    <span className='!text-sm'>Registered on {formatDate(vendor.createdAt)}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Quick Actions Dropdown */}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="w-10 h-10 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                                    disabled={isUpdating}
                                                >
                                                    {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : <MoreVertical className="w-5 h-5" />}
                                                </Button>
                                            </DropdownMenuTrigger>

                                            {isDropdownOpen && ( // Conditionally render the content
                                                <DropdownMenuContent>
                                                    <div className="p-2 space-y-1">
                                                        <p className="text-xs font-semibold text-gray-500 uppercase px-2 mb-1">Vendor Status</p>

                                                        {/* Approve */}
                                                        <DropdownMenuItem
                                                            onClick={() => handleStatusChange('approved')}
                                                            disabled={isUpdating || vendor.vendorStatus === 'approved'}
                                                            className={vendor.vendorStatus === 'approved' ? 'bg-green-100 text-green-700' : ''}
                                                        >
                                                            <CheckCircle2 className="mr-2 h-4 w-4" />
                                                            <span>{vendor.vendorStatus === 'approved' ? 'Approved ✓' : 'Approve'}</span>
                                                        </DropdownMenuItem>

                                                        {/* Set Pending */}
                                                        <DropdownMenuItem
                                                            onClick={() => handleStatusChange('pending')}
                                                            disabled={isUpdating || vendor.vendorStatus === 'pending'}
                                                            className={vendor.vendorStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                                                        >
                                                            <Clock className="mr-2 h-4 w-4" />
                                                            <span>{vendor.vendorStatus === 'pending' ? 'Pending ✓' : 'Set Pending'}</span>
                                                        </DropdownMenuItem>

                                                        {/* Reject */}
                                                        <DropdownMenuItem
                                                            onClick={() => handleStatusChange('rejected')}
                                                            disabled={isUpdating || vendor.vendorStatus === 'rejected'}
                                                            className={vendor.vendorStatus === 'rejected' ? 'bg-red-100 text-red-700' : ''}
                                                        >
                                                            <XCircle className="mr-2 h-4 w-4" />
                                                            <span>{vendor.vendorStatus === 'rejected' ? 'Rejected ✓' : 'Reject'}</span>
                                                        </DropdownMenuItem>

                                                        <DropdownMenuSeparator />

                                                        {/* Toggle Recommended */}
                                                        <DropdownMenuItem
                                                            onClick={handleToggleRecommended}
                                                            disabled={isUpdating}
                                                            className={vendor.isRecommended ? 'bg-yellow-100 text-yellow-700' : ''}
                                                        >
                                                            <Award className="mr-2 h-4 w-4" />
                                                            <span>{vendor.isRecommended ? 'Recommended ✓' : 'Add Recommended'}</span>
                                                        </DropdownMenuItem>

                                                        {/* Activate Subscription - Show only if approved and pending subscription */}
                                                        {vendor.vendorStatus === 'approved' && vendor.subscriptionStatus === 'pending' && (
                                                            <DropdownMenuItem
                                                                onClick={handleActivateSubscription}
                                                                disabled={isUpdating}
                                                                className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                                                            >
                                                                <Package className="mr-2 h-4 w-4" />
                                                                <span>Activate Subscription</span>
                                                            </DropdownMenuItem>
                                                        )}
                                                    </div>
                                                </DropdownMenuContent>
                                            )}
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Right Column - Details */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Business Description */}
                        {vendor.businessDescription && (
                            <div className="bg-white rounded p-6 border border-gray-100">
                                <h2 className="!text-xl uppercase font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-indigo-600" />
                                    About the Business
                                </h2>

                                <div className='my-5 flex flex-wrap items-center gap-3'>
                                    {vendor.subCategories.length > 0 && vendor.subCategories.map(sub => (
                                        <Badge key={sub._id} className="bg-gray-100 text-gray-800 !px-3 !py-1 rounded-3xl !text-sm border border-gray-300">{sub.name}</Badge>
                                    ))}
                                </div>
                                <p className="text-gray-700 leading-relaxed">{vendor.businessDescription}</p>
                            </div>
                        )}


                        {/* Subscription Details */}
                        {vendor.selectedBundle && (
                            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded p-6 border border-indigo-200">
                                <h2 className="!text-xl uppercase font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Package className="w-5 h-5 text-indigo-600" />
                                    Subscription Details
                                </h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Bundle</p>
                                        <p className="text-lg font-bold text-indigo-600">{vendor.selectedBundle.name}</p>
                                        <p className="text-sm text-gray-500">AED {vendor.selectedBundle.price} / {vendor.selectedBundle.duration?.value} {vendor.selectedBundle.duration?.unit}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Status</p>
                                        <span className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold ${getStatusColor(vendor.subscriptionStatus)}`}>
                                            {vendor.subscriptionStatus?.toUpperCase()}
                                        </span>
                                    </div>

                                    {vendor.subscriptionStartDate && (
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Start Date</p>
                                            <p className="font-medium text-gray-900 flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                {formatDate(vendor.subscriptionStartDate)}
                                            </p>
                                        </div>
                                    )}

                                    {vendor.subscriptionEndDate && (
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">End Date</p>
                                            <p className="font-medium text-gray-900 flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                {formatDate(vendor.subscriptionEndDate)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Features */}
                        {vendor.allFeatures && vendor.allFeatures.length > 0 && (
                            <div className="bg-white shadow p-6 border border-gray-100">
                                <h2 className="!text-xl uppercase font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Tag className="w-5 h-5 text-indigo-600" />
                                    Features & Benefits
                                </h2>


                                {/* All Base Features */}
                                <h3 className="font-semibold text-gray-700 !text-base mb-3">All Base Features</h3>
                                <div className="grid md:grid-cols-2 gap-3">
                                    {vendor.allFeatures.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-sm text-gray-700">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Existing Custom Features */}
                                {vendor.customFeatures && vendor.customFeatures.length > 0 && (
                                    <div className="mt-6">
                                        <h3 className="font-semibold text-gray-700 !text-base mb-3">
                                            Existing Custom Features
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-3">
                                            {vendor.customFeatures.map((feature, i) => (
                                                <div key={i} className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                                    <CheckCircle2 className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                                    <span className="text-sm text-gray-700">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Add New Custom Feature Form */}
                                <form onSubmit={handleAddCustomFeature} className="my-6 p-4 border border-indigo-100 bg-indigo-50 rounded-lg">
                                    <h3 className="font-semibold text-gray-700 !text-base mb-3 flex items-center gap-2">
                                        <PlusCircle className="w-4 h-4 text-indigo-600" />
                                        Add New Custom Feature
                                    </h3>
                                    <div className="flex gap-2">
                                        <Input
                                            value={newCustomFeature}
                                            onChange={(e) => setNewCustomFeature(e.target.value)}
                                            placeholder="Enter feature description..."
                                            disabled={isFeatureSubmitting}
                                        />
                                        <Button
                                            type="submit"
                                            disabled={isFeatureSubmitting || newCustomFeature.trim() === ''}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white flex-shrink-0"
                                        >
                                            {isFeatureSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Add'}
                                        </Button>
                                    </div>
                                </form>

                            </div>
                        )}

                        {/* Documents */}
                        <div className="bg-white rounded p-6 border border-gray-100">
                            <h2 className="!text-xl uppercase font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-indigo-600" />
                                Verification Documents
                            </h2>
                            <div className="space-y-4">
                                <div className="border border-gray-200 rounded-xl p-4 hover:border-indigo-300 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-gray-900">Trade License</p>
                                            <p className="text-sm text-gray-500">{vendor.tradeLicenseNumber}</p>
                                        </div>
                                        <a
                                            href={vendor.tradeLicenseCopy}
                                            download
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                                        >
                                            <Download className="w-4 h-4" />
                                            Download
                                        </a>
                                    </div>
                                </div>

                                <div className="border border-gray-200 rounded-xl p-4 hover:border-indigo-300 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-gray-900">Emirates ID</p>
                                            <p className="text-sm text-gray-500">{vendor.personalEmiratesIdNumber}</p>
                                        </div>
                                        <a
                                            href={vendor.emiratesIdCopy}
                                            download
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                                        >
                                            <Download className="w-4 h-4" />
                                            Download
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Left Column - Contact & Location */}
                    <div className="space-y-6">

                        {/* Contact Information */}
                        <div className="rounded shadow-sm p-6 bg-white border border-gray-100">
                            <h2 className="!text-xl uppercase font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-indigo-600" />
                                Contact Information
                            </h2>
                            <div className="space-y-4">

                                <div className="flex items-center gap-3">
                                    <Avatar className="w-20 h-20 rounded-full overflow-hidden bg-white">
                                        <AvatarImage className="size-full object-cover" src={vendor.ownerProfileImage || vendor.businessLogo} />
                                        <AvatarFallback>{getInitials(vendor?.businessName)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium font-heading text-gray-900">{vendor.ownerName}</p>
                                        <p className="!text-sm text-gray-500">Owner Name</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <a href={`mailto:${vendor.email}`} className="font-medium text-indigo-600 hover:underline">
                                            {vendor.email}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Phone</p>
                                        <a href={`tel:${vendor.phoneNumber}`} className="font-medium text-gray-900">
                                            {vendor.phoneNumber}
                                        </a>
                                    </div>
                                </div>

                                {vendor.whatsAppNumber && (
                                    <div className="flex items-start gap-3">
                                        <MessageCircle className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500">WhatsApp</p>
                                            <a href={`https://wa.me/${vendor.whatsAppNumber.replace(/[^0-9]/g, '')}`} className="font-medium text-green-600 hover:underline">
                                                {vendor.whatsAppNumber}
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Location */}
                        <div className="bg-white rounded shadow-sm p-6 border border-gray-100">
                            <h2 className="!text-xl uppercase font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-indigo-600" />
                                Location
                            </h2>
                            <div className="space-y-0">
                                {vendor.address?.street && <p className="text-gray-900 !text-sm">{vendor.address.street}</p>}
                                {vendor.address?.area && <p className="text-gray-600 !text-sm">{vendor.address.area}, {vendor.address.city}</p>}
                                <p className="text-gray-600">{vendor.address?.state}, {vendor.address?.country} {vendor.address?.zipCode}</p>
                                {vendor.address?.googleMapLink && (
                                    <a
                                        href={vendor.address.googleMapLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-indigo-600 hover:underline mt-3"
                                    >
                                        <MapPin className="w-4 h-4" />
                                        View on Google Maps
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Social Links */}
                        {(vendor.websiteLink || vendor.facebookLink || vendor.instagramLink || vendor.twitterLink) && (
                            <div className="bg-white rounded shadow-lg p-6 border border-gray-100">
                                <h2 className="!text-xl uppercase font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Globe className="w-5 h-5 text-indigo-600" />
                                    Online Presence
                                </h2>
                                <div className="space-y-3">
                                    {vendor.websiteLink && (
                                        <a href={vendor.websiteLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-700 hover:text-indigo-600 transition-colors">
                                            <Globe className="w-5 h-5" />
                                            <span>Website</span>
                                        </a>
                                    )}
                                    {vendor.facebookLink && (
                                        <a href={vendor.facebookLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors">
                                            <Facebook className="w-5 h-5" />
                                            <span>Facebook</span>
                                        </a>
                                    )}
                                    {vendor.instagramLink && (
                                        <a href={vendor.instagramLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-700 hover:text-pink-600 transition-colors">
                                            <Instagram className="w-5 h-5" />
                                            <span>Instagram</span>
                                        </a>
                                    )}
                                    {vendor.twitterLink && (
                                        <a href={vendor.twitterLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-700 hover:text-blue-400 transition-colors">
                                            <Twitter className="w-5 h-5" />
                                            <span>Twitter</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default VendorDetailsClient;