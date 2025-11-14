"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { getVendorSubscriptionStatusAction } from '@/app/actions/vendor/bundles';
import {
    CheckCircle,
    XCircle,
    Hourglass,
    Calendar,
    DollarSign,
    Package,
    Rocket,
    AlertTriangle,
    Info,
    Zap,
    Loader2,
    Clock
} from 'lucide-react';

const StatusBadge = ({ status, isActive }) => {
    let icon, variantClasses, text;

    if (isActive) {
        icon = <CheckCircle className="w-4 h-4" />;
        variantClasses = "bg-green-50 text-green-700 border border-green-200";
        text = "Active";
    } else {
        switch (status) {
            case 'pending':
                icon = <Hourglass className="w-4 h-4" />;
                variantClasses = "bg-amber-50 text-amber-700 border border-amber-200";
                text = "Pending Review";
                break;
            case 'expired':
                icon = <XCircle className="w-4 h-4" />;
                variantClasses = "bg-red-50 text-red-700 border border-red-200";
                text = "Expired";
                break;
            case 'rejected':
                icon = <XCircle className="w-4 h-4" />;
                variantClasses = "bg-red-50 text-red-700 border border-red-200";
                text = "Rejected";
                break;
            default:
                icon = <Hourglass className="w-4 h-4" />;
                variantClasses = "bg-gray-50 text-gray-700 border border-gray-200";
                text = status.charAt(0).toUpperCase() + status.slice(1);
        }
    }

    return (
        <span className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md ${variantClasses}`}>
            {icon}
            {text}
        </span>
    );
};

const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
        <div className="flex items-center gap-2 text-sm text-gray-600">
            <Icon className="w-4 h-4" />
            <span>{label}</span>
        </div>
        <span className="text-sm font-semibold text-gray-900">{value || 'N/A'}</span>
    </div>
);

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(new Date(dateString));
};

const SubscriptionData = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const result = await getVendorSubscriptionStatusAction();
                if (result.error) {
                    setError(result.error);
                    setData(null);
                } else {
                    setData(result.data);
                    setError(null);
                }
            } catch (err) {
                setError("An unexpected error occurred while fetching your subscription details.");
                setData(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                <div className='bg-white rounded-lg border border-gray-200 p-6 animate-pulse'>
                    <div className='h-5 bg-gray-200 rounded w-1/2 mb-4'></div>
                    <div className='h-8 bg-gray-200 rounded w-2/3 mb-6'></div>
                    <div className='space-y-3'>
                        <div className='h-12 bg-gray-100 rounded'></div>
                        <div className='h-12 bg-gray-100 rounded'></div>
                        <div className='h-12 bg-gray-100 rounded'></div>
                    </div>
                </div>
                <div className='lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6 animate-pulse'>
                    <div className='h-5 bg-gray-200 rounded w-1/3 mb-6'></div>
                    <div className='h-32 bg-gray-100 rounded mb-6'></div>
                    <div className='h-5 bg-gray-200 rounded w-1/4 mb-4'></div>
                    <div className='space-y-2'>
                        <div className='h-10 bg-gray-100 rounded'></div>
                        <div className='h-10 bg-gray-100 rounded'></div>
                        <div className='h-10 bg-gray-100 rounded'></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                    <h5 className="font-semibold text-red-900 mb-1">Subscription Status Error</h5>
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            </div>
        );
    }

    if (!data || !data.bundle) {
        return (
            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                    <h5 className="font-semibold text-blue-900 mb-1">No Active Plan Found</h5>
                    <p className="text-sm text-blue-700">Your vendor listing is currently inactive. Please select a bundle to activate your services.</p>
                </div>
            </div>
        );
    }

    const { bundle, subscription, isSubscriptionActive, status } = data;

    const durationValue = bundle.duration?.value;
    const durationUnit = bundle.duration?.unit;
    const bonusValue = bundle.bonusPeriod?.value;
    const bonusUnit = bundle.bonusPeriod?.unit;
    
    let durationText = durationValue && durationUnit 
        ? `${durationValue} ${durationUnit.replace(/s$/, '')}${durationValue !== 1 ? 's' : ''}` 
        : 'N/A';

    if (bonusValue > 0) {
        durationText += ` + ${bonusValue} ${bonusUnit.replace(/s$/, '')}${bonusValue !== 1 ? 's' : ''}`;
    }

    return (
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            {/* Status Card */}
            <div className='bg-white rounded-lg border border-gray-200 p-6'>
                <h4 className="text-base font-semibold text-gray-900 mb-4">Current Status</h4>
                
                <div className='mb-6'>
                    <StatusBadge status={status} isActive={isSubscriptionActive} />
                </div>
                
                <div>
                    <InfoRow
                        icon={Calendar}
                        label="Start Date"
                        value={formatDate(subscription.startDate)}
                    />
                    <InfoRow
                        icon={Clock}
                        label="End Date"
                        value={formatDate(subscription.endDate)}
                    />
                </div>
            </div>

            {/* Bundle Details Card */}
            <div className='lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6'>
                <h4 className="text-base font-semibold text-gray-900 mb-4 pb-4 border-b border-gray-200">Bundle Details</h4>
                
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6'>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                            <Package className="w-4 h-4" />
                            <span>Bundle Name</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">{bundle.name || 'Custom Plan'}</p>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                            <DollarSign className="w-4 h-4" />
                            <span>Price</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">{bundle.price ? `${bundle.price} AED` : 'Custom'}</p>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                            <Calendar className="w-4 h-4" />
                            <span>Duration</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">{durationText}</p>
                    </div>
                </div>

                <h5 className="text-sm font-semibold text-gray-900 mb-3">Plan Features</h5>
                
                <div className="space-y-2">
                    {bundle.features && bundle.features.length > 0 ? (
                        bundle.features.map((feature, index) => (
                            <div key={index} className="flex items-start gap-2 text-sm text-gray-700">
                                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>{feature}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">No specific features listed for this plan.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const SubscriptionStatus = () => {
    return (
        <div className='w-full bg-gray-50 p-4 sm:p-8'>
            <div className='max-w-7xl mx-auto'>
                <div className='mb-6'>
                    <h3 className='text-2xl font-bold text-gray-900'>My Subscription</h3>
                    <p className='text-sm text-gray-600 mt-1'>View your current plan details, features, and expiration dates.</p>
                </div>

                <Suspense fallback={
                    <div className='flex items-center justify-center p-12 bg-white rounded-lg border border-gray-200'>
                        <Loader2 className="h-6 w-6 animate-spin text-indigo-600 mr-2" />
                        <span className="text-sm font-medium text-gray-700">Loading subscription data...</span>
                    </div>
                }>
                    <SubscriptionData />
                </Suspense>
            </div>
        </div>
    );
};

export default SubscriptionStatus;