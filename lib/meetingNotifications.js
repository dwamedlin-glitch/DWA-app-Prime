// lib/meetingNotifications.js
// Meeting notification scheduling + immediate send
const { admin } = require("./firebase-admin");
const db = admin.firestore();

const SCHEDULE_COLLECTION = "meeting_notification_schedule";
const TOKENS_COLLECTION = "fcm_tokens";

async function sendToAllTokens({ title, body, data = {} }) {
  try {
    const tokensSnap = await db.collection(TOKENS_COLLECTION).get();
    if (tokensSnap.empty) {
      console.log("[MeetingNotify] No FCM tokens registered");
      return { sent: 0, failed: 0 };
    }
    const tokens = [];
    tokensSnap.forEach((doc) => {
      const t = doc.data().token;
      if (t) tokens.push(t);
    });
    if (tokens.length === 0) return { sent: 0, failed: 0 };
    const batches = [];
    for (let i = 0; i < tokens.length; i += 500) {
      batches.push(tokens.slice(i, i + 500));
    }
    let sent = 0;
    let failed = 0;
    const staleTokens = [];
    for (const batch of batches) {
      const message = {
        notification: { title, body },
        data: { ...data, type: "meeting" },
        tokens: batch,
      };
      const response = await admin.messaging().sendEachForMulticast(message);
      sent += response.successCount;
      failed += response.failureCount;
      response.responses.forEach((resp, idx) => {
        if (!resp.success && resp.error &&
          (resp.error.code === "messaging/registration-token-not-registered" ||
            resp.error.code === "messaging/invalid-registration-token")) {
          staleTokens.push(batch[idx]);
        }
      });
    }
    if (staleTokens.length > 0) {
      const cleanupBatch = db.batch();
      const staleSnap = await db.collection(TOKENS_COLLECTION)
        .where("token", "in", staleTokens.slice(0, 10)).get();
      staleSnap.forEach((doc) => cleanupBatch.delete(doc.ref));
      await cleanupBatch.commit();
    }
    console.log("[MeetingNotify] Sent: " + sent + ", Failed: " + failed);
    return { sent, failed };
  } catch (err) {
    console.error("[MeetingNotify] Send error:", err);
    return { sent: 0, failed: 0, error: err.message };
  }
}

async function onMeetingUpdated(meetingInfo) {
  const { title, date, time, location, zoomId, zoomPasscode, zoomLink } = meetingInfo;
  if (!date || !time) {
    console.log("[MeetingNotify] No date/time — skipping");
    return;
  }
  const meetingDate = parseMeetingDateTime(date, time);
  if (!meetingDate || isNaN(meetingDate.getTime())) {
    console.log("[MeetingNotify] Could not parse date/time:", date, time);
    return;
  }
  const now = new Date();
  const oneWeekBefore = new Date(meetingDate.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneDayBefore = new Date(meetingDate.getTime() - 24 * 60 * 60 * 1000);
  // "Day of" reminder fires from start of meeting's calendar day until meeting time.
  const dayOfStart = new Date(meetingDate.getFullYear(), meetingDate.getMonth(), meetingDate.getDate(), 0, 0, 0);
  const locationStr = location ? " · " + location : "";
  const dateStr = meetingDate.toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric"
  });
  const timeStr = meetingDate.toLocaleTimeString("en-US", {
    hour: "numeric", minute: "2-digit"
  });
  // Immediate notification about the meeting being scheduled / updated
  await sendToAllTokens({
    title: (title || "Union Meeting") + " · " + dateStr,
    body: timeStr + locationStr + (zoomId ? " · Zoom " + zoomId : ""),
    data: { url: "/?go=zoom" },
  });
  const scheduleDoc = {
    meetingTitle: title || "Union Meeting",
    meetingDate: admin.firestore.Timestamp.fromDate(meetingDate),
    meetingLocation: location || "",
    zoomId: zoomId || "",
    zoomPasscode: zoomPasscode || "",
    zoomLink: zoomLink || "",
    // Mark a milestone as already-sent if its target time has already passed —
    // prevents firing reminders for past dates the admin entered.
    oneWeekSent: oneWeekBefore < now,
    oneDaySent: oneDayBefore < now,
    dayOfSent: dayOfStart < now && meetingDate < now,
    oneWeekBeforeDate: admin.firestore.Timestamp.fromDate(oneWeekBefore),
    oneDayBeforeDate: admin.firestore.Timestamp.fromDate(oneDayBefore),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };
  await db.collection(SCHEDULE_COLLECTION).doc("next_meeting").set(scheduleDoc);
  console.log("[MeetingNotify] Schedule saved");
}

function parseMeetingDateTime(dateStr, timeStr) {
  try {
    let d = new Date(dateStr + " " + timeStr);
    if (!isNaN(d.getTime())) return d;
    d = new Date(dateStr + "T" + timeStr);
    if (!isNaN(d.getTime())) return d;
    return null;
  } catch {
    return null;
  }
}

async function checkScheduledNotifications() {
  // This runs ONCE per day (8am UTC by default — see vercel.json). We can't
  // reliably do precise "2 hours before" or "starting now" pushes on a daily
  // cron, so we fire the three morning-friendly reminders below and rely on
  // members' own Calendar app (via "Add to Calendar" on the Zoom screen) to
  // handle the imminent-meeting alerts.
  const now = new Date();
  const scheduleRef = db.collection(SCHEDULE_COLLECTION).doc("next_meeting");
  const doc = await scheduleRef.get();
  if (!doc.exists) return { action: "no_schedule" };
  const data = doc.data();
  const meetingDate = data.meetingDate.toDate();
  const dateStr = meetingDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const timeStr = meetingDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  const locationStr = data.meetingLocation ? " · " + data.meetingLocation : "";
  const zoomTail = data.zoomId ? " · Zoom " + data.zoomId : "";
  const results = [];

  // 1-week-before: gives officers time to publicize and members time to plan.
  const oneWeekBeforeDate = data.oneWeekBeforeDate && data.oneWeekBeforeDate.toDate();
  if (!data.oneWeekSent && oneWeekBeforeDate && now >= oneWeekBeforeDate && now < meetingDate) {
    await sendToAllTokens({
      title: "Union Meeting in 1 week",
      body: data.meetingTitle + " · " + dateStr + " at " + timeStr + locationStr,
      data: { url: "/?go=zoom" },
    });
    await scheduleRef.update({ oneWeekSent: true });
    results.push("one_week_sent");
  }

  // 1-day-before (morning reminder).
  const oneDayBeforeDate = data.oneDayBeforeDate && data.oneDayBeforeDate.toDate();
  if (!data.oneDaySent && oneDayBeforeDate && now >= oneDayBeforeDate && now < meetingDate) {
    await sendToAllTokens({
      title: "Reminder: " + data.meetingTitle + " tomorrow",
      body: dateStr + " at " + timeStr + locationStr + zoomTail,
      data: { url: "/?go=zoom" },
    });
    await scheduleRef.update({ oneDaySent: true });
    results.push("one_day_sent");
  }

  // Day-of (morning of meeting): "tonight at 6pm — tap to add to calendar"
  // Fires when cron runs on the same calendar day as the meeting.
  const sameDay = meetingDate.getFullYear() === now.getFullYear()
               && meetingDate.getMonth() === now.getMonth()
               && meetingDate.getDate() === now.getDate();
  if (!data.dayOfSent && sameDay && now < meetingDate) {
    await sendToAllTokens({
      title: data.meetingTitle + " today",
      body: "Today at " + timeStr + locationStr + zoomTail + " — tap to add to calendar or join",
      data: { url: "/?go=zoom" },
    });
    await scheduleRef.update({ dayOfSent: true });
    results.push("day_of_sent");
  }

  // Clean up old schedules (older than 1 day past meeting)
  const minutesUntilStart = (meetingDate - now) / (1000 * 60);
  if (minutesUntilStart < -24 * 60) {
    await scheduleRef.delete();
    results.push("schedule_cleaned");
  }
  return { action: results.length > 0 ? results.join(",") : "no_action_needed" };
}

module.exports = { onMeetingUpdated, checkScheduledNotifications };
