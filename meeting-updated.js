// pages/api/notifications/meeting-updated.js
// Called when admin clicks "Send Notification" for a meeting update.
// Uses notifyAll from lib/notify.js — the same proven path as all other notifications.

const { notifyAll } = require("../../../lib/notify");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { title, date, time, location, zoomId, zoomPasscode, zoomLink } = req.body;

    if (!date || !time) {
      return res.status(400).json({ error: "Date and time are required" });
    }

    // Build a readable notification body
    const meetingTitle = title || "Union Meeting";
    const dateStr = new Date(date + "T00:00:00").toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });

    let body = `${dateStr} at ${time}`;
    if (location) body += ` — ${location}`;
    if (zoomId) body += ` | Zoom ID: ${zoomId}`;

    // Send push notification to all members via the existing send endpoint
    await notifyAll({
      title: `📅 ${meetingTitle}`,
      body,
      type: "meeting",
      url: "/",
    });

    return res.status(200).json({ success: true, message: "Notification sent" });
  } catch (err) {
    console.error("[meeting-updated] Error:", err);
    return res.status(500).json({ error: "Failed to send notification" });
  }
}
