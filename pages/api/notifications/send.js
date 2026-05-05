// pages/api/notifications/send.js
const { adminMessaging, adminDb } = require("../../../lib/firebase-admin");

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { title, body, type, url, tokens } = req.body;
    if (!title || !body || !type) return res.status(400).json({ error: "title, body, type required" });

    const notification = { title, body };
    const data = { type: type || "general", title, body, url: url || "/" };

    let allTokens = tokens || [];

    if (allTokens.length === 0) {
      const snapshot = await adminDb.collection("fcm_tokens").get();
      snapshot.forEach(doc => {
        const t = doc.data().token;
        if (t) allTokens.push(t);
      });
    }

    if (allTokens.length === 0) {
      return res.json({ success: false, message: "No registered devices found", totalDevices: 0 });
    }

    let sent = 0, failed = 0, stale = [];
    for (let i = 0; i < allTokens.length; i += 500) {
      const batch = allTokens.slice(i, i + 500);
      const response = await adminMessaging.sendEachForMulticast({
                tokens: batch, data,
      });
      sent += response.successCount;
      failed += response.failureCount;
      response.responses.forEach((r, idx) => {
        if (r.error && (r.error.code === "messaging/invalid-registration-token" || r.error.code === "messaging/registration-token-not-registered")) {
          stale.push(batch[idx]);
        }
      });
    }

    for (const t of stale) {
      try { await adminDb.collection("fcm_tokens").doc(t).delete(); } catch (e) {}
    }

    return res.json({ success: true, sent, failed, staleRemoved: stale.length, totalDevices: allTokens.length });
  } catch (err) {
    console.error("[DWA] Send error:", err);
    return res.status(500).json({ error: err.message || "Failed to send" });
  }
}
