# Movie Diary App

A beautiful movie journaling app with Google Sheets integration.

## Current Setup Status

**Google Sheet ID**: `1mptRm3MOJjSoWNnd03DxOOdYiXyLzGkAb72auFTROi0`
**Sheet URL**: https://docs.google.com/spreadsheets/d/1mptRm3MOJjSoWNnd03DxOOdYiXyLzGkAb72auFTROi0/edit

**Web App URL**: `https://script.google.com/macros/s/AKfycbxWEX9C7oLio_0EIJrfE6WbVj38227ws058ikk-tDf_-zeIiIMLkD5d-UXqNsRvZcos/exec`

## IMPORTANT: Why Records Aren't Updating

If your records aren't appearing in the Google Sheet, follow these steps:

### Step 1: Check Sheet Tab Name
1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1mptRm3MOJjSoWNnd03DxOOdYiXyLzGkAb72auFTROi0/edit
2. Look at the bottom of the sheet - the tab name MUST be exactly **"MovieDiary"** (case-sensitive)
3. If it's named something else (like "Sheet1"), right-click the tab and rename it to **"MovieDiary"**

### Step 2: Redeploy Google Apps Script
Your Google Apps Script code has been updated. You MUST redeploy it:

1. Go to your Google Apps Script project (the one with your Web App)
2. Copy ALL the code from `google-apps-script.js` in this project
3. Paste it into your Google Apps Script editor (replace everything)
4. Click **"Deploy"** > **"Manage deployments"**
5. Click the **pencil/edit icon** on your existing deployment
6. Under "Version", select **"New version"**
7. Add description: "Fixed delete and update functions"
8. Click **"Deploy"**
9. Copy the new Web App URL (it might be the same)

### Step 3: Test the Connection
1. Open your app in the browser
2. Add a new movie entry
3. Check your Google Sheet - you should see a new row with:
   - Column A: Timestamp
   - Column B: Title
   - Column C: Date
   - Column D: Rating
   - Column E: Remarks

### Troubleshooting

**If entries still don't appear:**
1. Open browser console (F12) and check for errors
2. Make sure the Web App is set to:
   - Execute as: **Me** (your account)
   - Who has access: **Anyone**
3. Try creating a completely new deployment instead of updating the existing one

**If you see "no-cors" errors:**
This is normal! The app uses `mode: 'no-cors'` which means we can't read responses, but the data is still being sent to Google Sheets.

## Setup Instructions (For New Users)

### 1. Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Rename the tab at the bottom to **"MovieDiary"**
4. Copy the Sheet ID from the URL (the long string between `/d/` and `/edit`)

### 2. Deploy Google Apps Script
1. Go to [Google Apps Script](https://script.google.com/)
2. Click "New Project"
3. Delete any default code
4. Copy all code from `google-apps-script.js` and paste it
5. Replace `SHEET_ID` value with your actual Sheet ID
6. Click "Deploy" > "New deployment"
7. Click the gear icon next to "Select type" and choose "Web app"
8. Configure:
   - Description: "Movie Diary API"
   - Execute as: "Me"
   - Who has access: "Anyone"
9. Click "Deploy"
10. Copy the Web App URL

### 3. Configure the App
1. Open `script.js`
2. Replace `GOOGLE_SCRIPT_URL` with your Web App URL
3. Save the file

### 4. Run the App
Open `index.html` in your browser and start adding movies!

## Features
- Beautiful landing page with interactive book and pen
- Diary-style book pages for reading entries
- Add, edit, and delete movie entries
- Star rating system
- Sort by date (newest/oldest first)
- Data stored in Google Sheets
- Responsive design

## Pages
- **index.html** - Landing page with book and pen
- **diary.html** - Diary view with book pages
- **add-entry.html** - Form to add new movie entries

## Files
- `index.html` - Landing page
- `diary.html` - Diary page
- `add-entry.html` - Add entry page
- `landing.css` - Landing page styles
- `diary.css` - Diary page styles
- `style.css` - Add entry page styles
- `script.js` - Shared configuration
- `landing.js` - Landing page logic
- `diary.js` - Diary page logic
- `add-entry.js` - Add entry page logic
- `google-apps-script.js` - Backend code for Google Sheets
