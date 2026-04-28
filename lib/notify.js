// lib/notify.js
// Server-side helper to trigger push notifications
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

async function notifyAll({ title, body, type, url, id, targetRole }) {
  try {
    await fetch(BASE_URL + "/api/notifications/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body, type, url, id, targetRole: targetRole || "all" }),
    });
  } catch (err) {
    console.error("[DWA Notify] Error:", err);
  }
}

function notifyNewAnnouncement(title, id) {
  return notifyAll({ title: "New Announcement", body: title, type: "announcement", url: "/", id });
}

function notifyMeetingReminder(meetingTitle, meetingId, timeStr) {
  return notifyAll({ title: "Meeting Reminder", body: meetingTitle + " — " + timeStr, type: "meeting", url: "/", id: meetingId });
}

function notifyNewVote(voteTitle, voteId, deadline) {
  return notifyAll({ title: "New Vote Open", body: voteTitle + " — Vote by " + deadline, type: "vote", url: "/", id: voteId });
}

module.exports = { notifyAll, notifyNewAnnouncement, notifyMeetingReminder, notifyNewVote };
