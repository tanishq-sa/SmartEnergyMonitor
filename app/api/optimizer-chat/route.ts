import { NextResponse } from "next/server";

type Message = { role: "user" | "assistant"; text: string };

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "GEMINI_API_KEY is not set. Add it to .env.local before using the optimizer chat.",
        },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { messages, snapshot } = body as {
      messages: Message[];
      snapshot: {
        avgDaily: number;
        projected: number;
        threshold: number;
        unitPrice: number;
        trend: string | null;
        spikeCount: number;
      };
    };

    const historyText = messages
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.text}`)
      .join("\n");

    const summary = `
Energy data snapshot:
- Average daily usage: ${snapshot.avgDaily.toFixed(1)} units
- Projected monthly bill: ₹${snapshot.projected.toFixed(0)}
- Threshold: ${snapshot.threshold} units/day
- Unit price: ₹${snapshot.unitPrice.toFixed(2)} per unit
- Trend: ${snapshot.trend ?? "no strong trend detected"}
- Spike days detected: ${snapshot.spikeCount}
`.trim();

    const prompt = `
You are an energy-optimization assistant for a smart energy dashboard.

${summary}

User and assistant conversation so far:
${historyText}

Respond with specific, practical suggestions to help the user reduce energy usage and costs based on the snapshot.
Use short paragraphs and bullet points when helpful. Avoid repeating the raw numbers unless they are critical to your explanation.
`.trim();

    const geminiBody = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    };

    const resp = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=" +
        apiKey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(geminiBody),
      }
    );

    if (!resp.ok) {
      const errText = await resp.text();
      console.error("[optimizer-chat] Gemini error", resp.status, errText);
      return NextResponse.json(
        { error: "Gemini request failed", detail: errText },
        { status: 500 }
      );
    }

    const data = (await resp.json()) as any;
    const text =
      data?.candidates?.[0]?.content?.parts
        ?.map((p: any) => p.text ?? "")
        .join("")
        .trim() || "Sorry, I couldn't generate a suggestion right now.";

    return NextResponse.json({ text });
  } catch (err) {
    console.error("[optimizer-chat] Unexpected error", err);
    return NextResponse.json(
      { error: "Unexpected error while generating suggestions" },
      { status: 500 }
    );
  }
}

