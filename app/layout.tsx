import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Smart Energy Monitor",
  description: "Monitor. Optimize. Save Energy. Smart energy tracking for a sustainable future.",
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
        className={`${poppins.variable} font-sans antialiased bg-[#0f172a] text-slate-50`}
      >
        {bodyContent}
      </body>
    </html>
  );
}
