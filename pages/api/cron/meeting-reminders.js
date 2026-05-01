// pages/api/cron/meeting-reminders.js
// Vercel Cron Job — runs every hour
// Checks if "1 week before" or "starting now" notifications should fire
//
// vercel.json cron config:
// { "crons": [{ "path": "/api/cron/meeting-reminders", "schedule": "0 * * * *" }] }

import { checkScheduledNotifications } from "../../../lib/meetingNotifications";

export default async function handler(req, res) {
  // Verify this is called by Vercel Cron (not random requests)
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = req.headers.authorization;
    if (authHeader !== "Bearer " + cronSecret) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  }

  try {
    const result = await checkScheduledNotifications();
    console.log("[cron/meeting-reminders] Result:", result);
    return res.status(200).json(result);
  } catch (err) {
    console.error("[cron/meeting-reminders] Error:", err);
    return res.status(500).json({ error: err.message });
  }
}
