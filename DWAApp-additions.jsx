// ═══════════════════════════════════════════════════════════════════
// DWAApp.jsx — ADDITIONS FOR SEND NOTIFICATION BUTTON
// ═══════════════════════════════════════════════════════════════════
//
// Two things to add:
//   1. State variable for the confirmation modal
//   2. The button + modal JSX in the Officers Panel meeting section
//
// ───────────────────────────────────────────────────────────────────
// STEP 1: Add this state near your other useState declarations
// ───────────────────────────────────────────────────────────────────

const [showNotifyConfirm, setShowNotifyConfirm] = useState(false);
const [notifySending, setNotifySending] = useState(false);
const [notifyResult, setNotifyResult] = useState(null); // "sent" | "error" | null

// ───────────────────────────────────────────────────────────────────
// STEP 2: Add this handler function
// ───────────────────────────────────────────────────────────────────

const handleSendMeetingNotification = async () => {
  setNotifySending(true);
  setNotifyResult(null);
  try {
    const info = nextMeeting || {};
    const res = await fetch("/api/notifications/meeting-updated", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: info.title || "Union Meeting",
        date: info.date,
        time: info.time,
        location: info.location || "",
        zoomId: zoomInfo?.id || "",
        zoomPasscode: zoomInfo?.passcode || "",
        zoomLink: zoomInfo?.link || "",
      }),
    });
    if (res.ok) {
      setNotifyResult("sent");
    } else {
      setNotifyResult("error");
    }
  } catch (err) {
    console.error("Meeting notification failed:", err);
    setNotifyResult("error");
  }
  setNotifySending(false);
  // Auto-dismiss after 3 seconds
  setTimeout(() => {
    setShowNotifyConfirm(false);
    setNotifyResult(null);
  }, 3000);
};

// ───────────────────────────────────────────────────────────────────
// STEP 3: Add this JSX in the Officers Panel, below SAVE MEETING INFO
// ───────────────────────────────────────────────────────────────────

// "Send Notification" button — place right after the SAVE MEETING INFO button
{nextMeeting?.date && nextMeeting?.time && (
  <button
    style={{
      ...btnGold(),
      marginTop: 10,
      background: "transparent",
      border: "2px solid #d4a843",
      color: "#d4a843",
    }}
    onClick={() => setShowNotifyConfirm(true)}
  >
    📢 SEND MEETING NOTIFICATION
  </button>
)}

// ───────────────────────────────────────────────────────────────────
// STEP 4: Add confirmation modal — place before the closing </div>
//         of your main component return (or wherever your other
//         modals live)
// ───────────────────────────────────────────────────────────────────

{showNotifyConfirm && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
    }}
    onClick={() => {
      if (!notifySending) {
        setShowNotifyConfirm(false);
        setNotifyResult(null);
      }
    }}
  >
    <div
      style={{
        background: "#1a1a2e",
        border: "2px solid #d4a843",
        borderRadius: 12,
        padding: "24px 28px",
        maxWidth: 380,
        width: "90%",
        textAlign: "center",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {notifyResult === "sent" ? (
        <>
          <div style={{ fontSize: 36, marginBottom: 8 }}>✅</div>
          <div style={{ color: "#d4a843", fontWeight: 700, fontSize: 16 }}>
            Notification Sent!
          </div>
          <div style={{ color: "#ccc", fontSize: 13, marginTop: 6 }}>
            All members with notifications enabled will receive it.
          </div>
        </>
      ) : notifyResult === "error" ? (
        <>
          <div style={{ fontSize: 36, marginBottom: 8 }}>⚠️</div>
          <div style={{ color: "#e74c3c", fontWeight: 700, fontSize: 16 }}>
            Failed to send
          </div>
          <div style={{ color: "#ccc", fontSize: 13, marginTop: 6 }}>
            Check your connection and try again.
          </div>
        </>
      ) : (
        <>
          <div style={{ color: "#d4a843", fontWeight: 700, fontSize: 17, marginBottom: 12 }}>
            Send Meeting Notification?
          </div>
          <div style={{ color: "#ccc", fontSize: 14, marginBottom: 20, lineHeight: 1.5 }}>
            This will send a push notification to <strong>all members</strong> with
            the current meeting details.
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button
              style={{
                padding: "10px 24px",
                background: "transparent",
                border: "1px solid #555",
                color: "#ccc",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 14,
              }}
              onClick={() => setShowNotifyConfirm(false)}
              disabled={notifySending}
            >
              Cancel
            </button>
            <button
              style={{
                padding: "10px 24px",
                background: "#d4a843",
                border: "none",
                color: "#1a1a2e",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 14,
                opacity: notifySending ? 0.6 : 1,
              }}
              onClick={handleSendMeetingNotification}
              disabled={notifySending}
            >
              {notifySending ? "Sending..." : "Send It"}
            </button>
          </div>
        </>
      )}
    </div>
  </div>
)}
