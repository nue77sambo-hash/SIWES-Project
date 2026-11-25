import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ThemeProvider } from "./Providers/ThemeProvider";
import { AuthProvider } from "./context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "RootScroll | A Library of Code & Thought",
    template: "%s | RootScroll",
  },
  description:
    "Discover physical books exploring programming, software development, computing and the art of writing code.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>
          <AuthProvider>
            <Suspense fallback={null}>
              <Navbar />
              {children}
              <Footer />
            </Suspense>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}