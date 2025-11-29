import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function HowItWorks({ data } = {}) {
  const title = data?.title || "How it works ?";
  const heading = data?.heading || "Plan Your Event in 3 Easy Steps";
  const description = data?.description ||
    "We cater to both individuals and businesses, offering a smart, streamlined way to plan any event. Karyaa helps local vendors grow while making event planning simple, fast, and stress-free.";
  const imageSrc = data?.image || "/why-partner-with-us.webp";

  return (
    <section className="mx-auto w-full px-6 max-w-7xl">
      <div className="w-full flex max-lg:flex-col-reverse justify-center items-center gap-8 lg:gap-16">
        <div className="w-full lg:w-[45%] flex flex-col justify-center gap-5">
          <h6 className="uppercase max-lg:!text-sm !font-medium">{title}</h6>
          <h2>{heading}</h2>
          <p>{description}</p>
        </div>
        <div className="w-full lg:w-[55%]">
          <Image
            src={imageSrc}
            alt=""
            width={500}
            height={500}
            className="w-full h-72 lg:h-[30rem] object-cover rounded-2xl"
          />
        </div>
      </div>
    </section>
  );
}
