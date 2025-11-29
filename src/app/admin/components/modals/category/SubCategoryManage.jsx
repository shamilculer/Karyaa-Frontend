"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, EllipsisVertical, ChevronDown } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

// Import Server Actions
import {
    deleteSubcategories,
    toggleSubcategoryFlags,
} from "@/app/actions/admin/subcategory"

// Import Separated Modals
import { AddSubcategoryModal, EditSubcategoryModal, DeleteSubcategoryModal } from "../../sections/SubCategoryFunctions"

const SubcategorySection = ({ category, onUpdate, fetchData }) => {
    const [isAddSubcategoryOpen, setIsAddSubcategoryOpen] = useState(false)
    const [isEditSubcategoryOpen, setIsEditSubcategoryOpen] = useState(false)
    const [selectedSubcategory, setSelectedSubcategory] = useState(null)
    const [deleteSubcategoryId, setDeleteSubcategoryId] = useState(null)
    const [rowSelection, setRowSelection] = useState({})

    // Handle closing edit modal and resetting state
    const handleCloseEditModal = (open) => {
        setIsEditSubcategoryOpen(open)
        if (!open) {
            setSelectedSubcategory(null)
        }
    }

    // Handle closing delete modal and resetting state
    const handleCloseDeleteModal = (open) => {
        if (!open) {
            setDeleteSubcategoryId(null)
        }
    }

    // Toggle subcategory flags (Popular/New)
    const toggleSubcategoryFlag = async (subId, flag) => {
        const previousSubcategories = [...category.subCategories]
        const subcategory = previousSubcategories.find(sub => sub._id === subId)
        const newValue = !subcategory[flag]

        // Optimistic UI update
        onUpdate({
            ...category,
            subCategories: previousSubcategories.map((sub) =>
                sub._id === subId ? { ...sub, [flag]: newValue } : sub
            ),
        })

        try {
            const result = await toggleSubcategoryFlags([subId], flag, newValue)

            if (!result || !result.success) {
                // Rollback on failure
                onUpdate({
                    ...category,
                    subCategories: previousSubcategories,
                })
                toast.error(result?.message || "Failed to update status")
                return
            }

            toast.success(`${flag === 'isPopular' ? 'Popular' : 'New'} status updated`)
        } catch (error) {
            // Rollback on unexpected error
            onUpdate({
                ...category,
                subCategories: previousSubcategories,
            })
            toast.error(error?.message || "Failed to update status")
        }
    }

    // Handle delete subcategory
    const handleDeleteSubcategory = async (ids) => {
        try {
            const idArray = Array.isArray(ids) ? ids : [ids]
            const res = await deleteSubcategories(idArray)

            if (!res || !res.success) {
                toast.error(res?.message || "Failed to delete sub-category(s).")
                return
            }

            toast.success(res.message)
            fetchData()
            setDeleteSubcategoryId(null)
        } catch (error) {
            console.error("Delete sub-category error:", error)
            toast.error(error?.message || "Unexpected error during delete.")
        }
    }

    // Handle bulk delete
    const handleBulkDelete = async () => {
        const selectedIds = Object.keys(rowSelection).filter(id => rowSelection[id])

        if (selectedIds.length === 0) {
            toast.error("No sub-categories selected.")
            return
        }

        setDeleteSubcategoryId(selectedIds)
    }

    // Handle bulk delete confirmation
    const handleBulkDeleteConfirmation = async () => {
        if (!deleteSubcategoryId) return
        await handleDeleteSubcategory(deleteSubcategoryId)
        setRowSelection({})
        setDeleteSubcategoryId(null)
    }

    // Handle bulk toggle (Popular/New)
    const handleBulkToggle = async (flag, value) => {
        const selectedIds = Object.keys(rowSelection).filter(id => rowSelection[id])

        if (selectedIds.length === 0) {
            toast.error("No subcategories selected")
            return
        }

        const previousSubcategories = [...category.subCategories]

        // Optimistic UI update for bulk
        onUpdate({
            ...category,
            subCategories: previousSubcategories.map(sub =>
                selectedIds.includes(sub._id) ? { ...sub, [flag]: value } : sub
            )
        })

        try {
            const result = await toggleSubcategoryFlags(selectedIds, flag, value)

            if (!result || !result.success) {
                // Rollback on failure
                onUpdate({
                    ...category,
                    subCategories: previousSubcategories,
                })
                toast.error(result?.message || "Failed to update subcategories")
                return
            }

            setRowSelection({})
            toast.success(`${result.updatedCount} subcategory(ies) updated successfully`)
        } catch (error) {
            // Rollback on unexpected error
            onUpdate({
                ...category,
                subCategories: previousSubcategories,
            })
            toast.error(error?.message || "Failed to update subcategories")
        }
    }

    // Selection logic
    const toggleRowSelected = (id) => {
        setRowSelection(prev => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    const isRowSelected = (id) => !!rowSelection[id]

    const subcategories = category.subCategories || []
    const isAllSelected = subcategories.length > 0 && subcategories.every(row => isRowSelected(row._id))
    const isSomeSelected = subcategories.some(row => isRowSelected(row._id)) && !isAllSelected

    const toggleAllRowsSelected = (checked) => {
        if (checked) {
            const newSelection = {}
            subcategories.forEach(sub => {
                newSelection[sub._id] = true
            })
            setRowSelection(newSelection)
        } else {
            setRowSelection({})
        }
    }

    const selectedRowCount = subcategories.filter(row => rowSelection[row._id]).length

    // Proper handling of indeterminate checkbox
    const masterCheckboxRef = useRef(null)
    useEffect(() => {
        if (masterCheckboxRef.current) {
            masterCheckboxRef.current.indeterminate = isSomeSelected
        }
    }, [isSomeSelected])

    return (
        <>
            <Card className="bg-white border-gray-300 shadow-none">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="uppercase tracking-wide text-xl">Subcategories</CardTitle>
                        <div className="flex items-center gap-2">
                            {selectedRowCount > 0 && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button className="flex items-center gap-2 bg-[#F2F4FF] border border-gray-300 text-primary">
                                            Bulk Actions
                                            <Badge className="bg-primary text-white px-2 rounded-full">
                                                {selectedRowCount}
                                            </Badge>
                                            <ChevronDown className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleBulkToggle('isPopular', true)}>
                                            Mark as Popular
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleBulkToggle('isPopular', false)}>
                                            Remove Popular
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => handleBulkToggle('isNewSub', true)}>
                                            Mark as New
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleBulkToggle('isNewSub', false)}>
                                            Remove New
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={handleBulkDelete} className="text-red-600">
                                            Delete Selected ({selectedRowCount})
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}

                            <Button onClick={() => setIsAddSubcategoryOpen(true)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Subcategory
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-hidden">
                        <Table>
                            <TableHeader className="bg-gray-50">
                                <TableRow>
                                    <TableHead className="w-12">
                                        <Checkbox
                                            ref={masterCheckboxRef}
                                            checked={isAllSelected}
                                            onCheckedChange={(value) => toggleAllRowsSelected(!!value)}
                                        />
                                    </TableHead>
                                    <TableHead>Image</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Slug</TableHead>
                                    <TableHead className="text-center">Vendors</TableHead>
                                    <TableHead className="text-center">Popular</TableHead>
                                    <TableHead className="text-center">New</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {subcategories.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-12 text-gray-500">
                                            No subcategories yet. Add your first subcategory to get started.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    subcategories.map((sub) => (
                                        <TableRow key={sub._id} className="hover:bg-gray-50">
                                            <TableCell>
                                                <Checkbox
                                                    checked={isRowSelected(sub._id)}
                                                    onCheckedChange={() => toggleRowSelected(sub._id)}
                                                />
                                            </TableCell>

                                            <TableCell>
                                                <div className="relative w-16 h-16 rounded-lg overflow-hidden border">
                                                    <Image
                                                        src={sub.coverImage || "/placeholder.jpg"}
                                                        alt={sub.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </TableCell>

                                            <TableCell className="font-medium">{sub.name}</TableCell>
                                            <TableCell className="text-gray-500 text-sm">{sub.slug}</TableCell>

                                            <TableCell className="text-center">
                                                <Badge variant="outline" className="font-semibold">
                                                    {sub.vendorCount || 0}
                                                </Badge>
                                            </TableCell>

                                            <TableCell className="text-center">
                                                <Switch
                                                    checked={sub.isPopular}
                                                    onCheckedChange={() => toggleSubcategoryFlag(sub._id, "isPopular")}
                                                />
                                            </TableCell>

                                            <TableCell className="text-center">
                                                <Switch
                                                    checked={sub.isNewSub}
                                                    onCheckedChange={() => toggleSubcategoryFlag(sub._id, "isNewSub")}
                                                />
                                            </TableCell>

                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="size-8 p-0 rounded-full border border-gray-300">
                                                            <EllipsisVertical className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setSelectedSubcategory(sub)
                                                                setIsEditSubcategoryOpen(true)
                                                            }}
                                                        >
                                                            <Edit className="w-4 h-4 mr-2" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => toggleSubcategoryFlag(sub._id, "isPopular")}
                                                        >
                                                            {sub.isPopular ? "Remove Popular" : "Mark as Popular"}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => toggleSubcategoryFlag(sub._id, "isNewSub")}
                                                        >
                                                            {sub.isNewSub ? "Remove New" : "Mark as New"}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => setDeleteSubcategoryId(sub._id)}
                                                            className="text-red-600"
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-2" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Add Subcategory Modal */}
            <AddSubcategoryModal
                isOpen={isAddSubcategoryOpen}
                onOpenChange={setIsAddSubcategoryOpen}
                categoryId={category._id}
                categoryName={category.name}
                onSuccess={fetchData}
            />

            {/* Edit Subcategory Modal */}
            <EditSubcategoryModal
                isOpen={isEditSubcategoryOpen}
                onOpenChange={setIsEditSubcategoryOpen}
                subcategory={selectedSubcategory}
                onSuccess={fetchData}
            />

            {/* Delete Confirmation Modal */}
            <DeleteSubcategoryModal
                isOpen={!!deleteSubcategoryId}
                onOpenChange={() => setDeleteSubcategoryId(null)}
                deleteIds={deleteSubcategoryId}
                onConfirm={handleBulkDeleteConfirmation}
            />
        </>
    )
}

export default SubcategorySection