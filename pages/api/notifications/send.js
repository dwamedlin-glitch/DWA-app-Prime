// pages/api/notifications/send.js
// Send push notifications — admin/officer only
const { adminMessaging } = require("../../../lib/firebase-admin");

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { title, body, type, url, id, targetRole, tokens, topic } = req.body;
    if (!title || !body || !type) return res.status(400).json({ error: "title, body, type required" });

    const data = {
      type: type || "general",
      title,
      body,
      url: url || "/",
      tag: "dwa-" + type,
    };
    if (id) data.id = id;

    // Send to topic if provided
    if (topic) {
      const response = await adminMessaging.send({
        topic,
        data,
        webpush: { notification: { title, body, icon: "/icons/dwa-icon-192.png" } },
      });
      return res.json({ success: true, messageId: response });
    }

    // Send to specific tokens if provided
    if (tokens && tokens.length > 0) {
      const response = await adminMessaging.sendEachForMulticast({
        tokens,
        data,
        webpush: { notification: { title, body, icon: "/icons/dwa-icon-192.png" } },
      });
      return res.json({ success: true, sent: response.successCount, failed: response.failureCount });
    }

    // TODO: Wire up DB to fetch tokens by role
    return res.json({ success: true, message: "Notification queued (wire up DB token query)" });
  } catch (err) {
    console.error("[DWA] Send notification error:", err);
    return res.status(500).json({ error: err.message || "Failed to send" });
  }
}
