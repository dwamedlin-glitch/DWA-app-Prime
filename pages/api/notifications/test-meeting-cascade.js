// pages/api/notifications/test-meeting-cascade.js
// Admin testing utility — fires the 1-week, 1-day, and day-of reminder
// notifications immediately so admins can verify the format and content
// without waiting for the actual cron firing windows.
// Uses the meeting info from the request body (typically the current saved
// meeting in the admin UI). All three notifications go to all registered
// devices, with "(TEST)" in the title so members understand.

const { admin } = require("../../../lib/firebase-admin");
const db = admin.firestore();
const TOKENS_COLLECTION = "fcm_tokens";

async function sendToAllTokens({ title, body, data = {} }) {
  const tokensSnap = await db.collection(TOKENS_COLLECTION).get();
  if (tokensSnap.empty) return { sent: 0, failed: 0 };
  const tokens = [];
  tokensSnap.forEach((doc) => {
    const t = doc.data().token;
    if (t) tokens.push(t);
  });
  if (tokens.length === 0) return { sent: 0, failed: 0 };
  let sent = 0;
  let failed = 0;
  for (let i = 0; i < tokens.length; i += 500) {
    const batch = tokens.slice(i, i + 500);
    const response = await admin.messaging().sendEachForMulticast({
      notification: { title, body },
      data: { ...data, type: "meeting" },
      tokens: batch,
    });
    sent += response.successCount;
    failed += response.failureCount;
  }
  return { sent, failed };
}

function parseMeetingDateTime(dateStr, timeStr) {
  try {
    let d = new Date(dateStr + " " + timeStr);
    if (!isNaN(d.getTime())) return d;
    d = new Date(dateStr + "T" + timeStr);
    if (!isNaN(d.getTime())) return d;
    return null;
  } catch { return null; }
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { title, date, time, location, zoomId, zoomPasscode } = req.body;
    if (!date || !time) return res.status(400).json({ error: "Date and time required" });

    const meetingDate = parseMeetingDateTime(date, time);
    if (!meetingDate || isNaN(meetingDate.getTime())) {
      return res.status(400).json({ error: "Could not parse date/time" });
    }
    const meetingTitle = title || "Union Meeting";
    const dateStr = meetingDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
    const timeStr = meetingDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const locationStr = location ? " · " + location : "";
    const zoomTail = zoomId ? " · Zoom " + zoomId : "";

    const results = {};

    // 1. The "1 week before" format
    const r1 = await sendToAllTokens({
      title: "(TEST) Union Meeting in 1 week",
      body: meetingTitle + " · " + dateStr + " at " + timeStr + locationStr,
      data: { url: "/?go=zoom" },
    });
    results.oneWeek = r1;

    // 2. The "1 day before" format
    const r2 = await sendToAllTokens({
      title: "(TEST) Reminder: " + meetingTitle + " tomorrow",
      body: dateStr + " at " + timeStr + locationStr + zoomTail,
      data: { url: "/?go=zoom" },
    });
    results.oneDay = r2;

    // 3. The "day of" format
    const r3 = await sendToAllTokens({
      title: "(TEST) " + meetingTitle + " today",
      body: "Today at " + timeStr + locationStr + zoomTail + " — tap to add to calendar or join",
      data: { url: "/?go=zoom" },
    });
    results.dayOf = r3;

    return res.status(200).json({ success: true, results });
  } catch (err) {
    console.error("[test-meeting-cascade] Error:", err);
    return res.status(500).json({ error: err.message || "Failed to send test cascade" });
  }
}
