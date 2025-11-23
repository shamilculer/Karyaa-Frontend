// client/src/app/vendor/support/page.js
"use client";

import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import RaiseTicketModal from "../components/RaiseTicketModal";
import { Loader2 } from "lucide-react";
import { getContentByKeyAction } from "@/app/actions/content";
import { toast } from "sonner";

const VendorSupportPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const result = await getContentByKeyAction("faq-vendor");
        if (result.success && result.data && Array.isArray(result.data.content)) {
          setFaqs(result.data.content);
        } else {
          toast.error(result.message || "Failed to load FAQs");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error loading FAQs");
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="dashboard-container space-y-8 mb-12">
      {/* Frequently Asked Questions */}
      <div className="w-full bg-white flex flex-col gap-6 p-5 lg:p-10 border border-gray-200">
        <h3 className="pb-5 border-b border-b-gray-300">Frequently Asked Questions</h3>
        <div className="w-full">
          <Accordion type="single" collapsible className="w-full" defaultValue={faqs[0] ? "item-1" : undefined}>
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx + 1}`} className="border-b border-gray-300">
                <AccordionTrigger className="max-md:!text-lg">{faq.question}</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                  <p>{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      {/* Support Section */}
      <div className="w-full bg-white flex flex-col gap-6 p-5 lg:p-10 border border-gray-200">
        <h3 className="pb-5 border-b border-b-gray-300">Support</h3>
        <div className="space-y-10">
          <div className="w-full">
            <div className="flex-between max-lg:flex-col max-lg:!items-start gap-8">
              <div>
                <h3 className="!font-normal">Customer Care</h3>
                <p className="!text-sm text-gray-400">Lorem ipsum dolor sit amet, consect adipiscing elit, sed do sit amet.</p>
              </div>
              <div className="flex-center gap-5">
                {/* 👈 This opens the Shadcn Modal */}
                <RaiseTicketModal />
                {/* 👈 This triggers the separate handler (e.g., live chat) */}
                <Button asChild>
                  <Link href="/contact" target="_blank">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
          <div className="w-full">
            <div className="flex-between max-lg:flex-col max-lg:!items-start gap-8">
              <div>
                <h3 className="!font-normal">Privacy Policy</h3>
                <p className="!text-sm text-gray-400">Lorem ipsum dolor sit amet, consect adipiscing elit, sed do sit amet.</p>
              </div>
              <div>
                <Button asChild>
                  <Link href="/privacy-policy">View Our Privacy Policy</Link>
                </Button>
              </div>
            </div>
          </div>
          <div className="w-full">
            <div className="flex-between max-lg:flex-col max-lg:!items-start gap-8">
              <div>
                <h3 className="!font-normal">Terms and Conditions</h3>
                <p className="!text-sm text-gray-400">Lorem ipsum dolor sit amet, consect adipiscing elit, sed do sit amet.</p>
              </div>
              <div>
                <Button asChild>
                  <Link href="/terms-and-conditions">View Our Terms and Conditions</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorSupportPage;