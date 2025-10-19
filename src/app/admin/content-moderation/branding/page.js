"use client"

import * as React from "react"
import { useState } from "react"

// --- Shadcn UI Imports ---
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select" 
import { Separator } from "@/components/ui/separator"


import {
    Upload,
    Facebook,
    Instagram,
    Linkedin,
    Twitter,
    Youtube,
    Link,
    Plus,
    X,
    Phone,
    Mail,
    MapPin,
    Globe,
    Scissors,
    Save,
} from "lucide-react"

// --- Social Platform Definitions ---
const socialPlatforms = [
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-600', selected: false },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-600', selected: false },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700', selected: false },
    { id: 'twitter', name: 'X (Twitter)', icon: Twitter, color: 'text-gray-900', selected: false },
    { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'text-red-600', selected: false },
    { id: 'website', name: 'Custom Link', icon: Link, color: 'text-gray-500', selected: false },
];

// --- Initial Branding Data State ---
const initialBranding = {
    visuals: {
        logoUrl: "/logo.svg", 
        faviconUrl: "/placeholder-favicon.png",
    },
    contact: {
        phoneNumber: "+971 50 123 4567",
        mainEmail: "info@example.com",
        supportEmail: "support@example.com",
        location: "Dubai, UAE",
    },
    socialLinks: [
        { id: 1, platform: "facebook", url: "https://facebook.com/example" },
        { id: 2, platform: "instagram", url: "https://instagram.com/example" },
    ],
};

const BrandingManagement = () => {
    const [branding, setBranding] = useState(initialBranding);
    const [newSocialLink, setNewSocialLink] = useState({ platform: 'facebook', url: '' });
    
    // --- Handlers for Visuals ---
    const handleFileUpload = (type, event) => {
        const file = event.target.files[0];
        if (file) {
            console.log(`Uploading ${type}:`, file.name);
            const newUrl = URL.createObjectURL(file);
            
            setBranding(prev => ({
                ...prev,
                visuals: {
                    ...prev.visuals,
                    [`${type}Url`]: newUrl
                }
            }));
            event.target.value = ''; 
        }
    };

    // --- Handlers for Contact Info ---
    const handleContactChange = (field, value) => {
        setBranding(prev => ({
            ...prev,
            contact: {
                ...prev.contact,
                [field]: value
            }
        }));
    };

    // --- Handlers for Social Links ---
    const getPlatformIcon = (platformId) => {
        const platform = socialPlatforms.find(p => p.id === platformId);
        return platform ? platform.icon : Link;
    }

    const getPlatformColor = (platformId) => {
        const platform = socialPlatforms.find(p => p.id === platformId);
        return platform ? platform.color : 'text-gray-500';
    }

    const addSocialLink = () => {
        if (newSocialLink.url && newSocialLink.platform) {
            setBranding(prev => ({
                ...prev,
                socialLinks: [
                    ...prev.socialLinks,
                    { 
                        id: Date.now(), 
                        platform: newSocialLink.platform, 
                        url: newSocialLink.url 
                    },
                ],
            }));
            setNewSocialLink({ platform: 'facebook', url: '' }); // Reset input
        }
    };

    const removeSocialLink = (id) => {
        setBranding(prev => ({
            ...prev,
            socialLinks: prev.socialLinks.filter(link => link.id !== id),
        }));
    };

    // --- Submission Handler Placeholder ---
    const handleSave = () => {
        console.log("Saving Branding Data:", branding);
        alert("Branding settings saved successfully! (Simulated)");
    };

    // Helper component structure for an input with a leading icon
    const InputWithIcon = ({ Icon, label, id, placeholder, value, onChange, type = 'text' }) => (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <div className="relative">
                <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    // *** MODIFIED: Added border-gray-300
                    className="pl-10 border-gray-300" 
                />
            </div>
        </div>
    );


    return (
        <div className="h-full dashboard-container space-y-8">
            <div className="flex justify-between items-center">
                <span className='text-sidebar-foreground font-semibold text-2xl uppercase tracking-widest block'>Branding Management</span>
                <Button onClick={handleSave} className="bg-primary hover:bg-blue-700">
                    <Save className="h-4 w-4 mr-2" /> Save All Changes
                </Button>
            </div>
            
            <div className="space-y-6">

                {/* 1. VISUAL ASSETS (Logo & Favicon) */}
                <Card className="bg-white border-0 rounded-none shadow-none">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold text-sidebar-foreground uppercase tracking-widest flex items-center gap-2">
                            <Scissors className="h-5 w-5" /> Visual Assets
                        </CardTitle>
                        <CardDescription>Upload and update your main website visual identifiers.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 md:gap-x-8">

                            {/* Logo Upload Section */}
                            <div className="space-y-4 border-b pb-8 md:border-b-0 md:pb-0 md:border-r md:pr-8">
                                <Label className="font-semibold block">Website Logo</Label>
                                <div className="flex flex-col items-start space-y-4">
                                    {/* Preview Area (Larger) */}
                                    <div className="size-24 border border-dashed rounded-lg p-2 flex items-center justify-center bg-gray-50 shrink-0">
                                        <img 
                                            src={branding.visuals.logoUrl} 
                                            alt="Current Logo" 
                                            className="max-h-full max-w-full object-contain"
                                        />
                                    </div>
                                    
                                    {/* Upload Controls */}
                                    <div className="flex flex-col space-y-2 w-full max-w-xs">
                                        <p className="text-xs text-gray-500">Recommended: SVG or high-res PNG/JPEG. Max file size: 5MB.</p>
                                        <Label htmlFor="logo-upload" className="cursor-pointer">
                                            {/* Button acts as the visual trigger for the hidden input */}
                                            <Button asChild variant="outline" className="w-full text-primary border-primary hover:bg-primary/5">
                                                <span className="flex items-center justify-center">
                                                    <Upload className="h-4 w-4 mr-2" /> Upload New Logo
                                                </span>
                                            </Button>
                                        </Label>
                                        {/* Hidden File Input */}
                                        <Input 
                                            id="logo-upload" 
                                            type="file" 
                                            accept=".png,.svg,.jpg,.jpeg" 
                                            onChange={(e) => handleFileUpload('logo', e)}
                                            className="hidden" 
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Favicon Upload Section */}
                            <div className="space-y-4 pt-4 md:pt-0 md:pl-8">
                                <Label className="font-semibold block">Favicon</Label>
                                <div className="flex flex-col items-start space-y-4">
                                    {/* Preview Area (Small) */}
                                    <div className="size-10 border border-dashed rounded-md flex items-center justify-center bg-gray-50 shrink-0">
                                        <img 
                                            src={branding.visuals.faviconUrl} 
                                            alt="Current Favicon" 
                                            className="max-h-full max-w-full object-contain"
                                        />
                                    </div>

                                    {/* Upload Controls */}
                                    <div className="flex flex-col space-y-2 w-full max-w-xs">
                                        <p className="text-xs text-gray-500">Format: ICO or PNG (32x32px recommended).</p>
                                        <Label htmlFor="favicon-upload" className="cursor-pointer">
                                            {/* Button acts as the visual trigger for the hidden input */}
                                            <Button asChild variant="outline" className="w-full text-primary border-primary hover:bg-primary/5">
                                                <span className="flex items-center justify-center">
                                                    <Upload className="h-4 w-4 mr-2" /> Upload New Favicon
                                                </span>
                                            </Button>
                                        </Label>
                                        {/* Hidden File Input */}
                                        <Input 
                                            id="favicon-upload" 
                                            type="file" 
                                            accept=".ico,.png" 
                                            onChange={(e) => handleFileUpload('favicon', e)}
                                            className="hidden"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>


                {/* 2. CONTACT DETAILS */}
                <Card className="bg-white border-0 rounded-none shadow-none">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold text-sidebar-foreground uppercase tracking-widest flex items-center gap-2">
                            <Phone className="h-5 w-5" /> Contact Information
                        </CardTitle>
                        <CardDescription>Manage essential contact details displayed on the website.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Primary Contact Group (Phone and Main Email) */}
                            <div className="space-y-6">
                                {/* Phone Number */}
                                <InputWithIcon 
                                    Icon={Phone}
                                    label="Primary Phone Number"
                                    id="phone"
                                    placeholder="+971 50 XXX XXXX"
                                    value={branding.contact.phoneNumber}
                                    onChange={(e) => handleContactChange('phoneNumber', e.target.value)}
                                />
                                {/* Main Email */}
                                <InputWithIcon 
                                    Icon={Mail}
                                    label="Main Email Address"
                                    id="main-email"
                                    type="email"
                                    placeholder="info@example.com"
                                    value={branding.contact.mainEmail}
                                    onChange={(e) => handleContactChange('mainEmail', e.target.value)}
                                />
                            </div>
                            
                            {/* Secondary Contact Group (Support Email and Location) */}
                            <div className="space-y-6 pt-4 md:pt-0 border-t md:border-t-0 md:border-l md:pl-8">
                                {/* Support Email */}
                                <InputWithIcon 
                                    Icon={Mail}
                                    label="Support Email Address"
                                    id="support-email"
                                    type="email"
                                    placeholder="support@example.com"
                                    value={branding.contact.supportEmail}
                                    onChange={(e) => handleContactChange('supportEmail', e.target.value)}
                                />
                                {/* Location */}
                                <InputWithIcon 
                                    Icon={MapPin}
                                    label="Location/Address"
                                    id="location"
                                    placeholder="Dubai, UAE"
                                    value={branding.contact.location}
                                    onChange={(e) => handleContactChange('location', e.target.value)}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>


                {/* 3. SOCIAL MEDIA LINKS - ENHANCED LOOK */}
                <Card className="bg-white border-0 rounded-none shadow-none">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold text-sidebar-foreground uppercase tracking-widest flex items-center gap-2">
                            <Globe className="h-5 w-5" /> Social Media Links
                        </CardTitle>
                        <CardDescription>Configure links to your organization's social platforms.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        
                        {/* Add New Link Form */}
                        <div className="space-y-3 p-4 border rounded-lg bg-gray-50/50">
                            <Label className="font-bold block text-lg text-primary">Add New Link</Label>
                            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 items-end">
                                <div className="md:w-1/3 space-y-2">
                                    <Label htmlFor="platform-select" className="text-sm font-medium">Platform</Label>
                                    <Select 
                                        value={newSocialLink.platform} 
                                        onValueChange={(value) => setNewSocialLink(prev => ({ ...prev, platform: value }))}
                                        id="platform-select"
                                    >
                                        {/* *** MODIFIED: Added border-gray-300 */}
                                        <SelectTrigger className="bg-white border-gray-300"> 
                                            <SelectValue placeholder="Select Platform" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {socialPlatforms.map(platform => {
                                                const Icon = platform.icon;
                                                return (
                                                    <SelectItem key={platform.id} value={platform.id}>
                                                        <div className="flex items-center">
                                                            <Icon className={`h-4 w-4 mr-2 ${platform.color}`} />
                                                            {platform.name}
                                                        </div>
                                                    </SelectItem>
                                                )
                                            })}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <Label htmlFor="url-input" className="text-sm font-medium">Full URL</Label>
                                    <Input 
                                        id="url-input"
                                        placeholder="Paste full URL here (e.g., https://facebook.com/yourpage)..."
                                        value={newSocialLink.url}
                                        onChange={(e) => setNewSocialLink(prev => ({ ...prev, url: e.target.value }))}
                                        // *** MODIFIED: Added border-gray-300
                                        className="bg-white border-gray-300"
                                    />
                                </div>
                                <Button 
                                    onClick={addSocialLink} 
                                    className="w-full md:w-auto bg-primary hover:bg-primary/90 mt-2 md:mt-0" 
                                    disabled={!newSocialLink.url}
                                >
                                    <Plus className="h-4 w-4 mr-2" /> Add Link
                                </Button>
                            </div>
                        </div>

                        <Separator className="my-6" />
                        
                        {/* Existing Links List */}
                        <div className="space-y-4">
                            <Label className="font-bold block text-lg text-sidebar-foreground">Configured Links ({branding.socialLinks.length})</Label>
                            {branding.socialLinks.length > 0 ? (
                                <div className="space-y-3 max-h-80 overflow-y-auto pr-3">
                                    {branding.socialLinks.map(link => {
                                        const Icon = getPlatformIcon(link.platform);
                                        return (
                                            <div key={link.id} className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm transition hover:shadow-md">
                                                <div className="flex items-center space-x-3 truncate min-w-0">
                                                    <Icon className={`h-5 w-5 ${getPlatformColor(link.platform)} shrink-0`} />
                                                    <span className="text-sm text-gray-700 font-medium w-[80px] shrink-0">{link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}:</span>
                                                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-700 hover:underline truncate">
                                                        {link.url}
                                                    </a>
                                                </div>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-8 w-8 text-red-500 hover:bg-red-500/10 shrink-0 ml-4"
                                                    onClick={() => removeSocialLink(link.id)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 border border-dashed p-4 rounded-md bg-gray-50">
                                    You have no social media links configured. Use the form above to add your first link.
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}

export default BrandingManagement