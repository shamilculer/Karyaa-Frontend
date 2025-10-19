// components/ui/sonner.jsx

"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner";

const Toaster = ({
  ...props
}) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      // CRITICAL FIX: Add toastOptions to define custom styling for variants
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground text-sm",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          
          // REQUIRED VARIANT STYLING:
          // These classes override the default styling only for the specific toast type
          success: "group-[.toaster]:!text-green-600 group-[.toaster]:!border-green-500",
          error: "group-[.toaster]:!text-red-600 group-[.toaster]:!border-red-500",
          info: "group-[.toaster]:!text-blue-600 group-[.toaster]:!border-blue-500",
        },
      }}
      style={
        {
          // Default styles are still useful for the base toast, kept here.
          "--normal-bg": "#fff",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)"
        }
      }
      {...props} />
  );
}

export { Toaster }