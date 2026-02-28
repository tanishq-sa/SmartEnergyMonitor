import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getSettingsForUser, setSettingsForUser } from "@/lib/firebase";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const settings = await getSettingsForUser(userId);
    return NextResponse.json(settings);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (
      message.includes("FIREBASE_SERVICE_ACCOUNT") ||
      message.includes("GOOGLE_APPLICATION_CREDENTIALS") ||
      message.includes("invalid JSON")
    ) {
      return NextResponse.json(
        { error: "Firebase not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON or GOOGLE_APPLICATION_CREDENTIALS in .env.local (see README)." },
        { status: 503 }
      );
    }
    console.error("[GET /api/settings]", err);
    return NextResponse.json(
      { error: "Failed to load settings" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const { threshold } = body as { threshold?: number };
    if (threshold !== undefined) {
      if (typeof threshold !== "number" || threshold < 1 || threshold > 10000) {
        return NextResponse.json(
          { error: "threshold must be a number between 1 and 10000" },
          { status: 400 }
        );
      }
    }
    const settings = await setSettingsForUser(userId, { threshold });
    return NextResponse.json(settings);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (
      message.includes("FIREBASE_SERVICE_ACCOUNT") ||
      message.includes("GOOGLE_APPLICATION_CREDENTIALS") ||
      message.includes("invalid JSON")
    ) {
      return NextResponse.json(
        { error: "Firebase not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON or GOOGLE_APPLICATION_CREDENTIALS in .env.local (see README)." },
        { status: 503 }
      );
    }
    console.error("[PATCH /api/settings]", err);
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 }
    );
  }
}
