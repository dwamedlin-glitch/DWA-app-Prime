// app/api/translate/route.ts
// Free Spanish translation using MyMemory API (no API key required)
// Preserves line breaks by translating paragraph-by-paragraph

export async function POST(request: Request) {
  const { title, body } = await request.json();

  if (!title && !body) {
    return Response.json({ error: "Missing title or body" }, { status: 400 });
  }

  try {
    let titleEs = title || "";
    let bodyEs = body || "";

    // Translate title
    if (title) {
      titleEs = await translateText(title);
    }

    // Translate body paragraph-by-paragraph to preserve line breaks
    if (body) {
      const paragraphs = body.split("\n");
      const translated: string[] = [];
      for (const p of paragraphs) {
        if (p.trim() === "") {
          translated.push("");
        } else {
          translated.push(await translateText(p));
        }
      }
      bodyEs = translated.join("\n");
    }

    return Response.json({ titleEs, bodyEs });
  } catch (error) {
    console.error("Translation error:", error);
    return Response.json({
      error: "Translation failed",
      titleEs: null,
      bodyEs: null,
    });
  }
}

async function translateText(text: string): Promise<string> {
  if (!text || text.trim() === "") return text;

  try {
    const encoded = encodeURIComponent(text);
    const url = `https://api.mymemory.translated.net/get?q=${encoded}&langpair=en|es`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      let result = data.responseData.translatedText;
      // MyMemory sometimes returns ALL CAPS — fix that
      if (result === result.toUpperCase() && text !== text.toUpperCase()) {
        result = result.charAt(0).toUpperCase() + result.slice(1).toLowerCase();
      }
      return result;
    }
    return text;
  } catch (e) {
    return text;
  }
}
