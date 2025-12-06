import "./globals.css";
import { Great_Vibes } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import CookieConsent from "@/components/CookieConsent";

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-great-vibes",
  display: "swap",
  preload: true,
  fallback: ["cursive"],
  style: "normal",
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://kaarya.ae'),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${greatVibes.variable} antialiased`}
      >
        {children}
        <Toaster />
        <CookieConsent />
      </body>
    </html>
  );
}
