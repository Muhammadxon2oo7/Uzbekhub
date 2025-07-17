"use client";
import './globals.css'

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/Header";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuth = pathname.startsWith("/register") || pathname.startsWith("/login");

  return (
    <html lang="en" className='dark'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {!isAuth && <Header />}
        {children}
      </body>
    </html>
  );
}
