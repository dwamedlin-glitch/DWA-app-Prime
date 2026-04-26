// pages/api/translate.js
// Free Spanish translation using MyMemory API (no API key required)
// Preserves line breaks by translating paragraph-by-paragraph

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { title, body } = req.body;
  if (!title && !body) {
    return res.status(400).json({ error: "Missing title or body" });
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
      const translated = [];
      for (const p of paragraphs) {
        if (p.trim() === "") {
          translated.push("");
        } else {
          translated.push(await translateText(p));
        }
      }
      bodyEs = translated.join("\n");
    }

    return res.status(200).json({ titleEs, bodyEs });
  } catch (error) {
    console.error("Translation error:", error);
    return res.status(200).json({
      error: "Translation failed",
      titleEs: null,
      bodyEs: null,
    });
  }
}

async function translateText(text) {
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
        // Convert to sentence case
        result = result.charAt(0).toUpperCase() + result.slice(1).toLowerCase();
      }
      return result;
    }
    return text; // fallback to English
  } catch (e) {
    return text; // fallback to English
  }
}
