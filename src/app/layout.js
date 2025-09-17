import "./globals.css";
import { Great_Vibes } from "next/font/google";

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-great-vibes",
  display: "swap",
  preload: true,
  fallback: ["cursive"],
  style: "normal",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${greatVibes.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
