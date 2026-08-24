import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SubscriptionProvider } from "@/contexts/subscription-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AtlasAI",
  description: "Plataforma Inteligente de Pesquisa, Desenvolvimento e IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <SubscriptionProvider>{children}</SubscriptionProvider>
      </body>
    </html>
  );
}
