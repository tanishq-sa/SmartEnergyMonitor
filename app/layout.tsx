import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Smart Energy Monitor",
  description: "Track energy usage, view breakdowns, and get alerts.",
};

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const bodyContent = clerkKey ? (
    <ClerkProvider publishableKey={clerkKey}>{children}</ClerkProvider>
  ) : (
    children
  );

  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} font-sans antialiased bg-black text-white`}
      >
        {bodyContent}
      </body>
    </html>
  );
}
