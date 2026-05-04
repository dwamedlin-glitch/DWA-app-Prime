// pages/api/notifications/register.js
// Register an FCM token for push notifications — saves to Firestore
const { adminDb } = require("../../../lib/firebase-admin");

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { token, userId, role } = req.body;
    if (!token) return res.status(400).json({ error: "Invalid token" });

    // Store token in Firestore, keyed by token string for dedup
    await adminDb.collection("fcm_tokens").doc(token).set({
      token,
      userId: userId || "anonymous",
      role: role || "member",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    console.log("[DWA] FCM token registered:", token.substring(0, 20) + "...");
    return res.json({ success: true });
  } catch (err) {
    console.error("[DWA] Token registration error:", err);
    return res.status(500).json({ error: err.message || "Failed to register token" });
  }
}
