import "./globals.css";
import { Great_Vibes } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import CookieConsent from "@/components/CookieConsent";
import Script from "next/script";

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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17967949996"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17967949996');
          `}
        </Script>
        {children}
        <Toaster position="top-center" />
        <CookieConsent />
      </body>
    </html>
  );
}
