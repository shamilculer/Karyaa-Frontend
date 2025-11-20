import React from "react";
import WhyChooseUs from "./WhyChooseUs";
import { getContentByKeyAction } from "@/app/actions/content";

export default async function WhyChooseUsServer() {
  try {
    const result = await getContentByKeyAction("why-choose-us");
    console.log("[WhyChooseUsServer] getContentByKeyAction result:", result);

    let data = null;
    if (result?.success && result.data?.content) {
      try {
        const parsed = typeof result.data.content === "string" ? JSON.parse(result.data.content) : result.data.content;
        data = parsed;
      } catch (e) {
        console.warn("[WhyChooseUsServer] failed to parse content, passing raw content to client", e);
        data = result.data.content;
      }
    }

    return <WhyChooseUs data={data} />;
  } catch (err) {
    console.error("[WhyChooseUsServer] error calling getContentByKeyAction:", err);
    return <WhyChooseUs />;
  }
}
