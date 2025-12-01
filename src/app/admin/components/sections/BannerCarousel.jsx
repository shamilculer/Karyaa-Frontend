'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconCircleFilled } from "@tabler/icons-react";
import { FileEdit, ShieldMinus, Trash, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
    getAllBannersAction,
    toggleBannerStatusAction,
    deleteBannerAction
} from "@/app/actions/admin/banner";
import EditBannerModal from "../modals/banners/EditBannerModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils";

const NoBannersFound = () => (
    <div className="w-full p-10 border border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-gray-500 rounded-lg">
        <p className="text-xl font-semibold mb-2">No Active Banners Found</p>
        <p>Try clearing your filters or <span className="font-semibold">Upload a new banner</span>.</p>
    </div>
);

const BannerErrorFallback = ({ error }) => (
    <div className="w-full p-10 border border-red-300 bg-red-50 flex flex-col items-center justify-center text-red-700 rounded-lg">
        <p className="text-xl font-semibold mb-2">Error Fetching Banners</p>
        <p>{error?.message || "Could not load banner data from the server."}</p>
    </div>
);

const BannerCarouselContainer = ({ search, status, placement }) => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState({});
    const [deleteDialog, setDeleteDialog] = useState({ open: false, bannerId: null, bannerName: "" });
    const [editModal, setEditModal] = useState({ open: false, banner: null });

    const effectivePlacement = placement || "Homepage Carousel";

    const fetchAds = async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await getAllBannersAction({
                search: search || "",
                status: status === "all" ? "" : status,
                placement: effectivePlacement === "all" ? "" : effectivePlacement,
            });

            if (!result.success) {
                setError(result.message);
                setBanners([]);
            } else {
                setBanners(result.data || []);
                setError(null);
            }
        } catch (err) {
            setError(err.message || "An unexpected error occurred");
            setBanners([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAds();
    }, [search, status, placement, effectivePlacement]);

    // Optimistic status toggle
    const handleToggleStatus = async (bannerId, currentStatus) => {
        setActionLoading(prev => ({ ...prev, [bannerId]: 'status' }));

        // Optimistic update
        const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
        setBanners(prevBanners =>
            prevBanners.map(banner =>
                banner._id === bannerId
                    ? { ...banner, status: newStatus }
                    : banner
            )
        );

        try {
            const result = await toggleBannerStatusAction(bannerId);

            if (result.success) {
                toast.success(
                    `Banner ${currentStatus === "Active" ? "deactivated" : "activated"} successfully`
                );
            } else {
                // Revert on failure
                setBanners(prevBanners =>
                    prevBanners.map(banner =>
                        banner._id === bannerId
                            ? { ...banner, status: currentStatus }
                            : banner
                    )
                );
                toast.error(result.message || "Failed to update banner status");
            }
        } catch (err) {
            // Revert on error
            setBanners(prevBanners =>
                prevBanners.map(banner =>
                    banner._id === bannerId
                        ? { ...banner, status: currentStatus }
                        : banner
                )
            );
            toast.error("An error occurred while updating banner status");
            console.error(err);
        } finally {
            setActionLoading(prev => ({ ...prev, [bannerId]: null }));
        }
    };

    // Optimistic delete
    const handleDelete = async () => {
        const { bannerId, bannerName } = deleteDialog;
        setActionLoading(prev => ({ ...prev, [bannerId]: 'delete' }));

        // Store original banners for rollback
        const originalBanners = [...banners];

        // Optimistic delete
        setBanners(prevBanners => prevBanners.filter(banner => banner._id !== bannerId));
        setDeleteDialog({ open: false, bannerId: null, bannerName: "" });

        try {
            const result = await deleteBannerAction(bannerId);

            if (result.success) {
                toast.success("Banner deleted successfully");
            } else {
                // Revert on failure
                setBanners(originalBanners);
                toast.error(result.message || "Failed to delete banner");
            }
        } catch (err) {
            // Revert on error
            setBanners(originalBanners);
            toast.error("An error occurred while deleting banner");
            console.error(err);
        } finally {
            setActionLoading(prev => ({ ...prev, [bannerId]: null }));
        }
    };

    // Open delete confirmation dialog
    const openDeleteDialog = (bannerId, bannerName) => {
        setDeleteDialog({ open: true, bannerId, bannerName });
    };

    // Open edit modal
    const openEditModal = (banner) => {
        setEditModal({ open: true, banner });
    };

    // Handle successful edit (optimistic update)
    const handleEditSuccess = (updatedBanner) => {
        setBanners(prevBanners =>
            prevBanners.map(banner =>
                banner._id === updatedBanner._id ? updatedBanner : banner
            )
        );
    };

    if (loading) {
        return (
            <div className="w-full text-center py-10">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                <p className="mt-2 text-gray-600">Loading banners...</p>
            </div>
        );
    }

    if (error) return <BannerErrorFallback error={{ message: error }} />;
    if (banners.length === 0) return <NoBannersFound />;

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {banners.map((ad) => {
                    const isDeleting = actionLoading[ad._id] === 'delete';
                    const isTogglingStatus = actionLoading[ad._id] === 'status';

                    return (
                        <div className="group relative rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-white hover:shadow-md transition-shadow" key={ad._id}>
                            <div className="relative aspect-[16/9] w-full overflow-hidden">
                                <Image
                                    src={ad.imageUrl}
                                    alt={ad.name}
                                    fill
                                    className="object-cover"
                                    priority={false}
                                />

                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                                    <Button
                                        size="sm"
                                        className="bg-white text-black hover:bg-gray-100"
                                        onClick={() => openEditModal(ad)}
                                    >
                                        <FileEdit className="w-4 h-4 mr-2" /> Edit
                                    </Button>

                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => openDeleteDialog(ad._id, ad.name)}
                                        disabled={isDeleting}
                                    >
                                        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash className="w-4 h-4" />}
                                    </Button>
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-semibold !text-lg line-clamp-1" title={ad.name}>{ad.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant={ad.status === "Active" ? "success" : "secondary"} className={`${ad.status === "Active" ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                                                <IconCircleFilled className="w-2 h-2 mr-1" /> {ad.status}
                                            </Badge>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 px-2 text-xs"
                                                onClick={() => handleToggleStatus(ad._id, ad.status)}
                                                disabled={isTogglingStatus}
                                            >
                                                {isTogglingStatus ? <Loader2 className="w-3 h-3 animate-spin" /> : (ad.status === "Active" ? "Deactivate" : "Activate")}
                                            </Button>
                                        </div>
                                    </div>

                                    {ad.isVendorSpecific && ad.vendor && (
                                        <div className="flex items-center gap-2" title={ad.vendor.businessName}>
                                            <span className="text-sm font-medium text-gray-600 max-w-[100px] truncate">
                                                {ad.vendor.businessName}
                                            </span>
                                            <Avatar className="h-8 w-8 border border-gray-200 shrink-0">
                                                <AvatarImage src={ad.vendor.businessLogo} />
                                                <AvatarFallback>{getInitials(ad.vendor.businessName)}</AvatarFallback>
                                            </Avatar>
                                        </div>
                                    )}
                                </div>

                                {(ad.activeFrom || ad.activeUntil) && (
                                    <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded border border-gray-100">
                                        <div className="flex justify-between">
                                            <span>Start: {ad.activeFrom ? new Date(ad.activeFrom).toLocaleDateString() : 'Now'}</span>
                                            <span>End: {ad.activeUntil ? new Date(ad.activeUntil).toLocaleDateString() : 'Indefinite'}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog(prev => ({ ...prev, open }))}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the banner <strong>"{deleteDialog.bannerName}"</strong>.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => setDeleteDialog({ open: false, bannerId: null, bannerName: "" })}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {actionLoading[deleteDialog.bannerId] === 'delete' ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete Banner"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Edit Banner Modal */}
            <EditBannerModal
                open={editModal.open}
                onOpenChange={(open) => setEditModal({ open, banner: open ? editModal.banner : null })}
                banner={editModal.banner}
                onSuccess={handleEditSuccess}
            />
        </>
    );
};

export default BannerCarouselContainer;