import React from "react";
import Testimonials from "./Testimonials";
import { getContentByKeyAction } from "@/app/actions/public/content";

export default async function TestimonialsServer() {
  try {
    const result = await getContentByKeyAction("testimonials");

    let testimonials = null;
    if (result?.success && result.data?.content) {
      try {
        const parsed = typeof result.data.content === "string" ? JSON.parse(result.data.content) : result.data.content;
        // Accept array or object with `testimonials` key
        if (Array.isArray(parsed)) {
          testimonials = parsed;
        } else if (parsed && Array.isArray(parsed.testimonials)) {
          testimonials = parsed.testimonials;
        }
      } catch (e) {
        console.warn("[TestimonialsServer] failed to parse content, passing raw content to client", e);
      }
    }

    return <Testimonials testimonials={testimonials} />;
  } catch (err) {
    console.error("[TestimonialsServer] error calling getContentByKeyAction:", err);
    return <Testimonials />;
  }
}
