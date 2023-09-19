'use client';

import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
import { PropsWithChildren } from 'react';
import { Toaster } from 'sonner';

export const Providers = (props: PropsWithChildren) => {
  return (
    <>
      <Toaster />
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {props.children}
      </ThemeProvider>
    </>
  );
};

const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}