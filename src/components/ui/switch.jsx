"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

function Switch({
  className,
  ...props
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-[#D8DAE5] focus-visible:border-ring focus-visible:ring-ring/5 inline-flex h-[1.5rem] w-10 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
        className
      )}
      {...props}>
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "data-[state=unchecked]:bg-white bg-blue-600 data-[state=checked]:bg-white pointer-events-none block size-5 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0 cursor-pointer"
        )} />
    </SwitchPrimitive.Root>
  );
}

export { Switch }
