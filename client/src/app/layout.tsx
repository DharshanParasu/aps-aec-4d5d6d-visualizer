import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppProvider } from "@/contexts/AppContext";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "APS AEC 4D/5D/6D Visualizer",
  description: "Visualize BIM data with 4D Schedule, 5D Cost, and 6D Sustainability views using Autodesk Platform Services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Autodesk Viewer CSS */}
        <link
          rel="stylesheet"
          href="https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/style.min.css"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Autodesk Viewer JS */}
        <Script
          src="https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/viewer3D.min.js"
          strategy="beforeInteractive"
        />
        <AuthProvider>
          <AppProvider>
            {children}
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
