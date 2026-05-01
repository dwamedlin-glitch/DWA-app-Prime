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
  const locationStr = location ? " at " + location : "";
  const dateStr = meetingDate.toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric"
  });
  const timeStr = meetingDate.toLocaleTimeString("en-US", {
    hour: "numeric", minute: "2-digit"
  });
  await sendToAllTokens({
    title: "Union Meeting Updated",
    body: (title || "Union Meeting") + " — " + dateStr + ", " + timeStr + locationStr,
    data: { url: "/" },
  });
  const scheduleDoc = {
    meetingTitle: title || "Union Meeting",
    meetingDate: admin.firestore.Timestamp.fromDate(meetingDate),
    meetingLocation: location || "",
    zoomId: zoomId || "",
    zoomPasscode: zoomPasscode || "",
    zoomLink: zoomLink || "",
    oneWeekSent: oneWeekBefore < now,
    startSent: meetingDate < now,
    oneWeekBeforeDate: admin.firestore.Timestamp.fromDate(oneWeekBefore),
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
  const now = new Date();
  const scheduleRef = db.collection(SCHEDULE_COLLECTION).doc("next_meeting");
  const doc = await scheduleRef.get();
  if (!doc.exists) return { action: "no_schedule" };
  const data = doc.data();
  const meetingDate = data.meetingDate.toDate();
  const oneWeekBeforeDate = data.oneWeekBeforeDate.toDate();
  const results = [];
  if (!data.oneWeekSent && now >= oneWeekBeforeDate && now < meetingDate) {
    const dateStr = meetingDate.toLocaleDateString("en-US", {
      weekday: "long", month: "long", day: "numeric"
    });
    const timeStr = meetingDate.toLocaleTimeString("en-US", {
      hour: "numeric", minute: "2-digit"
    });
    await sendToAllTokens({
      title: "Union Meeting in 1 Week",
      body: data.meetingTitle + " — " + dateStr + ", " + timeStr,
      data: { url: "/" },
    });
    await scheduleRef.update({ oneWeekSent: true });
    results.push("one_week_sent");
  }
  const minutesUntilStart = (meetingDate - now) / (1000 * 60);
  if (!data.startSent && minutesUntilStart <= 5 && minutesUntilStart >= -60) {
    let body = data.meetingTitle + " is starting now!";
    if (data.zoomId) {
      body += "\nZoom ID: " + data.zoomId;
      if (data.zoomPasscode) body += " | Passcode: " + data.zoomPasscode;
    }
    await sendToAllTokens({
      title: "Union Meeting Starting Now!",
      body,
      data: { url: data.zoomLink || "/", zoomId: data.zoomId || "", zoomPasscode: data.zoomPasscode || "" },
    });
    await scheduleRef.update({ startSent: true });
    results.push("start_sent");
  }
  if (minutesUntilStart < -120) {
    await scheduleRef.delete();
    results.push("schedule_cleaned");
  }
  return { action: results.length > 0 ? results.join(",") : "no_action_needed" };
}

module.exports = { onMeetingUpdated, checkScheduledNotifications };
