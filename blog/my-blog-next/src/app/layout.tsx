import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/theme-provider";

import { getSortedPostsData } from '@/lib/posts';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://zej-projects-955ocoomd-jhons-projects-97ec523f.vercel.app/'),
  title: {
    default: 'Liora Blog',
    template: '%s | Liora Blog',
  },
  description: 'A personal blog about frontend development, Next.js, and design.',
  openGraph: {
    title: 'Liora Blog',
    description: 'A personal blog about frontend development, Next.js, and design.',
    url: 'https://zej-projects-955ocoomd-jhons-projects-97ec523f.vercel.app/',
    siteName: 'Liora Blog',
    locale: 'zh_CN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const allPostsData = getSortedPostsData();

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          disableTransitionOnChange
        >
          <Header posts={allPostsData} />
          
          {/* 主要内容区域，max-w-4xl 限制宽度，mx-auto 居中，py-8 上下留白 */}
          <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
            {children}
          </main>
          
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
