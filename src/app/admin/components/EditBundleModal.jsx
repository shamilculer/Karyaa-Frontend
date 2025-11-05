"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { FileText, Loader2, Pencil, PlusCircle, Trash2 } from "lucide-react"

// --- Shadcn UI Imports ---
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"

// --- Import Server Action ---
import { updateBundleAction } from "@/app/actions/admin/bundle"

// --- Zod Schema (same as CreateBundleModal) ---
const formSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  description: z.string().optional(),
  price: z.number().min(0, { message: "Price must be non-negative." }),
  durationValue: z.number().min(1, { message: "Duration value must be at least 1." }),
  durationUnit: z.enum(["days", "months", "years"]),
  status: z.enum(["active", "inactive"]),
  isPopular: z.boolean().default(false).optional(),
  includesRecommended: z.boolean().default(false).optional(),
  displayOrder: z.number().min(0, "Display order cannot be negative.").default(0),
  features: z.array(z.string().min(1, "Feature cannot be empty")).optional(),
})

const EditBundleModal = ({ open, setOpen, bundle, onSuccess }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      durationValue: 1,
      durationUnit: "months",
      status: "active",
      isPopular: false,
      includesRecommended: false,
      displayOrder: 0,
      features: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "features",
  })

  // ✅ Populate form when modal opens with bundle data
  useEffect(() => {
    if (bundle && open) {
      form.reset({
        name: bundle.name || "",
        description: bundle.description || "",
        price: bundle.price || 0,
        durationValue: bundle.duration?.value || 1,
        durationUnit: bundle.duration?.unit || "months",
        status: bundle.status || "active",
        isPopular: bundle.isPopular || false,
        includesRecommended: bundle.includesRecommended || false,
        displayOrder: bundle.displayOrder || 0,
        features: bundle.features || [],
      })
    }
  }, [bundle, open, form])

  const isSubmitting = form.formState.isSubmitting

  const onSubmit = async (values) => {
    const bundleData = {
      name: values.name,
      description: values.description,
      price: values.price,
      duration: {
        value: values.durationValue,
        unit: values.durationUnit,
      },
      status: values.status,
      isPopular: values.isPopular,
      includesRecommended: values.includesRecommended,
      displayOrder: values.displayOrder,
      features: values.features || [],
    }

    const res = await updateBundleAction(bundle._id, bundleData)

    if (res.success) {
      toast.success(res.message || "Bundle updated successfully.")
      setOpen(false)
      if (onSuccess) onSuccess()
    } else {
      toast.error(res.message || "Failed to update bundle.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!open && (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="flex gap-2">
            <Pencil className="w-4 h-4" />
            Edit
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Bundle</DialogTitle>
          <DialogDescription>
            Modify the details of this existing subscription bundle.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 py-4">
              {/* --- General Details --- */}
              <h4 className="font-semibold text-base">General Details</h4>

              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bundle Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Starter Plan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Short description of the bundle."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator className="my-4" />
              <h4 className="font-semibold text-base">Pricing & Duration</h4>

              {/* Price */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (AED)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="durationValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration Value</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="durationUnit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration Unit</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="days">Days</SelectItem>
                          <SelectItem value="months">Months</SelectItem>
                          <SelectItem value="years">Years</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator className="my-4" />
              <h4 className="font-semibold text-base">Configuration</h4>

              {/* Status + Display Order */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="displayOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Order</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Checkboxes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="isPopular"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 p-3 border rounded-md">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Mark as Popular</FormLabel>
                        <FormDescription className="!text-xs">
                          Highlights this on the bundles page.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="includesRecommended"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 p-3 border rounded-md">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Includes Recommended</FormLabel>
                        <FormDescription className="!text-xs">
                          Vendors get recommended listing feature.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <Separator className="my-4" />
              <h4 className="font-semibold text-base flex justify-between items-center">
                Features
                <Button type="button" onClick={() => append("")} variant="outline" size="sm">
                  <PlusCircle className="w-4 h-4 mr-2" /> Add Feature
                </Button>
              </h4>

              {/* Dynamic Features */}
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <FormField
                      control={form.control}
                      name={`features.${index}`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input placeholder="e.g., Max 5 listings per month" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => remove(index)}
                      className="h-10 w-10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <FileText className="mr-2 h-4 w-4" />
                )}
                {isSubmitting ? "Updating..." : "Update Bundle"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default EditBundleModal
