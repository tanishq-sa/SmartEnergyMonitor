"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-gray-800/90 bg-black/90 shadow-lg shadow-black/20 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="text-lg font-medium text-white transition-colors hover:text-gray-300"
        >
          Smart Energy Monitor
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-sm text-gray-400 transition-colors hover:text-white"
          >
            Dashboard
          </Link>
          {hasClerk && <UserButton afterSignOutUrl="/" />}
        </div>
      </div>
    </nav>
  );
}
