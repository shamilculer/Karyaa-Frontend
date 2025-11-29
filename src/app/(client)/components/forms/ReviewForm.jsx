// components/ReviewForm.jsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation"; // 💡 Added for client-side refresh
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Star } from "lucide-react";
import { toast } from "sonner"; 

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

// Assume this path correctly points to your Server Action file
import { createReview } from "@/app/actions/shared/reviews";

// --- Zod Schema for Validation ---
const reviewFormSchema = z.object({
  rating: z.number().min(1, { message: "Please select a star rating." }).max(5),
  comment: z.string().trim()
    .min(10, { message: "Review must be at least 10 characters." })
    .max(500, { message: "Review must not exceed 500 characters." }),
});

const ReviewForm = ({ vendorId, closeModal }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const router = useRouter(); // Initialize the router instance

  const form = useForm({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const { formState: { isSubmitting }, watch } = form;
  const currentRating = watch("rating");

  const onSubmit = async (data) => {
    try {
      // Call the Server Action to create the review
      const response = await createReview(vendorId, {
        rating: data.rating,
        comment: data.comment,
      });

      if (response.error) {
        toast.error(response.error.message);
      } else {
        toast.success(response.message || "Your review has been submitted!");
        form.reset(); 
        closeModal(); 

        router.refresh(); 
      }
    } catch (error) {
      toast.error(error.error || "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Star Rating Field */}
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Your Rating*</FormLabel>
              <FormControl>
                <div className="flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((starValue) => (
                    <Star
                      key={starValue}
                      className={`cursor-pointer transition-colors duration-200 
                                  ${starValue <= (hoverRating || currentRating) 
                                     ? "text-yellow-400 fill-yellow-400" 
                                     : "text-gray-300"
                                  }`}
                      size={32}
                      onClick={() => field.onChange(starValue)}
                      onMouseEnter={() => setHoverRating(starValue)}
                      onMouseLeave={() => setHoverRating(0)}
                    />
                  ))}
                </div>
              </FormControl>
              <FormDescription className="text-center">
                {currentRating > 0 ? `You rated this ${currentRating} out of 5 stars.` : "Click a star to rate."}
              </FormDescription>
              <FormMessage className="text-center" />
            </FormItem>
          )}
        />

        {/* Comment Field */}
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Your Comments*</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your experience (minimum 10 characters)..."
                  className="min-h-[120px]"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Your feedback helps other users and the vendor.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting || currentRating === 0}>
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </form>
    </Form>
  );
};

export default ReviewForm;
