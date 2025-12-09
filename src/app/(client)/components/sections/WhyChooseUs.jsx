import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function WhyChooseUs({ data } = {}) {

  const title = data?.title || "Why choose us ?";
  const heading = data?.heading || "Why thousands trust us";
  const description = data?.description ||
    "Karyaa is a UAE-based online platform that connects users with trusted event vendors — all in one place. Whether it's a wedding, birthday, or corporate event, you can easily find and compare planners, caterers, photographers, venues, and more.\n\nWe cater to both individuals and businesses, offering a smart, streamlined way to plan any event. Karyaa helps local vendors grow while making event planning simple, fast, and stress-free.";
  const imageSrc = data?.image || "/banner-2.jpg";
  const ctaText = data?.cta_text || "Find Your Vendor";
  const ctaLink = data?.cta_link || "/categories";

  return (
    <section className="mx-auto w-full px-6 max-w-7xl">
      <div className="w-full flex max-lg:flex-col justify-center items-center gap-8 lg:gap-16">
        <div className="w-full lg:w-[55%]">
          <Image
            src={imageSrc}
            alt=""
            width={500}
            height={500}
            className="w-full h-72 lg:h-[30rem] object-cover rounded-2xl"
          />
        </div>
        <div className="w-full lg:w-[45%] flex flex-col items-start gap-4 lg:gap-5">
          <h6 className="uppercase !font-medium max-lg:!text-sm">{title}</h6>
          <h2>
            {heading.split('\n').map((line, index) => (
              <span key={index}>
                {line}
                {index < heading.split('\n').length - 1 && <br />}
              </span>
            ))}
          </h2>
          <div
            className="prose prose-sm max-w-none
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:my-2 prose-p:min-h-[1.5em]
              prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
              prose-strong:font-semibold
              prose-ul:list-disc prose-ul:pl-5 prose-ul:my-2 prose-ul:[list-style-position:outside]
              prose-ol:list-decimal prose-ol:pl-5 prose-ol:my-2 prose-ol:[list-style-position:outside]
              prose-li:my-1"
            dangerouslySetInnerHTML={{ __html: description }}
          />
          <Button asChild>
            <Link href={ctaLink}>{ctaText}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
