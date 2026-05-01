// pages/api/notifications/meeting-updated.js
// Called when an admin saves/updates meeting info
// Sends immediate push notification + schedules future ones

const { onMeetingUpdated } = require("../../../lib/meetingNotifications");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { title, date, time, location, zoomId, zoomPasscode, zoomLink } = req.body;
    if (!date || !time) {
      return res.status(400).json({ error: "date and time are required" });
    }
    await onMeetingUpdated({
      title: title || "Union Meeting",
      date,
      time,
      location: location || "",
      zoomId: zoomId || "",
      zoomPasscode: zoomPasscode || "",
      zoomLink: zoomLink || "",
    });
    return res.status(200).json({ success: true, message: "Notification sent and schedule saved" });
  } catch (err) {
    console.error("[meeting-updated] Error:", err);
    return res.status(500).json({ error: "Failed to process meeting notification" });
  }
}
