"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header/Header";
import { useEffect } from "react";
import '../lib/i18n'; 
export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuth = pathname.startsWith("/register") || pathname.startsWith("/login");

  useEffect(() => {
    const lang = localStorage.getItem('i18nextLng') || 'uz'
    document.documentElement.lang = lang
  }, [])
  return (
    <>
      {!isAuth && <Header />}
      {children}
    </>
  );
}
