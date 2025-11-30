import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/src/lib/store/ReduxProvider";
import { Header } from "@/src/components/Header";
import { FullscreenLoader } from "@/src/components/FullscreenLoader";
import { Toaster } from "sonner";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MERN Shop – Premium Ecommerce",
  description:
    "A premium ecommerce experience built with MERN stack.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="antialiased bg-background text-foreground min-h-screen flex flex-col">
        <ReduxProvider>
          <FullscreenLoader />
          <Header />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <Toaster richColors position="top-center" />
        </ReduxProvider>
      </body>
    </html>
  );
}
