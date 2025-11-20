import React from "react";
import Hero from "./Hero";
import { getContentByKeyAction } from "@/app/actions/content";

export default async function HeroServer() {
  try {
    const result = await getContentByKeyAction("hero-section");

    let parsed = null;
    if (result?.success && result.data?.content) {
      try {
        parsed = typeof result.data.content === "string" ? JSON.parse(result.data.content) : result.data.content;
      } catch (e) {
        console.warn("[HeroServer] failed to parse content, passing raw content to client", e);
        return <Hero />;
      }
    }

    return <Hero data={parsed} />;
  } catch (err) {
    console.error("[HeroServer] error calling getContentByKeyAction:", err);
    return <Hero />;
  }
}
