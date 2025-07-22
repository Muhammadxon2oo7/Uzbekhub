// import './globals.css'
// import "../lib/i18n" // bu to‘g‘ri joyda
// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import Header from "@/components/header/Header";
// import { usePathname } from "next/navigation";
// import FloatingAssistant from '@/components/tool/FloatingAssistant';
// import { Providers } from './providers';

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });


// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const pathname = usePathname();
//   const isAuth = pathname.startsWith("/register") || pathname.startsWith("/login");

//   return (
//     <html lang="uz" suppressHydrationWarning>
//       <body className={`relative ${geistSans.variable} ${geistMono.variable} antialiased`}>
       
//       <Providers>
//         {/* <FloatingToolbox/> */}
//         {!isAuth && <Header />}
//         {children}
//         <FloatingAssistant/>
//         </Providers>
       
//       </body>
//     </html>
//   );
// }
import './globals.css';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import FloatingAssistant from '@/components/tool/FloatingAssistant';
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
          <FloatingAssistant />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
