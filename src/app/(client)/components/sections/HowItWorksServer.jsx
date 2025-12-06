import React from "react";
import HowItWorks from "./HowItWorks";
import { getContentByKeyAction } from "@/app/actions/public/content";

export default async function HowItWorksServer() {
  try {
    const result = await getContentByKeyAction("how-it-works");

    let data = null;
    if (result?.success && result.data?.content) {
      try {
        const parsed = typeof result.data.content === "string" ? JSON.parse(result.data.content) : result.data.content;
        data = parsed;
      } catch (e) {
        console.warn("[HowItWorksServer] failed to parse content, passing raw content to client", e);
        data = result.data.content;
      }
    }

    return <HowItWorks data={data} />;
  } catch (err) {
    console.error("[HowItWorksServer] error calling getContentByKeyAction:", err);
    return <HowItWorks />;
  }
}
