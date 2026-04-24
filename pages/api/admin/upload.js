// pages/api/admin/upload.js
// Handle image uploads — saves to public/images/

import fs from 'fs';
import path from 'path';
import { IncomingForm } from 'formidable';

// Disable Next.js body parser so formidable can handle the multipart form
export const config = {
  api: {
    bodyParser: false,
  },
};

const DATA_FILE = path.join(process.cwd(), 'data.json');
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'images');

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!verifyAuth(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Make sure upload directory exists
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  const form = new IncomingForm({
    uploadDir: UPLOAD_DIR,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB max
  });

  try {
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    const file = files.file?.[0] || files.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Get the desired filename from fields, or use original
    const desiredName = (Array.isArray(fields.filename) ? fields.filename[0] : fields.filename) || file.originalFilename;
    const ext = path.extname(desiredName) || path.extname(file.originalFilename);
    const safeName = desiredName.replace(/[^a-zA-Z0-9.-]/g, '-').toLowerCase();
    const finalPath = path.join(UPLOAD_DIR, safeName);

    // Move/rename the file to the desired name
    fs.renameSync(file.filepath, finalPath);

    const publicUrl = '/images/' + safeName;
    res.status(200).json({ success: true, url: publicUrl, filename: safeName });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
}
