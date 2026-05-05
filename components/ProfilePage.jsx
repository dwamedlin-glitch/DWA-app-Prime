"use client";
import { useState, useEffect } from "react";
import { getApp } from "firebase/app";
import { getFirestore, doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// ── PROFILE PAGE ──
// Lets members view & edit their info. Officers/admins can view all member profiles.
// Fields: name, email (read-only), phone, location, home address (optional).
// Matches the DWA dark/gold theme.

const GOLD = "#c9922a";
const DARK = "#1a1208";
const DARK_CARD = "#231a0d";
const SEAM = "rgba(201,146,42,0.25)";
const RED = "#ff4444";
const GREEN = "#4caf50";
const TEXT = "#e8d5b0";
const TEXT_DIM = "rgba(232,213,176,0.5)";

const f = (size, weight = 400) => ({ fontSize: size, fontWeight: weight, fontFamily: "'Oswald', 'Bebas Neue', sans-serif" });

const styles = {
  overlay: {
    position: "fixed", inset: 0, zIndex: 9000,
    background: DARK,
    overflowY: "auto", WebkitOverflowScrolling: "touch",
  },
  header: {
    display: "flex", alignItems: "center", gap: 12,
    padding: "16px 20px",
    borderBottom: `2px solid ${GOLD}`,
    background: DARK,
    position: "sticky", top: 0, zIndex: 10,
  },
  backBtn: {
    background: "none", border: "none", color: GOLD, cursor: "pointer",
    ...f(22, 700), padding: "4px 8px",
  },
  title: { ...f(20, 700), color: GOLD, letterSpacing: ".08em", textTransform: "uppercase" },
  body: { padding: "20px", maxWidth: 480, margin: "0 auto" },
  avatar: {
    width: 80, height: 80, borderRadius: "50%", margin: "0 auto 16px",
    background: `linear-gradient(135deg, ${DARK_CARD}, ${GOLD})`,
    display: "flex", alignItems: "center", justifyContent: "center",
    border: `3px solid ${GOLD}`, ...f(32, 700), color: DARK,
  },
  memberSince: { textAlign: "center", color: TEXT_DIM, ...f(12), marginBottom: 24, letterSpacing: ".05em" },
  section: { marginBottom: 24 },
  sectionTitle: {
    ...f(11, 700), color: GOLD, letterSpacing: ".15em", textTransform: "uppercase",
    marginBottom: 12, paddingBottom: 6, borderBottom: `1px solid ${SEAM}`,
  },
  fieldGroup: { marginBottom: 16 },
  label: { ...f(11, 600), color: TEXT_DIM, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 4, display: "block" },
  input: {
    width: "100%", padding: "12px 14px", borderRadius: 8,
    border: `1px solid ${SEAM}`, background: "rgba(255,255,255,0.04)",
    color: TEXT, ...f(14), outline: "none", boxSizing: "border-box",
  },
  inputReadonly: {
    width: "100%", padding: "12px 14px", borderRadius: 8,
    border: `1px solid rgba(201,146,42,0.1)`, background: "rgba(255,255,255,0.02)",
    color: TEXT_DIM, ...f(14), boxSizing: "border-box",
  },
  saveBtn: {
    width: "100%", padding: "14px", border: "none", borderRadius: 8, cursor: "pointer",
    background: `linear-gradient(135deg, #c9922a, #a67a1e)`,
    color: "#1a1208", ...f(14, 700), letterSpacing: ".1em", textTransform: "uppercase",
    marginTop: 8,
  },
  saveBtnDisabled: {
    width: "100%", padding: "14px", border: "none", borderRadius: 8,
    background: "rgba(201,146,42,0.3)", color: TEXT_DIM,
    ...f(14, 700), letterSpacing: ".1em", textTransform: "uppercase",
    marginTop: 8,
  },
  flash: (type) => ({
    padding: "10px 14px", borderRadius: 8, marginBottom: 16, ...f(13),
    background: type === "error" ? "rgba(255,68,68,0.15)" : "rgba(76,175,80,0.15)",
    color: type === "error" ? RED : GREEN,
    border: `1px solid ${type === "error" ? "rgba(255,68,68,0.3)" : "rgba(76,175,80,0.3)"}`,
  }),
  roleBadge: {
    display: "inline-block", padding: "3px 10px", borderRadius: 12,
    ...f(10, 700), letterSpacing: ".1em", textTransform: "uppercase",
    marginBottom: 4,
  },
};

export default function ProfilePage({ onBack, userId }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState(null);

  // Editable fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");

  useEffect(() => {
    loadProfile();
  }, [userId]);

  async function loadProfile() {
    try {
      const db = getFirestore(getApp());
      const uid = userId || getAuth(getApp()).currentUser?.uid;
      if (!uid) return;
      const snap = await getDoc(doc(db, "user_profiles", uid));
      if (snap.exists()) {
        const data = snap.data();
        setProfile(data);
        setName(data.name || "");
        setPhone(data.phone || "");
        setLocation(data.location || "");
        setStreet(data.address?.street || "");
        setCity(data.address?.city || "");
        setState(data.address?.state || "");
        setZip(data.address?.zip || "");
      }
    } catch (e) {
      console.error("[Profile] Load error:", e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setFlash(null);
    try {
      const db = getFirestore(getApp());
      const uid = userId || getAuth(getApp()).currentUser?.uid;
      await updateDoc(doc(db, "user_profiles", uid), {
        name: name.trim(),
        phone: phone.trim(),
        location: location.trim(),
        address: {
          street: street.trim(),
          city: city.trim(),
          state: state.trim(),
          zip: zip.trim(),
        },
        updatedAt: serverTimestamp(),
      });
      setFlash({ type: "success", msg: "Profile updated!" });
      setTimeout(() => setFlash(null), 3000);
    } catch (e) {
      console.error("[Profile] Save error:", e);
      setFlash({ type: "error", msg: "Failed to save. Try again." });
    } finally {
      setSaving(false);
    }
  }

  function getInitials(n) {
    if (!n) return "?";
    return n.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  }

  function getRoleBadgeStyle(role) {
    if (role === "admin" || role === "officer") {
      return { ...styles.roleBadge, background: "rgba(201,146,42,0.2)", color: GOLD, border: `1px solid ${SEAM}` };
    }
    return { ...styles.roleBadge, background: "rgba(255,255,255,0.06)", color: TEXT_DIM, border: `1px solid rgba(255,255,255,0.1)` };
  }

  if (loading) {
    return (
      <div style={styles.overlay}>
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={onBack}>←</button>
          <div style={styles.title}>Profile</div>
        </div>
        <div style={{ ...styles.body, textAlign: "center", color: TEXT_DIM, ...f(14), paddingTop: 60 }}>
          Loading profile...
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={styles.overlay}>
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={onBack}>←</button>
          <div style={styles.title}>Profile</div>
        </div>
        <div style={{ ...styles.body, textAlign: "center", color: TEXT_DIM, ...f(14), paddingTop: 60 }}>
          Profile not found.
        </div>
      </div>
    );
  }

  return (
    <div style={styles.overlay}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>←</button>
        <div style={styles.title}>My Profile</div>
      </div>

      <div style={styles.body}>
        {/* Avatar */}
        <div style={styles.avatar}>{getInitials(name)}</div>
        <div style={{ textAlign: "center", marginBottom: 4 }}>
          <span style={getRoleBadgeStyle(profile.role)}>{profile.role || "member"}</span>
        </div>
        <div style={styles.memberSince}>
          Member since {profile.memberSince || "—"}
        </div>

        {flash && <div style={styles.flash(flash.type)}>{flash.msg}</div>}

        {/* Basic Info */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Basic Information</div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Full Name</label>
            <input style={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Email</label>
            <div style={styles.inputReadonly}>{profile.email || "—"}</div>
            <div style={{ ...f(10), color: TEXT_DIM, marginTop: 4 }}>Contact an officer to change your email</div>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Phone</label>
            <input style={styles.input} value={phone} onChange={e => setPhone(e.target.value)} placeholder="Your phone number" type="tel" />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Work Location</label>
            <input style={styles.input} value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Florence" />
          </div>
        </div>

        {/* Home Address (Optional) */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Home Address <span style={{ ...f(10, 400), color: TEXT_DIM, textTransform: "none", letterSpacing: 0 }}>— optional, for union election records</span></div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Street</label>
            <input style={styles.input} value={street} onChange={e => setStreet(e.target.value)} placeholder="123 Main St" />
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ ...styles.fieldGroup, flex: 2 }}>
              <label style={styles.label}>City</label>
              <input style={styles.input} value={city} onChange={e => setCity(e.target.value)} placeholder="City" />
            </div>
            <div style={{ ...styles.fieldGroup, flex: 1 }}>
              <label style={styles.label}>State</label>
              <input style={styles.input} value={state} onChange={e => setState(e.target.value)} placeholder="NJ" maxLength={2} />
            </div>
            <div style={{ ...styles.fieldGroup, flex: 1 }}>
              <label style={styles.label}>Zip</label>
              <input style={styles.input} value={zip} onChange={e => setZip(e.target.value)} placeholder="08505" maxLength={10} />
            </div>
          </div>
        </div>

        {/* Save */}
        <button
          style={saving ? styles.saveBtnDisabled : styles.saveBtn}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        <div style={{ height: 40 }} />
      </div>
    </div>
  );
}
