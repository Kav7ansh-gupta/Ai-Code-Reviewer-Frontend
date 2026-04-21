import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "AI Code Reviewer | Professional Code Analysis",
  description: "Get instant, professional code reviews powered by advanced AI. Identify bugs, optimize complexity, and improve readability with ease.",
  keywords: ["code review", "ai", "software engineering", "programming", "optimization"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} h-full antialiased dark`}>
      <body className="h-full selection:bg-purple-500/30">
        {children}
      </body>
    </html>
  );
}
