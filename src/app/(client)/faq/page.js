// app/faq/page.js
import React from "react";
import { getBulkContentAction } from "@/app/actions/public/content";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import PageTitle from "../components/common/PageTitle";

export const metadata = {
  title: "FAQ - Frequently Asked Questions",
  description: "Find answers to common questions about our platform",
};

const FaqPage = async () => {
  const result = await getBulkContentAction(["faq-customer", "faq-vendor", "faq-page-title"]);

  const customerFaqs =
    result.success
      ? result.data.find((item) => item.key === "faq-customer")?.content || []
      : [];
  const vendorFaqs =
    result.success
      ? result.data.find((item) => item.key === "faq-vendor")?.content || []
      : [];
  const pageTitle =
    result.success
      ? result.data.find((item) => item.key === "faq-page-title")?.content
      : null;

  // Use custom page title if available, otherwise use defaults
  const heading = pageTitle?.heading || "FAQ";
  const tagline = pageTitle?.tagline || "Everything You Need to Know";
  const bannerImage = pageTitle?.bannerImage;

  return (
    <div className="min-h-screen">
      <PageTitle
        title={heading}
        tagline={tagline}
        {...(bannerImage && { imgUrl: bannerImage })}
      />

      {/* Customer FAQs */}
      {customerFaqs.length > 0 && (
        <section className="container py-16">
          <div className="text-center mb-10">
            <h6 className="uppercase !font-medium">For Customers</h6>
            <h2 className="uppercase">Common Questions</h2>
          </div>
          <div className="max-w-4xl mx-auto">
            <Accordion
              type="single"
              collapsible
              className="w-full"
              defaultValue="item-0"
            >
              {customerFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="max-md:!text-lg">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-4">
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: faq.answer }}
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      {/* Vendor FAQs */}
      {vendorFaqs.length > 0 && (
        <section className="container py-16">
          <div className="text-center mb-10">
            <h6 className="uppercase !font-medium">For Vendors</h6>
            <h2 className="uppercase">Common Questions</h2>
          </div>
          <div className="max-w-4xl mx-auto">
            <Accordion
              type="single"
              collapsible
              className="w-full"
              defaultValue="item-0"
            >
              {vendorFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="max-md:!text-lg">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-4">
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: faq.answer }}
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      {/* Empty State */}
      {customerFaqs.length === 0 && vendorFaqs.length === 0 && (
        <section className="container py-16">
          <div className="max-w-4xl mx-auto text-center py-12 bg-white rounded-lg border">
            <p className="text-gray-500 text-lg">
              No FAQs available at the moment.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Please check back later or contact support.
            </p>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="container py-16">
        <div className="max-w-4xl mx-auto text-center bg-white rounded-lg p-8 border">
          <h3 className="text-2xl font-bold mb-3">Still have questions?</h3>
          <p className="text-gray-600 mb-6">
            Can't find the answer you're looking for? Please reach out to our
            support team.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </section>
    </div>
  );
};

export default FaqPage;