import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "API Key Manager - Secure API Key Management & Usage Tracking",
  description: "Enterprise-grade API key management with usage tracking, rate limiting, and billing integration. Perfect for SaaS and API-driven businesses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {children}
          <Toaster position="top-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}
