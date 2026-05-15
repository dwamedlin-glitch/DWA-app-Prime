// pages/api/notifications/unregister.js
// Unregister an FCM token — removes from Firestore so the device stops receiving pushes
const { adminDb } = require("../../../lib/firebase-admin");

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: "Invalid token" });

    await adminDb.collection("fcm_tokens").doc(token).delete();

    console.log("[DWA] FCM token unregistered:", token.substring(0, 20) + "...");
    return res.json({ success: true });
  } catch (err) {
    console.error("[DWA] Token unregistration error:", err);
    return res.status(500).json({ error: err.message || "Failed to unregister token" });
  }
}
