// lib/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
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

export async function createFloorPost({ user, text, tag }) {
  return addDoc(collection(db, FLOOR_COLLECTION), {
    user,
    text,
    tag: tag || null,
    replies: [],
    createdAt: serverTimestamp(),
  });
}

export async function deleteFloorPost(postId) {
  return deleteDoc(doc(db, FLOOR_COLLECTION, postId));
}

export async function addFloorReply(postId, reply) {
  return updateDoc(doc(db, FLOOR_COLLECTION, postId), {
    replies: arrayUnion({
      id: reply.id || `r${Date.now()}`,
      user: reply.user,
      text: reply.text,
      time: serverTimestamp(),
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

export async function banUser(userId, userName, reason) {
  return setDoc(doc(db, BAN_COLLECTION, userId), {
    name: userName,
    reason: reason || "",
    bannedAt: serverTimestamp(),
  });
}

export async function unbanUser(userId) {
  return deleteDoc(doc(db, BAN_COLLECTION, userId));
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
