import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ArtVault - Discover & Collect Extraordinary Art",
  description: "Explore a curated marketplace of exceptional artworks from talented artists worldwide. Buy, sell, and trade with confidence.",
  keywords: "art, marketplace, digital art, paintings, sculptures, artists, collectors",
  authors: [{ name: "ArtVault Team" }],
  openGraph: {
    title: "ArtVault - Discover & Collect Extraordinary Art",
    description: "Explore a curated marketplace of exceptional artworks from talented artists worldwide.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <ClerkProvider>
          <ConvexClientProvider>
            {children}
            <Toaster position="top-right" richColors />
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}