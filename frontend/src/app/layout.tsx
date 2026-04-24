import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import GlobalFooter from "@/components/GlobalFooter";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import { getHomeServer, getSettingsServer } from "@/lib/server-api";

export const revalidate = 60;

const headingFont = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const bodyFont = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Samuel abera",
  description: "Fullstack portfolio platform with modern product-grade interface",
  icons: {
    icon: "/favicon.png?v=2",
    shortcut: "/favicon.png?v=2",
    apple: "/favicon.png?v=2",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RootLayoutShell>{children}</RootLayoutShell>;
}

async function RootLayoutShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [home, settings] = await Promise.all([
    getHomeServer(revalidate).catch(() => null),
    getSettingsServer(revalidate).catch(() => null),
  ]);

  return (
    <html
      lang="en"
      className={`${headingFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#05070d] text-slate-900">
        <Navbar showBlog={settings?.showBlog ?? true} />
        <main className="w-full flex-1 px-0 pb-0 pt-16">
          {children}
        </main>
        <GlobalFooter initialProfile={home?.profile ?? null} />
        <ScrollToTopButton />
      </body>
    </html>
  );
}
