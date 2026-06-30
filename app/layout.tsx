import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SaaS Starter | Production-Ready Multi-Tenant Architecture",
    template: "%s | SaaS Starter",
  },
  description: "A production-ready multi-tenant SaaS starter built with Next.js 15, Better Auth, Drizzle ORM, Neon Postgres, and Tailwind CSS.",
  keywords: ["SaaS starter", "Next.js 15", "Multi-tenancy", "Better Auth", "Drizzle ORM", "Neon Postgres"],
  authors: [{ name: "SaaS Starter Team" }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    title: "SaaS Starter",
    description: "Production-ready multi-tenant architecture with robust authentication and tenant isolation.",
    url: "/",
    siteName: "SaaS Starter",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SaaS Starter",
    description: "Production-ready multi-tenant architecture with robust authentication and tenant isolation.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}
      <Toaster richColors /></body>
    </html>
  );
}
