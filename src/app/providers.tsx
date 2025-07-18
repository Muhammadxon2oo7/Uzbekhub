"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function Providers({ children }: Props) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      storageKey="theme-preference" 
    >
      {children}
    </NextThemesProvider>
  );
}
