import './globals.css';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from './providers';
import LayoutClient from '@/components/LayoutClient';
import { Toaster } from '@/components/ui/sonner';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UzbekHub",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html   suppressHydrationWarning>
      <body className={`relative ${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <LayoutClient>{children}</LayoutClient>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
