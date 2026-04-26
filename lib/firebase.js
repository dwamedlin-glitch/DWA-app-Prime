// lib/firebase.js
import { initializeApp } from "firebase/app";
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
} from "firebase/firestore";

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

// ── THE FLOOR HELPERS ──

const FLOOR_COLLECTION = "floor_posts";

// Listen to all posts in real-time (sorted newest first)
export function subscribeToFloorPosts(callback) {
  const q = query(collection(db, FLOOR_COLLECTION), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const posts = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      // Convert Firestore Timestamp to JS millis for formatFloorTime()
      time: d.data().createdAt?.toMillis?.() || Date.now(),
    }));
    callback(posts);
  });
}

// Create a new post
export async function createFloorPost({ author, location, role, text }) {
  return addDoc(collection(db, FLOOR_COLLECTION), {
    author,
    location,
    role,
    text,
    replies: [],
    createdAt: serverTimestamp(),
  });
}

// Delete a post
export async function deleteFloorPost(postId) {
  return deleteDoc(doc(db, FLOOR_COLLECTION, postId));
}

// Add a reply to a post (stored as array on the post doc)
export async function addFloorReply(postId, reply) {
  return updateDoc(doc(db, FLOOR_COLLECTION, postId), {
    replies: arrayUnion({
      id: Date.now().toString(),
      author: reply.author,
      location: reply.location,
      role: reply.role,
      text: reply.text,
      time: Date.now(),
    }),
  });
}

// Delete a reply from a post
export async function deleteFloorReply(postId, reply) {
  return updateDoc(doc(db, FLOOR_COLLECTION, postId), {
    replies: arrayRemove(reply),
  });
}

// ── BAN MANAGEMENT ──

const BANNED_COLLECTION = "banned_users";

// Ban a user from The Floor
export async function banUser({ name, bannedBy, reason }) {
  return setDoc(doc(db, BANNED_COLLECTION, name), {
    name,
    bannedBy,
    reason: reason || "",
    bannedAt: serverTimestamp(),
  });
}

// Unban a user
export async function unbanUser(name) {
  return deleteDoc(doc(db, BANNED_COLLECTION, name));
}

// Subscribe to banned users list in real-time
export function subscribeToBannedUsers(callback) {
  return onSnapshot(collection(db, BANNED_COLLECTION), (snapshot) => {
    const banned = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      bannedAt: d.data().bannedAt?.toMillis?.() || Date.now(),
    }));
    callback(banned);
  });
}

// ── APP DATA PERSISTENCE ──
// All admin-editable data stored under "app_data" collection in Firestore
// Each data type gets its own document: announcements, documents, stewards, etc.

// Generic save/load helpers
async function saveAppData(key, data) {
  return setDoc(doc(db, "app_data", key), { list: data }, { merge: true });
}

async function loadAppData(key) {
  const snap = await getDoc(doc(db, "app_data", key));
  return snap.exists() && snap.data().list ? snap.data().list : null;
}

// Documents
export async function saveUploadedDocuments(docs) { return saveAppData("documents", docs); }
export async function loadUploadedDocuments() { return loadAppData("documents"); }

// Announcements
export async function saveAnnouncements(anns) { return saveAppData("announcements", anns); }
export async function loadAnnouncements() { return loadAppData("announcements"); }

// Stewards
export async function saveStewards(list) { return saveAppData("stewards", list); }
export async function loadStewards() { return loadAppData("stewards"); }

// Meeting info
export async function saveMeetingInfo(info) { return saveAppData("meeting_info", info); }
export async function loadMeetingInfo() { return loadAppData("meeting_info"); }

// Zoom info
export async function saveZoomInfo(info) { return saveAppData("zoom_info", info); }
export async function loadZoomInfo() { return loadAppData("zoom_info"); }

// Minutes
export async function saveMinutes(list) { return saveAppData("minutes", list); }
export async function loadMinutes() { return loadAppData("minutes"); }

// Seniority
export async function saveSeniority(list) { return saveAppData("seniority", list); }
export async function loadSeniority() { return loadAppData("seniority"); }

export { db };
