// pages/api/data.js
// API route to read all site data from the JSON file

import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data.json');

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const data = JSON.parse(raw);
    // Don't send the password to the public
    const { adminPassword, ...publicData } = data;
    res.status(200).json(publicData);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read data' });
  }
}
