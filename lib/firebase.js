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

// ── DOCUMENT PERSISTENCE ──

// Save uploaded documents to Firestore
export async function saveUploadedDocuments(docs) {
  return setDoc(doc(db, "app_data", "documents"), { list: docs }, { merge: true });
}

// Load uploaded documents from Firestore
export async function loadUploadedDocuments() {
  const snap = await getDoc(doc(db, "app_data", "documents"));
  return snap.exists() && snap.data().list ? snap.data().list : [];
}

// ── ANNOUNCEMENT PERSISTENCE ──

// Save announcements to Firestore
export async function saveAnnouncements(anns) {
  return setDoc(doc(db, "app_data", "announcements"), { list: anns }, { merge: true });
}

// Load announcements from Firestore
export async function loadAnnouncements() {
  const snap = await getDoc(doc(db, "app_data", "announcements"));
  return snap.exists() && snap.data().list ? snap.data().list : [];
}

export { db };
