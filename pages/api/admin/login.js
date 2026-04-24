// pages/api/admin/login.js
// Simple password-based admin login

import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data.json');

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const data = JSON.parse(raw);
    const { password } = req.body;

    if (password === data.adminPassword) {
      // In production you'd use a proper session/token. For a local union app, this is fine.
      res.status(200).json({ success: true, token: Buffer.from(password + ':' + Date.now()).toString('base64') });
    } else {
      res.status(401).json({ error: 'Wrong password' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}
