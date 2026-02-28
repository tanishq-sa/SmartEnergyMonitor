import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getEntriesForUser, addEntryForUser } from "@/lib/firebase";
import type { EnergyEntry } from "@/lib/analytics";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const entries: EnergyEntry[] = await getEntriesForUser(userId);
    return NextResponse.json(entries);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (
      message.includes("FIREBASE_SERVICE_ACCOUNT") ||
      message.includes("GOOGLE_APPLICATION_CREDENTIALS") ||
      message.includes("invalid JSON")
    ) {
      return NextResponse.json(
        {
          error:
            "Firebase not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON or GOOGLE_APPLICATION_CREDENTIALS in .env.local (see README).",
        },
        { status: 503 }
      );
    }
    console.error("[GET /api/entries]", err);
    return NextResponse.json(
      { error: "Failed to fetch entries" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    // Support single entry or bulk array for CSV import
    if (Array.isArray(body)) {
      const items = body as { date?: string; units?: number }[];
      if (items.length === 0) {
        return NextResponse.json(
          { error: "Array body must contain at least one item" },
          { status: 400 }
        );
      }
      for (const item of items) {
        if (!item.date || typeof item.units !== "number" || item.units <= 0) {
          return NextResponse.json(
            {
              error:
                "Invalid item in array: each needs date (string) and units (number > 0)",
            },
            { status: 400 }
          );
        }
      }
      const saved = await Promise.all(
        items.map((item) =>
          addEntryForUser(userId, {
            date: String(item.date),
            units: Number(item.units),
          })
        )
      );
      return NextResponse.json(saved);
    } else {
      const { date, units } = body as { date?: string; units?: number };

      if (!date || typeof units !== "number" || units <= 0) {
        return NextResponse.json(
          { error: "Invalid body: date (string) and units (number > 0) required" },
          { status: 400 }
        );
      }

      const entry = await addEntryForUser(userId, {
        date: String(date),
        units: Number(units),
      });

      return NextResponse.json(entry);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (
      message.includes("FIREBASE_SERVICE_ACCOUNT") ||
      message.includes("GOOGLE_APPLICATION_CREDENTIALS") ||
      message.includes("invalid JSON")
    ) {
      return NextResponse.json(
        {
          error:
            "Firebase not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON or GOOGLE_APPLICATION_CREDENTIALS in .env.local (see README).",
        },
        { status: 503 }
      );
    }
    console.error("[POST /api/entries]", err);
    return NextResponse.json(
      { error: "Failed to save entry" },
      { status: 500 }
    );
  }
}
