"use client"

// import type { Metadata } from "next";
import { Kanit, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
});

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-sans-thai",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient()

  return (
    <html
      lang="en"
      className={`${notoSansThai.className} ${kanit.className}`}
    >
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
