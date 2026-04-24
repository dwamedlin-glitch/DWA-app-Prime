// pages/api/admin/save.js
// Save updated content back to the JSON file

import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data.json');

function verifyAuth(req) {
  const token = req.headers.authorization;
  if (!token) return false;
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const data = JSON.parse(raw);
    const decoded = Buffer.from(token.replace('Bearer ', ''), 'base64').toString();
    const password = decoded.split(':')[0];
    return password === data.adminPassword;
  } catch {
    return false;
  }
}

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!verifyAuth(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const data = JSON.parse(raw);
    const { section, items } = req.body;

    // Only allow updating known sections
    if (['announcements', 'stewards', 'documents', 'cbaArticles', 'grievanceEmails'].includes(section)) {
      data[section] = items;
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ error: 'Invalid section' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to save data' });
  }
}
