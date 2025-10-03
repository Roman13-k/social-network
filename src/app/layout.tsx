import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Pwa from "@/components/ui/blocks/notification/Pwa";
import Online from "@/components/ui/blocks/chat/Online";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira",
  display: "swap",
});

const url = process.env.NEXT_PUBLIC_HOST_URL;

export const metadata: Metadata = {
  title: "Twister – Social Network",
  description:
    "Twister is the next-generation social network. Share your thoughts, connect with friends, and chat without limits.",
  keywords: ["twister", "social network", "chat", "posts", "friends", "profile"],
  authors: [{ name: "Twister Team" }],
  metadataBase: new URL(url ?? "/"),
  openGraph: {
    title: "Twister – Social Network",
    description: "Stay connected, share posts, and be part of the conversation on Twister.",
    url: url,
    siteName: "Twister",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 1200,
        height: 630,
        alt: "Twister Social Network",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Twister – Social Network",
    description: "Next-gen social network. Share your thoughts and chat without limits.",
    images: ["/android-chrome-512x512.png"],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${inter.variable} ${firaCode.variable} antialiased`}>
        <Providers>
          {children}
          <Online />
          <Pwa />
        </Providers>
      </body>
    </html>
  );
}
