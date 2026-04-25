/* DWA API Route: /api/data
 *
 * This file goes in: pages/api/data.js
 *
 * It handles:
 *   GET  → Reads all app data (announcements, documents, stewards, etc.) from Firebase
 *   POST → Saves updated data (like documents) back to Firebase
 *
 * Make sure your Firebase config is set up in lib/firebaseAdmin.js (see below)
 */

import { getDatabase } from "firebase-admin/database";
import { initializeApp, getApps, cert } from "firebase-admin/app";

// ── Initialize Firebase Admin (only once) ──
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // The private key comes from .env and needs newlines restored
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

const db = getDatabase();

export default async function handler(req, res) {
  // ── GET: Load all app data from Firebase ──
  if (req.method === "GET") {
    try {
      const snapshot = await db.ref("/").once("value");
      const data = snapshot.val() || {};
      return res.status(200).json(data);
    } catch (error) {
      console.error("Firebase GET error:", error);
      return res.status(500).json({ error: "Failed to load data" });
    }
  }

  // ── POST: Save updated data to Firebase ──
  if (req.method === "POST") {
    try {
      const body = req.body;

      // Save documents if provided
      if (body.documents) {
        await db.ref("documents").set(body.documents);
      }

      // Save announcements if provided
      if (body.announcements) {
        await db.ref("announcements").set(body.announcements);
      }

      // Save stewards if provided
      if (body.stewards) {
        await db.ref("stewards").set(body.stewards);
      }

      // Save grievance emails if provided
      if (body.grievanceEmails) {
        await db.ref("grievanceEmails").set(body.grievanceEmails);
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Firebase POST error:", error);
      return res.status(500).json({ error: "Failed to save data" });
    }
  }

  // ── Other methods not allowed ──
  return res.status(405).json({ error: "Method not allowed" });
}
