"use client"

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
    Building2, User, Mail, Phone, MapPin, Globe, Calendar, Download,
    CheckCircle2, XCircle, Clock, Timer, Edit,
    Image as ImageIcon, Box, Trash2, Save, LayoutDashboard, Loader2,
    FileText, ArrowLeft, X, ChevronUp,
    BadgeCheck, Star, Facebook, Instagram, Twitter, MessageCircle,
    Link as LinkIcon, MoreVertical,
    Package as PackageIcon, Tag, PlusCircle
} from 'lucide-react';

import {
    updateVendorStatusAction, toggleVendorRecommendedAction, updateVendorBundleAction,
    getVendorGalleryAction, deleteVendorGalleryItemAction,
    getVendorPackagesAction,
    updateVendorFeaturesAction, deleteVendorGalleryItemsAction,
    updateVendorDurationAction
} from '@/app/actions/admin/vendors';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/utils';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import AdminVendorProfileForm from '../forms/AdminVendorProfileForm';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdditionalDocumentsSection from './AdditionalDocumentsSection';
import AdminCommentsSection from './AdminCommentsSection';
import GalleryToolbar from './GalleryToolbar';
import EditPackageModal from '../modals/packages/EditPackageModal';
import ViewPackageModal from '@/app/vendor/components/modals/packages/ViewPackageModal';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import DeletePackageModal from '../modals/packages/DeletePackageModal';

const OCCASIONS = [
    { value: "baby-shower", label: "Baby Shower" },
    { value: "gender-reveal", label: "Gender Reveal" },
    { value: "birthday", label: "Birthday" },
    { value: "graduation", label: "Graduation" },
    { value: "corporate-event", label: "Corporate Event" },
    { value: "brand-launch", label: "Brand Launch" },
    { value: "festivities", label: "Festivities" },
    { value: "anniversary", label: "Anniversary" },
];

const VendorDetailsClient = ({ vendorData, bundles = [], categories = [], subcategories = [] }) => {
    const [vendor, setVendor] = useState(vendorData);
    const [activeTab, setActiveTab] = useState("overview");
    const [isUpdating, setIsUpdating] = useState(false);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isEditingSubscription, setIsEditingSubscription] = useState(false);
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const [isFeatureSubmitting, setIsFeatureSubmitting] = useState(false);
    const [newCustomFeature, setNewCustomFeature] = useState('');
    const [galleryItems, setGalleryItems] = useState([]);
    const [isGalleryLoading, setIsGalleryLoading] = useState(false);
    const [packages, setPackages] = useState([]);
    const [isPackagesLoading, setIsPackagesLoading] = useState(false);
    const [bulkMode, setBulkMode] = useState(false);
    const [selectedGalleryItems, setSelectedGalleryItems] = useState([]);
    const [bundleFormData, setBundleFormData] = useState({
        bundleId: vendor.selectedBundle?._id || "",
        subscriptionStartDate: vendor.subscriptionStartDate ? new Date(vendor.subscriptionStartDate).toISOString().split('T')[0] : "",
        subscriptionEndDate: vendor.subscriptionEndDate ? new Date(vendor.subscriptionEndDate).toISOString().split('T')[0] : ""
    });
    const [customDurationValue, setCustomDurationValue] = useState(vendor.subscriptionDuration?.base?.value || 12);
    const [customDurationUnit, setCustomDurationUnit] = useState(vendor.subscriptionDuration?.base?.unit || 'months');
    const [bonusPeriodValue, setBonusPeriodValue] = useState(vendor.subscriptionDuration?.bonus?.value || 0);
    const [bonusPeriodUnit, setBonusPeriodUnit] = useState(vendor.subscriptionDuration?.bonus?.unit || 'months');

    useEffect(() => {
        if (activeTab === "gallery") fetchGallery();
        else if (activeTab === "packages") fetchPackages();
    }, [activeTab]);

    // Sync duration state with vendor changes (e.g. after bundle update)
    useEffect(() => {
        if (vendor.subscriptionDuration) {
            setCustomDurationValue(vendor.subscriptionDuration.base?.value || 12);
            setCustomDurationUnit(vendor.subscriptionDuration.base?.unit || 'months');
            setBonusPeriodValue(vendor.subscriptionDuration.bonus?.value || 0);
            setBonusPeriodUnit(vendor.subscriptionDuration.bonus?.unit || 'months');
        }
    }, [vendor.subscriptionDuration]);

    const fetchGallery = async () => {
        setIsGalleryLoading(true);
        const result = await getVendorGalleryAction(vendor._id);
        if (result.success) setGalleryItems(result.data);
        else toast.error(result.message);
        setIsGalleryLoading(false);
    };

    const fetchPackages = async () => {
        setIsPackagesLoading(true);
        const result = await getVendorPackagesAction(vendor._id);
        if (result.success) setPackages(result.data);
        else toast.error(result.message);
        setIsPackagesLoading(false);
    };

    const handleStatusChange = async (newStatus) => {
        setIsStatusDropdownOpen(false);
        setIsUpdating(true);
        const result = await updateVendorStatusAction(vendor._id, newStatus);
        if (result.success) {
            setVendor(result.data);
            toast.success(result.message);
        } else toast.error(result.message);
        setIsUpdating(false);
    };

    const handleToggleCertified = async () => {
        setIsStatusDropdownOpen(false);
        setIsUpdating(true);
        const result = await toggleVendorRecommendedAction(vendor._id);
        if (result.success) {
            setVendor(result.data);
            toast.success(result.message);
        } else toast.error(result.message);
        setIsUpdating(false);
    };

    const handleDeleteGalleryItem = async (itemId) => {
        if (!confirm("Delete this image?")) return;
        const result = await deleteVendorGalleryItemAction(vendor._id, itemId);
        if (result.success) {
            setGalleryItems(prev => prev.filter(item => item._id !== itemId));
            toast.success("Image deleted");
        } else toast.error(result.message);
    };

    const toggleSelection = (id) => {
        setSelectedGalleryItems(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleBulkDelete = async () => {
        if (!confirm(`Delete ${selectedGalleryItems.length} items?`)) return;

        const result = await deleteVendorGalleryItemsAction(vendor._id, selectedGalleryItems);
        if (result.success) {
            setGalleryItems(prev => prev.filter(item => !selectedGalleryItems.includes(item._id)));
            setSelectedGalleryItems([]);
            setBulkMode(false);
            toast.success("Items deleted successfully");
        } else {
            toast.error(result.message);
        }
    };

    const handleBundleUpdate = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        const result = await updateVendorBundleAction(vendor._id, bundleFormData);
        if (result.success) {
            setVendor(result.data);
            setIsEditingSubscription(false);
            toast.success("Bundle updated");
        } else toast.error(result.message);
        setIsUpdating(false);
    };

    const handleDurationUpdate = async (e) => {
        e.preventDefault();
        setIsUpdating(true);

        const parsedValue = parseInt(customDurationValue, 10);
        const parsedBonusValue = parseInt(bonusPeriodValue, 10);

        // Ensure we're sending valid numbers (including 0)
        if (isNaN(parsedValue) || parsedValue < 0) {
            toast.error("Please enter a valid duration value (0 or greater)");
            setIsUpdating(false);
            return;
        }

        const result = await updateVendorDurationAction(vendor._id, {
            value: parsedValue,
            unit: customDurationUnit,
            bonusPeriod: {
                value: isNaN(parsedBonusValue) ? 0 : parsedBonusValue,
                unit: bonusPeriodUnit
            }
        });
        if (result.success) {
            setVendor(result.data);
            toast.success("Duration updated successfully");
        } else {
            toast.error(result.message);
        }
        setIsUpdating(false);
    };

    const handleAddCustomFeature = async (e) => {
        e.preventDefault();
        const feature = newCustomFeature.trim();
        if (!feature) {
            toast.error("Feature cannot be empty.");
            return;
        }

        setIsFeatureSubmitting(true);

        const updatedCustomFeatures = [...(vendor.customFeatures || []), feature];

        const result = await updateVendorFeaturesAction(vendor._id, updatedCustomFeatures);

        if (result.success) {
            setVendor({ ...vendor, customFeatures: updatedCustomFeatures });
            setNewCustomFeature('');
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }

        setIsFeatureSubmitting(false);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-50 text-green-700 border-green-200';
            case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'rejected': return 'bg-red-50 text-red-700 border-red-200';
            case 'expired': return 'bg-orange-50 text-orange-700 border-orange-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const getDurationDisplay = () => {
        if (vendor.subscriptionDuration) {
            const base = vendor.subscriptionDuration.base;
            const bonus = vendor.subscriptionDuration.bonus;

            let display = `${base.value} ${base.unit}`;
            if (bonus && bonus.value > 0) {
                display += ` + ${bonus.value} ${bonus.unit} bonus`;
            }
            return display;
        }
        return 'N/A';
    };

    const getTimeRemaining = (endDate) => {
        if (!endDate) return null;

        const end = new Date(endDate);
        const today = new Date();

        if (end <= today) {
            return { expired: true, text: "Expired" };
        }

        // Calculate difference
        const diffTime = end - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // If less than a year, break it down into months and days
        if (diffDays < 365) {
            const months = Math.floor(diffDays / 30);
            const days = diffDays % 30;

            let text = "";
            if (months > 0 && days > 0) {
                text = `${months} month${months > 1 ? 's' : ''} and ${days} day${days > 1 ? 's' : ''} left`;
            } else if (months > 0) {
                text = `${months} month${months > 1 ? 's' : ''} left`;
            } else {
                text = `${days} day${days > 1 ? 's' : ''} left`;
            }

            return {
                expired: false,
                totalDays: diffDays,
                months: months,
                days: days,
                text: text,
                lessThanYear: true
            };
        }

        // More than a year - just show days
        return {
            expired: false,
            totalDays: diffDays,
            text: `${diffDays} days left`,
            lessThanYear: false
        };
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                <Link href="/admin/vendor-management">
                    <Button variant="ghost" size="sm" className="gap-2">
                        <ArrowLeft className="w-4 h-4" />Back to Vendors
                    </Button>
                </Link>

                {/* Header */}
                <div className='relative overflow-hidden rounded-3xl bg-white shadow-sm border border-gray-100 p-8'>
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-purple-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

                    <div className="relative flex items-start gap-8 z-10">
                        <div className="relative flex-shrink-0 group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl opacity-75 group-hover:opacity-100 transition duration-200 blur"></div>
                            <Avatar className="w-32 h-32 rounded-2xl border-4 border-white shadow-2xl relative">
                                <AvatarImage className="object-cover rounded-xl" src={vendor.businessLogo} />
                                <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl">
                                    {getInitials(vendor.businessName)}
                                </AvatarFallback>
                            </Avatar>
                            {vendor.isRecommended && (
                                <div className="absolute -top-3 -left-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full p-2.5 shadow-lg border-2 border-white z-10">
                                    <BadgeCheck className="w-5 h-5 text-white" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-3">
                                <div className="flex-1 min-w-0">
                                    <h1 className="!text-3xl font-bold text-gray-900 mb-1">{vendor.businessName}</h1>
                                    {vendor.tagline && <p className="!text-sm text-gray-600 italic">{vendor.tagline}</p>}
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge className={`${getStatusColor(vendor.vendorStatus)} border-0 font-semibold px-4 py-1.5 text-sm uppercase tracking-wide`}>
                                        {vendor.vendorStatus === 'approved' && <CheckCircle2 className="w-4 h-4 mr-1.5" />}
                                        {vendor.vendorStatus === 'pending' && <Clock className="w-4 h-4 mr-1.5" />}
                                        {vendor.vendorStatus === 'rejected' && <XCircle className="w-4 h-4 mr-1.5" />}
                                        {vendor.vendorStatus === 'expired' && <Timer className="w-4 h-4 mr-1.5" />}
                                        {vendor.vendorStatus.toUpperCase()}
                                    </Badge>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                disabled={isUpdating}
                                                className="rounded-full border-gray-400 border"
                                            >
                                                <MoreVertical className="w-5 h-5" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48">
                                            <DropdownMenuItem
                                                onClick={() => handleStatusChange('approved')}
                                                disabled={vendor.vendorStatus === 'approved'}
                                            >
                                                <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                                                Approve
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleStatusChange('pending')}
                                                disabled={vendor.vendorStatus === 'pending'}
                                            >
                                                <Clock className="w-4 h-4 mr-2 text-yellow-600" />
                                                Set Pending
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleStatusChange('rejected')}
                                                disabled={vendor.vendorStatus === 'rejected'}
                                            >
                                                <XCircle className="w-4 h-4 mr-2 text-red-600" />
                                                Reject
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleStatusChange('expired')}
                                                disabled={vendor.vendorStatus === 'expired'}
                                            >
                                                <Timer className="w-4 h-4 mr-2 text-orange-600" />
                                                Set Expired
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={handleToggleCertified}>
                                                <BadgeCheck className="w-4 h-4 mr-2 text-blue-600" />
                                                {vendor.isRecommended ? 'Remove From Recommendations' : 'Mark as Recommended'}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {Array.isArray(vendor.mainCategory) && vendor.mainCategory.length > 0 ? (
                                    vendor.mainCategory.map((cat, idx) => (
                                        <Badge key={idx} variant="secondary" className="text-xs font-medium bg-indigo-100 text-indigo-700 border-0 px-3 py-1">
                                            {typeof cat === 'object' ? cat.name : cat}
                                        </Badge>
                                    ))
                                ) : (
                                    <Badge variant="secondary" className="text-xs font-medium bg-indigo-100 text-indigo-700 border-0 px-3 py-1">
                                        {vendor.mainCategory?.name || "No Category"}
                                    </Badge>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-sm">
                                {vendor.averageRating > 0 && (
                                    <div className="flex items-center gap-1.5">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span className="font-bold text-gray-900">{vendor.averageRating.toFixed(1)}</span>
                                        <span className="text-gray-500">({vendor.reviewCount || 0} reviews)</span>
                                    </div>
                                )}

                                {vendor.averageRating > 0 && (
                                    <span className="text-gray-400">•</span>
                                )}
                                {vendor.pricingStartingFrom > 0 && (
                                    <>
                                        <span className="text-gray-600">Starting from <span className="font-bold text-gray-900">AED {vendor.pricingStartingFrom}</span></span>
                                        <span className="text-gray-400">•</span>
                                    </>
                                )}
                                <span className="text-gray-500 flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4" />
                                    Registered on {formatDate(vendor.createdAt)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="w-full justify-start bg-transparent p-1 h-auto gap-2 border-b border-gray-100 pb-4">
                        <TabsTrigger
                            value="overview"
                            className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 data-[state=active]:shadow-none border border-transparent data-[state=active]:border-indigo-100 rounded-full px-6 py-2.5 transition-all duration-200"
                        >
                            <LayoutDashboard className="w-4 h-4 mr-2" /> Overview
                        </TabsTrigger>
                        <TabsTrigger
                            value="gallery"
                            className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 data-[state=active]:shadow-none border border-transparent data-[state=active]:border-indigo-100 rounded-full px-6 py-2.5 transition-all duration-200"
                        >
                            <ImageIcon className="w-4 h-4 mr-2" /> Gallery
                        </TabsTrigger>
                        <TabsTrigger
                            value="packages"
                            className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 data-[state=active]:shadow-none border border-transparent data-[state=active]:border-indigo-100 rounded-full px-6 py-2.5 transition-all duration-200"
                        >
                            <Box className="w-4 h-4 mr-2" /> Packages
                        </TabsTrigger>
                    </TabsList>

                    {/* OVERVIEW TAB */}
                    <TabsContent value="overview" className="mt-6 space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Vendor Profile - EDITABLE */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow duration-300">
                                    <div className="flex items-center justify-between mb-5">
                                        <h3 className="!text-xl uppercase font-semibold text-gray-900 flex items-center gap-2">
                                            <Building2 className="w-5 h-5 text-blue-600" />
                                            Vendor Profile
                                        </h3>
                                        {!isEditingProfile && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setIsEditingProfile(true)}
                                                disabled={isUpdating}
                                                className="shadow-sm"
                                            >
                                                <Edit className="w-3.5 h-3.5 mr-1.5" />Edit
                                            </Button>
                                        )}
                                    </div>

                                    {isEditingProfile ? (
                                        <AdminVendorProfileForm
                                            vendor={vendor}
                                            categories={categories}
                                            subcategories={subcategories}
                                            onSuccess={(updatedVendor) => {
                                                setVendor(updatedVendor);
                                                setIsEditingProfile(false);
                                                toast.success("Profile updated successfully");
                                            }}
                                            onCancel={() => setIsEditingProfile(false)}
                                        />
                                    ) : (
                                        <div className="space-y-3 text-sm">
                                            <div className='my-5 flex flex-wrap items-center gap-3'>
                                                {vendor.subCategories?.length > 0 && vendor.subCategories.map(sub => (
                                                    <Badge key={sub._id} className="bg-gray-100 text-gray-800 !px-3 !py-1 rounded-3xl !text-sm border border-gray-300">{sub.name}</Badge>
                                                ))}
                                            </div>
                                            <div><p className="text-xs font-bold text-gray-500 mb-1">Description</p><p className="text-gray-700 whitespace-pre-wrap">{vendor.businessDescription || 'N/A'}</p></div>
                                            <div><p className="text-xs font-bold text-gray-500 mb-1">Occasions Served</p>
                                                <div className="flex flex-wrap gap-1.5 mt-1">
                                                    {vendor.occasionsServed && vendor.occasionsServed.length > 0 ? vendor.occasionsServed.map((occ, idx) => (
                                                        <Badge key={idx} variant="outline" className="bg-gray-100 text-gray-800 !px-3 !py-1 rounded-3xl !text-sm border border-gray-300">{OCCASIONS.find(o => o.value === occ)?.label || occ}</Badge>
                                                    )) : <span className="text-gray-400 text-xs">None</span>}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Subscription Details */}
                                <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-2xl p-8 border border-indigo-100 shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full blur-2xl opacity-50 -mr-10 -mt-10 pointer-events-none"></div>
                                    <div className="flex items-center justify-between mb-5">
                                        <h3 className="!text-xl uppercase font-semibold text-gray-900 flex items-center gap-2">
                                            <PackageIcon className="w-5 h-5 text-blue-600" />
                                            Subscription Details
                                        </h3>
                                        <Button variant="outline" size="sm" onClick={() => setIsEditingSubscription(!isEditingSubscription)} className="shadow-sm">
                                            {isEditingSubscription ? <><ChevronUp className="w-3.5 h-3.5 mr-1.5" />Close</> : <><Edit className="w-3.5 h-3.5 mr-1.5" />Edit</>}
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div><p className="text-xs font-medium text-gray-500 mb-1">Bundle</p><p className="text-sm font-semibold text-gray-900">{vendor.selectedBundle?.name || "None"}</p>{vendor.selectedBundle?.price && <p className="text-xs text-gray-600 mt-0.5">AED {vendor.selectedBundle.price}</p>}</div>
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Total Duration</p>
                                            <p className="text-lg font-bold text-gray-900">{getDurationDisplay()}</p>
                                            {(() => {
                                                const timeLeft = getTimeRemaining(vendor.subscriptionEndDate);
                                                if (!timeLeft) return null;

                                                // Expired
                                                if (timeLeft.expired) {
                                                    return (
                                                        <p className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">
                                                            <XCircle className="w-3 h-3" />
                                                            Expired
                                                        </p>
                                                    );
                                                }

                                                // Determine color based on days remaining
                                                let colorClass = "text-green-600"; // Default: more than 3 months
                                                let IconComponent = Timer;

                                                if (timeLeft.totalDays <= 30) {
                                                    // Less than 1 month - Red (critical)
                                                    colorClass = "text-red-600";
                                                    IconComponent = XCircle;
                                                } else if (timeLeft.totalDays <= 90) {
                                                    // Less than 3 months - Orange (warning)
                                                    colorClass = "text-orange-600";
                                                    IconComponent = Timer;
                                                }

                                                return (
                                                    <p className={`text-xs ${colorClass} font-medium mt-1 flex items-center gap-1`}>
                                                        <IconComponent className="w-3 h-3" />
                                                        {timeLeft.text}
                                                    </p>
                                                );
                                            })()}
                                        </div>
                                        <div><p className="text-xs font-medium text-gray-500 mb-1">Start Date</p><p className="text-sm font-semibold text-gray-900">{formatDate(vendor.subscriptionStartDate)}</p></div>
                                        <div><p className="text-xs font-medium text-gray-500 mb-1">End Date</p><p className="text-sm font-semibold text-gray-900">{formatDate(vendor.subscriptionEndDate)}</p></div>
                                    </div>

                                    {isEditingSubscription && (
                                        <div className="border-t pt-5 space-y-4">
                                            <div className="space-y-6">
                                                {/* Bundle Update Section */}
                                                <div className="space-y-3 pb-4 border-b border-gray-100">
                                                    <h4 className="text-sm font-semibold text-gray-900">Update Bundle Plan</h4>
                                                    <div className="flex items-end gap-4">
                                                        <div className="flex-1 space-y-1.5">
                                                            <label className="text-xs font-medium text-gray-500">Select Bundle</label>
                                                            <Select
                                                                value={bundleFormData.bundleId}
                                                                onValueChange={(value) => setBundleFormData({ ...bundleFormData, bundleId: value })}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select bundle" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {bundles.map(b => (
                                                                        <SelectItem key={b._id} value={b._id}>
                                                                            {b.name} - AED {b.price}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <Button
                                                            onClick={handleBundleUpdate}
                                                            disabled={isUpdating}
                                                            size="sm"
                                                        >
                                                            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Bundle'}
                                                        </Button>
                                                    </div>
                                                </div>

                                                {/* Duration Update Section */}
                                                <div className="space-y-3">
                                                    <h4 className="text-sm font-semibold text-gray-900">Update Duration</h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="space-y-1.5">
                                                            <label className="text-xs font-medium text-gray-500">Base Duration</label>
                                                            <div className="flex gap-2">
                                                                <Input
                                                                    type="number"
                                                                    min={0}
                                                                    value={customDurationValue}
                                                                    onChange={(e) => setCustomDurationValue(e.target.value)}
                                                                    className=""
                                                                />
                                                                <Select value={customDurationUnit} onValueChange={setCustomDurationUnit}>
                                                                    <SelectTrigger className="flex-1 !h-11">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="days">Days</SelectItem>
                                                                        <SelectItem value="months">Months</SelectItem>
                                                                        <SelectItem value="years">Years</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="text-xs font-medium text-gray-500">Bonus Period</label>
                                                            <div className="flex gap-2">
                                                                <Input
                                                                    type="number"
                                                                    min={0}
                                                                    value={bonusPeriodValue}
                                                                    onChange={(e) => setBonusPeriodValue(e.target.value)}
                                                                    className=""
                                                                />
                                                                <Select value={bonusPeriodUnit} onValueChange={setBonusPeriodUnit}>
                                                                    <SelectTrigger className="flex-1 !h-11">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="days">Days</SelectItem>
                                                                        <SelectItem value="months">Months</SelectItem>
                                                                        <SelectItem value="years">Years</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-end pt-2">
                                                        <Button
                                                            onClick={handleDurationUpdate}
                                                            disabled={isUpdating}
                                                            size="sm"
                                                        >
                                                            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : <Clock className="w-4 h-4 mr-1.5" />}
                                                            Update Duration
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {vendor.allFeatures && vendor.allFeatures.length > 0 && (
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow duration-300">
                                        <h2 className="!text-xl uppercase font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <Tag className="w-5 h-5 text-indigo-600" />
                                            Features & Benefits
                                        </h2>

                                        <h3 className="font-semibold text-gray-700 !text-base mb-3">Bundle Features</h3>
                                        <div className="grid md:grid-cols-2 gap-3">
                                            {vendor.allFeatures.map((feature, i) => (
                                                <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                                    <span className="text-sm text-gray-700">{feature}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {vendor.customFeatures && vendor.customFeatures.length > 0 && (
                                            <div className="mt-6">
                                                <h3 className="font-semibold text-gray-700 !text-base mb-3">
                                                    Custom Features
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

                                        <form onSubmit={handleAddCustomFeature} className="my-6 p-4 border border-indigo-100 bg-indigo-50 rounded-lg w-full">
                                            <h3 className="font-semibold text-gray-700 !text-base mb-3 flex items-center gap-2">
                                                <PlusCircle className="w-4 h-4 text-indigo-600" />
                                                Add New Custom Feature
                                            </h3>
                                            <div className="flex gap-2 w-full">
                                                <Input
                                                    value={newCustomFeature}
                                                    onChange={(e) => setNewCustomFeature(e.target.value)}
                                                    placeholder="Enter feature description..."
                                                    disabled={isFeatureSubmitting}
                                                    className='w-full'
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
                                )
                                }

                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow duration-300">
                                    <div className="flex items-center justify-between mb-5">
                                        <h3 className="!text-xl uppercase font-semibold text-gray-900 flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-blue-600" />
                                            Verification Documents
                                        </h3>
                                    </div>

                                    <div className="space-y-3">
                                        {!vendor.isInternational ? (
                                            <>
                                                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                                    <div><p className="text-sm font-medium text-gray-900">Trade License</p><p className="text-xs text-gray-600">{vendor.tradeLicenseNumber || "N/A"}</p></div>
                                                    {vendor.tradeLicenseCopy && <a href={vendor.tradeLicenseCopy} target="_blank" rel="noreferrer"><Button variant="outline" size="sm" className="text-xs"><Download className="w-3.5 h-3.5 mr-1" />Download</Button></a>}
                                                </div>
                                                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                                    <div><p className="text-sm font-medium text-gray-900">Emirates ID</p><p className="text-xs text-gray-600">{vendor.personalEmiratesIdNumber || "N/A"}</p></div>
                                                    {vendor.emiratesIdCopy && <a href={vendor.emiratesIdCopy} target="_blank" rel="noreferrer"><Button variant="outline" size="sm" className="text-xs"><Download className="w-3.5 h-3.5 mr-1" />Download</Button></a>}
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                                    <div><p className="text-sm font-medium text-gray-900">Business License</p><p className="text-xs text-gray-600">{vendor.businessLicenseCopy ? "Uploaded" : "Not uploaded"}</p></div>
                                                    {vendor.businessLicenseCopy && <a href={vendor.businessLicenseCopy} target="_blank" rel="noreferrer"><Button variant="outline" size="sm" className="text-xs"><Download className="w-3.5 h-3.5 mr-1" />Download</Button></a>}
                                                </div>
                                                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                                    <div><p className="text-sm font-medium text-gray-900">Passport/ID</p><p className="text-xs text-gray-600">{vendor.passportOrIdCopy ? "Uploaded" : "Not uploaded"}</p></div>
                                                    {vendor.passportOrIdCopy && <a href={vendor.passportOrIdCopy} target="_blank" rel="noreferrer"><Button variant="outline" size="sm" className="text-xs"><Download className="w-3.5 h-3.5 mr-1" />Download</Button></a>}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Additional Documents Section */}
                                    <div className="mt-6 pt-6 border-t border-gray-200">
                                        <AdditionalDocumentsSection
                                            vendorId={vendor._id}
                                            documents={vendor.additionalDocuments || []}
                                            onUpdate={(updatedDocuments) => {
                                                setVendor({ ...vendor, additionalDocuments: updatedDocuments });
                                            }}
                                        />
                                    </div>
                                </div>

                            </div >

                            {/* Sidebar */}
                            < div className="space-y-6" >
                                {/* Contact */}
                                < div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow duration-300" >
                                    <h3 className="!text-xl uppercase font-semibold text-gray-900 mb-5 flex items-center gap-2">
                                        <User className="w-5 h-5 text-blue-600" />
                                        Contact Information
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 pb-4 border-b">
                                            <Avatar className="w-12 h-12 border-2 border-gray-100">
                                                <AvatarImage src={vendor.ownerProfileImage} />
                                                <AvatarFallback className="text-sm bg-gradient-to-br from-blue-500 to-blue-600 text-white">{getInitials(vendor.ownerName)}</AvatarFallback>
                                            </Avatar>
                                            <div><p className="text-sm font-semibold text-gray-900">{vendor.ownerName}</p><p className="text-xs text-gray-500">Business Owner</p></div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3 text-sm"><Mail className="w-4 h-4 text-gray-400 mt-0.5" /><div><p className="text-xs text-gray-500 mb-0.5">Email</p><a href={`mailto:${vendor.email}`} className="text-gray-900 hover:text-blue-600 break-all">{vendor.email}</a></div></div>
                                            <div className="flex items-start gap-3 text-sm"><Phone className="w-4 h-4 text-gray-400 mt-0.5" /><div><p className="text-xs text-gray-500 mb-0.5">Phone</p><a href={`tel:${vendor.phoneNumber}`} className="text-gray-900 hover:text-blue-600">{vendor.phoneNumber}</a></div></div>
                                            {vendor.whatsAppNumber && (
                                                <div className="flex items-start gap-3 text-sm"><MessageCircle className="w-4 h-4 text-gray-400 mt-0.5" /><div><p className="text-xs text-gray-500 mb-0.5">WhatsApp</p><a href={`https://wa.me/${vendor.whatsAppNumber}`} target="_blank" rel="noreferrer" className="text-gray-900 hover:text-blue-600">{vendor.whatsAppNumber}</a></div></div>
                                            )}
                                        </div>
                                    </div>
                                </div >

                                {/* Location */}
                                < div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow duration-300" >
                                    <h3 className="!text-xl uppercase font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-blue-600" />
                                        Location
                                    </h3>
                                    <div>
                                        <p className="text-sm text-gray-900 font-medium">{vendor.address?.city || 'N/A'}, {vendor.address?.country || 'UAE'}</p>
                                    </div>
                                </div >

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

                                {/* Admin Comments */}
                                <div className="mt-6">
                                    <AdminCommentsSection
                                        vendorId={vendor._id}
                                        comments={vendor.adminComments || []}
                                        onUpdate={(updatedComments) => {
                                            setVendor({ ...vendor, adminComments: updatedComments });
                                        }}
                                    />
                                </div>
                            </div >
                        </div >
                    </TabsContent >

                    {/* GALLERY TAB */}
                    < TabsContent value="gallery" className="mt-6" >
                        <div className="bg-white rounded-xl border border-gray-200 py-6 px-4">
                            <div className="mb-6">
                                <h2 className="!text-2xl uppercase font-semibold text-gray-900 mb-4">Gallery</h2>
                                <GalleryToolbar
                                    vendorId={vendor._id}
                                    onUploadComplete={fetchGallery}
                                    bulkMode={bulkMode}
                                    setBulkMode={setBulkMode}
                                    selectedCount={selectedGalleryItems.length}
                                    onDeleteSelected={handleBulkDelete}
                                    clearSelection={() => setSelectedGalleryItems([])}
                                />
                            </div>

                            {isGalleryLoading ? (
                                <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
                            ) : galleryItems.length === 0 ? (
                                <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                    <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                    <p className="text-sm font-medium text-gray-500">No images in gallery</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {galleryItems.map((item) => (
                                        <div
                                            key={item._id}
                                            className={`group relative aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-all shadow-sm ${selectedGalleryItems.includes(item._id) ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-100 hover:border-blue-300'
                                                }`}
                                            onClick={() => bulkMode && toggleSelection(item._id)}
                                        >
                                            <Image src={item.url} alt={item.caption || "Gallery"} fill className="w-full h-full object-cover" />

                                            {bulkMode && (
                                                <div className="absolute top-2 right-2 z-10">
                                                    <Checkbox
                                                        checked={selectedGalleryItems.includes(item._id)}
                                                        onCheckedChange={() => toggleSelection(item._id)}
                                                        className="bg-white border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 w-5 h-5"
                                                    />
                                                </div>
                                            )}

                                            {!bulkMode && (
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3 gap-2">
                                                    <Button variant="destructive" size="sm" onClick={(e) => { e.stopPropagation(); handleDeleteGalleryItem(item._id); }} className="w-full shadow-lg">
                                                        <Trash2 className="w-3.5 h-3.5 mr-1.5" />Delete
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </TabsContent >

                    {/* PACKAGES TAB */}
                    < TabsContent value="packages" className="mt-4" >
                        <div className="bg-white rounded-xl border border-gray-200 py-6 px-4">
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="!text-2xl uppercase font-semibold text-gray-900">Packages</h2>
                                <div className="flex gap-2">
                                    <EditPackageModal vendorId={vendor._id} onUpdate={fetchPackages} />
                                </div>
                            </div>
                            {isPackagesLoading ? (
                                <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
                            ) : packages.length === 0 ? (
                                <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                    <Box className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                    <p className="text-sm font-medium text-gray-500">No packages available</p>
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {packages.map((pkg, index) => (
                                        <Card
                                            key={index}
                                            className="min-h-[570px] p-3 border-0 shadow-none gap-2 relative"
                                        >
                                            <CardHeader className="p-0">
                                                <Image
                                                    src={pkg.coverImage}
                                                    width={300}
                                                    height={300}
                                                    alt={pkg.name}
                                                    className="w-full object-cover rounded-xl h-64"
                                                />
                                            </CardHeader>

                                            <CardContent className="p-0">
                                                <div className="flex flex-wrap gap-2">
                                                    {pkg.services?.slice(0, 3).map((service) => {
                                                        return (
                                                            <Badge
                                                                key={service}
                                                                className="text-xs rounded-full bg-gray-200 text-gray-600"
                                                            >
                                                                {service}
                                                            </Badge>
                                                        )
                                                    })}
                                                    {pkg.services && pkg.services.length > 3 && (
                                                        <Badge className="text-xs rounded-full bg-gray-200 text-gray-600">
                                                            & {pkg.services.length - 3} more
                                                        </Badge>
                                                    )}
                                                </div>

                                                <h3 className="!text-[20px] mt-5 leading-5 line-clamp-1">
                                                    {pkg.name}
                                                </h3>

                                                <div className="my-3">
                                                    <p className="!text-sm !font-medium font-heading text-gray-700 mb-2">
                                                        This package includes:
                                                    </p>

                                                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 pl-4">
                                                        {pkg.includes?.slice(0, 3).map((item, index) => (
                                                            <li key={index} className="truncate">
                                                                {item}
                                                            </li>
                                                        ))}

                                                        {pkg.includes?.length > 5 && (
                                                            <li className="list-none pl-4 text-gray-400">....</li>
                                                        )}
                                                    </ul>

                                                    <div className="mt-4 ">Starting From <span className="font-medium font-heading">AED {Number(pkg.priceStartingFrom).toLocaleString()}</span></div>
                                                </div>

                                                <div className="w-full flex items-center justify-end gap-4 pt-4 border-t border-gray-300">
                                                    <ViewPackageModal vendorId={vendor._id} packageData={pkg} />
                                                    <EditPackageModal vendorId={vendor._id} packageData={pkg} onUpdate={fetchPackages} />
                                                    <DeletePackageModal
                                                        vendorId={vendor._id}
                                                        packageId={pkg._id}
                                                        packageName={pkg.name}
                                                        onDelete={(deletedId) => setPackages(prev => prev.filter(p => p._id !== deletedId))}
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </TabsContent >
                </Tabs >
            </div >
        </div >
    );
};

export default VendorDetailsClient;