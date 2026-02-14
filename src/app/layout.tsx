import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";
import { ChatbotWrapper } from "@/components/ChatbotWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ Metadata (without viewport)
export const metadata: Metadata = {
  title: "Travel Agent Planner - AI-Powered Travel Planning",
  description:
    "Discover amazing destinations, get personalized recommendations, and plan your perfect trip with our AI-powered travel agent. Experience the future of travel planning with market basket analysis.",
  keywords:
    "travel, AI, chatbot, travel planning, destinations, market basket analysis, Mystral AI",
  authors: [{ name: "Travel Agent Planner Team" }],
};

// ✅ Viewport (moved to its own export)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navigation />
        {children}
        <ChatbotWrapper />
      </body>
    </html>
  );
}
