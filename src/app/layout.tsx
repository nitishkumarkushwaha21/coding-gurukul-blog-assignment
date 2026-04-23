import type { Metadata } from "next";
import { Toaster } from "sonner";

import "./globals.css";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Blog CMS",
  description: "A Next.js blog management system with MDX and admin editing.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-body">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen bg-gradient-to-b from-white to-slate-100 dark:from-slate-950 dark:to-slate-900">
            <Navbar />
            <main
              aria-label="Main content"
              className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6"
            >
              {children}
            </main>
            <Footer />
            <Toaster richColors position="top-right" />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
