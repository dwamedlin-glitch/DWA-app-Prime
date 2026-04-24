# DWA Admin Setup Instructions

## What's in this package

- `data.json` — Your content database (announcements, stewards, documents)
- `pages/api/data.js` — API route that serves content to the app
- `pages/api/admin/login.js` — Admin login endpoint
- `pages/api/admin/save.js` — Save content changes endpoint
- `pages/api/admin/upload.js` — File upload endpoint
- `pages/admin.js` — Admin dashboard page
- `public/images/` — Image files (flyer, QR code, DWA logo)

## How to install

1. Copy `data.json` to your project root (next to `package.json`)
2. Copy the `pages/` folder contents into your existing `pages/` folder
3. Copy `public/images/` into your existing `public/` folder
4. Install formidable (needed for file uploads):
   ```
   npm install formidable
   ```
5. Run `npx next dev` to start in development mode

## How to use the admin page

1. Go to `http://localhost:3000/admin`
2. Log in with password: `dwa2025`
3. Edit announcements, stewards, or upload images
4. Click Save — changes are live immediately

## To change the admin password

Edit `data.json` and change the `adminPassword` field.

## How it works

- All content lives in `data.json` — a simple text file the app reads
- The admin page lets you edit that file through a web form
- Images go in `public/images/` and are served as regular URLs
- No rebuild needed for content changes when using `npx next dev`
