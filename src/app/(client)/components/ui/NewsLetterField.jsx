"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { subscribeToNewsletterAction } from "@/app/actions/public/newsletter";

export default function NewsletterField() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic email validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await subscribeToNewsletterAction({ email });

      if (result.success) {
        toast.success(result.message || "Successfully subscribed to newsletter!");
        setEmail("");
      } else {
        toast.error(result.error || "Failed to subscribe. Please try again.");
      }

    } catch (error) {
      console.error("Newsletter subscription error:", error);
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="relative">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          disabled={isSubmitting}
          className="w-full px-4 py-3 pr-12 text-sm text-gray-900 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent placeholder:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="absolute right-1 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90 text-white p-2.5 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Subscribe to newsletter"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}