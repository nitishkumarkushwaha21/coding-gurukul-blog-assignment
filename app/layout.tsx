import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans"
});

export const metadata: Metadata = {
  title: "AI Startup Validator",
  description: "Validate startup ideas with AI-powered market, risk, and profitability insights."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            (function() {
              try {
                var saved = localStorage.getItem("ui-theme");
                var theme = saved || "ash";
                document.documentElement.setAttribute("data-theme", theme);
              } catch (e) {
                document.documentElement.setAttribute("data-theme", "ash");
              }
            })();
          `}
        </Script>
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
