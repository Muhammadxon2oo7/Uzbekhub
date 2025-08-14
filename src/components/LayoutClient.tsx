"use client";
import FloatingAssistant from "./tool/FloatingAssistant";
import { usePathname } from "next/navigation";
import Header from "@/components/header/Header";
import { useEffect } from "react";
import '../lib/i18n'; 
export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuth = pathname.startsWith("/register") || pathname.startsWith("/login") || pathname.startsWith("/forgot-password");
  const isMain = pathname.startsWith("/main");

  useEffect(() => {
    const lang = localStorage.getItem('i18nextLng') || 'uz'
    document.documentElement.lang = lang
  }, [])
  return (
    <>
      {!isAuth && !isMain && <Header />}
      {children}
      {!isMain && <FloatingAssistant />}
    </>
  );  
}
