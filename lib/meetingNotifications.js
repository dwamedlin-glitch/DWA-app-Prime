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

// Strip time-of-day — returns midnight of the given date (local).
function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}
// True if a and b fall on the same calendar day.
function sameCalendarDay(a, b) {
  return a.getFullYear() === b.getFullYear()
      && a.getMonth() === b.getMonth()
      && a.getDate() === b.getDate();
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
  const todayStart = startOfDay(new Date());
  // The three reminder days, as calendar days.
  const oneWeekDay = startOfDay(new Date(meetingDate.getTime() - 7 * 24 * 60 * 60 * 1000));
  const oneDayDay = startOfDay(new Date(meetingDate.getTime() - 24 * 60 * 60 * 1000));
  const meetingDay = startOfDay(meetingDate);
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
    // A reminder is marked already-sent if its calendar day is already in the past.
    // This prevents firing a "1 week before" reminder for a meeting scheduled
    // with short notice — the milestone simply never fires.
    oneWeekSent: todayStart.getTime() > oneWeekDay.getTime(),
    oneDaySent: todayStart.getTime() > oneDayDay.getTime(),
    dayOfSent: todayStart.getTime() > meetingDay.getTime(),
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
  // Runs ONCE per day (8am UTC by default — see vercel.json). Each reminder is
  // keyed to a distinct CALENDAR DAY, so the daily cron can fire at most ONE
  // reminder per run — the 1-week, 1-day, and day-of pushes can never collide.
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

  // The three reminder days, recomputed from the meeting date.
  const oneWeekDay = new Date(meetingDate.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneDayDay = new Date(meetingDate.getTime() - 24 * 60 * 60 * 1000);

  // 1-week-before — fires only on the calendar day exactly 7 days before.
  if (!data.oneWeekSent && sameCalendarDay(now, oneWeekDay) && now < meetingDate) {
    await sendToAllTokens({
      title: "Union Meeting in 1 week",
      body: data.meetingTitle + " · " + dateStr + " at " + timeStr + locationStr,
      data: { url: "/?go=zoom" },
    });
    await scheduleRef.update({ oneWeekSent: true });
    results.push("one_week_sent");
  }
  // 1-day-before — fires only on the calendar day before the meeting.
  else if (!data.oneDaySent && sameCalendarDay(now, oneDayDay) && now < meetingDate) {
    await sendToAllTokens({
      title: "Reminder: " + data.meetingTitle + " tomorrow",
      body: dateStr + " at " + timeStr + locationStr + zoomTail,
      data: { url: "/?go=zoom" },
    });
    await scheduleRef.update({ oneDaySent: true });
    results.push("one_day_sent");
  }
  // Day-of — fires only on the meeting's own calendar day.
  else if (!data.dayOfSent && sameCalendarDay(now, meetingDate)) {
    await sendToAllTokens({
      title: data.meetingTitle + " today",
      body: "Today at " + timeStr + locationStr + zoomTail + " — tap to add to calendar or join",
      data: { url: "/?go=zoom" },
    });
    await scheduleRef.update({ dayOfSent: true });
    results.push("day_of_sent");
  }

  // Clean up old schedules (more than 1 day past the meeting).
  const minutesUntilStart = (meetingDate - now) / (1000 * 60);
  if (minutesUntilStart < -24 * 60) {
    await scheduleRef.delete();
    results.push("schedule_cleaned");
  }
  return { action: results.length > 0 ? results.join(",") : "no_action_needed" };
}

module.exports = { onMeetingUpdated, checkScheduledNotifications };
