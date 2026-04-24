import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { title, body } = await req.json();

    if (!title || !body) {
      return NextResponse.json(
        { error: "Title and body are required" },
        { status: 400 }
      );
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `You are a professional translator for a labor union. Translate the following announcement title and body from English to Spanish. Keep the tone professional and clear. Return ONLY valid JSON with keys "titleEs" and "bodyEs" — no markdown, no explanation, nothing else.

Title: ${title}

Body: ${body}`,
        },
      ],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "{}";
    const parsed = JSON.parse(text.trim());

    return NextResponse.json({
      titleEs: parsed.titleEs || title,
      bodyEs: parsed.bodyEs || body,
    });
  } catch (error) {
    console.error("Translation error:", error);
    // Graceful fallback — return English if translation fails
    return NextResponse.json(
      { error: "Translation failed", titleEs: null, bodyEs: null },
      { status: 500 }
    );
  }
}
