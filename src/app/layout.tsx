import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";

import type { Metadata } from "next";
import "../styles/globals.css";
import { FloatingNav } from "@/components/floating-navbar";
import { navItems } from "@/data";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { UsernameChecker } from "@/components/username-checker";
import { Provider } from "@/components/provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MusicBox",
  description: "Review your favorite albums",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <SessionProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Provider>
            <FloatingNav navItems={navItems} />
          </Provider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <UsernameChecker />
            {children}
          </ThemeProvider>
        </body>
      </SessionProvider>
    </html>
  );
}
