'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconCircleFilled } from "@tabler/icons-react";
import { FileEdit, ShieldMinus, Trash, Loader2 } from "lucide-react";
import { Carousel } from "@/components/ui/carousel";
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
import EditBannerModal from "./EditBannerModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils";

const NoBannersFound = () => (
    <div className="w-full p-10 border border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-gray-500">
        <p className="text-xl font-semibold mb-2">No Active Banners Found</p>
        <p>Try clearing your filters or <span className="font-semibold">Upload a new banner</span>.</p>
    </div>
);

const BannerErrorFallback = ({ error }) => (
    <div className="w-full p-10 border border-red-300 bg-red-50 flex flex-col items-center justify-center text-red-700">
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
            <Carousel slidesPerView={1} loop={banners.length > 1} autoplay={true} autoplayDelay={5000}>
                {banners.map((ad) => {
                    const isDeleting = actionLoading[ad._id] === 'delete';
                    const isTogglingStatus = actionLoading[ad._id] === 'status';

                    return (
                        <div className="group relative" key={ad._id}>
                            <Image
                                src={ad.imageUrl}
                                alt={ad.name}
                                width={1300}
                                height={400}
                                className="w-full"
                                priority
                            />

                            <Badge
                                className={`absolute top-5 left-5 rounded-xl flex gap-1 text-base !font-medium leading-0 py-2 px-3 z-[100] transition-colors duration-300 ${ad.status === "Active"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                    }`}
                            >
                                <IconCircleFilled className="w-4 h-4" /> {ad.status}
                            </Badge>

                            <div className="bg-white absolute top-5 right-5 p-2 rounded z-100">
                                <span className="text-black font-semibold text-base">
                                    {ad.name}
                                </span>

                                {ad.isVendorSpecific && (
                                    <div className="flex items-center gap-3">
                                        <Avatar className="size-10 rounded-full overflow-hidden bg-green-400">
                                            <AvatarImage src={ad?.vendor?.businessLogo} className="object-cover" />
                                            <AvatarFallback>{getInitials(ad?.vendor?.businessName)}</AvatarFallback>
                                        </Avatar>

                                        <span className="font-medium">{ad?.vendor?.businessName}</span>
                                    </div>
                                )}
                            </div>

                            <div className="absolute top-0 left-0 w-full h-full bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex justify-center items-center gap-5">
                                <Button
                                    className="hover:text-white"
                                    onClick={() => openEditModal(ad)}
                                >
                                    <FileEdit className="w-5 mr-2" /> Edit
                                </Button>

                                <Button
                                    variant="destructive"
                                    className="hover:text-white"
                                    onClick={() => openDeleteDialog(ad._id, ad.name)}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? (
                                        <>
                                            <Loader2 className="w-5 mr-2 animate-spin" />
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash className="w-5 mr-2" /> Delete
                                        </>
                                    )}
                                </Button>

                                <Button
                                    className="bg-white text-black hover:bg-gray-100"
                                    onClick={() => handleToggleStatus(ad._id, ad.status)}
                                    disabled={isTogglingStatus}
                                >
                                    {isTogglingStatus ? (
                                        <>
                                            <Loader2 className="w-5 mr-2 animate-spin" />
                                            {ad.status === "Active" ? "Deactivating..." : "Activating..."}
                                        </>
                                    ) : (
                                        <>
                                            <ShieldMinus className="w-5 mr-2" />
                                            {ad.status === "Active" ? "Deactivate" : "Activate"}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </Carousel>

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