import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";
import { ChatbotWrapper } from "@/components/ChatbotWrapper";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

// ✅ Metadata (without viewport)
export const metadata: Metadata = {
  title: "Planify - AI-Powered Travel Planning",
  description:
    "Discover amazing destinations, get personalized recommendations, and plan your perfect trip with our AI-powered travel agent.",
  keywords:
    "travel, AI, chatbot, travel planning, destinations, Planify",
  authors: [{ name: "Planify" }],
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
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased bg-white text-black`}
      >
        <AuthProvider>
          <Navigation />
          {children}
          <ChatbotWrapper />
        </AuthProvider>
      </body>
    </html>
  );
}
