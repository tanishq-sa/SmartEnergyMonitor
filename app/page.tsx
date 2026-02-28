import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";

const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <nav className="border-b border-gray-800">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <span className="text-lg font-medium text-white">
            Smart Energy Monitor
          </span>
          <div className="flex items-center gap-4">
            {hasClerk ? (
              <>
                <SignedIn>
                  <Link
                    href="/dashboard"
                    className="text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    Dashboard
                  </Link>
                </SignedIn>
                <SignedOut>
                  <Link
                    href="/sign-in"
                    className="text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/sign-up"
                    className="rounded border border-gray-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-gray-900"
                  >
                    Sign up
                  </Link>
                </SignedOut>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Dashboard
                </Link>
                <span className="text-xs text-gray-500">
                  (Set Clerk keys for auth)
                </span>
              </>
            )}
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Smart Energy Monitor
        </h1>
        <p className="mt-4 text-lg text-gray-400">
          Track consumption, view breakdowns, and get threshold alerts.
        </p>
        {hasClerk ? (
          <>
            <SignedOut>
              <div className="mt-10 flex justify-center gap-4">
                <Link
                  href="/sign-up"
                  className="rounded border border-white bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-gray-200"
                >
                  Get started
                </Link>
                <Link
                  href="/sign-in"
                  className="rounded border border-gray-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-gray-500"
                >
                  Sign in
                </Link>
              </div>
            </SignedOut>
            <SignedIn>
              <Link
                href="/dashboard"
                className="mt-10 inline-block rounded border border-white bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-gray-200"
              >
                Go to dashboard
              </Link>
            </SignedIn>
          </>
        ) : (
          <Link
            href="/dashboard"
            className="mt-10 inline-block rounded border border-white bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-gray-200"
          >
            Go to dashboard (demo mode)
          </Link>
        )}
      </main>
    </div>
  );
}
