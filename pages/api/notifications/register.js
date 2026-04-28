// pages/api/notifications/register.js
// Register an FCM token for push notifications
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: "Invalid token" });
    // TODO: Store token in Firestore linked to the user
    // e.g. await setDoc(doc(db, "fcm_tokens", token), { token, createdAt: new Date() });
    console.log("[DWA] FCM token registered:", token.slice(0, 20) + "...");
    return res.json({ success: true });
  } catch (err) {
    console.error("[DWA] Token registration error:", err);
    return res.status(500).json({ error: "Failed to register token" });
  }
}
