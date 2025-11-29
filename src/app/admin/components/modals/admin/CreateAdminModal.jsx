"use client"

import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// UI Components
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"

// Icons & Schema
import { Copy, RefreshCw, Key, Shield, Mail, User, Loader2 } from 'lucide-react';
import { AccessControlSchema,CreateAdminSchema } from '@/lib/schema';
import { createAdminAction } from '@/app/actions/admin/auth';

// --- Default Permissions Object ---
// Extract default permissions structure for initial state
const defaultPermissions = Object.keys(AccessControlSchema.shape).reduce((acc, key) => {
    acc[key] = false;
    return acc;
}, {});

// --- 1. Password Generator Component ---
// The component is now simplified to work directly with RHF's Controller
const PasswordGenerator = ({ field, formState }) => {
    const { onChange, value } = field;
    const { errors } = formState;

    const [length, setLength] = useState(16);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeSymbols, setIncludeSymbols] = useState(true);

    const generatePassword = () => {
        const lower = 'abcdefghijklmnopqrstuvwxyz';
        const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

        let characters = lower + upper;
        if (includeNumbers) characters += numbers;
        if (includeSymbols) characters += symbols;

        if (characters.length === 0) {
            toast.error("Select at least one character type.");
            return;
        }

        let newPassword = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            newPassword += characters[randomIndex];
        }

        onChange(newPassword); // Set password via RHF onChange
    };

    const handleCopy = () => {
        if (value) {
            navigator.clipboard.writeText(value);
            toast.success("Password copied to clipboard.");
        }
    };

    // Auto-generate password on mount if field is empty (good for usability)
    useEffect(() => {
        if (!value) {
            generatePassword();
        }
    }, [value]);


    return (
        <div className="space-y-3 p-3 border rounded-md bg-gray-50">
            <Label className="flex items-center space-x-2 font-semibold text-primary">
                <Key className="w-4 h-4" />
                <span>Password Generator & Input</span>
            </Label>
            <div className="flex space-x-2">
                <div className='w-full'>
                    <Input
                        {...field}
                        type="text"
                        value={value || ''}
                        className="flex-grow bg-white font-mono"
                        placeholder="Enter or Generate Password"
                        required
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    <p className='!text-xs mt-2 text-gray-600'>Copy and save password before submitting.</p>
                </div>
                <Button variant="outline" size="icon" onClick={generatePassword} type="button">
                    <RefreshCw className="w-4 h-4" />
                </Button>
                <Button size="icon" onClick={handleCopy} disabled={!value} type="button">
                    <Copy className="w-4 h-4" />
                </Button>
            </div>
            <div className="flex items-center space-x-4 text-sm">
                <Input
                    type="number"
                    placeholder="Length"
                    value={length}
                    onChange={(e) => setLength(Math.max(8, parseInt(e.target.value) || 8))}
                    className="w-20 h-8"
                />
                <Label className="flex items-center">
                    <Checkbox checked={includeNumbers} onCheckedChange={setIncludeNumbers} />
                    <span className="ml-2">Numbers</span>
                </Label>
                <Label className="flex items-center">
                    <Checkbox checked={includeSymbols} onCheckedChange={setIncludeSymbols} />
                    <span className="ml-2">Symbols</span>
                </Label>
            </div>
        </div>
    );
};

// --- 2. Permissions Selector Component ---
const PermissionsSelector = ({ adminLevel, control, setValue, getValues }) => {
    const isSuperAdmin = adminLevel === 'admin';
    const currentPermissions = getValues('accessControl');

    const toggleAll = (checked) => {
        const newPermissions = Object.keys(defaultPermissions).reduce((acc, key) => {
            acc[key] = checked;
            return acc;
        }, {});
        setValue('accessControl', newPermissions, { shouldValidate: true });
    };

    return (
        <div className="space-y-3 p-3 border rounded-md">
            <div className="flex justify-between items-center">
                <Label className="flex items-center space-x-2 font-semibold text-primary">
                    <Shield className="w-4 h-4" />
                    <span>Access Control (Permissions)</span>
                </Label>
                {!isSuperAdmin && currentPermissions && (
                    <Button variant="link" size="sm" type="button" 
                        onClick={() => toggleAll(!Object.values(currentPermissions).every(p => p))}
                    >
                        {Object.values(currentPermissions).every(p => p) ? "Deselect All" : "Select All"}
                    </Button>
                )}
            </div>

            {isSuperAdmin ? (
                <Badge className="bg-blue-500 text-white p-2">Admin has full, unrestricted access.</Badge>
            ) : (
                <ScrollArea className="h-[150px] w-full pr-4">
                    <div className="grid grid-cols-2 gap-3">
                        {Object.keys(defaultPermissions).map(key => (
                            <Controller
                                key={key}
                                name={`accessControl.${key}`}
                                control={control}
                                render={({ field }) => (
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`perm-${key}`}
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            disabled={isSuperAdmin}
                                        />
                                        <Label htmlFor={`perm-${key}`} className="capitalize font-normal cursor-pointer">
                                            {key.replace(/([A-Z])/g, ' $1').trim()}
                                        </Label>
                                    </div>
                                )}
                            />
                        ))}
                    </div>
                </ScrollArea>
            )}
        </div>
    );
};


// --- 3. Main Modal Component (React Hook Form Integration) ---
export function CreateAdminModal({ onSuccess }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // RHF Setup
    const { 
        control, 
        handleSubmit, 
        reset, 
        watch, 
        setValue, 
        getValues,
        formState: { errors } 
    } = useForm({
        resolver: zodResolver(CreateAdminSchema),
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
            adminLevel: 'moderator',
            accessControl: defaultPermissions, // Initialize all permissions to false
        }
    });

    const adminLevel = watch('adminLevel');


    // Handle successful form submission
    const onSubmit = async (data) => {
        setIsSubmitting(true);
        
        try {
            // Server actions automatically handle FormData from the form object
            // If you want to use data from RHF directly, you must create a FormData object
            const formData = new FormData();
            Object.keys(data).forEach(key => {
                if (key === 'accessControl') {
                    // Convert accessControl object to JSON string for FormData
                    formData.append(key, JSON.stringify(data[key]));
                } else {
                    formData.append(key, data[key]);
                }
            });

            const result = await createAdminAction(formData);

            if (result.success) {
                toast.success(result.message);
                setIsOpen(false);
                reset();
                if(onSuccess) onSuccess()
            } else {
                // Display server-side errors (e.g., email already exists, or validation from server)
                if (result.errors) {
                    // Handle specific field errors if the server sends them back
                    Object.keys(result.errors).forEach(key => {
                        toast.error(`${key}: ${result.errors[key].join(', ')}`);
                    });
                } else {
                    toast.error(result.error || result.message || "Failed to create admin.");
                }
            }

        } catch (error) {
            toast.error("An unexpected error occurred during submission.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Reset form state when the dialog closes
    const handleClose = (open) => {
        if (!open) {
            reset();
        }
        setIsOpen(open);
    };


    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogTrigger asChild>
                <Button onClick={() => setIsOpen(true)} className="bg-primary text-white hover:bg-primary/90">
                    + Add New Admin
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] md:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Admin</DialogTitle>
                    <DialogDescription>
                        Fill in the details to register a new administrator.
                    </DialogDescription>
                </DialogHeader>
                
                {/* Use handleSubmit from RHF */}
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 py-4">

                    {/* Full Name */}
                    <div className="grid gap-2">
                        <Label htmlFor="fullName" className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <span>Full Name</span>
                        </Label>
                        <Controller
                            name="fullName"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id="fullName"
                                    placeholder="e.g., Jane Doe"
                                    required
                                />
                            )}
                        />
                        {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                    </div>

                    {/* Email */}
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-gray-500" />
                            <span>Email Address</span>
                        </Label>
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id="email"
                                    type="email"
                                    placeholder="admin@example.com"
                                    required
                                />
                            )}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    {/* Admin Level Selector */}
                    <div className="grid gap-2">
                        <Label htmlFor="adminLevel" className="flex items-center space-x-2">
                            <Shield className="w-4 h-4 text-gray-500" />
                            <span>Admin Level</span>
                        </Label>
                        <Controller
                            name="adminLevel"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger id="adminLevel">
                                        <SelectValue placeholder="Select Admin Level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Admin (Full Access)</SelectItem>
                                        <SelectItem value="moderator">Moderator (Restricted Access)</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.adminLevel && <p className="text-red-500 text-xs mt-1">{errors.adminLevel.message}</p>}
                    </div>

                    {/* Password Generator (RHF Controller) */}
                    <Controller
                        name="password"
                        control={control}
                        render={({ field, formState }) => (
                            <PasswordGenerator field={field} formState={formState} />
                        )}
                    />

                    {/* Permissions Selector (Conditional based on adminLevel) */}
                    {adminLevel === 'moderator' && (
                        <PermissionsSelector
                            adminLevel={adminLevel}
                            control={control}
                            setValue={setValue}
                            getValues={getValues}
                        />
                    )}

                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            'Create Admin'
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}