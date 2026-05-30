// lib/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
    sendPasswordResetEmail,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  where,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCxB-cPHT6t81DK2uVKe4z6gOEtNaW1Bqg",
  authDomain: "dwa-union-app-8d691.firebaseapp.com",
  projectId: "dwa-union-app-8d691",
  storageBucket: "dwa-union-app-8d691.firebasestorage.app",
  messagingSenderId: "457127100918",
  appId: "1:457127100918:web:04f142b6ca7b83d91507d7",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// ── AUTHENTICATION ──

export async function registerUser(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function loginUser(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function logoutUser() {
  return signOut(auth);
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

// ── USER PROFILES ──

const PROFILES_COLLECTION = "user_profiles";

export async function saveUserProfile(uid, profileData) {
  return setDoc(doc(db, PROFILES_COLLECTION, uid), profileData, { merge: true });
}

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, PROFILES_COLLECTION, uid));
  return snap.exists() ? { uid, ...snap.data() } : null;
}

export function subscribeToPendingMembers(callback) {
  const q = query(
    collection(db, PROFILES_COLLECTION),
    where("status", "==", "pending")
  );
  return onSnapshot(q, (snapshot) => {
    const members = snapshot.docs.map((d) => ({ uid: d.id, ...d.data() }));
    callback(members);
  });
}

export async function approveMember(uid) {
  return updateDoc(doc(db, PROFILES_COLLECTION, uid), { status: "approved" });
}

export async function denyMember(uid) {
  return deleteDoc(doc(db, PROFILES_COLLECTION, uid));
}

// ── FILE UPLOAD (FIREBASE STORAGE) ──

export async function uploadDocumentFile(file) {
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storageRef = ref(storage, `documents/${timestamp}_${safeName}`);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
}

// ── GRIEVANCE ATTACHMENTS ──
// Stores both the download URL and the storage path so we can clean files up
// when a grievance is hard-deleted.

export async function uploadGrievanceAttachment(file) {
  const timestamp = Date.now() + "_" + Math.random().toString(36).slice(2, 8);
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `grievance_attachments/${timestamp}_${safeName}`;
  const storageRef = ref(storage, storagePath);
  const snapshot = await uploadBytes(storageRef, file, { contentType: file.type || "application/octet-stream" });
  const downloadURL = await getDownloadURL(snapshot.ref);
  return {
    url: downloadURL,
    storagePath,
    name: file.name,
    size: file.size,
    mimeType: file.type || "",
    uploadedAt: Date.now(),
  };
}

export async function deleteGrievanceAttachment(storagePath) {
  if (!storagePath) return;
  try {
    const r = ref(storage, storagePath);
    const { deleteObject } = await import("firebase/storage");
    await deleteObject(r);
  } catch (e) {
    // File may already be gone — best-effort cleanup.
    console.warn("Failed to delete grievance attachment:", e.message);
  }
}

// ── THE FLOOR ──

const FLOOR_COLLECTION = "floor_posts";

export function subscribeToFloorPosts(callback) {
  const q = query(collection(db, FLOOR_COLLECTION), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const posts = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      time: d.data().createdAt?.toMillis?.() || Date.now(),
      replies: (d.data().replies || []).map((r) => ({
        ...r,
        time: r.time?.toMillis?.() || r.time || Date.now(),
      })),
    }));
    callback(posts);
  });
}

export async function createFloorPost({ author, uid, location, role, text, photoURL }) {
  const postData = {
    author,
    uid: uid || null,
    location: location || null,
    role: role || "member",
    text,
    replies: [],
    createdAt: serverTimestamp(),
  };
  if (photoURL) postData.photoURL = photoURL;
  return addDoc(collection(db, FLOOR_COLLECTION), postData);
}

// Upload a photo for a Floor post (Firebase Storage)
export async function uploadFloorPhoto(file) {
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storageRef = ref(storage, `floor_photos/${timestamp}_${safeName}`);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
}

export async function deleteFloorPost(postId) {
  return deleteDoc(doc(db, FLOOR_COLLECTION, postId));
}

export async function addFloorReply(postId, reply) {
  return updateDoc(doc(db, FLOOR_COLLECTION, postId), {
    replies: arrayUnion({
      id: reply.id || `r${Date.now()}`,
      author: reply.author,
      uid: reply.uid || null,
      location: reply.location || null,
      role: reply.role || "member",
      text: reply.text,
      time: Date.now(),
    }),
  });
}

export async function deleteFloorReply(postId, reply) {
  return updateDoc(doc(db, FLOOR_COLLECTION, postId), {
    replies: arrayRemove(reply),
  });
}

// ── BAN LIST ──

const BAN_COLLECTION = "banned_users";

export function subscribeToBannedUsers(callback) {
  return onSnapshot(collection(db, BAN_COLLECTION), (snapshot) => {
    const banned = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(banned);
  });
}

export async function banUser({ name, bannedBy }) {
  return setDoc(doc(db, BAN_COLLECTION, name), {
    name,
    bannedBy: bannedBy || "",
    bannedAt: serverTimestamp(),
  });
}

export async function unbanUser(userName) {
  return deleteDoc(doc(db, BAN_COLLECTION, userName));
}

// ── UPLOADED DOCUMENTS ──

const DOCS_DOC = "app_data/uploaded_documents";

export async function saveUploadedDocuments(docs) {
  const cleanDocs = docs.map((d) => {
    const clean = {};
    Object.keys(d).forEach((k) => {
      if (d[k] !== undefined) clean[k] = d[k];
    });
    return clean;
  });
  return setDoc(doc(db, "app_data", "uploaded_documents"), { list: cleanDocs }, { merge: true });
}

export async function loadUploadedDocuments() {
  const snap = await getDoc(doc(db, "app_data", "uploaded_documents"));
  return snap.exists() ? snap.data().list || [] : [];
}

// ── ANNOUNCEMENTS ──

export async function saveAnnouncements(data) {
  return setDoc(doc(db, "app_data", "announcements"), { list: data }, { merge: true });
}

export async function loadAnnouncements() {
  const snap = await getDoc(doc(db, "app_data", "announcements"));
  return snap.exists() ? snap.data().list || [] : [];
}

// ── STEWARDS ──

export async function saveStewards(data) {
  return setDoc(doc(db, "app_data", "stewards"), { list: data }, { merge: true });
}

export async function loadStewards() {
  const snap = await getDoc(doc(db, "app_data", "stewards"));
  return snap.exists() ? snap.data().list || [] : [];
}

// ── MEETING INFO ──

export async function saveMeetingInfo(data) {
  return setDoc(doc(db, "app_data", "meeting_info"), data, { merge: true });
}

export async function loadMeetingInfo() {
  const snap = await getDoc(doc(db, "app_data", "meeting_info"));
  return snap.exists() ? snap.data() : null;
}

// ── ZOOM INFO ──

export async function saveZoomInfo(data) {
  return setDoc(doc(db, "app_data", "zoom_info"), data, { merge: true });
}

export async function loadZoomInfo() {
  const snap = await getDoc(doc(db, "app_data", "zoom_info"));
  return snap.exists() ? snap.data() : null;
}

// ── MINUTES ──

export async function saveMinutes(data) {
  return setDoc(doc(db, "app_data", "minutes"), { list: data }, { merge: true });
}

export async function loadMinutes() {
  const snap = await getDoc(doc(db, "app_data", "minutes"));
  return snap.exists() ? snap.data().list || [] : [];
}

// ── SENIORITY ──

export async function saveSeniority(data) {
  return setDoc(doc(db, "app_data", "seniority"), { list: data }, { merge: true });
}

export async function loadSeniority() {
  const snap = await getDoc(doc(db, "app_data", "seniority"));
  return snap.exists() ? snap.data().list || [] : [];
}

// ── ADMIN EMAILS (super-admin-promoted officers) ──

export async function saveAdminEmails(data) {
  return setDoc(doc(db, "app_data", "admin_emails"), { list: data }, { merge: true });
}

export async function loadAdminEmails() {
  const snap = await getDoc(doc(db, "app_data", "admin_emails"));
  return snap.exists() ? snap.data().list || [] : [];
}

// ── GRIEVANCES ──

export async function saveGrievance(data) {
  return addDoc(collection(db, "grievances"), {
    ...data,
    status: data.status || "new",
    submittedAt: serverTimestamp(),
  });
}

export function subscribeToGrievances(callback) {
  const q = query(collection(db, "grievances"), orderBy("submittedAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const list = snapshot.docs.map((d) => {
      const data = d.data();
      const ts = data.submittedAt;
      return {
        id: d.id,
        ...data,
        submittedAtMs: ts && ts.toMillis ? ts.toMillis() : Date.now(),
      };
    });
    callback(list);
  });
}

export async function updateGrievanceStatus(id, status) {
  return updateDoc(doc(db, "grievances", id), { status });
}

export async function deleteGrievance(id) {
  // Clean up any uploaded attachments first so they don't orphan in Storage.
  try {
    const snap = await getDoc(doc(db, "grievances", id));
    if (snap.exists()) {
      const data = snap.data();
      const atts = data.attachments || [];
      for (const a of atts) {
        if (a && a.storagePath) await deleteGrievanceAttachment(a.storagePath);
      }
    }
  } catch (e) {
    console.warn("Failed to clean attachments for grievance:", e.message);
  }
  return deleteDoc(doc(db, "grievances", id));
}

export async function addGrievanceNote(id, note) {
  // note: { id, text, author, authorUid, time }
  return updateDoc(doc(db, "grievances", id), { notes: arrayUnion(note) });
}

export async function removeGrievanceNote(id, note) {
  return updateDoc(doc(db, "grievances", id), { notes: arrayRemove(note) });
}


// ── APPROVED MEMBERS (for steward promotion picker) ──

export function subscribeToApprovedMembers(callback) {
    const q = query(
          collection(db, PROFILES_COLLECTION),
          where("status", "==", "approved")
        );
    return onSnapshot(q, (snapshot) => {
          const members = snapshot.docs.map((d) => ({ uid: d.id, ...d.data() }));
          callback(members);
    });
}


// ── USER ROLE MANAGEMENT ──

export async function updateUserRole(uid, role) {
    return updateDoc(doc(db, PROFILES_COLLECTION, uid), { role });
}

export async function deleteUserProfile(uid) {
    return deleteDoc(doc(db, PROFILES_COLLECTION, uid));
}

export async function sendPasswordResetToUser(email) {
    return sendPasswordResetEmail(auth, email);
}
