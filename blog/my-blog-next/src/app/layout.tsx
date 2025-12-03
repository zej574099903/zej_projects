import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Personal Blog",
  description: "Welcome to my personal blog built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col font-sans`}
      >
        <Header />
        
        {/* 主要内容区域，max-w-4xl 限制宽度，mx-auto 居中，py-8 上下留白 */}
        <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
          {children}
        </main>
        
        <Footer />
      </body>
    </html>
  );
}
